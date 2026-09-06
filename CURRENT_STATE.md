# Current State

Last updated: 2026-09-06 KST

## Status

Architecture/product narrowing and the durable Korean-first UI publishing build are complete. **Phase-1 backend implementation has now started** against the narrowed document-intelligence vertical slice.

The repository now also applies the `personal-engineering-handbook` DLV-01~07 deliverable model and mandatory independent-review policy v1.4.1.

## Authoritative read order

1. `AGENTS.md`
2. `PROJECT_BRIEF.md`
3. `DECISIONS.md`
4. `docs/01-requirements-and-traceability.md`
5. `docs/02-system-design.md`
6. `docs/03-database-spec.md`
7. `prototype/UI_SPEC.md`
8. this file

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

## Phase-1 backend implementation — added 2026-09-06

Implemented source baseline:

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

Current implemented intent:

1. bounded PDF upload/storage under a configured artifact root;
2. SHA-256 content identity and duplicate artifact reuse;
3. FastAPI document registration + durable ingestion job creation;
4. PyMuPDF text-layer extraction preserving page/bbox per extracted word/span;
5. PostgreSQL schema for documents/spans/chunks/embeddings/jobs/run traces;
6. `FOR UPDATE SKIP LOCKED` durable job claim;
7. worker state transitions and bounded failure recording;
8. unit tests for PDF extraction/storage boundary;
9. PostgreSQL integration test for exclusive durable job claim;
10. CI intended to run Ruff, pgvector migration and pytest.

### Verification status

The source is **implemented but not yet accepted as Done**.

- source committed: PASS
- independent review: PENDING
- GitHub backend CI: PENDING CHECK
- PostgreSQL migration execution: NOT YET CONFIRMED
- integration tests: NOT YET CONFIRMED
- NAS backend deploy/smoke: NOT RUN

Do not report the backend as operational until these checks have evidence.

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

Major implemented publishing concepts include:

- multi-project Control Center;
- analysis task lifecycle and task detail;
- recurring analysis / run comparison / drift;
- experiment/model registry concepts;
- data source/profiling concepts;
- analysis recipe concepts;
- evidence/retrieval inspector and citation-to-bbox interaction;
- synthetic mini-evaluation;
- AI profile/provider UX;
- desktop-first responsive behavior.

The publishing build has no real API/auth/database/model execution yet. Backend integration will replace synthetic states progressively rather than forcing all broad UI concepts into the first backend slice.

## Prior publishing runtime evidence

Last explicitly recorded publishing verification was 2026-09-03:

- Synology loopback static HTTP: PASS;
- Cloudflare Quick Tunnel container: running at that time;
- external HTTP post-check from Synology: PASS;
- content: synthetic static UI only;
- public authentication: none.

The old Quick Tunnel URL is not treated as current because it is temporary.

## Runtime / agent boundary

- Synology `sovereign-workbench` is the dedicated non-production workspace managed by `son1004007/device-control`.
- GitHub remains the durable source-of-truth authoring path.
- NAS deployment/runtime access must use the bounded device-control path.
- public/company-sensitive boundaries in `AGENTS.md` remain mandatory.

## Next implementation work

After current source passes CI + independent review:

1. bounded NAS deployment and API/worker/PostgreSQL smoke test;
2. update DLV-01/DLV-07 with actual PASS/FAIL evidence;
3. implement deterministic chunk generation and span->chunk lineage;
4. implement PostgreSQL lexical FTS;
5. select/measure local embedding model and implement pgvector retrieval;
6. implement RRF + local reranker;
7. implement citation response contract and progressively connect the Evidence UI;
8. implement reproducible evaluation harness and measured metrics;
9. implement/test explicit egress policy before making stronger sovereignty claims.

## Deferred

OCR/VLM, L40S serving, Spring/JPA/RBAC, LangGraph, MCP, dedicated observability dashboard, Kafka, mandatory Redis, Kubernetes and LoRA remain outside the first measured vertical slice.
