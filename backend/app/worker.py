import asyncio
import logging
from datetime import UTC, datetime
from uuid import UUID

from .config import get_settings
from .db import Database
from .pdf_extractor import extract_text_spans
from .repository import (
    claim_next_job,
    load_job_document,
    persist_extraction,
    persist_failure,
    record_trace,
)
from .storage import resolve_artifact

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("workbench.worker")


async def process_one(db: Database) -> bool:
    settings = get_settings()
    root = settings.normalized_artifact_root()

    async with db.connection() as conn:
        job = await claim_next_job(conn, settings.worker_id)

    if job is None:
        return False

    job_id = UUID(str(job["id"]))
    document_id = UUID(str(job["document_id"])) if job.get("document_id") else None
    started_at = datetime.now(UTC)

    if job["job_type"] != "DOCUMENT_INGEST" or document_id is None:
        async with db.connection() as conn:
            await persist_failure(
                conn,
                job_id,
                document_id,
                "UNSUPPORTED_JOB",
                f"unsupported job type or missing document: {job['job_type']}",
            )
        return True

    try:
        async with db.connection() as conn:
            document = await load_job_document(conn, document_id)
            await conn.execute(
                "UPDATE documents SET status = 'PROCESSING', updated_at = now() WHERE id = $1",
                document_id,
            )

        pdf_path = resolve_artifact(root, document["artifact_ref"])
        if not pdf_path.is_file():
            raise FileNotFoundError(f"artifact not found for document {document_id}")

        extraction = await asyncio.to_thread(extract_text_spans, pdf_path)
        finished_at = datetime.now(UTC)

        async with db.connection() as conn:
            async with conn.transaction():
                await persist_extraction(conn, job_id, document_id, extraction)
                await record_trace(
                    conn,
                    stage="document_extract",
                    started_at=started_at,
                    finished_at=finished_at,
                    job_id=job_id,
                    document_id=document_id,
                    component_version=f"{extraction.parser_name}:{extraction.parser_version}",
                    attributes={"span_count": len(extraction.spans)},
                )

        logger.info(
            "job_succeeded job_id=%s document_id=%s span_count=%s",
            job_id,
            document_id,
            len(extraction.spans),
        )
    except Exception as exc:  # worker boundary: persist failure before continuing
        logger.exception("job_failed job_id=%s document_id=%s", job_id, document_id)
        async with db.connection() as conn:
            async with conn.transaction():
                await persist_failure(
                    conn,
                    job_id,
                    document_id,
                    type(exc).__name__.upper(),
                    str(exc),
                )
                await record_trace(
                    conn,
                    stage="document_extract",
                    started_at=started_at,
                    finished_at=datetime.now(UTC),
                    job_id=job_id,
                    document_id=document_id,
                    attributes={"result": "FAILED", "error_type": type(exc).__name__},
                )
    return True


async def run_forever() -> None:
    settings = get_settings()
    db = Database(settings)
    await db.connect()
    try:
        while True:
            processed = await process_one(db)
            if not processed:
                await asyncio.sleep(1.0)
    finally:
        await db.close()


if __name__ == "__main__":
    asyncio.run(run_forever())
