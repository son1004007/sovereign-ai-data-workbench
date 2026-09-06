from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any
from uuid import UUID, uuid4

import asyncpg

from .pdf_extractor import ExtractionResult
from .storage import StoredArtifact


@dataclass(frozen=True)
class DocumentRegistration:
    document_id: UUID
    job_id: UUID | None
    status: str
    sha256: str


async def register_document(
    conn: asyncpg.Connection,
    artifact: StoredArtifact,
    original_name: str,
    media_type: str,
) -> DocumentRegistration:
    document_id = uuid4()
    inserted = await conn.fetchrow(
        """
        INSERT INTO documents (
            id, sha256, original_name, artifact_ref, media_type, byte_size, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, 'REGISTERED')
        ON CONFLICT (sha256) DO NOTHING
        RETURNING id, status, sha256
        """,
        document_id,
        artifact.sha256,
        original_name,
        artifact.artifact_ref,
        media_type,
        artifact.byte_size,
    )

    if inserted is None:
        existing = await conn.fetchrow(
            "SELECT id, status, sha256 FROM documents WHERE sha256 = $1",
            artifact.sha256,
        )
        if existing is None:
            raise RuntimeError("document conflict occurred but existing row could not be loaded")
        document_id = existing["id"]
        status = existing["status"]
    else:
        status = inserted["status"]

    active_job = await conn.fetchrow(
        """
        SELECT id
        FROM jobs
        WHERE document_id = $1 AND job_type = 'DOCUMENT_INGEST'
          AND status IN ('QUEUED', 'RUNNING')
        ORDER BY created_at DESC
        LIMIT 1
        """,
        document_id,
    )

    job_id: UUID | None
    if status == "READY":
        job_id = None
    elif active_job is not None:
        job_id = active_job["id"]
    else:
        job_id = uuid4()
        await conn.execute(
            """
            INSERT INTO jobs (id, job_type, document_id, status, payload)
            VALUES ($1, 'DOCUMENT_INGEST', $2, 'QUEUED', '{}'::jsonb)
            """,
            job_id,
            document_id,
        )

    return DocumentRegistration(
        document_id=document_id,
        job_id=job_id,
        status=status,
        sha256=artifact.sha256,
    )


async def get_document(conn: asyncpg.Connection, document_id: UUID) -> dict[str, Any] | None:
    row = await conn.fetchrow(
        """
        SELECT id, sha256, original_name, artifact_ref, media_type, byte_size,
               parser_name, parser_version, status, created_at, updated_at
        FROM documents
        WHERE id = $1
        """,
        document_id,
    )
    return dict(row) if row else None


async def get_job(conn: asyncpg.Connection, job_id: UUID) -> dict[str, Any] | None:
    row = await conn.fetchrow(
        """
        SELECT id, job_type, document_id, status, attempts, available_at,
               started_at, heartbeat_at, finished_at, worker_id,
               error_code, error_message, created_at, updated_at
        FROM jobs
        WHERE id = $1
        """,
        job_id,
    )
    return dict(row) if row else None


async def claim_next_job(
    conn: asyncpg.Connection,
    worker_id: str,
) -> dict[str, Any] | None:
    row = await conn.fetchrow(
        """
        WITH candidate AS (
            SELECT id
            FROM jobs
            WHERE status = 'QUEUED' AND available_at <= now()
            ORDER BY created_at, id
            FOR UPDATE SKIP LOCKED
            LIMIT 1
        )
        UPDATE jobs AS j
        SET status = 'RUNNING',
            attempts = attempts + 1,
            started_at = now(),
            heartbeat_at = now(),
            worker_id = $1,
            updated_at = now()
        FROM candidate
        WHERE j.id = candidate.id
        RETURNING j.id, j.job_type, j.document_id, j.status, j.attempts, j.payload,
                  j.started_at, j.worker_id
        """,
        worker_id,
    )
    return dict(row) if row else None


async def load_job_document(conn: asyncpg.Connection, document_id: UUID) -> dict[str, Any]:
    row = await conn.fetchrow(
        "SELECT id, artifact_ref, sha256, status FROM documents WHERE id = $1",
        document_id,
    )
    if row is None:
        raise LookupError(f"document not found: {document_id}")
    return dict(row)


async def persist_extraction(
    conn: asyncpg.Connection,
    job_id: UUID,
    document_id: UUID,
    extraction: ExtractionResult,
) -> None:
    await conn.execute("DELETE FROM document_spans WHERE document_id = $1", document_id)

    if extraction.spans:
        await conn.executemany(
            """
            INSERT INTO document_spans (
                id, document_id, page_number, span_order, x0, y0, x1, y1, text
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            """,
            [
                (
                    uuid4(),
                    document_id,
                    span.page_number,
                    span.span_order,
                    span.x0,
                    span.y0,
                    span.x1,
                    span.y1,
                    span.text,
                )
                for span in extraction.spans
            ],
        )

    await conn.execute(
        """
        UPDATE documents
        SET parser_name = $2,
            parser_version = $3,
            status = 'READY',
            updated_at = now()
        WHERE id = $1
        """,
        document_id,
        extraction.parser_name,
        extraction.parser_version,
    )

    await conn.execute(
        """
        UPDATE jobs
        SET status = 'SUCCEEDED',
            finished_at = now(),
            heartbeat_at = now(),
            error_code = NULL,
            error_message = NULL,
            updated_at = now()
        WHERE id = $1
        """,
        job_id,
    )


async def persist_failure(
    conn: asyncpg.Connection,
    job_id: UUID,
    document_id: UUID | None,
    error_code: str,
    error_message: str,
) -> None:
    bounded_message = error_message[:1000]
    if document_id is not None:
        await conn.execute(
            "UPDATE documents SET status = 'FAILED', updated_at = now() WHERE id = $1",
            document_id,
        )
    await conn.execute(
        """
        UPDATE jobs
        SET status = 'FAILED',
            finished_at = now(),
            heartbeat_at = now(),
            error_code = $2,
            error_message = $3,
            updated_at = now()
        WHERE id = $1
        """,
        job_id,
        error_code[:120],
        bounded_message,
    )


async def record_trace(
    conn: asyncpg.Connection,
    *,
    stage: str,
    started_at: datetime,
    finished_at: datetime | None,
    request_id: str | None = None,
    job_id: UUID | None = None,
    document_id: UUID | None = None,
    component_version: str | None = None,
    attributes: dict[str, Any] | None = None,
) -> UUID:
    trace_id = uuid4()
    await conn.execute(
        """
        INSERT INTO run_traces (
            id, request_id, job_id, document_id, stage, component_version,
            started_at, finished_at, attributes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)
        """,
        trace_id,
        request_id,
        job_id,
        document_id,
        stage,
        component_version,
        started_at,
        finished_at,
        __import__("json").dumps(attributes or {}),
    )
    return trace_id
