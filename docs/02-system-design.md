# System / Software Design

Baseline: 2026-09-06

## Context

Primary user: a data analyst supervising analysis/document-intelligence work through a browser workbench.

First backend slice is intentionally narrow: ingest public text-layer PDFs, preserve provenance/coordinates, persist durable processing state in PostgreSQL/pgvector, and prepare for auditable retrieval/citation/evaluation.

## Components

| Component | Responsibility | State owner |
| --- | --- | --- |
| Publishing UI | durable static UI/interaction contract; synthetic until API-backed | browser/static assets |
| FastAPI API | document registration/upload metadata, job query, health, future retrieval/eval contracts | PostgreSQL via repository layer |
| Ingestion worker | claims durable jobs, hashes/parses PDFs, persists spans/chunks/provenance | PostgreSQL + project artifact volume |
| PDF extractor | text-layer coordinate-preserving extraction using page/bbox | stateless |
| PostgreSQL + pgvector | documents, spans/chunks, job state, retrieval/eval metadata, provenance/traces | PostgreSQL |
| Project artifact volume | raw public PDFs and future large artifacts, referenced by stable relative identifier | filesystem/project volume |
| Retrieval/eval services | lexical/vector/RRF/reranker/eval; next increment | PostgreSQL + local models |

## Runtime Shape

```text
Browser
  -> FastAPI
       -> PostgreSQL + pgvector
       -> project artifact volume

Worker
  -> PostgreSQL job claim (`FOR UPDATE SKIP LOCKED`)
  -> project artifact volume
  -> PDF extractor
  -> PostgreSQL provenance/span/chunk state
```

API request does not own long-running parsing to completion. API persists a job and returns identifiers; worker performs processing.

## Data Flow — Phase 1

```text
PDF bytes / path
-> SHA-256
-> document record
-> ingestion job
-> worker claim
-> coordinate-preserving page/span extraction
-> span records
-> deterministic chunk preparation (later phase-1 extension if needed)
-> job success/failure + trace metadata
```

## Interface Contracts — Initial

### `GET /health`
Returns service status without claiming database readiness unless a DB probe was actually executed.

### `POST /api/v1/documents`
Initial contract accepts metadata plus a project-local artifact reference. Direct multipart upload may be added after storage/runtime boundary is validated.

Returns:
- `document_id`
- `job_id`
- `status`

### `GET /api/v1/documents/{document_id}`
Returns provenance and processing status.

### `GET /api/v1/jobs/{job_id}`
Returns durable job state, attempts, error summary and timestamps.

No retrieval/answer endpoint is declared implemented until the retrieval/evaluation slice exists.

## Trust / Security Boundaries

- public repository and demo data are public/synthetic only.
- artifact path input must resolve inside an allow-listed project artifact root; traversal/absolute host paths are rejected.
- secret values are environment/runtime configuration and never committed.
- sovereignty/egress mode is explicit configuration/evidence; absence of external calls is not inferred from product name.
- publishing prototype CSP remains independent from backend runtime network policy.

## State / Transaction / Concurrency

- PostgreSQL is the authoritative state owner.
- job claim uses transaction + `FOR UPDATE SKIP LOCKED` so multiple workers do not process the same queued job concurrently.
- worker increments attempt/start metadata in the claim transaction.
- completion/failure is a separate persisted transition.
- processing should be idempotent by document/content identity where practical; identical SHA-256 may reference an existing document according to API policy rather than duplicate raw identity silently.

## Failure Semantics

- invalid/missing artifact: job fails with bounded error information; no endless retry.
- malformed/non-text-layer PDF: extraction failure is explicit; no OCR fallback in phase 1.
- DB unavailable: API/worker fail visibly; no in-memory success fallback.
- worker crash after claim: stale-running recovery policy must be explicit before production use; initial implementation records heartbeat/start timestamps and leaves recovery as a documented operational limitation until exercised.
- hash/parser failure must not mark document as ready.

## Timeout / Retry

- no automatic broad retry for deterministic parse/input failures.
- transient DB/runtime retry policy is conservative and bounded.
- retry count/state is persisted in job record.

## Observability

Minimum phase-1 fields:
- request/job ID
- document ID + SHA-256
- parser name/version
- job state/attempts
- stage timestamps / duration where measured
- bounded error code/message

Future retrieval/evaluation adds index/model versions, ranks/scores and stage latency.

## Decisions

`DECISIONS.md` remains the product-scope decision log. This document translates those decisions into implementation contracts.

Key decisions:
- one FastAPI backend first;
- PostgreSQL + pgvector state source of truth;
- PostgreSQL-backed durable worker before Celery/Redis/Kafka;
- text-layer coordinate extraction before OCR/VLM;
- hybrid retrieval/evaluation only after provenance/job foundation is measurable.

## Risks / Trade-offs

- PostgreSQL job queue is intentionally simpler than a dedicated broker and is suitable only while measured workload supports it.
- PyMuPDF-style coordinate extraction may need parser abstraction once diverse PDFs are evaluated.
- local embedding/reranker model choice affects NAS resource usage and is intentionally deferred until measured.
