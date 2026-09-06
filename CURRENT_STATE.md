# Current State

Last updated: 2026-09-06 KST

## Status

Architecture/product narrowing and the durable Korean-first UI publishing build are complete. **Phase-1 backend foundation is implemented and CI-verified, but not yet normal-Done because independent review and runtime/API acceptance remain open.**

The repository applies the `personal-engineering-handbook` DLV-01~07 deliverable model and mandatory independent-review policy v1.4.1.

## Authoritative read order

1. `AGENTS.md`
2. `PROJECT_BRIEF.md`
3. `DECISIONS.md`
4. `docs/01-requirements-and-traceability.md`
5. `docs/02-system-design.md`
6. `docs/03-database-spec.md`
7. `docs/05-operation-acceptance-guide.md`
8. `prototype/UI_SPEC.md`
9. this file

## First vertical slice

```text
public text-layer PDF
  -> SHA-256 provenance
  -> page/bbox-preserving extraction
  -> PostgreSQL + pgvector
  -> durable PostgreSQL-backed job worker
  -> PostgreSQL lexical FTS + vector retrieval + RRF
  -> local reranker
  -> citation-grounded result
  -> citation -> original PDF bbox inspection
  -> automated evaluation/regression
```

## Phase-1 backend foundation — implemented 2026-09-06

Implemented source:

- `backend/pyproject.toml`
- `backend/app/config.py`
- `backend/app/db.py`
- `backend/app/storage.py`
- `backend/app/pdf_extractor.py`
- `backend/app/repository.py`
- `backend/app/worker.py`
- `backend/app/main.py`
- `backend/migrations/001_initial.sql`
- `backend/tests/`
- `.github/workflows/backend-ci.yml`
- `docker-compose.yml`

Implemented behavior:

1. bounded PDF upload/storage under configured artifact root;
2. SHA-256 content identity and duplicate artifact reuse;
3. FastAPI document registration + durable ingestion job creation;
4. PyMuPDF text-layer extraction preserving page/bbox;
5. PostgreSQL schema for documents/spans/chunks/embeddings/jobs/run traces;
6. `FOR UPDATE SKIP LOCKED` durable job claim;
7. worker processing and persisted success/failure state;
8. parser name/version and run trace metadata;
9. tests for storage, bbox extraction, durable claim and worker integration;
10. CI for Ruff, PostgreSQL/pgvector migration and pytest.

## Verification evidence

Evidence anchor for current backend code: commit `94c6fc65f492a983164645ca1aebe892a8408fd2`.

Backend CI run `34001712895`: **SUCCESS**.

Successful CI steps:

- backend install: PASS
- Ruff lint: PASS
- PostgreSQL client/setup: PASS
- `backend/migrations/001_initial.sql`: PASS
- pgvector extension/schema creation: PASS
- pytest: PASS
- exclusive durable job claim integration: PASS
- worker -> extraction -> document READY/job SUCCEEDED/span/run_trace integration: PASS

### Still open

- AGY/Gemini independent final review: PENDING via `device-control` issue `#363`
- severity calibration/reconciliation: PENDING
- HTTP multipart API -> DB/job -> worker -> status E2E: NOT RUN
- NAS backend deployment/runtime smoke: NOT RUN
- backup/restore: NOT RUN
- stale `RUNNING` job recovery: NOT IMPLEMENTED/NOT RUN

Therefore the backend is **source-implemented and CI-integrated, not yet claimed operational/deployed**.

## Deliverables

- DLV-01: `docs/01-requirements-and-traceability.md`
- DLV-02: `prototype/`, `prototype/UI_SPEC.md`, `prototype/README.md`
- DLV-03: `docs/02-system-design.md`, `DECISIONS.md`
- DLV-04: `docs/03-database-spec.md`, `backend/migrations/`
- DLV-05: `backend/`, `prototype/`, `.github/workflows/`
- DLV-06: `docs/04-install-deployment-guide.md`
- DLV-07: `docs/05-operation-acceptance-guide.md`

## Publishing build

The static publishing build remains the durable UI/interaction reference and is Korean-first, analyst-supervisor oriented, and synthetic-data only.

Major publishing concepts include:

- multi-project Control Center;
- analysis task lifecycle/detail;
- recurring analysis/run comparison/drift;
- experiment/model registry concepts;
- data source/profiling concepts;
- analysis recipe concepts;
- evidence/retrieval inspector and citation-to-bbox interaction;
- synthetic mini-evaluation;
- AI profile/provider UX;
- desktop-first responsive behavior.

Broad UI concepts remain synthetic/reference until backed by real contracts. Backend integration follows the narrowed first slice rather than implementing every publishing page at once.

## Prior publishing runtime evidence

Last explicitly recorded publishing verification was 2026-09-03:

- Synology loopback static HTTP: PASS;
- Cloudflare Quick Tunnel container: running at that time;
- external HTTP post-check from Synology: PASS;
- content: synthetic static UI only;
- public authentication: none.

The old Quick Tunnel URL is temporary and is not treated as current.

## Runtime / agent boundary

- GitHub is the durable source-of-truth.
- NAS runtime/device access must use `son1004007/device-control` bounded policy.
- direct `sovereign-workbench` AGY workspace review was attempted but rejected because that workspace/path is not allow-listed; no bypass was used.
- final independent review therefore uses an allow-listed read-only AGY workspace with the exact target-code snapshot in the review payload.
- public/company-sensitive boundaries in `AGENTS.md` remain mandatory.

## Next implementation work

After independent review/reconciliation closes the current foundation:

1. add HTTP multipart API -> DB/job -> worker -> status acceptance test;
2. bounded NAS deployment and API/worker/PostgreSQL smoke through approved device-control path;
3. implement deterministic chunk generation and span->chunk lineage;
4. implement PostgreSQL lexical FTS retrieval;
5. select/measure local embedding model and implement pgvector retrieval;
6. implement RRF + local reranker;
7. implement citation response contract and progressively connect Evidence UI;
8. implement reproducible evaluation harness/metrics;
9. implement/test explicit egress policy before stronger sovereignty claims.

## Deferred

OCR/VLM, L40S serving, Spring/JPA/RBAC, LangGraph, MCP, dedicated observability dashboard, Kafka, mandatory Redis, Kubernetes and LoRA remain outside the first measured vertical slice.
