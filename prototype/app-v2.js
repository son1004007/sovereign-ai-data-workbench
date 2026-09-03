(() => {
  'use strict';

  const state = {
    page: 'dashboard',
    taskTab: 'summary',
    requiredOnly: false,
    decisions: {},
    selectedProfile: '로컬 분석 / 오픈웨이트',
  };

  const pages = {
    dashboard: {
      group: 'core', label: '통합 관제', need: '필수',
      title: '오늘 내가 개입해야 할 분석 업무만 확인합니다.',
      summary: '여러 프로젝트를 동시에 수행할 때 자동화된 작업 전체를 따라다니지 않고, 실패·승인·판단이 필요한 항목만 모아보는 화면입니다.',
      when: '분석가 1명이 여러 과제를 동시에 담당할 때 매일 가장 먼저 사용합니다.',
      without: '과제가 1개뿐이면 없어도 되지만, 여러 과제를 병렬로 관리하려면 필요합니다.',
      example: '지역난방 분석 3건, 환경 월간분석 2건 중 사람이 확인해야 할 3건만 표시합니다.'
    },
    tasks: {
      group: 'core', label: '프로젝트·분석 과제', need: '필수',
      title: '분석 한 건을 시작부터 결과 전달까지 같은 구조로 관리합니다.',
      summary: '요구사항, 데이터, 분석 방법, 실행, 결과, QA, 보고서를 한 과제 안에 모읍니다. G1~G6는 이 흐름을 일정하게 만드는 기준입니다.',
      when: '새 분석 요청을 받았을 때 과제를 만들고, 어디까지 진행됐는지 확인할 때 사용합니다.',
      without: '문서·SQL·Python·결과가 흩어져 과제 재개와 인수인계에 시간이 많이 듭니다.',
      example: '“최근 5년 메뉴별 이용 추이를 분석해 달라”는 요청을 하나의 과제로 만들고 데이터 검증부터 결과까지 기록합니다.'
    },
    data: {
      group: 'core', label: '데이터 연결·검증', need: '필수',
      title: '분석 전에 데이터가 실제로 쓸 수 있는 상태인지 자동 확인합니다.',
      summary: 'Oracle·PostgreSQL·CSV·Excel 등의 데이터 연결과 스키마 탐색, NULL·중복·기간·키·이상치를 확인합니다.',
      when: '새 DB나 파일을 받았거나 데이터가 갱신됐을 때 사용합니다.',
      without: '분석가가 과제마다 같은 데이터 확인 SQL과 점검 코드를 반복 작성하게 됩니다.',
      example: 'DB 연결 후 분석 기간, 후보 PK, 중복률, NULL 비율, 날짜 공백을 자동 점검합니다.'
    },
    execution: {
      group: 'core', label: '분석 실행·결과', need: '필수',
      title: '통계·SQL·머신러닝 분석을 실행하고 결과와 근거를 함께 남깁니다.',
      summary: 'LLM은 분석 방법이나 코드를 제안할 수 있지만 실제 계산은 SQL·Python·통계/ML 라이브러리가 수행합니다.',
      when: '분석 설계가 승인된 뒤 실제 계산과 시각화, 결과 검증을 할 때 사용합니다.',
      without: 'AI가 만든 설명과 실제 계산 결과의 경계가 불명확해지고 재현하기 어렵습니다.',
      example: '월별 이용량 SQL → 통계 집계 → 차트 → 결과 요약 → 실행 기록을 하나의 Run으로 저장합니다.'
    },
    history: {
      group: 'core', label: '결과·이력', need: '필수',
      title: '과거에 무엇을 실행했고 어떤 결과를 승인했는지 다시 확인합니다.',
      summary: 'Run 단위로 데이터 기간, 코드/분석 버전, 결과, QA, 사람 승인 여부를 남깁니다.',
      when: '지난 분석을 재현하거나 이번 달 결과가 왜 달라졌는지 확인할 때 사용합니다.',
      without: '“지난달에 어떻게 계산했지?”를 매번 다시 찾아야 합니다.',
      example: '8월 결과와 7월 결과를 비교하고, 당시 사용한 분석 절차와 승인 기록까지 확인합니다.'
    },
    recurring: {
      group: 'optional', label: '정기 분석', need: '조건부',
      title: '매일·매주·매월 반복되는 분석을 자동 실행합니다.',
      summary: '같은 분석 절차를 스케줄에 맞춰 실행하고 이전 결과와 비교해 이상이 있을 때만 사람에게 검토를 요청합니다.',
      when: '한국환경공단처럼 같은 분석·보고를 정기적으로 반복할 때 사용합니다.',
      without: '일회성 프로젝트만 한다면 없어도 됩니다.',
      example: '매월 3일 전월 데이터를 자동 분석하고 보고서 초안을 만든 뒤 변화가 큰 항목만 분석가에게 보여줍니다.'
    },
    models: {
      group: 'optional', label: 'ML 실험·모델', need: '조건부',
      title: '머신러닝이 필요한 과제에서 기준모델과 후보모델을 비교합니다.',
      summary: '회귀·분류·군집·이상탐지·예측 모델의 실험 결과와 활성 모델, 성능 저하 여부를 관리합니다.',
      when: '통계 분석만으로 해결되지 않고 예측·분류·이상탐지가 필요한 과제에서만 사용합니다.',
      without: 'ML을 사용하지 않는 과제라면 필요 없습니다.',
      example: '이동평균 baseline과 LightGBM 예측 모델을 비교하고 개선 폭이 충분할 때만 후보모델로 승인합니다.'
    },
    evidence: {
      group: 'optional', label: '문서 근거·RAG', need: '조건부',
      title: 'PDF·HWP 같은 문서를 분석할 때 답변 근거를 원문까지 추적합니다.',
      summary: '문서 해시, 페이지, 위치(bbox), 검색 점수, 인용 결과를 연결해 AI 답변이 어디서 나왔는지 확인합니다.',
      when: '문서 검색, RAG, OCR/VLM 기반 분석을 하는 과제에서 사용합니다.',
      without: 'DB·CSV 분석만 하는 솔루션이라면 초기에는 제외할 수 있습니다.',
      example: 'AI 답변의 [근거 2]를 누르면 실제 PDF 12페이지의 해당 문단 위치를 표시합니다.'
    },
    recipes: {
      group: 'optional', label: '분석 레시피', need: '권장',
      title: '한 번 검증한 분석 절차를 다음 과제에서 재사용합니다.',
      summary: 'Top-N, 월별 추이, 데이터 품질검사, 예측 baseline 같은 반복 패턴을 버전 있는 템플릿으로 저장합니다.',
      when: '비슷한 분석을 여러 프로젝트에서 반복할수록 효과가 커집니다.',
      without: '매번 AI가 새 코드를 만들면 산출물 구조와 품질이 달라질 가능성이 커집니다.',
      example: '검증된 “월별 추이 분석 v3”에 날짜컬럼·지표·그룹만 지정해 다른 고객 데이터에도 적용합니다.'
    },
    providers: {
      group: 'settings', label: 'AI 계정·모델 연결', need: '권장',
      title: '사용자가 자신의 AI 계정이나 로컬 모델을 선택합니다.',
      summary: 'AGY·Claude Code·Codex·상용 API·로컬 오픈웨이트 모델을 같은 방식으로 등록하고 새 실행에서 사용할 프로필을 선택합니다.',
      when: '사용자마다 다른 개인 인증키·계정을 사용하거나 폐쇄망에서 로컬 모델로 전환할 때 사용합니다.',
      without: '특정 AI 업체와 하나의 공용 계정에 종속됩니다.',
      example: '오늘은 개인 AGY로 코드 작업을 하고, 보호 데이터 분석은 로컬 모델만 사용하도록 정책을 적용합니다.'
    }
  };

  const navOrder = ['dashboard','tasks','data','execution','history','recurring','models','evidence','recipes','providers'];

  const taskRows = [
    ['지역난방 데이터 분석','메뉴·다운로드 이용 추이','G4 분석 수행','실행 중','통계','일회성'],
    ['지역난방 데이터 분석','사용자 유형별 행동 분석','G3 설계 검토','검토 필요','ML 군집','일회성'],
    ['환경 월간 분석','월간 대기질 운영 분석','R4 정기 분석','정상','통계 + ML','월간'],
    ['환경 월간 분석','시설 이상 징후 탐지','R6 변화 감시','검토 필요','ML 이상탐지','일간'],
    ['케이블 소재 연구','TDS 문서 구조화 추출','G4 분석 수행','실행 중','문서 AI','일회성']
  ];

  function needClass(need) {
    return need === '필수' ? 'required' : need === '권장' ? 'recommended' : 'conditional';
  }

  function guide(page) {
    const p = pages[page];
    return `<section class="feature-guide">
      <div class="guide-headline"><div><div class="guide-kicker">기능 판단 안내</div><h1>${p.title}</h1><p>${p.summary}</p></div><span class="need-pill ${needClass(p.need)}">${p.need}</span></div>
      <div class="guide-grid">
        <div><strong>언제 사용하나요?</strong><p>${p.when}</p></div>
        <div><strong>이 기능이 없으면?</strong><p>${p.without}</p></div>
        <div><strong>사용 예시</strong><p>${p.example}</p></div>
      </div>
      <div class="decision-row"><span>현재 판단을 기록해 보세요.</span>
        ${['필요','보류','불필요'].map(v=>`<button class="decision ${state.decisions[page]===v?'active':''}" data-decision="${v}" data-decision-page="${page}">${v}</button>`).join('')}
      </div>
    </section>`;
  }

  function dashboard() {
    return `${guide('dashboard')}
      <section class="kpis">
        <div class="kpi"><span>진행 중 과제</span><strong>8</strong><small>3개 프로젝트</small></div>
        <div class="kpi"><span>내 판단 필요</span><strong>3</strong><small>승인 2 · 데이터 정의 1</small></div>
        <div class="kpi"><span>오늘 자동 실행</span><strong>5</strong><small>실패 0</small></div>
        <div class="kpi"><span>재사용 레시피</span><strong>12</strong><small>예시 값</small></div>
      </section>
      <section class="two-col">
        <article class="panel"><div class="panel-head"><div><h2>내 판단이 필요한 작업</h2><p>자동화가 멈추고 사람 결정을 기다리는 항목입니다.</p></div></div>
          <div class="actions">
            <button class="action-card" data-page="tasks"><b>방문자 집계 기준 정의 필요</b><span>지역난방 · G2 데이터 검증</span><em>확인하기 →</em></button>
            <button class="action-card" data-page="tasks"><b>군집 분석 지표 승인</b><span>지역난방 · G3 분석 설계</span><em>확인하기 →</em></button>
            <button class="action-card" data-page="recurring"><b>시설 이상 12건 검토</b><span>환경 월간 · 정기 분석</span><em>확인하기 →</em></button>
          </div>
        </article>
        <article class="panel"><div class="panel-head"><div><h2>이 화면에서 하지 않는 것</h2><p>모든 자동 실행 로그를 계속 보는 화면이 아닙니다.</p></div></div>
          <ul class="plain-list"><li>정상 처리된 과제는 요약만 표시</li><li>실패·승인·의사결정만 우선 노출</li><li>상세 SQL·모델 지표는 해당 과제에서 확인</li></ul>
          <button class="primary" data-page="tasks">전체 분석 과제 보기</button>
        </article>
      </section>`;
  }

  function tasks() {
    return `${guide('tasks')}
      <article class="panel"><div class="panel-head"><div><h2>분석 과제 목록</h2><p>과제를 누르면 어떤 정보가 한 곳에 모이는지 확인할 수 있습니다.</p></div><button class="primary" data-action="new-task">+ 새 분석 과제</button></div>
      <div class="table-wrap"><table><thead><tr><th>프로젝트</th><th>분석 과제</th><th>단계</th><th>상태</th><th>분석 방식</th><th>실행</th></tr></thead><tbody>
      ${taskRows.map((r,i)=>`<tr class="clickable" data-task-detail="${i}">${r.map((c,j)=>`<td>${j===3?`<span class="status ${c==='검토 필요'?'warn':c==='실행 중'?'info':'ok'}">${c}</span>`:c}</td>`).join('')}</tr>`).join('')}
      </tbody></table></div></article>`;
  }

  function taskDetail() {
    const tabs = {summary:'요약',requirements:'요구사항',data:'데이터',plan:'분석 설계',run:'실행',results:'결과',qa:'검증',history:'이력'};
    const tabBody = {
      summary:`<div class="summary-grid"><div><b>목적</b><p>홈페이지 메뉴/다운로드 이용 추이를 분석해 개선 후보를 찾습니다.</p></div><div><b>현재 단계</b><p>G4 분석 수행 중 · 사람 승인 1건 남음</p></div><div><b>분석 방식</b><p>SQL 집계 + 월별 통계 + 차트</p></div><div><b>결과물</b><p>Top-N, 월별 추이, 검증표, 보고서</p></div></div>`,
      requirements:`<div class="steps"><div><b>분석 목적</b><span>메뉴 이용 현황 파악 및 개선 후보 선정</span></div><div><b>기간</b><span>2021-01 ~ 2026-06</span></div><div><b>확인 필요</b><span>방문자 중복 제거 기준</span></div></div>`,
      data:`<div class="steps"><div><b>연결 데이터</b><span>Oracle 로그 DB · 읽기 전용</span></div><div><b>자동 검증</b><span>기간, NULL, 중복, 키 후보, 날짜 공백</span></div><div><b>현재 이슈</b><span>방문자 grain 정의 필요</span></div></div>`,
      plan:`<div class="steps"><div><b>지표</b><span>메뉴 방문수, 다운로드수, 월별 증감률</span></div><div><b>검증</b><span>월 합계 = 전체 합계 reconciliation</span></div><div><b>산출물</b><span>표 2개 · 차트 3개 · 요약 1개</span></div></div>`,
      run:`<div class="codebox">SELECT month, menu_id, COUNT(*)\nFROM access_log\nWHERE event_date BETWEEN :from AND :to\nGROUP BY month, menu_id;</div><p class="hint">실제 제품에서는 생성 SQL을 읽기전용 정책·timeout·row limit 검증 후 실행합니다.</p><button class="primary" data-action="simulate-run">예시 분석 실행</button>`,
      results:`<div class="kpis"><div class="kpi"><span>메뉴 A</span><strong>28%</strong><small>전체 이용 비중</small></div><div class="kpi"><span>메뉴 B</span><strong>+14%</strong><small>전년 대비</small></div><div class="kpi"><span>검토 후보</span><strong>3</strong><small>예시 값</small></div></div><p class="hint">계산 결과와 AI 설명을 분리해 저장합니다. 이 숫자는 화면 검토용 synthetic data입니다.</p>`,
      qa:`<div class="steps"><div><b>합계 일치</b><span class="ok-text">PASS</span></div><div><b>기간 완전성</b><span class="ok-text">PASS</span></div><div><b>미지원 주장 확인</b><span class="warn-text">2건 사람 검토</span></div></div>`,
      history:`<div class="steps"><div><b>09:42</b><span>분석 Run #241 완료</span></div><div><b>09:10</b><span>데이터 품질검사 완료</span></div><div><b>어제</b><span>분석 설계 v3 승인</span></div></div>`
    };
    return `<button class="back" data-page="tasks">← 분석 과제 목록</button><section class="feature-guide compact"><div class="guide-headline"><div><div class="guide-kicker">분석 과제 상세</div><h1>메뉴·다운로드 이용 추이 분석</h1><p>한 과제의 요구사항부터 결과·검증·이력까지 동일한 위치에서 관리하는 예시입니다.</p></div><span class="need-pill required">필수</span></div></section>
      <article class="panel"><div class="tabs">${Object.entries(tabs).map(([k,v])=>`<button class="tab ${state.taskTab===k?'active':''}" data-task-tab="${k}">${v}</button>`).join('')}</div><div class="tab-body">${tabBody[state.taskTab]}</div></article>`;
  }

  function dataPage() {
    return `${guide('data')}<section class="two-col"><article class="panel"><h2>연결 가능한 데이터</h2><div class="connector-grid">${['Oracle','PostgreSQL','Tibero','CSV / Excel','Parquet','PDF / HWP'].map((x,i)=>`<button class="connector" data-action="connector"><b>${x}</b><span>${i<2?'연결됨':'연결 가능'}</span></button>`).join('')}</div></article><article class="panel"><h2>연결하면 자동으로 확인할 것</h2><ul class="check-list"><li>분석 가능 기간</li><li>컬럼 타입과 분포</li><li>NULL / 중복</li><li>PK·관계 후보</li><li>날짜 공백</li><li>이상치·코드값 분포</li></ul></article></section>`;
  }

  function execution() {
    return `${guide('execution')}<section class="two-col"><article class="panel"><h2>분석 실행 흐름</h2><div class="flow"><span>분석 요청</span><i>→</i><span>분석 설계</span><i>→</i><span>SQL/Python 검증</span><i>→</i><span>실제 계산</span><i>→</i><span>결과·차트</span><i>→</i><span>AI 설명</span></div><button class="primary" data-action="simulate-run">예시 Run 실행</button></article><article class="panel"><h2>LLM에게 맡기지 않는 것</h2><ul class="check-list"><li>합계·평균·통계값 계산</li><li>DB 결과 임의 생성</li><li>모델 평가지표 임의 생성</li><li>검증되지 않은 산출물 형식 변경</li></ul></article></section>`;
  }

  function history() {
    return `${guide('history')}<article class="panel"><h2>최근 실행</h2><div class="run-list">${[['RUN-241','2026-08','PASS','승인 대기'],['RUN-240','2026-07','PASS','승인 완료'],['RUN-239','2026-06','PASS','승인 완료']].map(r=>`<button class="run-row" data-action="run-detail"><b>${r[0]}</b><span>${r[1]}</span><span>${r[2]}</span><span>${r[3]}</span></button>`).join('')}</div></article>`;
  }

  function recurring() {
    return `${guide('recurring')}<section class="two-col"><article class="panel"><h2>월간 환경 분석</h2><p>매월 3일 01:00 · 이전 달 데이터</p><div class="month-strip"><span>4월 ✓</span><span>5월 ✓</span><span>6월 ✓</span><span class="warn-bg">7월 !</span><span>8월 ✓</span></div><button class="primary" data-action="schedule">실행 규칙 보기</button></article><article class="panel"><h2>이번 달 변화</h2><div class="kpis"><div class="kpi"><span>평균 지수</span><strong>+4.1%</strong></div><div class="kpi"><span>이상 건수</span><strong>12</strong></div><div class="kpi"><span>예측 오차</span><strong>9.7%</strong></div></div><p class="hint">예시 데이터입니다. 실제 제품에서는 이전 Run과 자동 비교합니다.</p></article></section>`;
  }

  function models() {
    return `${guide('models')}<article class="panel"><h2>예측 모델 비교 예시</h2><div class="model-grid"><div><b>이동평균</b><strong>14.8%</strong><span>Baseline MAPE</span></div><div class="selected"><b>LightGBM v3</b><strong>9.7%</strong><span>현재 모델</span></div><div><b>LightGBM v4</b><strong>9.3%</strong><span>후보 · 승인 필요</span></div></div><button class="primary" data-action="model-review">후보모델 검토 예시</button></article>`;
  }

  function evidence() {
    return `${guide('evidence')}<section class="evidence-layout"><article class="panel"><h2>답변</h2><p>예시 문서에서는 “운영기관은 월별 결과를 검토한다”고 명시합니다. <button class="citation" data-action="citation">[근거 1]</button></p><div class="retrieval"><span>문자검색 0.71</span><span>벡터검색 0.82</span><span>RRF #1</span><span>재정렬 0.91</span></div></article><article class="panel pdf-mock"><div class="pdf-page"><span id="evidenceBox">운영기관은 월별 결과를 검토하고 이상 변동의 원인을 확인한다.</span></div><p class="hint">근거를 누르면 실제 구현에서는 PDF 페이지와 bbox 위치로 이동합니다.</p></article></section>`;
  }

  function recipes() {
    const rs=[['월별 추이 분석','통계','필수 입력: 날짜·지표·그룹'],['Top-N 기여도','BI','필수 입력: 지표·차원·N'],['데이터 품질 프로파일','품질','필수 입력: 소스·grain'],['예측 Baseline Pack','ML','필수 입력: target·horizon']];
    return `${guide('recipes')}<div class="recipe-grid">${rs.map(r=>`<button class="recipe" data-action="recipe"><span>${r[1]}</span><b>${r[0]}</b><small>${r[2]}</small><em>검증된 구조 재사용 →</em></button>`).join('')}</div>`;
  }

  function providers() {
    return `${guide('providers')}<section class="two-col"><article class="panel"><h2>내 AI 프로필</h2>${['로컬 분석 / 오픈웨이트','개인 AGY','개인 Claude Code','개인 Codex'].map((p,i)=>`<label class="profile-row"><input type="radio" name="profile" value="${p}" ${state.selectedProfile===p?'checked':''}><span><b>${p}</b><small>${i===0?'제한 데이터 사용 가능':'개인 인증 프로필 예시'}</small></span></label>`).join('')}</article><article class="panel"><h2>선택 규칙</h2><div class="flow vertical"><span>데이터 등급 확인</span><i>↓</i><span>사용자 선택 AI 확인</span><i>↓</i><span>외부전송 정책 확인</span><i>↓</i><span>실행 가능 여부 결정</span></div><p class="hint">보호 데이터에서는 외부 AI를 조용히 대체하지 않고 “정책상 사용 불가”를 명확히 표시합니다.</p></article></section>`;
  }

  const renderers = {dashboard, tasks, data:dataPage, execution, history, recurring, models, evidence, recipes, providers};

  function navHtml() {
    const core = navOrder.filter(k=>pages[k].group==='core');
    const optional = navOrder.filter(k=>pages[k].group==='optional');
    const settings = navOrder.filter(k=>pages[k].group==='settings');
    const items = keys => keys.map(k=>`<button class="nav-item ${state.page===k?'active':''}" data-page="${k}"><span>${pages[k].label}</span><small>${pages[k].need}</small></button>`).join('');
    return `<div class="nav-group"><b>기본 기능</b>${items(core)}</div>
      <div class="nav-group optional-group ${state.requiredOnly?'hidden':''}"><b>확장 기능</b>${items(optional)}</div>
      <div class="nav-group"><b>설정</b>${items(settings)}</div>`;
  }

  function render() {
    document.getElementById('nav').innerHTML = navHtml();
    const root = document.getElementById('content');
    if(state.page==='task-detail') root.innerHTML = taskDetail();
    else root.innerHTML = renderers[state.page]();
    document.getElementById('breadcrumb').textContent = state.page==='task-detail' ? '분석 과제 / 상세' : pages[state.page].label;
    document.getElementById('requiredOnly').checked = state.requiredOnly;
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
    const action=e.target.closest('[data-action]');
    if(action){
      const a=action.dataset.action;
      if(a==='simulate-run'){ openDialog('예시 분석 실행','<p>데이터 검증 → SQL 실행 → 통계 계산 → 결과 저장 → 사람 검토 순서로 실행되는 모습을 구현할 예정입니다.</p><div class="dialog-status">✓ 인터랙션이 정상 동작하고 있습니다.</div>'); }
      else if(a==='citation'){ document.getElementById('evidenceBox')?.classList.add('highlight'); toast('원문 근거 위치를 표시했습니다.'); }
      else if(a==='new-task'){ openDialog('새 분석 과제','<p>실제 구현에서는 분석 목적, 실행 방식(일회성/정기), 데이터 소스, 승인 정책을 입력합니다.</p>'); }
      else if(a==='model-review'){ openDialog('후보모델 적용 검토','<p>현재 모델과 후보 모델의 실제 성능을 비교하고 사람이 적용 여부를 결정합니다.</p>'); }
      else if(a==='schedule'){ openDialog('정기 실행 규칙','<p>매월 3일 01:00 · 이전 달 데이터 → 품질검사 → 분석 → 이전 Run 비교 → 보고서 → 예외 시 사람 검토</p>'); }
      else if(a==='connector'){ toast('데이터 연결 설정 예시입니다.'); }
      else if(a==='recipe'){ toast('검증된 분석 레시피를 선택했습니다.'); }
      else if(a==='run-detail'){ openDialog('Run 상세','<p>데이터 기간, 분석 버전, 결과, QA, 승인 이력을 확인하는 화면입니다.</p>'); }
      return;
    }
    if(e.target.id==='dialogClose' || e.target.id==='dialog'){ if(e.target.id==='dialogClose' || e.target===document.getElementById('dialog')) document.getElementById('dialog').hidden=true; }
  });

  document.addEventListener('change', e => {
    if(e.target.id==='requiredOnly'){ state.requiredOnly=e.target.checked; render(); }
    if(e.target.name==='profile'){ state.selectedProfile=e.target.value; toast(`새 실행의 AI 프로필: ${e.target.value}`); }
  });

  document.getElementById('mobileMenu').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));

  const status=document.getElementById('interactionStatus');
  status.textContent='상호작용 정상'; status.classList.add('ok');
  document.body.classList.add('js-ready');
  render();
})();
