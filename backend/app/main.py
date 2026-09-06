from contextlib import asynccontextmanager
from pathlib import Path
from uuid import UUID, uuid4

from fastapi import FastAPI, File, HTTPException, Request, UploadFile

from .config import get_settings
from .db import Database
from .repository import get_document, get_job, register_document
from .storage import store_pdf

settings = get_settings()
db = Database(settings)


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings.normalized_artifact_root()
    await db.connect()
    app.state.db = db
    yield
    await db.close()


app = FastAPI(
    title="Sovereign AI Data Workbench API",
    version="0.1.0",
    lifespan=lifespan,
)


@app.middleware("http")
async def request_id_middleware(request: Request, call_next):
    request_id = request.headers.get("x-request-id") or str(uuid4())
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["x-request-id"] = request_id
    return response


@app.get("/health")
async def health() -> dict[str, object]:
    try:
        database = await db.ping()
    except Exception:
        database = False
    return {
        "service": "sovereign-ai-data-workbench",
        "status": "UP" if database else "DEGRADED",
        "database": database,
    }


@app.post("/api/v1/documents", status_code=202)
async def create_document(file: UploadFile = File(...)) -> dict[str, object]:
    original_name = Path(file.filename or "document.pdf").name
    media_type = file.content_type or "application/octet-stream"

    if media_type not in {"application/pdf", "application/octet-stream"}:
        await file.close()
        raise HTTPException(status_code=415, detail="only PDF input is supported")

    try:
        artifact = await store_pdf(
            file,
            settings.normalized_artifact_root(),
            settings.max_upload_bytes,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    async with db.connection() as conn:
        async with conn.transaction():
            registration = await register_document(
                conn,
                artifact,
                original_name=original_name,
                media_type="application/pdf",
            )

    return {
        "document_id": str(registration.document_id),
        "job_id": str(registration.job_id) if registration.job_id else None,
        "status": registration.status,
        "sha256": registration.sha256,
        "artifact_ref": artifact.artifact_ref,
    }


@app.get("/api/v1/documents/{document_id}")
async def read_document(document_id: UUID) -> dict[str, object]:
    async with db.connection() as conn:
        document = await get_document(conn, document_id)
    if document is None:
        raise HTTPException(status_code=404, detail="document not found")
    return document


@app.get("/api/v1/jobs/{job_id}")
async def read_job(job_id: UUID) -> dict[str, object]:
    async with db.connection() as conn:
        job = await get_job(conn, job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="job not found")
    return job
