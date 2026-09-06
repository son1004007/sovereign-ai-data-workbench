# UI Publishing Specification

Status: `working product UI contract`
Baseline: 2026-09-06
Runtime entry: `index.html -> app-v2.js + styles-v2.css + publishing-complete.css`

이 문서는 요구사항과 실제 퍼블리싱 구현 사이의 DLV-02 계약이다. 퍼블리싱은 단순 이미지/mockup이 아니라 화면 구조, 주요 상태, 사용자 흐름, synthetic/real 경계를 검토할 수 있는 실행형 산출물로 유지한다.

## 1. Product and user model

Primary user:

- 여러 프로젝트/분석 과제를 동시에 감독하는 데이터 분석가
- 반복 가능한 작업은 자동화에 맡기고 실패·승인·판단이 필요한 지점에 개입
- 첫 technical vertical slice에서는 public/synthetic PDF ingest, provenance, evidence, evaluation을 직접 점검

Mental model:

```text
analyst as supervisor
> engineering inspection workbench
> chatbot-first UI
```

## 2. Publishing boundary

- 모든 표시 데이터, KPI, 문서, 모델/검색 점수는 `public/synthetic` UI 검토용 예시다.
- 실제 API/auth/database/model/retrieval/evaluation 결과와 혼동하지 않는다.
- runtime evidence가 없으면 `zero-egress`, `air-gapped`, `measured performance`를 주장하지 않는다.
- 실제 SQL/Python execution contract가 연결되기 전에는 정적 화면에서 IDE나 실행 성공을 가장하지 않는다.
- secret 값은 등록 후 재표시하지 않는 UX를 전제로 한다.

## 3. Global navigation / screen map

| Screen ID | Menu | Priority | Primary purpose | First-slice relation |
| --- | --- | --- | --- | --- |
| SCR-001 | 통합 관제 | 필수 | action queue, multi-project health, first-slice progress | summary |
| SCR-002 | 프로젝트 | 필수 | project context, scope, deliverable/blocker grouping | supporting |
| SCR-003 | 분석 과제 | 필수 | G1~G6 task lifecycle and task detail | supporting |
| SCR-004 | 데이터 연결·검증 | 필수 | DB/file/document source and quality/access state | supporting |
| SCR-005 | 분석 실행·결과 | 필수 | Run input/policy/result/QA contract without fake IDE | supporting |
| SCR-006 | 결과·이력 | 필수 | Run history, comparison, reproducibility evidence | supporting |
| SCR-007 | 문서·수집 파이프라인 | 필수 | PDF registration, durable job, parser/span status | **first-slice core** |
| SCR-008 | 근거·평가 | 필수 | provenance, retrieval inspector, citation, bbox, eval | **first-slice core** |
| SCR-009 | 정기 분석 | 조건부 | cadence, run comparison, drift/retraining review | later/optional |
| SCR-010 | ML 실험·모델 | 조건부 | baseline/candidate/activation lifecycle | later/optional |
| SCR-011 | 분석 레시피 | 권장 | reusable analysis contract/version | later/optional |
| SCR-012 | AI 계정·모델 연결 | 권장 | profile/scope/quota/policy routing state | supporting policy UX |
| SCR-003-A | 분석 과제 상세 | 필수 | task tabs and handoff context | supporting |

`기본 기능만 보기`는 확장 기능을 숨기되 필수 first-slice 화면은 유지한다.

## 4. Global UI rules

Every page should make these explicit where relevant:

- current state: synthetic/publishing vs real backend/runtime
- action owner: automated / human review / blocked
- result semantics: PASS / FAIL / NOT RUN / BLOCKED / planned
- status text must accompany status color
- dense enterprise table/grid layout; no marketing cards as the primary information form
- system/local fonts only; no external runtime dependency

## 5. SCR-001 Control Center

Must answer:

1. 무엇이 진행 중인가?
2. 어디에 사람 판단이 필요한가?
3. 문서 ingest 또는 recurring/model 흐름 중 무엇이 비정상인가?
4. 어떤 프로젝트/과제를 다음으로 열어야 하는가?

Required regions:

- KPI strip
- human action queue
- first vertical-slice progress
- links into tasks/documents/models
- synthetic boundary notice

## 6. SCR-002 Projects

Required information:

- project name / scope
- analysis type
- active task count
- blocker count
- readiness/progress
- linked task/document entry points
- scope/data/review/deliverable context

Key actions:

- create project dialog contract
- open project tasks
- open document pipeline for first-slice project

## 7. SCR-003 Analysis Tasks

List contract:

- project
- task
- stage
- status
- analysis type
- one-time/recurring mode
- search and empty-result state

### SCR-003-A Task detail tabs

The publishing build covers the stable task contract:

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

`Runs` shows execution inputs/policy/evidence but must not simulate a real IDE while backend execution is absent.

Required states:

- confirmed requirement
- review-required requirement
- run approved/pending
- candidate vs active model
- QA PASS + review item
- draft/ready report artifact

## 8. SCR-004 Data Sources

Required concepts:

- DB/file/document connectors
- read-only/access mode
- connection state
- profiling checks
- data classification awareness
- permission-denied behavior

The publishing build shows connector setup as a contract only; it does not make network connections.

## 9. SCR-005 Analysis Execution / Results

Required concepts:

```text
requirements
-> analysis design
-> input snapshot
-> policy validation
-> actual calculation
-> result / QA
```

Before real execution is implemented, execution control is visibly `DISABLED` and describes the API/runtime dependency.

Do not fake:

- database results
- statistics
- model metrics
- execution PASS

