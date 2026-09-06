(() => {
  'use strict';

  const state = {
    page: 'dashboard',
    taskTab: 'summary',
    requiredOnly: false,
    decisions: {},
    selectedProfile: '로컬 분석 / 오픈웨이트',
    documentScenario: 'mixed',
    selectedDocument: 'DOC-042',
    selectedCitation: 'CIT-01',
    evalRun: false,
    taskSearch: '',
  };

  const pages = {
    dashboard: { group: 'core', label: '통합 관제', need: '필수', title: '오늘 내가 개입해야 할 분석 업무를 한눈에 확인합니다.', summary: '여러 프로젝트의 정상 자동 실행은 요약하고 실패·승인·판단이 필요한 항목과 첫 vertical slice 문서 파이프라인 상태를 우선 보여줍니다.', when: '분석가가 여러 프로젝트와 자동 실행을 동시에 감독할 때 가장 먼저 사용합니다.', without: '실패와 승인 요청이 각 기능 화면에 흩어져 우선순위를 놓치기 쉽습니다.', example: '분석 과제 8건 중 사람 판단 3건과 문서 ingest 실패 1건만 우선 확인합니다.' },
    projects: { group: 'core', label: '프로젝트', need: '필수', title: '프로젝트 단위로 과제·데이터·산출물·차단 상태를 관리합니다.', summary: '고객 또는 업무 단위 컨텍스트를 먼저 고정하고 그 아래 분석 과제와 데이터 소스, 산출물, 승인 상태를 연결합니다.', when: '새 업무를 시작하거나 여러 과제를 같은 목적 아래 묶어볼 때 사용합니다.', without: '분석 과제와 데이터가 어떤 업무 목적에 속하는지 인수인계가 어려워집니다.', example: '문서 인텔리전스 포트폴리오 프로젝트 아래 PDF ingest, retrieval, evaluation 과제를 둡니다.' },
    tasks: { group: 'core', label: '분석 과제', need: '필수', title: '분석 한 건을 요구사항부터 검증·보고까지 같은 구조로 관리합니다.', summary: '요구사항, 데이터, 분석 설계, 실행, 결과, 실험·모델, QA, 보고서, 이력을 한 과제 안에 모읍니다.', when: '새 분석 요청을 등록하거나 진행 단계와 승인 상태를 확인할 때 사용합니다.', without: '요구사항·SQL·Python·결과·검증 근거가 흩어져 재개와 인수인계 비용이 커집니다.', example: '“메뉴별 이용 추이를 분석해 달라”는 요청을 G1~G6 흐름으로 관리합니다.' },
    data: { group: 'core', label: '데이터 연결·검증', need: '필수', title: '분석 전에 데이터가 실제로 사용할 수 있는 상태인지 확인합니다.', summary: 'DB·파일·문서 데이터 소스와 접근 모드, 스키마/기간/NULL/중복/키 후보를 검토합니다.', when: '새 데이터 소스를 받았거나 분석 범위가 바뀌었을 때 사용합니다.', without: '과제마다 동일한 데이터 확인 절차를 반복하고 데이터 품질 문제를 늦게 발견합니다.', example: 'PostgreSQL 연결 후 분석 기간, 후보 PK, 중복률과 날짜 공백을 확인합니다.' },
    execution: { group: 'core', label: '분석 실행·결과', need: '필수', title: '실행 계약과 실제 계산 결과를 분리해 재현 가능하게 관리합니다.', summary: '정적 퍼블리싱에서는 IDE를 흉내내지 않고 실행 입력·정책·단계·산출물·검증 상태 계약만 보여줍니다.', when: '분석 설계가 승인된 뒤 Run을 만들고 결과와 근거를 확인할 때 사용합니다.', without: 'AI 설명과 실제 계산 결과의 경계가 흐려지고 재현이 어려워집니다.', example: 'SQL 집계 Run의 입력 데이터 버전, timeout 정책, 결과·QA·승인 상태를 함께 남깁니다.' },
    history: { group: 'core', label: '결과·이력', need: '필수', title: '과거 Run과 승인 결과를 다시 확인하고 비교합니다.', summary: 'Run 단위로 데이터 기간, 분석/파이프라인 버전, 결과, QA, 사람 승인 여부를 추적합니다.', when: '지난 분석을 재현하거나 이번 결과가 왜 달라졌는지 확인할 때 사용합니다.', without: '지난달 계산 방식과 승인 근거를 다시 찾아야 합니다.', example: 'RUN-241과 RUN-240의 데이터 창, 결과, QA와 승인 상태를 비교합니다.' },
    documents: { group: 'core', label: '문서·수집 파이프라인', need: '필수', title: '첫 vertical slice의 PDF 등록부터 bbox 추출까지 상태를 감독합니다.', summary: '문서 SHA-256, artifact 상태, durable job, parser/version, 페이지·bbox 추출 결과를 한 화면에서 확인합니다. 실제 backend 연결 전 값은 synthetic contract data로 표시합니다.', when: 'PDF를 등록하거나 ingest job이 지연·실패했을 때 사용합니다.', without: 'HTTP 요청과 비동기 처리 상태가 섞여 문서가 실제로 처리됐는지 판단하기 어렵습니다.', example: 'DOC-042가 QUEUED → PROCESSING → READY로 이동하고 parser와 span 수를 확인합니다.' },
    recurring: { group: 'optional', label: '정기 분석', need: '조건부', title: '매일·매주·매월 반복되는 분석을 자동 실행하고 예외만 검토합니다.', summary: 'cadence, timezone, data window, recipe/pipeline version, 최근 Run, 이전 Run 대비 변화, drift, review policy를 함께 봅니다.', when: '동일 분석과 보고가 일정 주기로 반복될 때 사용합니다.', without: '일회성 분석만 한다면 없어도 됩니다.', example: '매월 3일 전월 데이터를 분석하고 변화가 큰 항목만 사람이 검토합니다.' },
    models: { group: 'optional', label: 'ML 실험·모델', need: '조건부', title: '기준모델과 후보모델을 비교하고 활성화 결정을 분리합니다.', summary: 'experiment ID, baseline/candidate metric, dataset/feature version, CANDIDATE/ACTIVE/RETIRED 상태와 drift/retraining trigger를 관리합니다.', when: '예측·분류·군집·이상탐지 같은 ML 과제에서 사용합니다.', without: 'ML을 사용하지 않는 과제라면 필요 없습니다.', example: 'baseline 대비 개선된 forecast-v4를 바로 활성화하지 않고 사람 검토 대상으로 둡니다.' },
    evidence: { group: 'core', label: '근거·평가', need: '필수', title: '답변과 검색 결과를 원본 페이지·bbox와 평가 근거까지 되짚습니다.', summary: 'source hash, parser/index/model version, lexical/vector/RRF/reranker 순위, citation, bbox, latency, evaluation과 unanswerable 처리를 함께 확인합니다.', when: '문서 검색/RAG 결과의 정확성과 근거를 검토할 때 사용합니다.', without: '답변이 그럴듯해도 실제 원문 근거와 검색 단계가 맞는지 확인할 수 없습니다.', example: '[근거 1]을 누르면 DOC-042 p.2의 bbox와 해당 retrieval ranking을 함께 표시합니다.' },
    recipes: { group: 'optional', label: '분석 레시피', need: '권장', title: '한 번 검증한 분석 절차를 버전 있는 템플릿으로 재사용합니다.', summary: 'Top-N, 월별 추이, 품질검사, 예측 baseline 같은 반복 패턴에 입력·산출물·검증 계약을 붙여 저장합니다.', when: '비슷한 분석을 여러 과제에서 반복할수록 효과가 커집니다.', without: '매번 새 코드를 만들며 산출물 구조와 검증 기준이 달라질 수 있습니다.', example: '“월별 추이 분석 v3”에 날짜·지표·그룹만 지정해 재사용합니다.' },
    providers: { group: 'settings', label: 'AI 계정·모델 연결', need: '권장', title: '사용자 프로필과 데이터·네트워크 정책을 함께 적용합니다.', summary: 'provider/agent, profile label, scope, 연결/쿼터/정책 상태와 새 Run 기본값을 보여주며 secret 값은 다시 표시하지 않습니다.', when: '개인 계정과 조직/로컬 모델을 함께 사용하거나 데이터 등급에 따라 사용 가능 provider가 달라질 때 사용합니다.', without: '사용자 선택과 보안정책 사이의 충돌이 숨겨질 수 있습니다.', example: '보호 데이터에서 외부 프로필을 선택하면 자동 대체하지 않고 정책 거부 상태를 표시합니다.' },
  };

  const navOrder = ['dashboard','projects','tasks','data','execution','history','documents','evidence','recurring','models','recipes','providers'];

  const projectRows = [
    ['Sovereign Document Intelligence','개인 공개 포트폴리오','문서 AI · RAG','5','1','68%'],
    ['지역난방 데이터 분석','공공 분석 예시','통계 · BI','3','1','74%'],
    ['환경 월간 분석','정기 분석 예시','통계 · ML','2','0','86%'],
  ];

  const taskRows = [
    ['Sovereign Document Intelligence','PDF provenance & bbox ingestion','G4 분석 수행','실행 중','Document AI','일회성'],
    ['Sovereign Document Intelligence','Hybrid retrieval & citation','G3 설계','계획됨','RAG','일회성'],
    ['지역난방 데이터 분석','메뉴·다운로드 이용 추이','G4 분석 수행','실행 중','통계','일회성'],
    ['지역난방 데이터 분석','사용자 유형별 행동 분석','G3 설계 검토','검토 필요','ML 군집','일회성'],
    ['환경 월간 분석','월간 대기질 운영 분석','R4 정기 분석','정상','통계 + ML','월간'],
    ['환경 월간 분석','시설 이상 징후 탐지','R6 변화 감시','검토 필요','ML 이상탐지','일간'],
  ];

  const documents = [
    { id:'DOC-042', name:'synthetic-operations-q3.pdf', sha:'7a19…e42b', pages:5, parser:'PyMuPDF 1.x', status:'READY', job:'JOB-118', spans:286, updated:'09:42' },
    { id:'DOC-043', name:'public-technical-layout.pdf', sha:'19d8…a211', pages:12, parser:'PyMuPDF 1.x', status:'PROCESSING', job:'JOB-119', spans:0, updated:'09:47' },
    { id:'DOC-044', name:'public-table-sample.pdf', sha:'31ab…923e', pages:8, parser:'—', status:'QUEUED', job:'JOB-120', spans:0, updated:'09:48' },
    { id:'DOC-041', name:'image-only-scan.pdf', sha:'c913…18ff', pages:3, parser:'PyMuPDF 1.x', status:'FAILED', job:'JOB-116', spans:0, updated:'08:31' },
  ];

  const statusClass = (value) => {
    const v = String(value).toLowerCase();
    if (['ready','normal','pass','정상','승인 완료','active','connected','available'].some(x => v.includes(x))) return 'ok';
    if (['processing','running','실행 중','queued','계획됨'].some(x => v.includes(x))) return 'info';
    if (['failed','blocked','검토 필요','승인 대기','denied','오류'].some(x => v.includes(x))) return 'warn';
    return 'neutral';
  };

  function needClass(need) {
    return need === '필수' ? 'required' : need === '권장' ? 'recommended' : 'conditional';
  }

  function badge(value) {
    return `<span class="status ${statusClass(value)}">${value}</span>`;
  }

  function guide(page) {
    const p = pages[page];
    return `<section class="feature-guide">
      <div class="guide-headline"><div><div class="guide-kicker">화면 설계 산출물 · ${p.need}</div><h1>${p.title}</h1><p>${p.summary}</p></div><span class="need-pill ${needClass(p.need)}">${p.need}</span></div>
      <div class="guide-grid">
        <div><strong>언제 사용하나요?</strong><p>${p.when}</p></div>
        <div><strong>이 기능이 없으면?</strong><p>${p.without}</p></div>
        <div><strong>사용 예시</strong><p>${p.example}</p></div>
      </div>
      <div class="decision-row"><span>퍼블리싱 검토 판단</span>${['필요','보류','불필요'].map(v=>`<button class="decision ${state.decisions[page]===v?'active':''}" data-decision="${v}" data-decision-page="${page}">${v}</button>`).join('')}</div>
    </section>`;
  }

  function contractBanner() {
    return `<div class="contract-banner"><b>현재 상태: 퍼블리싱 계약</b><span>표시 데이터는 public/synthetic 예시입니다. backend 또는 runtime 검증이 없는 기능을 실제 동작·성능·zero-egress로 주장하지 않습니다.</span></div>`;
  }

  function dashboard() {
    return `${guide('dashboard')}${contractBanner()}
      <section class="kpis">
        <div class="kpi"><span>진행 중 과제</span><strong>8</strong><small>3개 프로젝트 · synthetic</small></div>
        <div class="kpi"><span>내 판단 필요</span><strong>3</strong><small>승인 2 · 데이터 정의 1</small></div>
        <div class="kpi"><span>문서 ingest</span><strong>2 / 4</strong><small>READY 1 · 처리/대기 2 · 실패 1</small></div>
        <div class="kpi"><span>재사용 레시피</span><strong>12</strong><small>예시 값</small></div>
      </section>
      <section class="two-col">
        <article class="panel"><div class="panel-head"><div><h2>내 판단이 필요한 작업</h2><p>자동화가 멈추고 사람 결정을 기다리는 항목입니다.</p></div></div>
          <div class="actions">
            <button class="action-card" data-page="documents"><b>image-only PDF는 text layer가 없어 실패</b><span>DOC-041 · OCR/VLM은 현재 범위 밖</span><em>파이프라인 확인 →</em></button>
            <button class="action-card" data-page="tasks"><b>방문자 집계 기준 정의 필요</b><span>지역난방 · G2 데이터 검증</span><em>확인하기 →</em></button>
            <button class="action-card" data-page="models"><b>후보 모델 활성화 검토</b><span>forecast-v4 · 자동 활성화 금지</span><em>검토하기 →</em></button>
          </div>
        </article>
        <article class="panel"><div class="panel-head"><div><h2>첫 vertical slice 진행</h2><p>문서 등록 → 추출 → retrieval → citation → evaluation</p></div></div>
          <div class="milestone-list">
            <div><b>1. Provenance / bbox ingest</b>${badge('구현·검증 중')}</div>
            <div><b>2. PostgreSQL durable job</b>${badge('구현·검증 중')}</div>
            <div><b>3. FTS + vector + RRF + reranker</b>${badge('계획됨')}</div>
            <div><b>4. Citation → PDF bbox</b>${badge('퍼블리싱 계약')}</div>
            <div><b>5. Automated evaluation</b>${badge('퍼블리싱 계약')}</div>
          </div>
        </article>
      </section>`;
  }

  function projects() {
    return `${guide('projects')}${contractBanner()}
      <article class="panel"><div class="panel-head"><div><h2>프로젝트 목록</h2><p>프로젝트별 과제·차단·준비 상태</p></div><button class="primary" data-action="new-project">+ 새 프로젝트</button></div>
      <div class="table-wrap"><table><thead><tr><th>프로젝트</th><th>범위</th><th>유형</th><th>과제</th><th>차단</th><th>준비도</th><th>동작</th></tr></thead><tbody>
      ${projectRows.map((r,i)=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]==='0'?badge('없음'):badge(`${r[4]}건`)}</td><td>${r[5]}</td><td><button class="secondary" data-page="tasks">과제 보기</button>${i===0?'<button class="link-button" data-page="documents">문서 파이프라인</button>':''}</td></tr>`).join('')}
      </tbody></table></div></article>
      <section class="three-col mt"><article class="panel"><h2>기본 정보</h2><ul class="plain-list"><li>목적 / 범위 / out-of-scope</li><li>데이터 등급과 네트워크 모드</li><li>owner / review policy</li></ul></article><article class="panel"><h2>연결 산출물</h2><ul class="plain-list"><li>요구사항·추적성</li><li>화면·설계·DB 명세</li><li>코드·테스트·운영 결과</li></ul></article><article class="panel"><h2>상태 규칙</h2><ul class="plain-list"><li>정상과 차단을 분리</li><li>synthetic과 measured 분리</li><li>미검증을 완료로 표시하지 않음</li></ul></article></section>`;
  }

  function filteredTasks() {
    const q = state.taskSearch.trim().toLowerCase();
    return !q ? taskRows : taskRows.filter(r => r.join(' ').toLowerCase().includes(q));
  }

  function tasks() {
    const rows = filteredTasks();
    return `${guide('tasks')}${contractBanner()}
      <article class="panel"><div class="panel-head"><div><h2>분석 과제 목록</h2><p>과제를 선택하면 요구사항부터 결과·보고까지 같은 위치에서 확인합니다.</p></div><button class="primary" data-action="new-task">+ 새 분석 과제</button></div>
      <div class="toolbar"><input id="taskSearch" value="${state.taskSearch}" placeholder="프로젝트·과제·분석 방식 검색" aria-label="분석 과제 검색"><span>${rows.length}건</span></div>
      ${rows.length ? `<div class="table-wrap"><table><thead><tr><th>프로젝트</th><th>분석 과제</th><th>단계</th><th>상태</th><th>분석 방식</th><th>실행</th></tr></thead><tbody>${rows.map((r,i)=>`<tr class="clickable" data-task-detail="${i}">${r.map((c,j)=>`<td>${j===3?badge(c):c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : `<div class="empty-state"><b>검색 결과가 없습니다.</b><span>검색어를 변경하거나 새 과제를 등록하세요.</span><button class="secondary" data-action="clear-search">검색 초기화</button></div>`}
      </article>`;
  }

  function taskDetail() {
    const tabs = {summary:'요약',requirements:'요구사항',data:'데이터',plan:'분석 설계',runs:'Runs',experiments:'Experiments',models:'Models',qa:'QA',reports:'Reports',history:'History'};
    const tabBody = {
      summary:`<div class="summary-grid"><div><b>목적</b><p>홈페이지 메뉴/다운로드 이용 추이를 분석해 개선 후보를 찾습니다.</p></div><div><b>현재 단계</b><p>G4 분석 수행 중 · 사람 승인 1건 남음</p></div><div><b>분석 방식</b><p>SQL 집계 + 월별 통계 + 차트</p></div><div><b>결과물</b><p>Top-N, 월별 추이, 검증표, 보고서</p></div></div>`,
      requirements:`<div class="steps"><div><b>REQ-01 · 분석 목적</b><span>메뉴 이용 현황 파악 및 개선 후보 선정</span>${badge('CONFIRMED')}</div><div><b>REQ-02 · 기간</b><span>2021-01 ~ 2026-06</span>${badge('CONFIRMED')}</div><div><b>REQ-03 · 방문자 grain</b><span>중복 제거 기준 확정 필요</span>${badge('검토 필요')}</div></div>`,
      data:`<div class="steps"><div><b>연결 데이터</b><span>Oracle 로그 DB · 읽기 전용</span>${badge('연결 예시')}</div><div><b>자동 검증</b><span>기간, NULL, 중복, 키 후보, 날짜 공백</span>${badge('PASS 예시')}</div><div><b>현재 이슈</b><span>방문자 grain 정의 필요</span>${badge('검토 필요')}</div></div>`,
      plan:`<div class="steps"><div><b>지표</b><span>메뉴 방문수, 다운로드수, 월별 증감률</span></div><div><b>검증</b><span>월 합계 = 전체 합계 reconciliation</span></div><div><b>산출물</b><span>표 2개 · 차트 3개 · 요약 1개</span></div><div><b>실행 정책</b><span>읽기 전용 · timeout · row limit · 오류 시 결과 미확정</span></div></div>`,
      runs:`<div class="run-contract"><div class="codebox">SELECT month, menu_id, COUNT(*)\nFROM access_log\nWHERE event_date BETWEEN :from AND :to\nGROUP BY month, menu_id;</div><div class="steps"><div><b>RUN-241</b><span>데이터 snapshot v18 · SQL plan v3 · QA PASS</span>${badge('승인 대기')}</div><div><b>RUN-240</b><span>데이터 snapshot v17 · SQL plan v3 · QA PASS</span>${badge('승인 완료')}</div></div></div><div class="state-note info"><b>정적 퍼블리싱 경계</b><span>실제 SQL/Python 실행 엔진이 연결되기 전에는 IDE나 실행 성공을 가장하지 않습니다.</span></div>`,
      experiments:`<div class="experiment-grid"><div class="experiment-card"><b>EXP-031 · Baseline</b><strong>Seasonal naive</strong><span>MAPE 14.8% · synthetic</span></div><div class="experiment-card selected"><b>EXP-036 · Candidate</b><strong>LightGBM v4</strong><span>MAPE 9.3% · synthetic</span></div><div class="experiment-card"><b>EXP-034 · Compared</b><strong>Random Forest</strong><span>MAPE 11.6% · synthetic</span></div></div>`,
      models:`<div class="table-wrap"><table><thead><tr><th>Version</th><th>Data</th><th>Feature</th><th>Metric</th><th>Status</th><th>Activation</th></tr></thead><tbody><tr><td>forecast-v3</td><td>v18</td><td>v5</td><td>MAPE 9.7%</td><td>${badge('ACTIVE')}</td><td>현재</td></tr><tr><td>forecast-v4</td><td>v19</td><td>v5</td><td>MAPE 9.3%</td><td>${badge('CANDIDATE')}</td><td><button class="secondary" data-action="model-review">사람 검토</button></td></tr></tbody></table></div>`,
      qa:`<div class="steps"><div><b>합계 일치</b><span>월 합계 = 전체 합계</span>${badge('PASS')}</div><div><b>기간 완전성</b><span>2021-01 ~ 2026-06</span>${badge('PASS')}</div><div><b>미지원 주장 확인</b><span>보고서 문장 2건 사람 검토</span>${badge('검토 필요')}</div></div>`,
      reports:`<div class="report-grid"><article><b>월간 분석 보고서</b><span>HTML / PDF 계약</span>${badge('Draft')}</article><article><b>지표 부록</b><span>XLSX export 계약</span>${badge('Ready 예시')}</article><article><b>Run manifest</b><span>JSON 재현성 근거</span>${badge('Ready 예시')}</article></div>`,
      history:`<div class="steps"><div><b>09:42</b><span>RUN-241 완료 · QA PASS · 승인 대기</span></div><div><b>09:10</b><span>데이터 품질검사 완료</span></div><div><b>어제</b><span>분석 설계 v3 승인</span></div><div><b>8월 28일</b><span>REQ-03 방문자 grain 이슈 등록</span></div></div>`,
    };
    return `<button class="back" data-page="tasks">← 분석 과제 목록</button><section class="feature-guide compact"><div class="guide-headline"><div><div class="guide-kicker">분석 과제 상세 · SCR-TASK-DETAIL</div><h1>메뉴·다운로드 이용 추이 분석</h1><p>UI_SPEC의 과제 탭 계약을 빠짐없이 확인하는 퍼블리싱 화면입니다.</p></div><span class="need-pill required">필수</span></div></section><article class="panel"><div class="tabs">${Object.entries(tabs).map(([k,v])=>`<button class="tab ${state.taskTab===k?'active':''}" data-task-tab="${k}">${v}</button>`).join('')}</div><div class="tab-body">${tabBody[state.taskTab]}</div></article>`;
  }

  function dataPage() {
    const sources = [
      ['PostgreSQL','Analytics DB','Read-only','Connected'],['Oracle','Legacy/enterprise RDBMS','Read-only','Connected'],['Tibero','Enterprise JDBC','Read-only','Available'],['CSV / XLSX','Uploaded file','Local artifact','Ready'],['Parquet','Columnar file','Local artifact','Ready'],['PDF / HWP','Document pipeline','Local artifact','Ready']
    ];
    return `${guide('data')}${contractBanner()}<section class="two-col"><article class="panel"><div class="panel-head"><div><h2>데이터 소스</h2><p>연결 상태와 접근 모드를 함께 표시합니다.</p></div><button class="primary" data-action="new-source">+ 데이터 소스</button></div><div class="connector-grid">${sources.map(x=>`<button class="connector" data-action="connector"><b>${x[0]}</b><span>${x[1]}</span><small>${x[2]} · ${x[3]}</small></button>`).join('')}</div></article><article class="panel"><h2>연결 후 자동 검증</h2><ul class="check-list"><li>분석 가능 기간 / time zone</li><li>컬럼 타입과 분포</li><li>NULL / 중복 / candidate key</li><li>PK·관계 후보</li><li>날짜 공백 / code value</li><li>민감정보 classification 상태</li></ul><div class="state-note warn"><b>권한 거부 상태 예시</b><span>쓰기 권한 또는 허용되지 않은 schema 요청은 “권한 없음”으로 표시하고 읽기 전용 연결을 유지합니다.</span></div></article></section>`;
  }

  function execution() {
    return `${guide('execution')}${contractBanner()}<section class="two-col"><article class="panel"><h2>Run 계약</h2><div class="flow"><span>요구사항</span><i>→</i><span>분석 설계</span><i>→</i><span>입력 snapshot</span><i>→</i><span>정책 검증</span><i>→</i><span>실제 계산</span><i>→</i><span>결과 / QA</span></div><div class="definition-grid"><div><b>Run ID</b><span>RUN-241</span></div><div><b>Input</b><span>snapshot-v18</span></div><div><b>Plan</b><span>analysis-plan-v3</span></div><div><b>Policy</b><span>read-only · timeout 30s</span></div></div><button class="primary" data-action="simulate-run">퍼블리싱 Run 상태 보기</button></article><article class="panel"><h2>실제 실행 전 상태</h2><div class="state-note neutral"><b>DISABLED</b><span>현재 정적 산출물에서는 실제 SQL/Python을 실행하지 않습니다. 실행 API 계약이 연결된 뒤 활성화됩니다.</span></div><h2 class="mt">LLM에게 맡기지 않는 것</h2><ul class="check-list"><li>합계·평균·통계값 임의 계산</li><li>DB 결과 임의 생성</li><li>모델 평가값 임의 생성</li><li>검증되지 않은 결과를 PASS로 표시</li></ul></article></section>`;
  }

  function history() {
    const runs = [['RUN-241','2026-08','snapshot-v18','PASS','승인 대기'],['RUN-240','2026-07','snapshot-v17','PASS','승인 완료'],['RUN-239','2026-06','snapshot-v16','PASS','승인 완료']];
    return `${guide('history')}${contractBanner()}<article class="panel"><h2>최근 실행</h2><div class="run-list">${runs.map(r=>`<button class="run-row" data-action="run-detail"><b>${r[0]}</b><span>${r[1]}</span><span>${r[2]}</span><span>${badge(r[3])} ${badge(r[4])}</span></button>`).join('')}</div></article><section class="two-col mt"><article class="panel"><h2>비교 기준</h2><ul class="plain-list"><li>데이터 기간 / snapshot</li><li>recipe / pipeline / model version</li><li>결과 KPI / anomaly</li><li>QA / 승인 / known issue</li></ul></article><article class="panel"><h2>재현성</h2><div class="definition-grid"><div><b>Artifact</b><span>run-manifest.json</span></div><div><b>Result</b><span>report.html</span></div><div><b>Evidence</b><span>QA / review record</span></div><div><b>Runtime</b><span>실제 연결 전</span></div></div></article></section>`;
  }

  function documentRows() {
    if (state.documentScenario === 'empty') return [];
    if (state.documentScenario === 'failed') return documents.filter(d=>d.status==='FAILED');
    if (state.documentScenario === 'processing') return documents.filter(d=>['PROCESSING','QUEUED'].includes(d.status));
    if (state.documentScenario === 'ready') return documents.filter(d=>d.status==='READY');
    return documents;
  }

  function documentsPage() {
    const rows = documentRows();
    const selected = documents.find(d=>d.id===state.selectedDocument) || documents[0];
    const denied = state.documentScenario === 'denied';
    return `${guide('documents')}${contractBanner()}
      <div class="scenario-bar"><b>화면 상태 검토</b>${['mixed','processing','ready','failed','empty','denied'].map(x=>`<button class="scenario ${state.documentScenario===x?'active':''}" data-doc-scenario="${x}">${({mixed:'혼합',processing:'처리 중',ready:'완료',failed:'오류',empty:'빈 상태',denied:'권한 없음'})[x]}</button>`).join('')}</div>
      ${denied ? `<div class="permission-state"><b>이 프로젝트의 문서 목록을 볼 권한이 없습니다.</b><span>실제 제품에서는 프로젝트/RBAC 계약이 추가될 때 사용되는 permission-denied 상태입니다.</span><button class="secondary" data-action="request-access">접근 요청</button></div>` : `<section class="doc-layout"><article class="panel"><div class="panel-head"><div><h2>문서 / ingestion jobs</h2><p>HTTP 등록과 long-running worker 상태를 분리해 표시합니다.</p></div><button class="primary" data-action="upload-document">+ PDF 등록</button></div>
        ${rows.length ? `<div class="table-wrap"><table><thead><tr><th>문서</th><th>SHA-256</th><th>Job</th><th>Status</th><th>Parser</th><th>Spans</th><th>Updated</th></tr></thead><tbody>${rows.map(d=>`<tr class="clickable ${state.selectedDocument===d.id?'selected-row':''}" data-document-id="${d.id}"><td><b>${d.id}</b><br><small>${d.name}</small></td><td>${d.sha}</td><td>${d.job}</td><td>${badge(d.status)}</td><td>${d.parser}</td><td>${d.spans||'—'}</td><td>${d.updated}</td></tr>`).join('')}</tbody></table></div>` : `<div class="empty-state"><b>등록된 문서가 없습니다.</b><span>public/synthetic PDF를 등록하면 문서와 durable job 상태가 여기에 나타납니다.</span><button class="primary" data-action="upload-document">PDF 등록</button></div>`}</article>
        <aside class="panel"><h2>선택 문서 상세</h2><div class="definition-list"><div><b>Document</b><span>${selected.id}</span></div><div><b>SHA-256</b><span>${selected.sha}</span></div><div><b>Artifact ref</b><span>documents/&lt;sha256&gt;.pdf</span></div><div><b>Job</b><span>${selected.job}</span></div><div><b>Parser</b><span>${selected.parser}</span></div><div><b>Pages / spans</b><span>${selected.pages} / ${selected.spans||'—'}</span></div></div>
        <h2 class="mt">Pipeline</h2><div class="pipeline">${['REGISTERED','QUEUED','PROCESSING','EXTRACT','READY'].map((s,i)=>`<div class="pipeline-step ${selected.status==='FAILED'&&i>=3?'failed':selected.status==='READY'||(selected.status==='PROCESSING'&&i<=2)||(selected.status==='QUEUED'&&i<=1)?'done':''}"><span>${i+1}</span><b>${s}</b></div>`).join('')}</div>
        ${selected.status==='FAILED'?`<div class="state-note warn"><b>FAILED · no extractable text layer</b><span>OCR/VLM은 현재 first slice out-of-scope입니다. 실패를 성공으로 대체하지 않습니다.</span></div>`:`<div class="state-note info"><b>durable state</b><span>실제 연결 시 PostgreSQL documents/jobs/run_traces가 authoritative state가 됩니다.</span></div>`}</aside></section>`}`;
  }

  function evidence() {
    const evalValues = state.evalRun ? ['83%','.76','88%','80%'] : ['—','—','—','—'];
    return `${guide('evidence')}${contractBanner()}
      <section class="evidence-top"><article class="panel"><div class="panel-head"><div><h2>Provenance / execution evidence</h2><p>실제 값이 아니라 UI 계약 예시입니다.</p></div>${badge('Runtime egress NOT VERIFIED')}</div><div class="definition-grid"><div><b>Document SHA-256</b><span>7a19…e42b</span></div><div><b>Parser</b><span>PyMuPDF / example</span></div><div><b>Index</b><span>IDX-003 · planned</span></div><div><b>Embedding</b><span>local profile · planned</span></div><div><b>Reranker</b><span>local profile · planned</span></div><div><b>Run trace</b><span>TRACE-081 · contract</span></div></div></article>
      <article class="panel"><h2>Stage latency / status</h2><div class="latency-list"><div><span>extract</span><b>124 ms</b>${badge('synthetic')}</div><div><span>lexical</span><b>18 ms</b>${badge('planned')}</div><div><span>vector</span><b>22 ms</b>${badge('planned')}</div><div><span>rerank</span><b>41 ms</b>${badge('planned')}</div></div></article></section>
      <section class="evidence-layout mt"><article class="panel"><h2>Grounded answer</h2><p>예시 문서에서는 “운영기관은 월별 결과를 검토한다”고 명시합니다. <button class="citation ${state.selectedCitation==='CIT-01'?'active':''}" data-citation-id="CIT-01">[근거 1]</button> 월간 평균은 72.4로 계산된 synthetic 예시입니다. <button class="citation ${state.selectedCitation==='CIT-02'?'active':''}" data-citation-id="CIT-02">[근거 2]</button></p><div class="unanswerable"><b>근거 없음 처리</b><span>원문에 확정 비용 정보가 없어 답변하지 않습니다.</span></div>
        <div class="ranking-table"><div class="rank-head"><span>Chunk</span><span>Lexical</span><span>Vector</span><span>RRF</span><span>Rerank</span></div><div><b>Chunk 12</b><span>#2</span><span>#1 / .84</span><span>#1 / .031</span><span>.91</span></div><div><b>Chunk 14</b><span>#1</span><span>#3 / .81</span><span>#2 / .029</span><span>.88</span></div><div><b>Chunk 09</b><span>#4</span><span>#2 / .75</span><span>#3 / .025</span><span>.63</span></div></div></article>
        <article class="panel pdf-mock"><div class="panel-head"><div><h2>Source evidence</h2><p>DOC-042 · Page 2 / 5</p></div>${badge('bbox contract')}</div><div class="pdf-page"><h3>Environmental Operations Summary — Q3</h3><p>This synthetic document demonstrates the evidence inspection layout.</p><table class="pdf-table"><thead><tr><th>Facility</th><th>Monthly avg.</th><th>MoM</th></tr></thead><tbody><tr><td>A</td><td>64.8</td><td>+1.2%</td></tr><tr><td>B</td><td>81.7</td><td>+8.6%</td></tr><tr><td>C</td><td>70.6</td><td>+3.0%</td></tr></tbody></table><p id="evidenceBox1" class="evidence-line ${state.selectedCitation==='CIT-01'?'highlight':''}">운영기관은 월별 결과를 검토하고 이상 변동의 원인을 확인한다.</p><p id="evidenceBox2" class="evidence-line ${state.selectedCitation==='CIT-02'?'highlight':''}">Synthetic combined monthly indicator: 72.4.</p></div></article></section>
      <article class="panel mt"><div class="panel-head"><div><h2>Evaluation gate</h2><p>Golden QA 기반 회귀 평가 UI 계약</p></div><button class="primary" id="runEvalButton">${state.evalRun?'다시 실행':'Synthetic mini-eval 실행'}</button></div><div class="eval-grid"><div><span>Hit@5</span><b>${evalValues[0]}</b></div><div><span>MRR@5</span><b>${evalValues[1]}</b></div><div><span>Citation precision</span><b>${evalValues[2]}</b></div><div><span>Negative refusal</span><b>${evalValues[3]}</b></div></div><p class="hint">표시 값은 퍼블리싱 검토용 synthetic이며 measured product performance가 아닙니다.</p></article>`;
  }

  function recurring() {
    return `${guide('recurring')}${contractBanner()}<section class="two-col"><article class="panel"><div class="panel-head"><div><h2>월간 환경 분석</h2><p>Enabled recurring policy</p></div>${badge('Enabled')}</div><div class="definition-grid"><div><b>Cadence</b><span>매월 3일 01:00</span></div><div><b>Timezone</b><span>Asia/Seoul</span></div><div><b>Data window</b><span>Previous month</span></div><div><b>Recipe</b><span>monthly-ops/v7</span></div><div><b>Next run</b><span>10월 3일 01:00</span></div><div><b>Review policy</b><span>예외 시 사람 검토</span></div></div><div class="month-strip"><span>4월 ✓</span><span>5월 ✓</span><span>6월 ✓</span><span class="warn-bg">7월 !</span><span>8월 ✓</span></div></article><article class="panel"><h2>Latest vs previous</h2><div class="kpis compact-kpis"><div class="kpi"><span>평균 지수</span><strong>+4.1%</strong></div><div class="kpi"><span>이상 건수</span><strong>12</strong></div><div class="kpi"><span>예측 오차</span><strong>9.7%</strong></div></div><div class="steps mt"><div><b>Data drift</b><span>분포 변화 범위 내 · synthetic</span>${badge('Normal')}</div><div><b>Model drift</b><span>성능 저하 trigger 없음</span>${badge('Normal')}</div><div><b>Retraining candidate</b><span>forecast-v4 별도 승인 필요</span>${badge('검토 필요')}</div></div></article></section>`;
  }

  function models() {
    return `${guide('models')}${contractBanner()}<section class="three-col"><article class="model-card"><span>EXP-031 · Baseline</span><b>Seasonal naive</b><strong>14.8%</strong><small>MAPE · synthetic</small></article><article class="model-card active"><span>ACTIVE · forecast-v3</span><b>LightGBM</b><strong>9.7%</strong><small>dataset v18 · feature v5</small></article><article class="model-card candidate"><span>CANDIDATE · forecast-v4</span><b>LightGBM</b><strong>9.3%</strong><small>dataset v19 · feature v5</small></article></section><article class="panel mt"><div class="panel-head"><div><h2>Activation review</h2><p>숫자가 좋아졌다는 이유만으로 자동 활성화하지 않습니다.</p></div><button class="primary" data-action="model-review">후보모델 검토</button></div><div class="steps"><div><b>Baseline comparison</b><span>14.8% → 9.3% MAPE · synthetic</span>${badge('PASS 예시')}</div><div><b>Regression / subgroup</b><span>검증 근거 필요</span>${badge('검토 필요')}</div><div><b>Drift / retraining trigger</b><span>정기 scoring과 재학습을 분리</span>${badge('정책 확인')}</div></div></article>`;
  }

  function recipes() {
    const rs=[['월별 추이 분석','통계','v3','날짜·지표·그룹'],['Top-N 기여도','BI','v2','지표·차원·N'],['데이터 품질 프로파일','품질','v5','소스·grain'],['예측 Baseline Pack','ML','v2','target·horizon']];
    return `${guide('recipes')}${contractBanner()}<div class="recipe-grid">${rs.map(r=>`<button class="recipe" data-action="recipe"><span>${r[1]} · ${r[2]}</span><b>${r[0]}</b><small>필수 입력: ${r[3]}</small><em>검증 계약 보기 →</em></button>`).join('')}</div><article class="panel mt"><h2>레시피에 포함되는 계약</h2><div class="definition-grid"><div><b>Inputs</b><span>필수 파라미터 / 데이터 grain</span></div><div><b>Steps</b><span>SQL/Python/통계 단계</span></div><div><b>Outputs</b><span>표/차트/결과 스키마</span></div><div><b>Verification</b><span>reconciliation / QA</span></div></div></article>`;
  }

  function providers() {
    const profiles = [
      ['로컬 분석 / 오픈웨이트','Organization / local','Available','제한 데이터 후보 · runtime policy 필요'],
      ['개인 AGY','Personal','Connected','개인 공개 프로젝트용'],
      ['개인 Claude Code','Personal','Connected','코드 agent 예시'],
      ['개인 Codex','Personal','Quota blocked','새 실행 불가 예시'],
    ];
    return `${guide('providers')}${contractBanner()}<section class="two-col"><article class="panel"><div class="panel-head"><div><h2>내 AI 프로필</h2><p>Secret은 등록 후 다시 표시하지 않습니다.</p></div><button class="primary" data-action="new-profile">+ 프로필</button></div>${profiles.map(p=>`<label class="profile-row"><input type="radio" name="profile" value="${p[0]}" ${state.selectedProfile===p[0]?'checked':''}><span><b>${p[0]}</b><small>${p[1]} · ${p[3]}</small></span>${badge(p[2])}</label>`).join('')}</article><article class="panel"><h2>Routing policy</h2><div class="flow vertical"><span>Task requirement</span><i>↓</i><span>Network mode</span><i>↓</i><span>Data classification</span><i>↓</i><span>Provider capability</span><i>↓</i><span>User profile</span><i>↓</i><span>Organization policy</span></div><div class="state-note warn"><b>POLICY DENIED 예시</b><span>보호 데이터 + 외부 personal profile 조합이면 다른 provider로 조용히 바꾸지 않고 거부 사유를 보여줍니다.</span></div></article></section>`;
  }

  const renderers = {dashboard, projects, tasks, data:dataPage, execution, history, documents:documentsPage, evidence, recurring, models, recipes, providers};

  function navHtml() {
    const core = navOrder.filter(k=>pages[k].group==='core');
    const optional = navOrder.filter(k=>pages[k].group==='optional');
    const settings = navOrder.filter(k=>pages[k].group==='settings');
    const items = keys => keys.map(k=>`<button class="nav-item ${state.page===k?'active':''}" data-page="${k}"><span>${pages[k].label}</span><small>${pages[k].need}</small></button>`).join('');
    return `<div class="nav-group"><b>기본 기능</b>${items(core)}</div><div class="nav-group optional-group ${state.requiredOnly?'hidden':''}"><b>확장 기능</b>${items(optional)}</div><div class="nav-group"><b>설정</b>${items(settings)}</div>`;
  }

  function render() {
    document.getElementById('nav').innerHTML = navHtml();
    const root = document.getElementById('content');
    if(state.page==='task-detail') root.innerHTML = taskDetail();
    else root.innerHTML = renderers[state.page]();
    document.getElementById('breadcrumb').textContent = state.page==='task-detail' ? '분석 과제 / 상세' : pages[state.page].label;
    document.getElementById('requiredOnly').checked = state.requiredOnly;
    const search = document.getElementById('taskSearch');
    if (search) search.focus({preventScroll:true});
  }

  function toast(msg) {
    const el=document.createElement('div'); el.className='toast'; el.textContent=msg;
    document.getElementById('toasts').appendChild(el); setTimeout(()=>el.remove(),2600);
  }

  function openDialog(title, body) {
    document.getElementById('dialogTitle').textContent=title;
    document.getElementById('dialogBody').innerHTML=body;
    document.getElementById('dialog').hidden=false;
  }

  document.addEventListener('click', e => {
    const page=e.target.closest('[data-page]');
    if(page){ state.page=page.dataset.page; render(); return; }
    const detail=e.target.closest('[data-task-detail]');
    if(detail){ state.page='task-detail'; state.taskTab='summary'; render(); return; }
    const tab=e.target.closest('[data-task-tab]');
    if(tab){ state.taskTab=tab.dataset.taskTab; render(); return; }
    const decision=e.target.closest('[data-decision]');
    if(decision){ state.decisions[decision.dataset.decisionPage]=decision.dataset.decision; render(); toast(`기능 판단: ${decision.dataset.decision}`); return; }
    const scenario=e.target.closest('[data-doc-scenario]');
    if(scenario){ state.documentScenario=scenario.dataset.docScenario; render(); return; }
    const doc=e.target.closest('[data-document-id]');
    if(doc){ state.selectedDocument=doc.dataset.documentId; render(); return; }
    const citation=e.target.closest('[data-citation-id]');
    if(citation){ state.selectedCitation=citation.dataset.citationId; render(); toast('원문 bbox 근거 위치를 변경했습니다.'); return; }
    const action=e.target.closest('[data-action]');
    if(action){
      const a=action.dataset.action;
      if(a==='simulate-run') openDialog('Run 상태 계약','<div class="steps"><div><b>1. 정책 검증</b><span>read-only / timeout / input snapshot 확인</span></div><div><b>2. 실행</b><span>정적 퍼블리싱에서는 DISABLED</span></div><div><b>3. 결과</b><span>API 연결 후 실제 결과/QA로 대체</span></div></div>');
      else if(a==='new-task') openDialog('새 분석 과제','<div class="form-preview"><label>과제명<input placeholder="예: PDF evidence retrieval"></label><label>실행 방식<select><option>일회성</option><option>정기</option></select></label><label>승인 정책<select><option>사람 검토 필요</option><option>예외 시 검토</option></select></label></div>');
      else if(a==='new-project') openDialog('새 프로젝트','<div class="form-preview"><label>프로젝트명<input placeholder="Public analytics project"></label><label>데이터 경계<select><option>public / synthetic</option><option>non-public (정책 필요)</option></select></label></div>');
      else if(a==='new-source') openDialog('데이터 소스 추가','<p>Connector, read-only access, classification, 연결 테스트 상태를 등록하는 계약입니다.</p>');
      else if(a==='upload-document') openDialog('PDF 등록','<div class="form-preview"><label>파일<input type="file" accept="application/pdf,.pdf"></label><div class="state-note neutral"><b>현재 정적 산출물</b><span>파일을 실제 서버로 전송하지 않습니다. backend POST /api/v1/documents 연결 후 활성화합니다.</span></div><button class="secondary" disabled>Backend 연결 후 등록</button></div>');
      else if(a==='model-review') openDialog('후보모델 적용 검토','<p>baseline/current/candidate, dataset·feature version, regression과 drift 근거를 보고 사람이 ACTIVE 전환 여부를 결정합니다.</p>');
      else if(a==='recipe') openDialog('분석 레시피 계약','<p>필수 입력, 실행 단계, 산출물 schema, QA/reconciliation 기준, 버전을 함께 저장합니다.</p>');
      else if(a==='run-detail') openDialog('Run 상세','<p>데이터 기간, snapshot, 분석/모델 버전, 결과, QA, 승인, known issue를 확인합니다.</p>');
      else if(a==='connector') toast('연결 설정/테스트 상태 예시입니다.');
      else if(a==='request-access') toast('접근 요청 interaction 예시입니다.');
      else if(a==='new-profile') openDialog('AI 프로필 추가','<p>Provider, profile label, scope, 인증 방식과 정책 상태를 등록합니다. secret value는 저장 후 다시 표시하지 않습니다.</p>');
      else if(a==='clear-search'){ state.taskSearch=''; render(); }
      return;
    }
    if(e.target.id==='dialogClose' || e.target.id==='dialog') {
      if(e.target.id==='dialogClose' || e.target===document.getElementById('dialog')) document.getElementById('dialog').hidden=true;
    }
  });

  document.addEventListener('input', e => {
    if(e.target.id==='taskSearch'){ state.taskSearch=e.target.value; const pos=e.target.selectionStart; render(); const n=document.getElementById('taskSearch'); if(n){ n.focus(); n.setSelectionRange(pos,pos); } }
  });

  document.addEventListener('change', e => {
    if(e.target.id==='requiredOnly'){ state.requiredOnly=e.target.checked; render(); }
    if(e.target.name==='profile'){ state.selectedProfile=e.target.value; toast(`새 실행의 AI 프로필: ${e.target.value}`); }
  });

  document.getElementById('mobileMenu').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));
  document.getElementById('runEvalButton')?.addEventListener('click',()=>{});
  document.addEventListener('click', e => { if(e.target.id==='runEvalButton'){ state.evalRun=true; render(); toast('Synthetic mini-eval 상태를 표시했습니다.'); } });

  const status=document.getElementById('interactionStatus');
  status.textContent='상호작용 정상'; status.classList.add('ok');
  document.body.classList.add('js-ready');
  render();
})();
