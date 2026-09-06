import hashlib
import os
from uuid import uuid4

import asyncpg
import pymupdf
import pytest

from app.config import Settings, get_settings
from app.db import Database
from app.worker import process_one


def make_pdf_bytes() -> bytes:
    document = pymupdf.open()
    page = document.new_page(width=300, height=200)
    page.insert_text((50, 80), "durable worker integration")
    data = document.tobytes()
    document.close()
    return data


@pytest.mark.asyncio
async def test_worker_processes_document_to_ready_with_spans() -> None:
    database_url = os.environ.get("WORKBENCH_DATABASE_URL")
    artifact_root_value = os.environ.get("WORKBENCH_ARTIFACT_ROOT")
    if not database_url or not artifact_root_value:
        pytest.skip("worker integration environment is not configured")

    get_settings.cache_clear()
    settings = Settings()
    root = settings.normalized_artifact_root()
    documents_dir = root / "documents"
    documents_dir.mkdir(parents=True, exist_ok=True)

    pdf = make_pdf_bytes()
    sha256 = hashlib.sha256(pdf).hexdigest()
    artifact_ref = f"documents/{sha256}.pdf"
    artifact_path = root / artifact_ref
    artifact_path.write_bytes(pdf)

    document_id = uuid4()
    job_id = uuid4()

    setup = await asyncpg.connect(database_url)
    try:
        await setup.execute(
            "TRUNCATE run_traces, jobs, chunk_embeddings, chunks, "
            "document_spans, documents CASCADE"
        )
        await setup.execute(
            """
            INSERT INTO documents (
                id, sha256, original_name, artifact_ref, media_type, byte_size, status
            )
            VALUES ($1, $2, 'worker.pdf', $3, 'application/pdf', $4, 'REGISTERED')
            """,
            document_id,
            sha256,
            artifact_ref,
            len(pdf),
        )
        await setup.execute(
            """
            INSERT INTO jobs (id, job_type, document_id, status)
            VALUES ($1, 'DOCUMENT_INGEST', $2, 'QUEUED')
            """,
            job_id,
            document_id,
        )
    finally:
        await setup.close()

    db = Database(settings)
    await db.connect()
    try:
        assert await process_one(db) is True
    finally:
        await db.close()

    verify = await asyncpg.connect(database_url)
    try:
        document = await verify.fetchrow(
            "SELECT status, parser_name, parser_version FROM documents WHERE id = $1",
            document_id,
        )
        job = await verify.fetchrow(
            "SELECT status, attempts, worker_id, error_code FROM jobs WHERE id = $1",
            job_id,
        )
        spans = await verify.fetch(
            """
            SELECT page_number, x0, y0, x1, y1, text
            FROM document_spans
            WHERE document_id = $1
            ORDER BY page_number, span_order
            """,
            document_id,
        )
        trace_count = await verify.fetchval(
            "SELECT count(*) FROM run_traces WHERE job_id = $1 AND stage = 'document_extract'",
            job_id,
        )

        assert document["status"] == "READY"
        assert document["parser_name"] == "PyMuPDF"
        assert document["parser_version"]
        assert job["status"] == "SUCCEEDED"
        assert job["attempts"] == 1
        assert job["worker_id"] == settings.worker_id
        assert job["error_code"] is None
        assert spans
        assert any(span["text"] == "durable" for span in spans)
        assert all(span["page_number"] == 1 for span in spans)
        assert all(span["x1"] >= span["x0"] for span in spans)
        assert all(span["y1"] >= span["y0"] for span in spans)
        assert trace_count == 1
    finally:
        await verify.close()
        artifact_path.unlink(missing_ok=True)