## 10. SCR-006 Results / History

Required concepts:

- Run ID
- data window/snapshot
- pipeline/analysis/model version where relevant
- result / QA
- approval state
- artifacts/manifests
- previous-run comparison entry point

## 11. SCR-007 Document / Ingestion Pipeline

This is a first-slice core screen.

Required document row fields:

- document ID/name
- source SHA-256
- durable job ID
- status
- parser/version
- page/span count
- last update

Required pipeline states:

```text
REGISTERED
-> QUEUED
-> PROCESSING
-> EXTRACT
-> READY
```

Failure example:

- PDF has no extractable text layer
- OCR/VLM is outside the current slice
- UI shows `FAILED`; it must not substitute a synthetic success

Publishing review state switcher must expose:

- mixed
- processing/queued
- ready
- failed
- empty
- permission-denied

Upload behavior:

- static prototype may allow file selection UX
- actual submit remains disabled until `POST /api/v1/documents` is connected
- UI explicitly states that no file is transmitted by the static artifact

## 12. SCR-008 Evidence / Evaluation

This is a first-slice core screen.

### Provenance

Show:

- document SHA-256
- parser/version
- index/model/version placeholders where not implemented
- run/trace identity contract
- egress state as `NOT VERIFIED` until runtime evidence exists

### Retrieval inspector

Show conditional synthetic contract columns:

- lexical rank
- vector rank/similarity
- RRF rank/score
- reranker score
- stage latency

The page must not claim these are implemented/measured until backend evidence exists.

### Grounded answer

- citations resolve to chunk/page concept
- selected citation changes source evidence highlight
- unanswerable/unsupported question shows refusal behavior

### PDF evidence

- source document/page
- bbox-highlighted evidence region
- selected citation state

### Evaluation

- Hit@K
- MRR
- citation precision
- negative/unanswerable handling
- synthetic mini-eval interaction
- explicit synthetic label

## 13. SCR-009 Recurring Analysis

When applicable, show:

- cadence/timezone
- data window
- recipe/pipeline version
- recent run sequence
- latest vs previous comparison
- data/model drift
- next run
- review policy
- retraining candidate separated from ordinary scoring

## 14. SCR-010 Experiments & Models

Always compare candidates to a baseline.

Show:

- experiment ID
- problem type
- baseline metric
- candidate/current metric
- dataset/feature version
- CANDIDATE / ACTIVE / RETIRED state
- explicit activation review
- drift/retraining trigger

A numerically better synthetic model must not appear auto-activated.

## 15. SCR-011 Analysis Recipes

Recipe contract:

- name/type/version
- required inputs
- steps
- output schema/artifacts
- verification/reconciliation contract

The catalog is a reusable template layer, not an agent marketplace.

## 16. SCR-012 AI Accounts & Providers

Show:

- provider/agent
- profile label
- scope: personal/organization/local
- connection/quota/policy state
- selected default for new runs
- secret non-redisplay rule

Routing contract:

```text
task requirement
+ network mode
+ data classification
+ provider capability
+ selected user profile
+ organization policy
= final provider routing
```

Policy rejection must be visible. Silent provider substitution is prohibited for auditable runs.

## 17. State coverage

DLV-02 requires major non-happy-path states to be reviewable.

| State | Publishing coverage |
| --- | --- |
| loading/processing | document `PROCESSING`, pipeline state |
| queued | document `QUEUED` |
| empty | document empty state, task search empty state |
| error | document `FAILED` |
| disabled | actual execution/upload backend-dependent controls |
| permission-denied | document/data policy state |
| policy-denied | provider routing rejection example |
| review-required | dashboard/task/model/QA states |

## 18. Responsive behavior

Primary desktop target: 1440px productivity layout.

Narrow screens:

- sidebar becomes drawer
- tables remain horizontally scrollable
- dense two/three-column panels stack
- KPI grids reduce columns
- dialog becomes single-column
- evidence source stacks below answer/inspector
- no business-critical columns are silently deleted solely for mobile

## 19. Requirement-to-screen mapping

| Requirement | Screens |
| --- | --- |
| FR-DOC-001 | SCR-007 |
| FR-PROV-001 | SCR-007, SCR-008 |
| FR-EXT-001 | SCR-007, SCR-008 |
| FR-JOB-001 | SCR-007 |
| FR-DB-001 | SCR-004, SCR-007 (status only; DB truth remains backend) |
| FR-RET-001 | SCR-008 contract only until implemented |
| FR-RET-002 | SCR-008 contract only until implemented |
| FR-RET-003 | SCR-008 contract only until implemented |
| FR-RET-004 | SCR-008 contract only until implemented |
| FR-CIT-001 | SCR-008 |
| FR-EVAL-001 | SCR-008 |
| FR-OBS-001 | SCR-007, SCR-008 |
| SEC-EGR-001 | SCR-008, SCR-012, global boundary banner |
| SEC-DATA-001 | all screens / sample content |
| UI-001 | overall information architecture |

## 20. DLV-02 completion criteria

Publishing is ready for acceptance review when:

- all screen IDs above are reachable from the runnable artifact;
- task-detail tabs match this spec;
- first-slice document/evidence screens expose happy and major failure states;
- synthetic vs real/runtime boundary is explicit;
- citation interaction changes evidence highlight;
- document scenario controls expose processing/ready/failed/empty/permission states;
- static JavaScript/CSS contract checks pass;
- desktop/mobile layout remains usable;
- independent final review has no unresolved calibrated BLOCKER and MAJORs are reconciled per `REVIEW_POLICY.md`.
