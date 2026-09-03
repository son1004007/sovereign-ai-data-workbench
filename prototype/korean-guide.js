(() => {
  const TEXT = new Map(Object.entries({
    'Control Center':'통합 관제',
    'Projects':'프로젝트',
    'Analysis Tasks':'분석 과제',
    'Recurring':'정기 분석',
    'Recurring Analysis':'정기 분석',
    'Experiments & Models':'ML 실험·모델',
    'Data Sources':'데이터 소스',
    'Analysis Recipes':'분석 레시피',
    'Evidence & Eval':'근거·평가',
    'Evidence & Evaluation':'근거·평가',
    'AI Accounts':'AI 계정',
    'AI Accounts & Providers':'AI 계정·모델 연결',
    'Workspace':'작업공간',
    'Analytics Division':'분석사업부',
    '8 active tasks':'활성 과제 8개',
    'Restricted mode':'제한망 모드',
    'External data egress is blocked for protected tasks.':'보호 데이터는 외부로 전송되지 않도록 차단합니다.',
    'View policy':'정책 보기',
    'Restricted Network':'제한망',
    'AI profile':'AI 프로필',
    'Local Analysis / Open-weight':'로컬 분석 / 오픈웨이트',
    'Personal AGY':'개인 AGY',
    'Personal Claude Code':'개인 Claude Code',
    'Personal Codex (quota blocked)':'개인 Codex (현재 사용량 제한)',
    'Active tasks':'활성 과제',
    'Needs review':'검토 필요',
    'Recurring health':'정기 실행 정상률',
    'Reusable recipes':'재사용 레시피',
    'Active analysis tasks':'진행 중 분석 과제',
    'Portfolio workload':'전체 분석 실행량',
    'Action required':'내 판단이 필요한 작업',
    'Projects':'프로젝트',
    'Recent automation':'최근 자동화 실행',
    'View all':'전체 보기',
    'Manage':'관리',
    'Running':'실행 중',
    'Review required':'검토 필요',
    'Blocked':'차단됨',
    'Healthy':'정상',
    'Draft':'초안',
    'Pending':'승인 대기',
    'Approved':'승인 완료',
    'ACTIVE':'사용 중',
    'CANDIDATE':'후보',
    'RETIRED':'사용 종료',
    'Recommended':'추천',
    'Compared':'비교 완료',
    'Activated':'적용 완료',
    'Enabled':'사용',
    'Connected':'연결됨',
    'Available':'사용 가능',
    'Ready':'준비됨',
    'Later':'추후',
    'Normal':'정상',
    'Review':'검토',
    'Inspect':'확인',
    'Configure':'설정',
    'Preview':'미리보기',
    'Export':'내보내기',
    'Save draft':'초안 저장',
    'Cancel':'취소',
    'Create':'생성',
    'Execute':'실행',
    'Schedule':'일정',
    'Account':'계정',
    'Security':'보안',
    'Model governance':'모델 관리',
    'New analysis task':'새 분석 과제',
    'New project':'새 프로젝트',
    'Create recurring analysis':'정기 분석 만들기',
    'Add AI credential profile':'AI 계정 프로필 추가',
    'Add data source':'데이터 소스 추가',
    'Run analysis':'분석 실행',
    'Review model activation':'모델 적용 검토',
    'Network & egress policy':'네트워크·외부전송 정책',
    'Task name':'과제명',
    'Project':'프로젝트',
    'Execution mode':'실행 방식',
    'Primary analysis':'주 분석 방식',
    'Approval policy':'승인 방식',
    'Objective':'분석 목적',
    'Project name':'프로젝트명',
    'Deployment mode':'배포 환경',
    'Default AI routing':'기본 AI 선택 정책',
    'Description':'설명',
    'Analysis task':'분석 과제',
    'Frequency':'주기',
    'Data window':'분석 기간',
    'Run time':'실행 시각',
    'Timezone':'시간대',
    'After run':'실행 후 처리',
    'Provider':'AI 제공자',
    'Profile label':'프로필 이름',
    'Authentication method':'인증 방식',
    'Connector':'연결 방식',
    'Access mode':'접근 권한',
    'Connection label':'연결 이름',
    'Run policy':'실행 정책',
    'Pipeline':'분석 절차',
    'Decision note':'판단 근거',
    'Mode':'모드',
    'External LLM':'외부 LLM',
    'Local model':'로컬 모델',
    'Audit':'감사 기록',
    'Claim policy':'검증 원칙',
    'Analysis LLM':'분석 LLM',
    'Code agent':'코드 에이전트',
    'Embedding':'임베딩',
    'Restricted data':'제한 데이터',
    'Local-only enforced':'로컬 처리 강제',
    'Organization local profile':'기관 로컬 프로필',
    'Task':'과제',
    'Stage':'단계',
    'Status':'상태',
    'Next':'다음 일정',
    'Analysis type':'분석 유형',
    'Updated':'최근 변경',
    'All tasks':'전체 과제',
    'Monthly':'월간',
    'Weekly':'주간',
    'Daily':'일간',
    'One-time':'일회성',
    'Statistical':'통계 분석',
    'Machine Learning':'머신러닝',
    'Generative AI':'생성형 AI',
    'Mixed':'혼합',
    'Data Quality':'데이터 품질',
    'Evaluation':'평가',
    'Document AI':'문서 AI',
    'Statistical + ML':'통계 + ML',
    'Open task':'과제 열기',
    'Open tasks →':'과제 보기 →',
    'New task':'새 과제',
    'New project':'새 프로젝트',
    'Data profiling':'데이터 품질 확인',
    'Current defaults':'현재 기본 설정',
    'Scheduled pipelines':'정기 실행 목록',
    'Run comparison':'이전 실행과 비교',
    'Monitoring & retraining policy':'모니터링·재학습 판단',
    'Experiment comparison':'실험 결과 비교',
    'Quality gates':'품질 검증',
    'Review queue':'검토 대기',
    'Monthly operations report':'월간 운영 보고서',
    'Metric appendix':'지표 부록',
    'Run manifest':'실행 재현 기록',
    'Section ready':'화면 준비 중',
    'Publishing content is being refined.':'퍼블리싱 내용을 정리하고 있습니다.',
    'District Heating Analytics':'지역난방 데이터 분석',
    'Environmental Monthly Analysis':'환경 월간 분석',
    'Cable Materials Research':'케이블 소재 연구',
    'Public Energy Demo':'에너지 공공데이터 예시',
    'Public Environment Demo':'환경 공공데이터 예시',
    'Manufacturing Demo':'제조 데이터 예시',
    'Menu & download trend analysis':'메뉴·다운로드 이용 추이 분석',
    'User segment behavior':'사용자 유형별 행동 분석',
    'Portal log quality validation':'포털 로그 데이터 품질 검증',
    'Monthly air-quality operations report':'월간 대기질 운영 분석',
    'Facility anomaly detection':'시설 이상 징후 탐지',
    'TDS structured extraction':'TDS 문서 구조화 추출',
    'Technical evidence retrieval':'기술 근거 문서 검색',
    'Extraction regression evaluation':'문서 추출 품질 회귀 평가',
    'Environmental monthly operations':'환경 월간 운영 분석',
    'Facility anomaly scoring':'시설 이상 점수 산정',
    'Document extraction regression':'문서 추출 품질 정기검증',
    'Monthly execution volume':'월별 분석 실행량',
    'Model performance trend':'모델 성능 추이',
    'Analysis':'분석 수행',
    'Design review':'설계 검토',
    'Data validation':'데이터 검증',
    'Recurring analysis':'정기 분석',
    'Drift monitor':'변화 감시',
    'Design':'분석 설계',
    'QA':'품질 검증',
    'Baseline':'기준 모델',
    'Candidate':'후보 모델',
    'Training data':'학습 데이터',
    'Metric':'평가지표',
    'Decision':'판단',
    'Problem':'문제 유형',
    'Algorithm':'알고리즘',
    'Version':'버전',
    'Action':'작업',
    'Window':'분석 기간',
    'Model':'모델',
    'Duration':'소요 시간',
    'Review P':'검토 정확도',
    'Data':'데이터',
    'Feature':'특성',
    'Average index':'평균 지수',
    'Anomalies':'이상 건수',
    'Forecast error':'예측 오차',
    'Data drift':'데이터 변화',
    'Model performance':'모델 성능',
    'Retraining candidate':'재학습 후보',
    'Current v3':'현재 모델 v3',
    'Candidate v4':'후보 모델 v4',
    'Drift':'데이터 변화',
    'Read-only':'읽기 전용',
    'Blocked for protected tasks':'보호 데이터에서는 차단',
    'Allowed':'허용',
    'Analyst supervisor workspace':'분석 업무 관제',
    'Portfolio':'프로젝트 포트폴리오',
    'Execution portfolio':'분석 실행 관리',
    'Scheduled analysis':'정기 분석 자동화',
    'ML lifecycle':'머신러닝 운영',
    'Data layer':'데이터 연결·검증',
    'Evidence inspection':'근거 검증',
    'Provider abstraction':'AI 연결 관리'
  }));

  const PHRASES = [
    [/\bactive tasks\b/gi, '활성 과제'],
    [/\banalysis tasks\b/gi, '분석 과제'],
    [/\bproject readiness\b/gi, '프로젝트 준비도'],
    [/\bhuman decisions\b/gi, '사람 판단'],
    [/\bLast activity\b/gi, '최근 활동'],
    [/\bLast 6 months\b/gi, '최근 6개월'],
    [/\bLast activity 12 min ago\b/gi, '최근 활동 12분 전'],
    [/\b12 min ago\b/gi, '12분 전'],
    [/\b34 min ago\b/gi, '34분 전'],
    [/\b1 hr ago\b/gi, '1시간 전'],
    [/\b8 min ago\b/gi, '8분 전'],
    [/\b22 min ago\b/gi, '22분 전'],
    [/\b4 min ago\b/gi, '4분 전'],
    [/\b29 min ago\b/gi, '29분 전'],
    [/\b2 hr ago\b/gi, '2시간 전'],
    [/\bprevious\b/gi, '이전'],
    [/\bToday\b/gi, '오늘'],
    [/\bYesterday\b/gi, '어제'],
    [/\breview pending\b/gi, '검토 대기'],
    [/\breview required\b/gi, '검토 필요'],
    [/\bNo blockers\b/gi, '차단 항목 없음'],
    [/\bblocked\b/gi, '차단'],
    [/\bready\b/gi, '준비'],
    [/\bcompleted\b/gi, '완료'],
    [/\bcurrent approved pipeline\b/gi, '현재 승인된 분석 절차'],
    [/\bPrevious month\b/gi, '이전 달'],
    [/\bPrevious day\b/gi, '이전 일'],
    [/\bCustom window\b/gi, '기간 직접 선택'],
    [/\bTrailing 30 days\b/gi, '최근 30일'],
    [/\bHuman review required\b/gi, '사람 검토 필수'],
    [/\bAuto-run, review on exception\b/gi, '자동 실행, 예외만 검토'],
    [/\bLocal preferred\b/gi, '로컬 우선'],
    [/\bPolicy based\b/gi, '정책에 따라 선택'],
    [/\bAir-gapped target\b/gi, '완전 폐쇄망'],
    [/\bConnected\b/g, '인터넷 연결망']
  ];

  const GUIDES = {
    dashboard: {
      title: '통합 관제는 “오늘 내가 어디에 개입해야 하는지” 보는 첫 화면입니다.',
      summary: '여러 프로젝트를 동시에 담당할 때 AI와 자동화가 처리한 작업 중 사람이 판단해야 하는 것만 모아봅니다.',
      need: 'required', needLabel: '제안: 필수',
      when: '업무를 시작할 때, 또는 여러 분석 과제의 전체 상태를 빠르게 확인할 때 사용합니다.',
      see: '“내 판단이 필요한 작업”과 차단된 과제를 먼저 보고, 정상 실행 건은 상세 화면에 들어가지 않아도 됩니다.',
      without: '프로젝트와 과제를 하나씩 열어 상태를 확인해야 해서 다중 프로젝트 관리 부담이 커집니다.',
      example: '예: 월간 환경 분석은 자동 완료됐고 12건의 이상치만 사람이 판단해야 한다면, 여기서 그 12건만 확인합니다.'
    },
    projects: {
      title: '프로젝트는 고객·업무 단위로 분석 과제를 묶는 화면입니다.',
      summary: '“어느 고객의 어떤 분석 업무인가”를 분리해서 데이터, 과제, 산출물을 섞이지 않게 관리합니다.',
      need: 'required', needLabel: '제안: 필수',
      when: '고객이나 사업이 2개 이상이거나, 프로젝트별 접근권한·납품물을 분리해야 할 때 사용합니다.',
      see: '프로젝트 진행률보다 “활성 과제 수”와 “사람 판단 때문에 막힌 건수”가 핵심입니다.',
      without: '서로 다른 고객 데이터와 분석 이력이 한 작업공간에 섞일 위험이 있습니다.',
      example: '예: 지역난방 분석과 케이블 소재 연구를 별도 프로젝트로 두고 각 프로젝트의 과제와 데이터 연결을 분리합니다.'
    },
    tasks: {
      title: '분석 과제는 실제 업무 한 건의 시작부터 납품까지 관리하는 핵심 화면입니다.',
      summary: '통계, ML, 문서 AI 여부와 관계없이 “문제 정의 → 데이터 검증 → 분석 → QA → 납품” 흐름을 동일하게 관리합니다.',
      need: 'required', needLabel: '제안: 필수',
      when: '새 분석 요청을 받거나 현재 진행 중인 분석 한 건을 찾고 상태를 확인할 때 사용합니다.',
      see: '현재 단계, 차단 여부, 분석 유형, 일회성/정기 실행 여부를 봅니다.',
      without: '분석 코드·데이터·보고서가 각각 따로 관리되어 “어디까지 했는지” 추적하기 어려워집니다.',
      example: '예: “월간 대기질 운영 분석” 과제를 열면 요구사항, 데이터, 실행 코드, 결과, QA, 보고서를 한 곳에서 이어서 봅니다.'
    },
    'task-detail': {
      title: '과제 상세는 분석 한 건의 작업대입니다.',
      summary: '복잡해 보이지만 모든 탭을 매번 쓰는 것이 아닙니다. 현재 단계에 필요한 탭만 열어보는 구조입니다.',
      need: 'required', needLabel: '제안: 필수',
      when: '특정 분석 과제를 실제로 설계·실행·검토할 때 사용합니다.',
      see: '초기에는 요구사항·데이터, 실행 중에는 분석 설계·코드, 완료 후에는 결과·QA·보고서만 보면 됩니다.',
      without: 'SQL/Python, 결과표, 보고서, 승인 근거가 서로 다른 도구에 흩어집니다.',
      example: '예: G2 단계라면 “데이터” 탭만 확인하고, G4라면 “코드·실행”과 “결과”를 확인하는 식입니다.'
    },
    recurring: {
      title: '정기 분석은 매일·매주·매월 반복되는 업무를 자동 실행하는 화면입니다.',
      summary: '한 번 만든 분석 절차를 반복 실행하고, 이전 결과와 달라진 부분만 사람이 검토합니다.',
      need: 'conditional', needLabel: '제안: 조건부',
      when: '월간 보고서, 일일 이상탐지처럼 같은 분석을 주기적으로 반복할 때만 필요합니다.',
      see: '다음 실행 시각, 최근 실패 여부, 이전 실행 대비 변화, 사람 검토가 필요한 예외만 봅니다.',
      without: '반복 분석이 없다면 없어도 됩니다. 반복 업무가 있다면 수작업 재실행 비용이 계속 발생합니다.',
      example: '예: 매월 3일 대기질 보고서를 자동 생성하고 전월 대비 이상 변화가 있을 때만 분석가에게 검토를 요청합니다.'
    },
    models: {
      title: 'ML 실험·모델은 머신러닝을 실제로 사용하는 과제에만 필요한 화면입니다.',
      summary: '모델을 많이 만드는 화면이 아니라, 기존 기준보다 새 모델이 정말 나은지 비교하고 적용 여부를 승인합니다.',
      need: 'conditional', needLabel: '제안: ML 사용 시',
      when: '예측·분류·군집·이상탐지 모델을 학습하거나 교체할 때 사용합니다.',
      see: '현재 사용 모델, 기준 모델, 후보 모델의 평가 지표와 데이터 버전을 비교합니다.',
      without: 'ML을 사용하지 않는 조직이라면 제거해도 됩니다. ML을 운영한다면 모델 교체 근거가 남지 않습니다.',
      example: '예: 현재 예측오차 9.7% 모델과 후보 9.3% 모델을 비교하고 사람이 승인해야 새 모델을 사용합니다.'
    },
    data: {
      title: '데이터 소스는 “어떤 데이터로 분석하는지” 연결하고 품질을 확인하는 화면입니다.',
      summary: 'Oracle·PostgreSQL·CSV·Excel·Parquet·문서 등을 연결하고 분석 전에 결측·중복·기간 오류를 확인합니다.',
      need: 'required', needLabel: '제안: 필수',
      when: '새 DB나 파일을 분석에 연결하거나 결과가 이상해서 원천 데이터 품질을 확인할 때 사용합니다.',
      see: '연결 상태, 읽기 전용 여부, 데이터 범위, 결측·중복·이상치 여부를 봅니다.',
      without: 'AI가 분석은 해도 어떤 데이터가 문제였는지 원인을 확인하기 어렵습니다.',
      example: '예: Oracle 테이블의 분석 기간이 2026년 8월까지 들어왔는지, 필수 컬럼 결측이 없는지 먼저 확인합니다.'
    },
    recipes: {
      title: '분석 레시피는 잘 된 분석 방법을 다음 과제에서 재사용하기 위한 템플릿입니다.',
      summary: 'SQL 한 줄을 저장하는 것이 아니라 데이터 검증, 계산, 차트, QA까지 검증된 분석 절차를 묶어 재사용합니다.',
      need: 'recommended', needLabel: '제안: 권장',
      when: '비슷한 분석을 여러 고객·기간·데이터에 반복 적용할 때 유용합니다.',
      see: '어떤 문제에 쓰는 레시피인지, 필요한 입력값과 검증 규칙이 무엇인지 확인합니다.',
      without: '초기에는 없어도 되지만 같은 분석을 매번 처음부터 만들게 됩니다.',
      example: '예: “월별 추이 + 급증 구간 탐지” 레시피를 만들어 부서별 이용량, 민원, 매출 분석에 재사용합니다.'
    },
    evidence: {
      title: '근거·평가는 문서 AI/RAG 결과가 “어디서 나온 답인지” 검증하는 화면입니다.',
      summary: 'PDF 문장 위치와 검색 점수를 확인하고, AI 답변의 인용을 클릭해 원문 페이지까지 추적합니다.',
      need: 'conditional', needLabel: '제안: 문서 AI 사용 시',
      when: 'PDF/HWP 보고서·매뉴얼·논문 등을 검색하거나 RAG 답변을 제공할 때 필요합니다.',
      see: '인용 원문, 페이지 위치, 검색 결과, 평가 데이터셋의 정답률을 확인합니다.',
      without: '문서 AI를 쓰지 않으면 없어도 됩니다. 문서 AI를 쓰는데 이 기능이 없으면 답변 근거를 검증하기 어렵습니다.',
      example: '예: “이 기준의 근거가 뭐야?”라는 답변의 [1]을 누르면 실제 PDF 12페이지 해당 문장 위치를 보여줍니다.'
    },
    providers: {
      title: 'AI 계정·모델 연결은 어떤 AI를 사용할지 환경과 사용자별로 선택하는 관리 화면입니다.',
      summary: '상용 LLM, 개인 AGY/Claude/Codex, 폐쇄망 로컬 모델을 기능 코드와 분리해서 교체 가능하게 합니다.',
      need: 'recommended', needLabel: '제안: 권장',
      when: '인터넷 연결망과 폐쇄망을 모두 지원하거나 사용자별 AI 계정을 사용할 때 필요합니다.',
      see: '실제 비밀번호가 아니라 연결 프로필, 허용 환경, 기본 모델만 확인합니다.',
      without: 'AI 공급자가 하나뿐이고 폐쇄망 요구도 없다면 단순화할 수 있습니다. 여러 환경을 지원한다면 결합도가 높아집니다.',
      example: '예: 일반 데이터는 상용 LLM, 보호 데이터는 사내 vLLM만 사용하도록 정책으로 분기합니다.'
    }
  };

  function translateString(value) {
    if (!value) return value;
    const trimmed = value.trim();
    if (TEXT.has(trimmed)) {
      const leading = value.match(/^\s*/)?.[0] || '';
      const trailing = value.match(/\s*$/)?.[0] || '';
      return leading + TEXT.get(trimmed) + trailing;
    }
    let out = value;
    for (const [pattern, replacement] of PHRASES) out = out.replace(pattern, replacement);
    return out;
  }

  function translateTree(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const parent = node.parentElement;
      if (!parent || parent.closest('script,style,pre,code')) continue;
      const translated = translateString(node.nodeValue);
      if (translated !== node.nodeValue) node.nodeValue = translated;
    }
    root.querySelectorAll?.('[placeholder]').forEach(el => {
      const value = el.getAttribute('placeholder');
      const mapped = {
        'Search task or project':'과제명 또는 프로젝트 검색',
        'e.g. Monthly demand forecast':'예: 월간 수요 예측',
        'Public Analytics Project':'예: 공공 데이터 분석 프로젝트',
        'Personal profile A':'예: 개인 업무용 프로필',
        'analytics-readonly':'예: 분석DB-읽기전용'
      }[value];
      if (mapped) el.setAttribute('placeholder', mapped);
    });
  }

  function currentPage() {
    const breadcrumb = document.getElementById('breadcrumb')?.textContent || '';
    if (breadcrumb.includes('/') || document.querySelector('[data-task-tab]')) return 'task-detail';
    return document.querySelector('.nav-item.is-active')?.dataset.page || 'dashboard';
  }

  function buildGuide(page) {
    const g = GUIDES[page] || GUIDES.dashboard;
    const section = document.createElement('section');
    section.className = 'feature-guide';
    section.dataset.featureGuide = page;
    section.innerHTML = `
      <div class="feature-guide-head">
        <div>
          <h2 class="feature-guide-title">${g.title}</h2>
          <p class="feature-guide-summary">${g.summary}</p>
        </div>
        <span class="feature-need ${g.need}">${g.needLabel}</span>
      </div>
      <div class="feature-guide-grid">
        <div class="guide-box"><strong>언제 사용하나요?</strong><p>${g.when}</p></div>
        <div class="guide-box"><strong>여기서 무엇을 보면 되나요?</strong><p>${g.see}</p></div>
        <div class="guide-box"><strong>이 기능이 없으면?</strong><p>${g.without}</p></div>
      </div>
      <div class="guide-example"><strong>사용 예시</strong> · ${g.example}</div>`;
    return section;
  }

  function ensureGuide() {
    const root = document.getElementById('pageRoot');
    if (!root) return;
    const page = currentPage();
    const existing = root.querySelector('[data-feature-guide]');
    if (existing?.dataset.featureGuide === page) return;
    existing?.remove();
    const head = root.querySelector('.page-head');
    const guide = buildGuide(page);
    if (head) head.insertAdjacentElement('afterend', guide);
    else root.prepend(guide);
  }

  function localizeStaticShell() {
    document.documentElement.classList.add('korean-primary');
    translateTree(document.body);
    const navLabels = {
      dashboard:'통합 관제', projects:'프로젝트', tasks:'분석 과제', recurring:'정기 분석',
      models:'ML 실험·모델', data:'데이터 소스', recipes:'분석 레시피', evidence:'근거·평가', providers:'AI 계정·모델'
    };
    document.querySelectorAll('.nav-item').forEach(item => {
      const label = item.querySelector('span:last-child');
      if (label && navLabels[item.dataset.page]) label.textContent = navLabels[item.dataset.page];
    });
    const staticText = [
      ['.sidebar-label','작업공간'],
      ['.workspace-copy strong','분석사업부'],
      ['.workspace-copy small','활성 과제 8개'],
      ['.security-head strong','제한망 모드'],
      ['.security-card p','보호 데이터는 외부로 전송되지 않도록 차단합니다.'],
      ['.security-card .text-button','정책 보기'],
      ['.mode-pill span:last-child','제한망'],
      ['.profile-select > span','AI 프로필']
    ];
    staticText.forEach(([selector, value]) => { const el = document.querySelector(selector); if (el) el.textContent = value; });
  }

  let scheduled = false;
  function apply() {
    scheduled = false;
    localizeStaticShell();
    translateTree(document.getElementById('pageRoot') || document.body);
    translateTree(document.getElementById('modalBackdrop') || document.body);
    ensureGuide();
  }
  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(apply);
  }

  const observer = new MutationObserver(scheduleApply);
  observer.observe(document.body, {subtree:true, childList:true, characterData:true});
  apply();
})();
