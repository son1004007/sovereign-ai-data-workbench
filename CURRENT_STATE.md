# Current State

Last updated: 2026-09-06 KST

## Status

The repository is implementing one narrowed document-intelligence vertical slice.

**DLV-02 screen-design/publishing is now merged to `main` and accepted for the current low-risk static milestone.** The publishing artifact is an executable review contract; it does not imply that backend/retrieval/evaluation functionality is already live.

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

## DLV-02 Publishing — accepted 2026-09-06

Merged PR:

- PR: `#1 feat: complete screen-design publishing deliverable`
- merge commit: `0cabead92d71bdf12a1c44d7a6b4b88191d0d7dc`

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

Legacy `app.js`, `styles.css`, `enhancements.js`, and `korean-guide.js` are not current runtime evidence.

### Screen coverage

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

Task detail has the stable 10-tab contract:

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

`문서·수집 파이프라인` covers:

- source hash / document / job / parser / span state;
- `REGISTERED -> QUEUED -> PROCESSING -> EXTRACT -> READY`;
- mixed / processing / ready / failed / empty / permission-denied review states;
- failed text-layer PDF without fake OCR success;
- backend-disabled upload contract;
- list/detail reconciliation when scenario filters change.

`근거·평가` covers:

- source SHA-256 and parser/index/model/run identity contract;
- runtime egress `NOT VERIFIED`;
- lexical/vector/RRF/reranker ranking contract;
- stage latency contract;
- citation -> source evidence highlight;
- unanswerable/refusal behavior;
- synthetic mini-evaluation.

### Publishing verification and review evidence

PR-head CI:

- run `34004208520`: **SUCCESS** on head `e717d15c32e5c4ba2cc4a8823f27d9c754789a4d`

Post-merge `main` CI:

- run `34004329598`: **SUCCESS** on merge commit `0cabead92d71bdf12a1c44d7a6b4b88191d0d7dc`

Independent review:

- `son1004007/device-control#366`
- AGY/Gemini verdict: `READY_FOR_RECONCILIATION`
- calibrated BLOCKER: 0
- calibrated MAJOR: 0
- NITs: bounded duplicate render/search/style observations accepted for this static milestone

CI verifies:

- live JavaScript syntax;
- 12-screen contract;
- 10 task-detail tabs;
- document scenario and stale-detail reconciliation markers;
- evidence/citation/eval interaction contract;
- runtime egress `NOT VERIFIED` language;
- responsive CSS/mobile navigation contract;
- zero external runtime URL dependency.

### Explicit NOT RUN

Browser-level visual smoke for the merged publishing build is **NOT RUN** in the current ChatGPT execution environment because outbound GitHub DNS/network was unavailable. The independent reviewer assessed this as non-blocking for this low-risk personal/public static publishing milestone because deterministic syntax/static CI passed and the gap is explicit rather than represented as PASS.

## Backend foundation — separate logical change

Backend code currently includes FastAPI, PostgreSQL/pgvector schema, bounded artifact storage, SHA-256 identity, PyMuPDF bbox extraction, durable PostgreSQL jobs, worker state persistence, run traces and CI tests.

Earlier backend evidence includes CI run `34001712895` at commit `94c6fc65f492a983164645ca1aebe892a8408fd2` = SUCCESS. A later independent review identified an active-job concurrency race; repository changes added document-row locking and an active-ingest uniqueness guard. Backend review/re-verification and runtime/API acceptance remain separate from DLV-02 publishing acceptance.

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
- NAS/runtime access must use `son1004007/device-control` bounded policy.
- public/company-sensitive boundaries in `AGENTS.md` remain mandatory.

## Next product/backend work

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
