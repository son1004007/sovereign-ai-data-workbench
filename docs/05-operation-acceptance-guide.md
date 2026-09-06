# Operation / Acceptance / Handover Guide

Baseline: 2026-09-06
Status: phase-1 backend source + CI integration verified; independent review/NAS runtime pending
Evidence anchor: commit `94c6fc65f492a983164645ca1aebe892a8408fd2`, Backend CI run `34001712895`.

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

| Check | Evidence | Result | Release Impact / Notes |
| --- | --- | --- | --- |
| Publishing static check | prior publishing workflow/runtime evidence | PASS | synthetic/static only |
| Korean guided publishing | `CURRENT_STATE.md` prior verification | PASS | backend not connected |
| Backend source baseline | commit `94c6fc65...` | PASS | source exists; not equal to runtime deployment |
| Ruff lint | Backend CI run `34001712895`, step `Lint` | PASS | |
| PostgreSQL migration | Backend CI run `34001712895`, `Apply database migration` | PASS | pgvector/PostgreSQL service |
| pgvector extension/schema | migration in same CI run | PASS | vector extension + baseline tables created |
| Unit/integration tests | Backend CI run `34001712895`, `Run tests` | PASS | storage/extractor/job/worker tests |
| Durable job exclusive claim | `test_db_integration.py` | PASS | `FOR UPDATE SKIP LOCKED` behavior exercised |
| SHA-256 artifact identity/dedupe/path boundary | `test_storage.py` | PASS | DB/API persistence still separately pending |
| bbox text-layer extraction | `test_pdf_extractor.py` | PASS | no-text-layer rejection also exercised |
| Worker queued job -> extraction -> READY/SUCCEEDED/span/trace | `test_worker_integration.py` | PASS | PostgreSQL + filesystem integration in CI |
| HTTP multipart upload -> DB/job -> worker -> status | end-to-end API smoke | NOT RUN | required before ingestion foundation fully VERIFIED |
| Independent AGY/Gemini final review | device-control issue `#363` | PENDING | release/Done gate not yet closed |
| NAS backend runtime | approved device-control deployment/smoke | NOT RUN | no production/runtime claim |
| Backup/restore | runtime exercise | NOT RUN | required before production-like use |
| Stale RUNNING-job recovery | implementation + fault test | NOT RUN | known operational limitation |
| Retrieval/RRF/reranker | later slice | NOT RUN | intentionally not implemented yet |
| Citation-grounded answer | later slice | NOT RUN | intentionally not implemented yet |
| Measured evaluation | later slice | NOT RUN | intentionally not implemented yet |
| Zero-egress/air-gap claim | runtime egress evidence | NOT RUN | must not claim yet |

## Current Release / Handover Interpretation

This baseline is **not yet normal-Done for deployed backend operation** because independent review and runtime/API acceptance remain open.

No active calibrated BLOCKER has been established yet; AGY findings remain pending review/reconciliation.

## Known Issues / Residual Risk

- stale `RUNNING` job recovery is not implemented/tested;
- HTTP API multipart end-to-end path is not yet exercised;
- NAS backend runtime and backup/restore are not tested;
- broad publishing UI contains synthetic concepts beyond first backend slice;
- retrieval/evaluation and credential/auth functionality are not implemented;
- explicit egress enforcement/evidence is not implemented;
- current public static preview is not a production deployment contract.

## Handover Boundaries

- repository/source-of-truth: this GitHub repository
- product decisions: `DECISIONS.md`
- current implementation state: `CURRENT_STATE.md`
- device/NAS runtime access: `son1004007/device-control`
- engineering standards: `son1004007/personal-engineering-handbook`

## Next Acceptance Actions

1. complete AGY/Gemini independent final review + severity calibration/reconciliation;
2. add HTTP multipart API -> DB/job -> worker -> status acceptance test/smoke;
3. use approved device-control path for bounded NAS deployment and runtime smoke;
4. verify backup/restore and stale-job policy before any production-like claim;
5. only then mark phase-1 ingestion foundation fully verified.
