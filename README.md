# Sovereign AI Data Workbench

Portfolio-grade, auditable document-intelligence/data-analysis workbench focused on measurable engineering evidence rather than a chatbot-first demo.

## Current implementation focus

The first real backend slice is intentionally narrow:

```text
public text-layer PDF
-> SHA-256 provenance
-> page/bbox-preserving extraction
-> PostgreSQL + pgvector
-> durable PostgreSQL-backed job worker
-> lexical + dense retrieval
-> RRF + local reranker
-> citation-grounded evidence
-> reproducible evaluation
```

The repository already contains a durable Korean-first static publishing build under `prototype/`. Backend implementation is being connected incrementally; synthetic UI states are not presented as real backend functionality.

## Start here

- `AGENTS.md` — engineering/review/data-boundary rules
- `PROJECT_BRIEF.md` — broad product intent
- `DECISIONS.md` — narrowed first-slice decisions
- `CURRENT_STATE.md` — actual implementation/verification state
- `docs/00-deliverables-index.md` — project deliverables
- `docs/01-requirements-and-traceability.md` — requirement-to-evidence map
- `prototype/UI_SPEC.md` — UI/information-architecture contract

## Backend quick start

```bash
docker compose up -d postgres
export WORKBENCH_DATABASE_URL='postgresql://workbench:workbench@127.0.0.1:5432/workbench'
psql "$WORKBENCH_DATABASE_URL" -v ON_ERROR_STOP=1 -f backend/migrations/001_initial.sql

cd backend
python3 -m venv .venv
. .venv/bin/activate
pip install -e '.[dev]'
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Worker in another shell:

```bash
cd backend
. .venv/bin/activate
python -m app.worker
```

Full installation/operation details:

- `docs/04-install-deployment-guide.md`
- `docs/05-operation-acceptance-guide.md`

## Public-data boundary

This public repository uses only public or synthetic data. Do not add employer/client source code, credentials, internal topology, private configuration, confidential datasets or reconstructable non-public context.

## Evidence rule

Do not claim a backend capability, performance number, sovereign/zero-egress property or deployment state without actual review/runtime/test evidence. `CURRENT_STATE.md` distinguishes implemented source from verified operational behavior.
