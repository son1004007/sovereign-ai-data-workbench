import os
from uuid import uuid4

import asyncpg
import pytest

from app.repository import claim_next_job


@pytest.mark.asyncio
async def test_claim_next_job_is_durable_and_exclusive() -> None:
    database_url = os.environ.get("WORKBENCH_DATABASE_URL")
    if not database_url:
        pytest.skip("WORKBENCH_DATABASE_URL is not configured")

    conn = await asyncpg.connect(database_url)
    try:
        await conn.execute(
            "TRUNCATE run_traces, jobs, chunk_embeddings, chunks, document_spans, documents CASCADE"
        )
        document_id = uuid4()
        job_id = uuid4()
        await conn.execute(
            """
            INSERT INTO documents (
                id, sha256, original_name, artifact_ref, media_type, byte_size, status
            )
            VALUES ($1, $2, 'sample.pdf', 'documents/sample.pdf', 'application/pdf', 10, 'REGISTERED')
            """,
            document_id,
            "a" * 64,
        )
        await conn.execute(
            """
            INSERT INTO jobs (id, job_type, document_id, status)
            VALUES ($1, 'DOCUMENT_INGEST', $2, 'QUEUED')
            """,
            job_id,
            document_id,
        )

        first = await claim_next_job(conn, "worker-a")
        second = await claim_next_job(conn, "worker-b")

        assert first is not None
        assert first["id"] == job_id
        assert first["status"] == "RUNNING"
        assert first["attempts"] == 1
        assert second is None

        persisted = await conn.fetchrow(
            "SELECT status, attempts, worker_id FROM jobs WHERE id = $1",
            job_id,
        )
        assert persisted["status"] == "RUNNING"
        assert persisted["attempts"] == 1
        assert persisted["worker_id"] == "worker-a"
    finally:
        await conn.close()
