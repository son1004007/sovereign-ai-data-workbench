# Operation / Acceptance / Handover Guide

Baseline: 2026-09-06
Status: phase-1 backend acceptance plan; runtime results pending

## Runtime Components

- static publishing UI
- FastAPI API
- PostgreSQL + pgvector
- ingestion worker
- project artifact volume

## Start / Stop / Status

Development commands are defined in `docs/04-install-deployment-guide.md`.

Operational status is not inferred from process existence alone. Minimum checks:

- API health response;
- DB connectivity/migration compatibility;
- worker can claim queued job;
- artifact volume is readable/writable within allowed root;
- latest smoke ingestion state.

## Logs / Diagnostics

Initial backend logs should carry, where available:

- request ID
- job ID
- document ID
- stage
- bounded error code/message

Never log source file bytes, credentials or sensitive tokens.

Primary diagnostic records:

- `jobs`
- `documents.status`
- `run_traces`
- application/worker logs

## Routine Operations

### Check queued/failed jobs

Inspect job counts/state in PostgreSQL. A future admin/API view may expose this, but DB state remains authoritative until then.

### Retry policy

Do not blindly requeue deterministic invalid-input/non-text-layer PDF failures. A manual retry should record a new attempt/reason after correcting the actual condition.

### Stop processing without deleting work

Stop worker process. Queued jobs remain persisted. RUNNING-job recovery is a known limitation until stale-claim recovery is implemented and tested.

## Backup / Restore

Not yet runtime-verified.

Required backup domains before production-like use:

- PostgreSQL database
- project artifact volume

Restore acceptance must verify that document metadata still resolves to artifacts and provenance/hash remains consistent.

## Incident First Response

1. identify affected request/job/document IDs;
2. stop worker if continued processing could increase damage;
3. preserve relevant logs/DB state;
4. classify whether failure is input, parser, DB, filesystem or application defect;
5. rollback/disable/forward-fix as appropriate;
6. run bounded smoke/regression after correction;
7. record review/reconciliation evidence for substantive fixes.

## Acceptance Matrix — Current Baseline

| Check | Evidence | Result | Notes |
| --- | --- | --- | --- |
| Publishing static check | existing GitHub workflow / prior runtime evidence | PASS | synthetic/static only |
| Korean guided publishing | `CURRENT_STATE.md` prior verification | PASS | backend not connected |
| Backend source exists | repository after phase-1 code commit | PENDING | |
| Unit tests | CI/local execution | NOT RUN | new code not yet executed |
| PostgreSQL migration | CI/runtime | NOT RUN | |
| pgvector extension | CI/runtime | NOT RUN | |
| Durable job claim | integration test | NOT RUN | |
| SHA-256 provenance | unit/integration test | NOT RUN | |
| bbox PDF extraction | generated/public PDF test | NOT RUN | |
| API upload -> worker -> READY | end-to-end smoke | NOT RUN | |
| NAS backend runtime | device-control bounded deployment | NOT RUN | |
| Retrieval/RRF/reranker | later slice | NOT RUN | intentionally not implemented yet |
| Citation-grounded answer | later slice | NOT RUN | |
| Measured evaluation | later slice | NOT RUN | |
| Zero-egress/air-gap claim | runtime evidence | NOT RUN | must not claim yet |

## Known Issues / Residual Risk

- backend runtime and DB integration are pending implementation verification;
- stale RUNNING job recovery is not complete;
- broad publishing UI contains synthetic concepts beyond the first real backend slice;
- retrieval/evaluation and credential/auth functionality are not implemented;
- current public static preview is not a production deployment contract.

## Handover Boundaries

- repository/source-of-truth: this GitHub repository
- product decisions: `DECISIONS.md`
- current implementation state: `CURRENT_STATE.md`
- device/NAS runtime access: `son1004007/device-control`
- engineering standards: `son1004007/personal-engineering-handbook`

## Next Acceptance Actions

After phase-1 code is committed:

1. CI unit/static tests;
2. CI PostgreSQL/pgvector migration + integration tests;
3. AGY/Gemini independent final review;
4. bounded NAS deploy/smoke via device-control;
5. update this matrix with actual evidence only.
