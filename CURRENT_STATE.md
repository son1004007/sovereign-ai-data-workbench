# Current State

Last updated: 2026-09-06 KST

## Status

The repository is implementing one narrowed document-intelligence vertical slice. The **screen-design/publishing deliverable has now been expanded into a completion candidate on branch `publishing-complete-2026-09-06`** and passes the repository static publishing contract, but it is not yet declared normal-Done until independent final review/reconciliation is complete.

The repository applies `personal-engineering-handbook` DLV-01~07 and `REVIEW_POLICY.md` v1.4.1.

## Authoritative read order

1. `AGENTS.md`
2. `PROJECT_BRIEF.md`
3. `DECISIONS.md`
4. `docs/01-requirements-and-traceability.md`
5. `docs/02-system-design.md`
6. `docs/03-database-spec.md`
7. `docs/05-operation-acceptance-guide.md`
8. `prototype/UI_SPEC.md`
9. `prototype/README.md`
10. this file

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

## DLV-02 Publishing completion candidate — 2026-09-06

Branch:

```text
publishing-complete-2026-09-06
```

Primary runtime:

```text
prototype/index.html
-> styles-v2.css
-> publishing-complete.css
-> mobile-nav-fix.css
-> app-v2.js
-> mobile-nav-fix.js
```

Legacy `app.js/styles.css/enhancements.js/korean-guide.js` are not current runtime evidence.

### Implemented screen coverage

Core:

1. 통합 관제
2. 프로젝트
3. 분석 과제
4. 데이터 연결·검증
5. 분석 실행·결과
6. 결과·이력
7. 문서·수집 파이프라인
8. 근거·평가

Conditional/recommended:

9. 정기 분석
10. ML 실험·모델
11. 분석 레시피
12. AI 계정·모델 연결

Task detail now covers the stable 10-tab contract:

- Summary
- Requirements
- Data
- Analysis Plan
- Runs
- Experiments
- Models
- QA
- Reports
- History

### First-slice UI coverage

`문서·수집 파이프라인` now covers:

- source hash / document / job / parser / span status;
- REGISTERED -> QUEUED -> PROCESSING -> EXTRACT -> READY flow;
- mixed / processing / ready / failed / empty / permission-denied review states;
- failed text-layer PDF state without fake OCR success;
- backend-disabled upload contract.

`근거·평가` now covers:

- source SHA-256 and parser/index/model/run identity contract;
- runtime egress `NOT VERIFIED` wording;
- lexical/vector/RRF/reranker ranking contract;
- stage latency contract;
- clickable citation -> source evidence highlight;
- unanswerable/refusal behavior;
- synthetic evaluation interaction.

### Publishing verification evidence

Publishing CI run `34003929808`: **SUCCESS** at commit `930f1a2fd55be41e33369f9ca6446c42092da0f1`.

Validated by CI:

- `node --check` for live JavaScript;
- 12-screen label/contract coverage;
- 10 task-detail tabs;
- document state scenario controls;
- evidence/citation/eval interaction markers;
- runtime egress `NOT VERIFIED` language;
- responsive completion CSS contract;
- mobile navigation regression contract;
- zero external runtime URL dependency.

Not yet claimed:

- browser-level visual smoke on this branch in an accessible browser runtime;
- independent final review/reconciliation;
- backend/API connectivity for the synthetic UI states.

## Backend foundation

Backend code currently includes FastAPI, PostgreSQL/pgvector schema, bounded artifact storage, SHA-256 identity, PyMuPDF bbox extraction, durable PostgreSQL jobs, worker state persistence, run traces and CI tests.

Backend verification evidence already recorded includes Backend CI run `34001712895` at commit `94c6fc65f492a983164645ca1aebe892a8408fd2` = SUCCESS. The later AGY review identified an active-job concurrency race as a credible MAJOR; repository changes added document row locking and an active-ingest uniqueness guard. Remaining backend review findings/re-verification are a separate logical change from this publishing completion work.

Do not report the backend as deployed/operational merely because the publishing screen exists.

## Deliverables

- DLV-01: `docs/01-requirements-and-traceability.md`
- DLV-02: `prototype/`, `prototype/UI_SPEC.md`, `prototype/README.md`
- DLV-03: `docs/02-system-design.md`, `DECISIONS.md`
- DLV-04: `docs/03-database-spec.md`, `backend/migrations/`
- DLV-05: `backend/`, `prototype/`, `.github/workflows/`
- DLV-06: `docs/04-install-deployment-guide.md`
- DLV-07: `docs/05-operation-acceptance-guide.md`

## Runtime / agent boundary

- GitHub is the durable source-of-truth.
- NAS runtime/device access must use `son1004007/device-control` bounded policy.
- current execution container could not clone GitHub for local browser smoke because outbound GitHub DNS/network was unavailable; this is recorded as NOT RUN, not PASS.
- public/company-sensitive boundaries in `AGENTS.md` remain mandatory.

## Next work

Publishing change:

1. independent AGY/Gemini final review of the publishing branch/diff;
2. reconcile findings;
3. merge only after review gate is satisfied;
4. browser/runtime visual smoke when an approved accessible environment is available.

Product/backend next slice after the current foundation is reconciled:

1. HTTP multipart API -> DB/job -> worker -> status acceptance;
2. bounded NAS deployment/runtime smoke;
3. deterministic chunk generation + span lineage;
4. PostgreSQL lexical FTS;
5. pgvector dense retrieval;
6. RRF + local reranker;
7. citation response API connected to SCR-008;
8. reproducible evaluation harness;
9. explicit runtime egress enforcement/evidence.

## Deferred

OCR/VLM, L40S serving, Spring/JPA/RBAC, LangGraph, MCP, dedicated observability dashboard, Kafka, mandatory Redis, Kubernetes and LoRA remain outside the first measured vertical slice.
