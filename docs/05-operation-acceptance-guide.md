# Operation / Acceptance / Handover Guide

Baseline: 2026-09-06

## Deliverable status split

### DLV-02 publishing

Status: **ACCEPTED for the current low-risk static screen-design milestone**.

Evidence:

- PR `#1 feat: complete screen-design publishing deliverable`
- merge commit `0cabead92d71bdf12a1c44d7a6b4b88191d0d7dc`
- PR-head publishing CI `34004208520`: PASS
- post-merge `main` publishing CI `34004329598`: PASS
- independent AGY/Gemini review `device-control#366`: `READY_FOR_RECONCILIATION`
- calibrated BLOCKER: 0
- calibrated MAJOR: 0
- browser visual smoke: NOT RUN; explicitly non-blocking for this static milestone after review

### Backend / runtime

Status: **NOT yet normal-Done for deployed operation**.

Backend/runtime acceptance remains a separate logical change. Publishing acceptance must not be interpreted as backend deployment or operational acceptance.

## Runtime components

- static publishing UI
- FastAPI API
- PostgreSQL + pgvector
- ingestion worker
- project artifact volume

## Publishing handover

Primary runtime:

```text
prototype/index.html
-> styles-v2.css
-> publishing-complete.css
-> mobile-nav-fix.css
-> app-v2.js
-> publishing-state-fix.js
-> mobile-nav-fix.js
```

Authoritative UI contract:

- `prototype/UI_SPEC.md`
- `prototype/README.md`
- `docs/01-requirements-and-traceability.md`

Publishing state coverage includes:

- 12 menu screens;
- 10 analysis-task detail tabs;
- document mixed / queued-processing / ready / failed / empty / permission-denied states;
- disabled backend upload/execution states;
- retrieval/citation/evaluation contract states;
- policy-denied provider state;
- responsive/mobile navigation contract;
- explicit synthetic/runtime boundary;
- egress `NOT VERIFIED` wording instead of unsupported sovereignty claims.

## Start / status

Static local publishing:

```bash
cd prototype
python3 -m http.server 8080
```

Then open `http://127.0.0.1:8080/`.

The static screen itself is not authoritative for backend state. When backend integration is added, PostgreSQL/API/runtime evidence remains authoritative.

## Publishing acceptance matrix

| Check | Evidence | Result | Notes |
| --- | --- | --- | --- |
| 12 top-level screen contract | publishing CI `34004208520`, `34004329598` | PASS | core + conditional/settings screens |
| 10 task-detail tabs | same CI | PASS | Summary through History |
| JavaScript syntax | `node --check` in same CI | PASS | live scripts incl. state helper/mobile helper |
| Document queued/processing/ready/failed states | `app-v2.js` + static contract | PASS | synthetic review states |
| Document empty state | `app-v2.js` + state reconciliation helper | PASS | stale detail is not left visible |
| Permission/policy-denied states | SCR-004/SCR-007/SCR-012 contract | PASS | future RBAC/policy contract only |
| Disabled real execution/upload | SCR-005/SCR-007 contract | PASS | backend not faked |
| Citation -> source evidence highlight | SCR-008 interaction contract | PASS | publishing interaction only |
| Synthetic mini-evaluation | SCR-008 interaction contract | PASS | explicitly not measured performance |
| Runtime egress wording | SCR-008/global banner | PASS | `NOT VERIFIED`, no zero-egress claim |
| External runtime URLs | publishing CI | PASS | 0 |
| Responsive/mobile CSS/navigation contract | publishing CI | PASS | deterministic selector/interaction checks |
| Independent final review | `device-control#366` | PASS | READY_FOR_RECONCILIATION, no BLOCKER/MAJOR |
| Browser-level visual smoke | approved browser runtime | NOT RUN | current ChatGPT container could not resolve/fetch GitHub; non-blocking for this low-risk static milestone |

## Backend acceptance matrix — separate work

| Check | Evidence | Result | Notes |
| --- | --- | --- | --- |
| Backend source baseline | existing repository | PASS | source exists; not deployment evidence |
| PostgreSQL/pgvector migration baseline | existing backend CI evidence | PASS | CI-level only |
| Durable worker/job tests | existing backend CI evidence | PASS | CI-level only |
| HTTP multipart upload -> DB/job -> worker -> status | end-to-end API acceptance | NOT RUN | still required |
| Backend review after concurrency-guard changes | separate review/re-verification | NOT CLOSED HERE | not part of DLV-02 acceptance |
| NAS backend runtime | approved device-control smoke | NOT RUN | no operational claim |
| Backup/restore | runtime exercise | NOT RUN | required before production-like use |
| Stale RUNNING-job recovery | implementation + fault test | NOT RUN | known limitation |
| Retrieval/RRF/reranker backend | later slice | NOT RUN | publishing contract only today |
| Citation-grounded backend answer | later slice | NOT RUN | publishing contract only today |
| Measured evaluation backend | later slice | NOT RUN | publishing contract only today |
| Zero-egress/air-gap runtime evidence | runtime enforcement/evidence | NOT RUN | must not claim |

## Diagnostics / operation boundary

For backend runtime, expected diagnostic records remain:

- `jobs`
- `documents.status`
- `run_traces`
- application/worker logs

Do not infer operational health from the publishing UI or process existence alone.

## Known issues / residual risk

Publishing:

- browser-level visual smoke is NOT RUN in the current environment;
- broader optional screens are synthetic design contracts and do not imply implemented backend capabilities.

Backend/runtime:

- HTTP API end-to-end acceptance remains open;
- stale RUNNING job recovery is not implemented/tested;
- NAS runtime and backup/restore are not verified;
- retrieval/evaluation and auth functionality are not implemented;
- explicit runtime egress enforcement/evidence is not implemented.

## Handover boundaries

- repository/source-of-truth: this GitHub repository
- product decisions: `DECISIONS.md`
- requirements/traceability: `docs/01-requirements-and-traceability.md`
- publishing contract: `prototype/UI_SPEC.md`
- publishing run/review guide: `prototype/README.md`
- current implementation state: `CURRENT_STATE.md`
- device/NAS runtime access: `son1004007/device-control`
- engineering standards: `son1004007/personal-engineering-handbook`

## Next acceptance actions

Publishing is closed for the current static milestone. Next work is product/backend integration:

1. HTTP multipart API -> DB/job -> worker -> status acceptance;
2. bounded NAS runtime smoke;
3. retrieval stack implementation;
4. citation API integration into SCR-008;
5. reproducible measured evaluation;
6. explicit runtime egress enforcement/evidence.
