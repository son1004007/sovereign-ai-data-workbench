# Installation / Build / Deployment Guide

Baseline: 2026-09-06
Status: phase-1 backend implementation guide; runtime verification pending

## Supported Development Shape

- Python 3.12 recommended for the initial backend
- PostgreSQL with pgvector extension
- filesystem artifact root writable by API/worker
- FastAPI API process
- separate worker process

Exact NAS production versions remain runtime evidence, not assumptions in this document.

## Configuration

Copy environment values from `.env.example`; do not commit real secrets.

Required/important variables:

```text
WORKBENCH_DATABASE_URL
WORKBENCH_ARTIFACT_ROOT
WORKBENCH_MAX_UPLOAD_BYTES
WORKBENCH_WORKER_ID
```

Artifact root must be a dedicated project directory. The application rejects paths that resolve outside this root.

## Local PostgreSQL

The repository provides `docker-compose.yml` for a development PostgreSQL/pgvector instance.

```bash
docker compose up -d postgres
```

Apply schema:

```bash
psql "$WORKBENCH_DATABASE_URL" -v ON_ERROR_STOP=1 -f backend/migrations/001_initial.sql
```

## Backend Install

```bash
cd backend
python3 -m venv .venv
. .venv/bin/activate
python -m pip install --upgrade pip
pip install -e '.[dev]'
```

## Start API

```bash
cd backend
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

## Start Worker

In a separate process:

```bash
cd backend
python -m app.worker
```

## Health / Smoke Check

```bash
curl -fsS http://127.0.0.1:8000/health
```

A healthy HTTP process alone does not prove DB migration, worker execution or PDF ingestion. Complete smoke acceptance also requires:

1. DB connection succeeds;
2. migration is applied;
3. a small public/synthetic text-layer PDF is uploaded;
4. API returns document/job IDs;
5. worker transitions job to `SUCCEEDED`;
6. document reaches `READY`;
7. extracted span rows include page and bbox coordinates.

## Tests

```bash
cd backend
pytest
```

GitHub CI is expected to run unit tests plus PostgreSQL migration/integration checks after the workflow is added.

## Deployment Notes — Synology

The NAS deployment remains owned through `son1004007/device-control`; do not put DSM credentials, host-specific secret paths or Docker socket bypasses in this public repository.

Target shape:

```text
static publishing
FastAPI API
worker
PostgreSQL/pgvector
project artifact volume
```

Deployment automation must use the bounded device-control/workspace path rather than inventing direct credentials.

## Upgrade

1. review schema/application compatibility;
2. backup or snapshot according to runtime policy where required;
3. apply additive migration;
4. deploy API/worker;
5. run health + ingestion smoke check;
6. verify no overdue review debt/known blocker.

## Rollback / Recovery

- application rollback: deploy prior known-good revision if schema remains backward compatible;
- schema rollback: do not assume down migration exists; destructive changes require a specific forward-fix/rollback plan before release;
- worker disable: stop worker process to prevent new queue claims while preserving queued jobs;
- ingestion failure: retain explicit failed job/document state; do not mark ready.

## Known Limitations

- backend/NAS runtime is not yet verified in this baseline;
- OCR/VLM is intentionally unavailable;
- retrieval/reranker/evaluation runtime is not yet implemented;
- public auth/RBAC is not implemented;
- stale RUNNING-job recovery requires measured operational policy before production use.
