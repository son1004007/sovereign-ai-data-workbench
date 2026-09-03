const state = {
  page: 'dashboard',
  selectedTask: 'env-monthly',
  taskTab: 'overview',
  taskFilter: 'all',
  projectFilter: 'all',
  evidenceHighlight: false,
  evalRun: false,
};

const projects = [
  { id: 'district', name: 'District Heating Analytics', client: 'Public Energy Demo', progress: 74, active: 3, blocked: 1, mode: 'Mixed' },
  { id: 'environment', name: 'Environmental Monthly Analysis', client: 'Public Environment Demo', progress: 86, active: 2, blocked: 0, mode: 'Recurring' },
  { id: 'materials', name: 'Cable Materials Research', client: 'Manufacturing Demo', progress: 61, active: 3, blocked: 0, mode: 'Document AI' },
];

const tasks = [
  { id: 'district-menu', project: 'District Heating Analytics', name: 'Menu & download trend analysis', stage: 'G4', stageLabel: 'Analysis', type: 'Statistical', mode: 'One-time', owner: 'SK', status: 'running', next: '—', updated: '12 min ago' },
  { id: 'district-segment', project: 'District Heating Analytics', name: 'User segment behavior', stage: 'G3', stageLabel: 'Design review', type: 'ML · Clustering', mode: 'One-time', owner: 'SK', status: 'review', next: 'Metric approval', updated: '34 min ago' },
  { id: 'district-quality', project: 'District Heating Analytics', name: 'Portal log quality validation', stage: 'G2', stageLabel: 'Data validation', type: 'Data Quality', mode: 'One-time', owner: 'SK', status: 'blocked', next: 'Define visitor grain', updated: '1 hr ago' },
  { id: 'env-monthly', project: 'Environmental Monthly Analysis', name: 'Monthly air-quality operations report', stage: 'R4', stageLabel: 'Recurring analysis', type: 'Statistical + ML', mode: 'Monthly', owner: 'SK', status: 'healthy', next: 'Oct 03, 01:00', updated: '8 min ago' },
  { id: 'env-anomaly', project: 'Environmental Monthly Analysis', name: 'Facility anomaly detection', stage: 'R6', stageLabel: 'Drift monitor', type: 'ML · Anomaly', mode: 'Daily', owner: 'SK', status: 'review', next: 'Tomorrow 02:00', updated: '22 min ago' },
  { id: 'materials-tds', project: 'Cable Materials Research', name: 'TDS structured extraction', stage: 'G4', stageLabel: 'Analysis', type: 'Document AI', mode: 'One-time', owner: 'SK', status: 'running', next: '—', updated: '4 min ago' },
  { id: 'materials-rag', project: 'Cable Materials Research', name: 'Technical evidence retrieval', stage: 'G3', stageLabel: 'Design', type: 'RAG', mode: 'One-time', owner: 'SK', status: 'healthy', next: '—', updated: '29 min ago' },
  { id: 'materials-eval', project: 'Cable Materials Research', name: 'Extraction regression evaluation', stage: 'G5', stageLabel: 'QA', type: 'Evaluation', mode: 'Weekly', owner: 'SK', status: 'healthy', next: 'Mon 03:30', updated: '2 hr ago' },
];

const statusBadge = (status) => {
  const map = {
    running: ['info', 'Running'], review: ['warn', 'Review required'], blocked: ['danger', 'Blocked'], healthy: ['ok', 'Healthy'], draft: ['neutral', 'Draft']
  };
  const [cls, label] = map[status] || ['neutral', status];
  return `<span class="badge ${cls}">${label}</span>`;
};

const stageBadge = (stage) => {
  const cls = stage.startsWith('R') ? 'violet' : 'info';
  return `<span class="badge ${cls}">${stage}</span>`;
};

function pageHead(eyebrow, title, subtitle, actions = '') {
  return `<div class="page-head">
    <div><div class="eyebrow">${eyebrow}</div><h1 class="page-title">${title}</h1><p class="page-subtitle">${subtitle}</p></div>
    <div class="page-actions">${actions}</div>
  </div>`;
}

function chartBars(values) {
  return `<div class="chart"><div class="chart-title">Monthly execution volume</div><div class="chart-grid"></div><div class="chart-bars">${values.map(v=>`<span style="height:${v}%"></span>`).join('')}</div><div class="chart-note">Prototype sample values · not measured</div></div>`;
}

function lineChart(points) {
  const p = points.map(([x,y])=>`${x},${y}`).join(' ');
  return `<div class="chart"><div class="chart-title">Model performance trend</div><div class="chart-grid"></div><div class="chart-line"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="${p}" fill="none" stroke="#2a6c94" stroke-width="2" vector-effect="non-scaling-stroke"/></svg></div><div class="chart-note">Illustrative trend for publishing review only</div></div>`;
}

function renderDashboard() {
  return `${pageHead('Analyst supervisor workspace','Control Center','여러 프로젝트와 일회성·정기 분석 과제를 한 곳에서 감독하고, 사람이 필요한 판단만 빠르게 처리합니다.',
    `<button class="button" data-open-modal="project">+ Project</button><button class="button primary" data-open-modal="task">+ Analysis Task</button>`)}

  <div class="prototype-label mb-14">이 화면의 수치와 프로젝트는 기능 검토를 위한 synthetic prototype data입니다. 실제 성능 측정값이나 고객 데이터가 아닙니다.</div>

  <section class="grid kpi-grid">
    <article class="card kpi-card"><div class="kpi-label">Active tasks</div><div class="kpi-value">8</div><div class="kpi-foot"><span class="kpi-delta">+3</span> recurring tasks automated</div></article>
    <article class="card kpi-card"><div class="kpi-label">Needs review</div><div class="kpi-value">3</div><div class="kpi-foot"><span class="kpi-delta warn">2 decisions</span> · 1 data blocker</div></article>
    <article class="card kpi-card"><div class="kpi-label">Recurring health</div><div class="kpi-value">96%</div><div class="kpi-foot"><span class="kpi-delta">23 / 24</span> latest scheduled runs passed</div></article>
    <article class="card kpi-card"><div class="kpi-label">Reusable recipes</div><div class="kpi-value">12</div><div class="kpi-foot"><span>Trend · Top-N · Forecast · Anomaly</span></div></article>
  </section>

  <section class="grid two">
    <div class="grid">
      <article class="card">
        <header class="card-head"><div><div class="card-title">Active analysis tasks</div><div class="card-subtitle">현재 실행·승인·차단 상태를 기준으로 정렬</div></div><button class="button sm" data-page-jump="tasks">View all</button></header>
        <div class="table-wrap"><table><thead><tr><th>Task</th><th>Project</th><th>Stage</th><th>Mode</th><th>Status</th><th>Next</th></tr></thead><tbody>
          ${tasks.slice(0,6).map(t=>`<tr class="clickable" data-task-id="${t.id}"><td><span class="cell-main">${t.name}</span><span class="cell-sub">${t.type}</span></td><td>${t.project}</td><td>${stageBadge(t.stage)} ${t.stageLabel}</td><td>${t.mode}</td><td>${statusBadge(t.status)}</td><td>${t.next}</td></tr>`).join('')}
        </tbody></table></div>
      </article>

      <article class="card">
        <header class="card-head"><div><div class="card-title">Portfolio workload</div><div class="card-subtitle">월간 실행량과 자동화된 정기 과제 흐름</div></div><span class="badge neutral">Last 6 months</span></header>
        <div class="card-body">${chartBars([36,48,55,63,75,84])}</div>
      </article>
    </div>

    <div class="grid">
      <article class="card">
        <header class="card-head"><div><div class="card-title">Action required</div><div class="card-subtitle">AI가 진행을 멈추고 사람 판단을 기다리는 항목</div></div><span class="badge warn">3 items</span></header>
        <div class="card-body action-list">
          <div class="action-item"><span class="status-dot status-danger"></span><div class="action-copy"><strong>Visitor grain definition is missing</strong><span>District Heating · G2 data validation</span></div><button class="button sm" data-task-id="district-quality">Review</button></div>
          <div class="action-item"><span class="status-dot status-warn"></span><div class="action-copy"><strong>Approve clustering metric set</strong><span>User segment behavior · G3 design</span></div><button class="button sm" data-task-id="district-segment">Review</button></div>
          <div class="action-item"><span class="status-dot status-warn"></span><div class="action-copy"><strong>12 anomaly cases need analyst judgment</strong><span>Environmental Monthly · recurring run</span></div><button class="button sm" data-task-id="env-anomaly">Inspect</button></div>
        </div>
      </article>

      <article class="card">
        <header class="card-head"><div><div class="card-title">Projects</div><div class="card-subtitle">분석가가 동시에 감독하는 프로젝트</div></div><button class="button sm" data-page-jump="projects">Manage</button></header>
        <div class="card-body project-list">
          ${projects.map(p=>`<div class="project-row"><div class="project-row-head"><div><div class="project-name">${p.name}</div><div class="project-meta">${p.client} · ${p.active} active tasks</div></div><span class="badge neutral">${p.mode}</span></div><div class="progress"><span style="width:${p.progress}%"></span></div><div class="project-task-strip"><span class="badge ok">${p.progress}% ready</span>${p.blocked?`<span class="badge danger">${p.blocked} blocked</span>`:'<span class="badge ok">No blockers</span>'}</div></div>`).join('')}
        </div>
      </article>

      <article class="card">
        <header class="card-head"><div><div class="card-title">Recent automation</div><div class="card-subtitle">자동 실행과 AI 보조 작업 이력</div></div></header>
        <div class="card-body timeline-list">
          <div class="timeline-item"><div class="timeline-time">09:42</div><div class="timeline-node"></div><div class="timeline-content"><strong>Monthly report pipeline completed</strong><span>QA passed · analyst review queued</span></div></div>
          <div class="timeline-item"><div class="timeline-time">09:18</div><div class="timeline-node"></div><div class="timeline-content"><strong>Data drift check completed</strong><span>No retraining required</span></div></div>
          <div class="timeline-item"><div class="timeline-time">08:57</div><div class="timeline-node"></div><div class="timeline-content"><strong>TDS extraction batch finished</strong><span>46 documents · 2 schema recoveries</span></div></div>
        </div>
      </article>
    </div>
  </section>`;
}

function renderProjects() {
  return `${pageHead('Portfolio','Projects','고객·업무 단위의 프로젝트에서 여러 분석 과제와 데이터 소스, 산출물을 관리합니다.', `<button class="button primary" data-open-modal="project">+ New project</button>`)}
  <div class="grid three">
  ${projects.map(p=>`<article class="card"><div class="card-body">
    <div class="flex space-between"><div><div class="eyebrow">${p.client}</div><h3 style="margin:0;font-size:15px">${p.name}</h3></div><span class="badge neutral">${p.mode}</span></div>
    <div class="metric-grid mt-14"><div class="metric-box"><span>Active</span><strong>${p.active}</strong><small>analysis tasks</small></div><div class="metric-box"><span>Progress</span><strong>${p.progress}%</strong><small>project readiness</small></div><div class="metric-box"><span>Blocked</span><strong>${p.blocked}</strong><small>human decisions</small></div></div>
    <div class="split-line"></div><div class="progress"><span style="width:${p.progress}%"></span></div>
    <div class="flex space-between mt-10"><span class="small muted">Last activity 12 min ago</span><button class="button sm" data-page-jump="tasks">Open tasks →</button></div>
  </div></article>`).join('')}
  </div>
  <article class="card mt-14"><header class="card-head"><div><div class="card-title">Project governance</div><div class="card-subtitle">프로젝트마다 승인 흐름과 산출물 구조는 동일한 계약을 따릅니다.</div></div></header><div class="card-body"><div class="stage-row">${['G1 Problem','G2 Data','G3 Design','G4 Analysis','G5 QA','G6 Delivery'].map((s,i)=>`<div class="stage ${i<3?'done':i===3?'current':''}"><strong>${s.split(' ')[0]}</strong><span>${s.substring(3)}</span></div>`).join('')}</div></div></article>`;
}

function taskRows(filtered = tasks) {
  return filtered.map(t=>`<tr class="clickable" data-task-id="${t.id}"><td><span class="cell-main">${t.name}</span><span class="cell-sub">${t.id}</span></td><td>${t.project}</td><td>${t.type}</td><td>${stageBadge(t.stage)} ${t.stageLabel}</td><td>${t.mode}</td><td>${statusBadge(t.status)}</td><td>${t.updated}</td></tr>`).join('');
}

function renderTasks() {
  const filtered = state.taskFilter === 'all' ? tasks : tasks.filter(t=>t.status === state.taskFilter || t.mode.toLowerCase() === state.taskFilter);
  return `${pageHead('Execution portfolio','Analysis Tasks','통계·머신러닝·생성형 AI 과제를 동일한 lifecycle과 승인 규칙으로 관리합니다.', `<button class="button primary" data-open-modal="task">+ New task</button>`)}
    <article class="card"><div class="card-body">
      <div class="toolbar"><div class="toolbar-group"><div class="search-input"><input class="input" id="taskSearch" placeholder="Search task or project" /></div><select class="select" id="taskFilter"><option value="all">All tasks</option><option value="review">Review required</option><option value="blocked">Blocked</option><option value="healthy">Healthy</option><option value="monthly">Monthly</option></select></div><div class="toolbar-group"><span class="small muted">${filtered.length} tasks</span></div></div>
      <div class="table-wrap"><table><thead><tr><th>Task</th><th>Project</th><th>Analysis type</th><th>Stage</th><th>Mode</th><th>Status</th><th>Updated</th></tr></thead><tbody id="taskTableBody">${taskRows(filtered)}</tbody></table></div>
    </div></article>`;
}

function taskStages(task) {
  const recurring = task.mode !== 'One-time';
  const labels = recurring ? ['G1 Defined','G2 Validated','G3 Designed','G4 Built','G5 QA','G6 Delivered','R1 Schedule','R2 Run','R3 Compare','R4 Monitor','R5 Revise'] : ['G1 Problem','G2 Data','G3 Design','G4 Analysis','G5 QA','G6 Delivery'];
  return `<div class="stage-row" style="grid-template-columns:repeat(${Math.min(labels.length,6)},minmax(0,1fr));flex-wrap:wrap">${labels.map((s,i)=>`<div class="stage ${i<3?'done':i===3?'current':''}"><strong>${s.split(' ')[0]}</strong><span>${s.substring(s.indexOf(' ')+1)}</span></div>`).join('')}</div>`;
}

function renderTaskDetail(taskId) {
  const task = tasks.find(t=>t.id===taskId) || tasks[0];
  state.selectedTask = task.id;
  const tabs = ['overview','requirements','data','plan','runs','experiments','models','qa','reports','history'];
  const labels = {overview:'Overview',requirements:'Requirements',data:'Data',plan:'Analysis Plan',runs:'Runs',experiments:'Experiments',models:'Models',qa:'QA',reports:'Reports',history:'History'};
  return `${pageHead(task.project,task.name,`${task.type} · ${task.mode} · owner ${task.owner}`,
    `<button class="button" data-page-jump="tasks">← All tasks</button><button class="button primary" data-open-modal="run">Run analysis</button>`)}
    <article class="card mb-14"><div class="card-body detail-summary"><div><div class="flex wrap">${stageBadge(task.stage)} ${statusBadge(task.status)} <span class="badge neutral">${task.mode}</span><span class="badge neutral">${task.type}</span></div><div class="mt-14">${taskStages(task)}</div></div><div class="small muted">Last updated<br><strong style="color:var(--text)">${task.updated}</strong></div></div></article>
    <article class="card"><div class="tabs">${tabs.map(t=>`<button class="tab ${state.taskTab===t?'is-active':''}" data-task-tab="${t}">${labels[t]}</button>`).join('')}</div><div class="card-body" id="taskTabPanel">${renderTaskTab(task,state.taskTab)}</div></article>`;
}

function renderTaskTab(task, tab) {
  const isRecurring = task.mode !== 'One-time';
  if (tab === 'overview') return `<div class="grid two"><div>
    <div class="eyebrow">Business objective</div><h3 style="margin:0 0 7px;font-size:15px">${task.id==='env-monthly'?'월별 환경 운영 데이터를 자동 분석하고 변화·이상·예측을 비교해 검토 가능한 보고서를 생성':'반복 분석 공수를 줄이면서 판단 근거를 추적 가능한 형태로 제공'}</h3>
    <p class="muted small">LLM은 분석계획·SQL/Python·설명을 제안하지만 실제 계산과 검증은 DB/DataFrame/ML 엔진이 수행합니다.</p>
    <dl class="definition-list mt-14"><div class="definition-row"><dt>Execution mode</dt><dd>${task.mode}</dd></div><div class="definition-row"><dt>Analysis mix</dt><dd>${task.type}</dd></div><div class="definition-row"><dt>Primary data</dt><dd>PostgreSQL analytics + monthly Parquet snapshot</dd></div><div class="definition-row"><dt>Output contract</dt><dd>analysis-plan/v1 · run-manifest/v1 · qa-result/v1</dd></div><div class="definition-row"><dt>AI provider policy</dt><dd>Local preferred · external provider blocked for protected data</dd></div></dl>
  </div><div class="grid"><div class="metric-grid"><div class="metric-box"><span>Last run</span><strong>PASS</strong><small>2026-09 synthetic run</small></div><div class="metric-box"><span>Review</span><strong>2</strong><small>human decisions pending</small></div><div class="metric-box"><span>Automation</span><strong>81%</strong><small>prototype estimate only</small></div></div>${chartBars([45,58,51,69,76,72])}</div></div>`;
  if (tab === 'requirements') return `<div class="grid two"><div><h3 class="card-title">G1 Requirement Spec</h3><dl class="definition-list"><div class="definition-row"><dt>Decision</dt><dd>월별 운영 변화와 이상 요인을 담당자가 빠르게 확인</dd></div><div class="definition-row"><dt>Scope</dt><dd>Previous month vs trailing 12 months</dd></div><div class="definition-row"><dt>Deliverables</dt><dd>Trend table, anomaly list, forecast, review report</dd></div><div class="definition-row"><dt>Exclusions</dt><dd>자동 외부 배포, 자동 모델 활성화</dd></div><div class="definition-row"><dt>Unknowns</dt><dd>Facility B maintenance calendar mapping</dd></div></dl></div><div class="prototype-label">Top-level sections are schema-controlled. LLM may fill rationale/notes, but cannot invent the artifact shape.</div></div>`;
  if (tab === 'data') return `<div class="grid two"><div><div class="card-title">Data quality summary</div><div class="metric-grid mt-10"><div class="metric-box"><span>Rows</span><strong>8.4M</strong><small>prototype sample</small></div><div class="metric-box"><span>Null flags</span><strong>2</strong><small>non-blocking</small></div><div class="metric-box"><span>Orphans</span><strong>0</strong><small>relationship check</small></div></div><div class="table-wrap mt-14"><table><thead><tr><th>Check</th><th>Result</th><th>Note</th></tr></thead><tbody><tr><td>Date coverage</td><td>${statusBadge('healthy')}</td><td>2024-01 → 2026-08</td></tr><tr><td>Duplicate grain</td><td>${statusBadge('healthy')}</td><td>0.01% reviewed</td></tr><tr><td>Missing facility code</td><td>${statusBadge('review')}</td><td>42 rows</td></tr><tr><td>Distribution drift</td><td>${statusBadge('healthy')}</td><td>Within policy</td></tr></tbody></table></div></div><div><div class="card-title">Source lineage</div><div class="code-block mt-10">source: analytics_monthly
snapshot: 2026-08
schema_version: 4
read_only: true
row_limit_policy: enforced
query_timeout: 30s
sensitive_fields: masked</div></div></div>`;
  if (tab === 'plan') return `<div class="grid two"><div><div class="card-title">Analysis Plan / v7</div><dl class="definition-list mt-10"><div class="definition-row"><dt>Metrics</dt><dd>Monthly average, peak, YoY/MoM, anomaly count</dd></div><div class="definition-row"><dt>Statistics</dt><dd>Trend decomposition + robust z-score</dd></div><div class="definition-row"><dt>ML baseline</dt><dd>Seasonal naive</dd></div><div class="definition-row"><dt>Candidate</dt><dd>LightGBM regression</dd></div><div class="definition-row"><dt>Validation</dt><dd>Rolling-window backtest</dd></div><div class="definition-row"><dt>Approval</dt><dd>Metric changes require analyst approval</dd></div></dl></div><div><div class="card-title">Pipeline</div><div class="code-block mt-10">refresh_data
  → quality_gate
  → statistical_recipe
  → feature_recipe
  → score_active_model
  → detect_drift
  → compare_previous_run
  → generate_report
  → human_review</div></div></div>`;
  if (tab === 'runs') return `<div class="table-wrap"><table><thead><tr><th>Run</th><th>Window</th><th>Pipeline</th><th>Model</th><th>QA</th><th>Review</th><th>Duration</th></tr></thead><tbody>${['2026-09','2026-08','2026-07','2026-06'].map((m,i)=>`<tr><td><strong>RUN-${241-i}</strong></td><td>${m}</td><td>v7</td><td>forecast-v3</td><td><span class="badge ok">PASS</span></td><td>${i===0?'<span class="badge warn">Pending</span>':'<span class="badge ok">Approved</span>'}</td><td>${6+i}m ${12+i*4}s</td></tr>`).join('')}</tbody></table></div>`;
  if (tab === 'experiments') return `<div class="grid three"><div class="model-card"><div class="model-head"><div><strong>Seasonal naive</strong><small>Baseline · EXP-031</small></div><span class="badge neutral">Baseline</span></div><div class="model-metrics"><div><span>MAPE</span><strong>14.8%</strong></div><div><span>MAE</span><strong>8.2</strong></div><div><span>Train</span><strong>—</strong></div></div></div><div class="model-card"><div class="model-head"><div><strong>LightGBM v3</strong><small>Candidate · EXP-036</small></div><span class="badge ok">Recommended</span></div><div class="model-metrics"><div><span>MAPE</span><strong>9.7%</strong></div><div><span>MAE</span><strong>5.1</strong></div><div><span>Train</span><strong>42s</strong></div></div></div><div class="model-card"><div class="model-head"><div><strong>Random Forest</strong><small>Candidate · EXP-034</small></div><span class="badge neutral">Compared</span></div><div class="model-metrics"><div><span>MAPE</span><strong>11.6%</strong></div><div><span>MAE</span><strong>6.4</strong></div><div><span>Train</span><strong>55s</strong></div></div></div></div><div class="prototype-label mt-14">Sample metrics illustrate the comparison UX only. Real model metrics will be populated by experiment artifacts.</div>`;
  if (tab === 'models') return `<div class="table-wrap"><table><thead><tr><th>Version</th><th>Algorithm</th><th>Training data</th><th>Metric</th><th>Status</th><th>Action</th></tr></thead><tbody><tr><td>forecast-v3</td><td>LightGBM</td><td>snapshot-2026-07</td><td>MAPE 9.7%</td><td><span class="badge ok">ACTIVE</span></td><td><button class="button sm" data-toast="Active model details opened">Inspect</button></td></tr><tr><td>forecast-v4</td><td>LightGBM</td><td>snapshot-2026-08</td><td>MAPE 9.3%</td><td><span class="badge warn">CANDIDATE</span></td><td><button class="button sm" data-open-modal="activate-model">Review activation</button></td></tr><tr><td>forecast-v2</td><td>Random Forest</td><td>snapshot-2026-05</td><td>MAPE 11.6%</td><td><span class="badge neutral">RETIRED</span></td><td>—</td></tr></tbody></table></div>`;
  if (tab === 'qa') return `<div class="grid two"><div><div class="card-title">Quality gates</div><div class="table-wrap mt-10"><table><thead><tr><th>Gate</th><th>Result</th></tr></thead><tbody><tr><td>Data snapshot identified</td><td><span class="badge ok">PASS</span></td></tr><tr><td>Aggregate reconciliation</td><td><span class="badge ok">PASS</span></td></tr><tr><td>Baseline comparison</td><td><span class="badge ok">PASS</span></td></tr><tr><td>Feature leakage check</td><td><span class="badge ok">PASS</span></td></tr><tr><td>Unsupported claim check</td><td><span class="badge warn">2 REVIEW</span></td></tr></tbody></table></div></div><div><div class="card-title">Review queue</div><div class="action-list mt-10"><div class="action-item"><span class="status-dot status-warn"></span><div class="action-copy"><strong>Facility B anomaly explanation</strong><span>Evidence requires analyst judgment</span></div><button class="button sm" data-toast="Review item opened">Review</button></div><div class="action-item"><span class="status-dot status-warn"></span><div class="action-copy"><strong>Forecast deviation note</strong><span>Report narrative needs confirmation</span></div><button class="button sm" data-toast="Review item opened">Review</button></div></div></div></div>`;
  if (tab === 'reports') return `<div class="grid three"><div class="model-card"><div class="model-head"><div><strong>Monthly operations report</strong><small>HTML · generated from run artifact</small></div><span class="badge warn">Draft</span></div><button class="button sm" data-toast="Report preview opened">Preview</button></div><div class="model-card"><div class="model-head"><div><strong>Metric appendix</strong><small>XLSX export contract</small></div><span class="badge ok">Ready</span></div><button class="button sm" data-toast="Export simulated">Export</button></div><div class="model-card"><div class="model-head"><div><strong>Run manifest</strong><small>JSON · reproducibility evidence</small></div><span class="badge ok">Ready</span></div><button class="button sm" data-toast="Manifest inspected">Inspect</button></div></div>`;
  if (tab === 'history') return `<div class="timeline-list"><div class="timeline-item"><div class="timeline-time">Today 09:42</div><div class="timeline-node"></div><div class="timeline-content"><strong>RUN-241 completed</strong><span>Pipeline v7 · QA PASS · review pending</span></div></div><div class="timeline-item"><div class="timeline-time">Yesterday</div><div class="timeline-node"></div><div class="timeline-content"><strong>Model candidate forecast-v4 registered</strong><span>Activation not automatic</span></div></div><div class="timeline-item"><div class="timeline-time">Aug 28</div><div class="timeline-node"></div><div class="timeline-content"><strong>Metric definition updated</strong><span>Analyst approved · version 3 → 4</span></div></div></div>`;
  return `<div class="empty-state"><strong>Section ready</strong><span>Publishing content is being refined.</span></div>`;
}

function renderRecurring() {
  return `${pageHead('Scheduled analysis','Recurring Analysis','월별·일별 과제를 자동 실행하고 이전 결과, 데이터 변화, 모델 상태를 비교합니다.', `<button class="button primary" data-open-modal="schedule">+ Schedule</button>`)}
  <div class="grid two"><div class="grid">
    <article class="card"><header class="card-head"><div><div class="card-title">Scheduled pipelines</div><div class="card-subtitle">실행 주기와 최근 run 상태</div></div></header><div class="card-body grid">
      <div class="schedule-card"><div class="schedule-head"><div><div class="schedule-name">Environmental monthly operations</div><div class="schedule-meta">Every month · day 3 · 01:00 Asia/Seoul</div></div><span class="badge ok">Enabled</span></div><div class="run-strip"><div class="run-dot">Mar ✓</div><div class="run-dot">Apr ✓</div><div class="run-dot">May ✓</div><div class="run-dot">Jun ✓</div><div class="run-dot warn">Jul !</div><div class="run-dot">Aug ✓</div></div><div class="flex space-between"><span class="small muted">Next: Oct 03, 01:00</span><button class="button sm" data-task-id="env-monthly">Open task</button></div></div>
      <div class="schedule-card"><div class="schedule-head"><div><div class="schedule-name">Facility anomaly scoring</div><div class="schedule-meta">Daily · 02:00 Asia/Seoul</div></div><span class="badge ok">Enabled</span></div><div class="run-strip"><div class="run-dot">D-5 ✓</div><div class="run-dot">D-4 ✓</div><div class="run-dot">D-3 ✓</div><div class="run-dot">D-2 ✓</div><div class="run-dot warn">D-1 12</div><div class="run-dot">Today ✓</div></div><div class="flex space-between"><span class="small muted">12 anomalies require review</span><button class="button sm" data-task-id="env-anomaly">Inspect</button></div></div>
      <div class="schedule-card"><div class="schedule-head"><div><div class="schedule-name">Document extraction regression</div><div class="schedule-meta">Weekly · Monday 03:30</div></div><span class="badge ok">Enabled</span></div><div class="run-strip"><div class="run-dot">W-5 ✓</div><div class="run-dot">W-4 ✓</div><div class="run-dot">W-3 ✓</div><div class="run-dot">W-2 ✓</div><div class="run-dot">W-1 ✓</div><div class="run-dot">Now ✓</div></div></div>
    </div></article>
  </div><div class="grid">
    <article class="card"><header class="card-head"><div><div class="card-title">Run comparison</div><div class="card-subtitle">현재 월과 이전 월의 주요 변화</div></div><span class="badge neutral">Aug vs Jul</span></header><div class="card-body"><div class="metric-grid"><div class="metric-box"><span>Average index</span><strong>72.4</strong><small>↑ 4.1% MoM</small></div><div class="metric-box"><span>Anomalies</span><strong>12</strong><small>previous 8</small></div><div class="metric-box"><span>Forecast error</span><strong>9.7%</strong><small>previous 10.2%</small></div></div><div class="mt-14">${lineChart([[0,64],[20,60],[40,57],[60,54],[80,52],[100,50]])}</div></div></article>
    <article class="card"><header class="card-head"><div><div class="card-title">Monitoring & retraining policy</div><div class="card-subtitle">정기 실행과 모델 재학습은 별개의 승인 흐름</div></div></header><div class="card-body"><div class="action-list"><div class="action-item"><span class="status-dot status-ok"></span><div class="action-copy"><strong>Data drift</strong><span>PSI and distribution checks within prototype policy</span></div><span class="badge ok">Normal</span></div><div class="action-item"><span class="status-dot status-ok"></span><div class="action-copy"><strong>Model performance</strong><span>No degradation trigger</span></div><span class="badge ok">Healthy</span></div><div class="action-item"><span class="status-dot status-warn"></span><div class="action-copy"><strong>Retraining candidate</strong><span>forecast-v4 is better in synthetic comparison</span></div><button class="button sm" data-open-modal="activate-model">Review</button></div></div></div></article>
  </div></div>`;
}

function renderModels() {
  return `${pageHead('ML lifecycle','Experiments & Models','복잡한 모델 자체보다 baseline 비교, 재현 가능한 실험, 활성 모델 승인 흐름을 우선합니다.', `<button class="button" data-toast="Experiment template opened">+ Experiment</button><button class="button primary" data-open-modal="activate-model">Review candidate</button>`)}
  <div class="grid three">
    <div class="model-card"><div class="model-head"><div><strong>forecast-v3</strong><small>LightGBM · Environmental monthly</small></div><span class="badge ok">ACTIVE</span></div><div class="model-metrics"><div><span>MAPE</span><strong>9.7%</strong></div><div><span>Data</span><strong>v18</strong></div><div><span>Feature</span><strong>v5</strong></div></div></div>
    <div class="model-card"><div class="model-head"><div><strong>forecast-v4</strong><small>LightGBM · Candidate</small></div><span class="badge warn">CANDIDATE</span></div><div class="model-metrics"><div><span>MAPE</span><strong>9.3%</strong></div><div><span>Data</span><strong>v19</strong></div><div><span>Feature</span><strong>v5</strong></div></div></div>
    <div class="model-card"><div class="model-head"><div><strong>anomaly-v4</strong><small>Isolation Forest · Facility scoring</small></div><span class="badge ok">ACTIVE</span></div><div class="model-metrics"><div><span>Review P</span><strong>78%</strong></div><div><span>Data</span><strong>v12</strong></div><div><span>Feature</span><strong>v7</strong></div></div></div>
  </div>
  <article class="card mt-14"><header class="card-head"><div><div class="card-title">Experiment comparison</div><div class="card-subtitle">모든 후보는 baseline과 현재 활성 모델을 함께 비교</div></div></header><div class="table-wrap"><table><thead><tr><th>Experiment</th><th>Problem</th><th>Algorithm</th><th>Baseline</th><th>Candidate metric</th><th>Decision</th></tr></thead><tbody><tr><td>EXP-036</td><td>Forecasting</td><td>LightGBM</td><td>14.8% MAPE</td><td>9.3% MAPE</td><td><span class="badge warn">Review</span></td></tr><tr><td>EXP-035</td><td>Forecasting</td><td>XGBoost</td><td>14.8% MAPE</td><td>10.1% MAPE</td><td><span class="badge neutral">Compared</span></td></tr><tr><td>EXP-028</td><td>Anomaly</td><td>Isolation Forest</td><td>Rule-based</td><td>78% analyst precision</td><td><span class="badge ok">Activated</span></td></tr></tbody></table></div></article>`;
}

function renderData() {
  const connectors = [
    ['OR','Oracle','Enterprise RDBMS','Connected'],['PG','PostgreSQL','Analytics database','Connected'],['TI','Tibero','Enterprise JDBC','Available'],['MY','MySQL / MariaDB','Relational database','Available'],['CS','CSV / XLSX','Uploaded files','Ready'],['PQ','Parquet','Columnar file','Ready'],['HV','Hive','Existing big-data source','Later'],['DC','Documents','PDF / HWP / DOCX','Ready']
  ];
  return `${pageHead('Data layer','Data Sources','정형 데이터는 SQL/DataFrame 엔진으로, 문서는 extraction/search pipeline으로 역할을 분리합니다.', `<button class="button primary" data-open-modal="datasource">+ Data source</button>`)}
  <div class="connector-grid">${connectors.map(([icon,name,desc,status])=>`<div class="connector-card"><div><div class="connector-icon">${icon}</div><strong>${name}</strong><p>${desc}</p></div><div class="flex space-between"><span class="badge ${status==='Connected'||status==='Ready'?'ok':'neutral'}">${status}</span><button class="button sm" data-toast="${name} settings opened">Configure</button></div></div>`).join('')}</div>
  <article class="card mt-14"><header class="card-head"><div><div class="card-title">Data profiling</div><div class="card-subtitle">연결 후 G2 검증 항목을 자동 수행</div></div><button class="button sm" data-toast="Profiling run simulated">Run profile</button></header><div class="card-body"><div class="metric-grid"><div class="metric-box"><span>Tables</span><strong>43</strong><small>discovered</small></div><div class="metric-box"><span>Columns</span><strong>582</strong><small>schema metadata</small></div><div class="metric-box"><span>Relations</span><strong>21</strong><small>candidate links</small></div></div><div class="table-wrap mt-14"><table><thead><tr><th>Automated check</th><th>Purpose</th><th>Result</th></tr></thead><tbody><tr><td>PK / candidate key</td><td>grain validation</td><td><span class="badge ok">18 identified</span></td></tr><tr><td>NULL / duplicate</td><td>quality gate</td><td><span class="badge warn">2 warnings</span></td></tr><tr><td>Date coverage</td><td>analysis window</td><td><span class="badge ok">Complete</span></td></tr><tr><td>Orphan relationship</td><td>referential quality</td><td><span class="badge ok">0 blocking</span></td></tr><tr><td>Distribution</td><td>code/outlier/drift</td><td><span class="badge ok">Profiled</span></td></tr></tbody></table></div></div></article>`;
}

function renderEvidence() {
  return `${pageHead('Explainable analysis','Evidence & Evaluation','답변이 어떤 원본 근거·검색 단계·모델 버전에서 나왔는지 되짚고, 품질을 반복 측정합니다.', `<button class="button" id="runEvalButton">Run mini-eval</button><button class="button primary" data-toast="Synthetic PDF upload flow opened">Upload document</button>`)}
  <div class="prototype-label mb-14">문서·랭킹·평가 수치는 화면 설계 확인용 sample입니다. 실제 vertical slice 구현 후 golden dataset에서 측정한 값으로 교체합니다.</div>
  <div class="grid evidence-grid">
    <div class="grid">
      <article class="card"><header class="card-head"><div><div class="card-title">Provenance & sovereignty</div><div class="card-subtitle">원본부터 답변까지 고정된 lineage</div></div><span class="badge ok">Egress blocked</span></header><div class="card-body"><dl class="definition-list"><div class="definition-row"><dt>Document SHA-256</dt><dd>7a19…e42b</dd></div><div class="definition-row"><dt>Parser</dt><dd>text-layer-parser / v0.1</dd></div><div class="definition-row"><dt>Index</dt><dd>IDX-2026-09-003</dd></div><div class="definition-row"><dt>Embedding</dt><dd>local-embedding / profile A</dd></div><div class="definition-row"><dt>Reranker</dt><dd>local-cross-encoder / profile A</dd></div><div class="definition-row"><dt>Response contract</dt><dd>citation-answer/v1</dd></div></dl></div></article>
      <article class="card"><header class="card-head"><div><div class="card-title">Grounded answer</div><div class="card-subtitle">인용을 클릭하면 원본 위치가 강조됩니다.</div></div></header><div class="card-body answer-panel"><div class="answer-box">2025년 3분기 운영지표는 전년 동기 대비 증가했으며, 가장 큰 변동은 Facility B에서 발생했습니다. <button class="citation" data-citation="1">Chunk 12 · p.2</button> 월간 평균은 72.4로 집계되었고 전월 대비 4.1% 증가한 것으로 계산되었습니다. <button class="citation" data-citation="2">Chunk 14 · p.2</button><br><br><strong>근거가 없는 항목:</strong> 원문에는 설비 교체 비용의 확정치가 없어 해당 값은 답변하지 않습니다.</div><div class="rank-list"><div class="rank-row"><strong>#1</strong><span>Chunk 12 · Facility trend paragraph</span><span>RRF .031</span><span>Vec .84</span><span>Rerank .91</span></div><div class="rank-row"><strong>#2</strong><span>Chunk 14 · Monthly KPI table</span><span>RRF .029</span><span>Vec .81</span><span>Rerank .88</span></div><div class="rank-row"><strong>#3</strong><span>Chunk 09 · Maintenance note</span><span>RRF .025</span><span>Vec .75</span><span>Rerank .63</span></div></div></div></article>
      <article class="card"><header class="card-head"><div><div class="card-title">Evaluation gate</div><div class="card-subtitle">Golden QA 기반 회귀 평가</div></div><span class="badge ${state.evalRun?'ok':'neutral'}">${state.evalRun?'Sample run complete':'Not run'}</span></header><div class="card-body"><div class="eval-gauges"><div class="eval-box"><span>Hit@5</span><strong>${state.evalRun?'83%':'—'}</strong></div><div class="eval-box"><span>MRR@5</span><strong>${state.evalRun?'.76':'—'}</strong></div><div class="eval-box"><span>Citation precision</span><strong>${state.evalRun?'88%':'—'}</strong></div><div class="eval-box"><span>Negative refusal</span><strong>${state.evalRun?'80%':'—'}</strong></div></div></div></article>
    </div>
    <article class="card"><header class="card-head"><div><div class="card-title">Source evidence</div><div class="card-subtitle">PDF page / bbox inspection view</div></div><span class="badge neutral">Page 2 / 5</span></header><div class="card-body"><div class="evidence-viewer"><div class="pdf-page" id="pdfPage"><h3>Environmental Operations Summary — Q3</h3><p>This synthetic public-style document is included only to demonstrate the planned evidence inspection experience. Values below do not represent an actual customer or organization.</p><table class="pdf-table"><thead><tr><th>Facility</th><th>Monthly avg.</th><th>MoM</th><th>Anomaly cases</th></tr></thead><tbody><tr><td>A</td><td>64.8</td><td>+1.2%</td><td>2</td></tr><tr><td>B</td><td>81.7</td><td>+8.6%</td><td>7</td></tr><tr><td>C</td><td>70.6</td><td>+3.0%</td><td>3</td></tr></tbody></table><p>Facility B showed the largest month-over-month change during the selected period. The review workflow flagged the change for analyst confirmation rather than automatically concluding its cause.</p><p>The combined monthly indicator was calculated as 72.4 for the current period, a 4.1% increase from the prior month in this synthetic example.</p><div class="bbox-highlight" id="bbox1" style="left:9%;top:45%;width:82%;height:22%"></div><div class="bbox-highlight" id="bbox2" style="left:9%;top:70%;width:82%;height:12%"></div></div></div></div></article>
  </div>`;
}

function renderProviders() {
  const providers = [
    ['LO','Local Open-weight','Managed local model endpoint','Organization','Available','ok'],
    ['AG','Personal AGY','User-owned agent credential profile','Personal','Connected','ok'],
    ['CL','Personal Claude Code','User-owned coding agent profile','Personal','Connected','ok'],
    ['CX','Personal Codex','User-owned coding agent profile','Personal','Quota blocked','warn'],
    ['API','Commercial LLM API','Connected-zone provider adapter','Personal / Org','Policy controlled','info'],
  ];
  return `${pageHead('Identity & routing','AI Accounts & Providers','사용자는 자신의 credential profile을 바꿀 수 있지만, 실제 실행 가능 여부는 데이터 분류·네트워크 모드·provider capability 정책이 함께 결정합니다.', `<button class="button primary" data-open-modal="provider">+ Add profile</button>`)}
  <article class="card"><header class="card-head"><div><div class="card-title">My AI profiles</div><div class="card-subtitle">Secret value는 등록 이후 UI·로그·산출물에 다시 표시하지 않습니다.</div></div></header><div>
    ${providers.map(([logo,name,desc,scope,status,cls])=>`<div class="provider-row"><div class="provider-logo">${logo}</div><div class="provider-name"><strong>${name}</strong><span>${desc}</span></div><div class="provider-meta">${scope}</div><div><span class="badge ${cls}">${status}</span></div><button class="button sm" data-toast="${name} profile settings opened">Manage</button></div>`).join('')}
  </div></article>
  <div class="grid two mt-14"><article class="card"><header class="card-head"><div><div class="card-title">Routing policy</div><div class="card-subtitle">사용자 선택보다 보안정책이 우선</div></div></header><div class="card-body"><div class="code-block">task requirement
+ network mode
+ data classification
+ provider capability
+ selected user profile
+ organization policy
= final provider routing</div><div class="prototype-label mt-10">Protected / restricted data → external provider is rejected, not silently substituted.</div></div></article><article class="card"><header class="card-head"><div><div class="card-title">Current defaults</div><div class="card-subtitle">새 실행에 적용되는 사용자 기본값</div></div></header><div class="card-body"><dl class="definition-list"><div class="definition-row"><dt>Analysis LLM</dt><dd>Local Analysis / Open-weight</dd></div><div class="definition-row"><dt>Code agent</dt><dd>Personal AGY</dd></div><div class="definition-row"><dt>Embedding</dt><dd>Organization local profile</dd></div><div class="definition-row"><dt>Restricted data</dt><dd>Local-only enforced</dd></div></dl></div></article></div>`;
}

function renderCurrent() {
  const root = document.getElementById('pageRoot');
  const breadcrumb = document.getElementById('breadcrumb');
  let html = '';
  if (state.page === 'dashboard') { html = renderDashboard(); breadcrumb.textContent = 'Control Center'; }
  else if (state.page === 'projects') { html = renderProjects(); breadcrumb.textContent = 'Projects'; }
  else if (state.page === 'tasks') { html = renderTasks(); breadcrumb.textContent = 'Analysis Tasks'; }
  else if (state.page === 'task-detail') { const task = tasks.find(t=>t.id===state.selectedTask); html = renderTaskDetail(state.selectedTask); breadcrumb.textContent = `Analysis Tasks / ${task?.name || ''}`; }
  else if (state.page === 'recurring') { html = renderRecurring(); breadcrumb.textContent = 'Recurring Analysis'; }
  else if (state.page === 'models') { html = renderModels(); breadcrumb.textContent = 'Experiments & Models'; }
  else if (state.page === 'data') { html = renderData(); breadcrumb.textContent = 'Data Sources'; }
  else if (state.page === 'evidence') { html = renderEvidence(); breadcrumb.textContent = 'Evidence & Evaluation'; }
  else if (state.page === 'providers') { html = renderProviders(); breadcrumb.textContent = 'AI Accounts & Providers'; }
  root.innerHTML = html;
  root.focus({preventScroll:true});
  bindDynamic();
}

function openModal(type) {
  const backdrop = document.getElementById('modalBackdrop');
  const eyebrow = document.getElementById('modalEyebrow');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  const footer = document.getElementById('modalFooter');
  const templates = {
    task: ['Create','New analysis task',`<div class="form-grid"><div class="field full"><label>Task name</label><input placeholder="e.g. Monthly demand forecast" /></div><div class="field"><label>Project</label><select><option>Environmental Monthly Analysis</option><option>District Heating Analytics</option><option>Cable Materials Research</option></select></div><div class="field"><label>Execution mode</label><select><option>One-time</option><option>Daily</option><option>Weekly</option><option>Monthly</option></select></div><div class="field"><label>Primary analysis</label><select><option>Statistical / BI</option><option>Machine Learning</option><option>Generative AI</option><option>Mixed</option></select></div><div class="field"><label>Approval policy</label><select><option>Human review required</option><option>Auto-run, review on exception</option></select></div><div class="field full"><label>Objective</label><textarea placeholder="이 과제가 어떤 의사결정을 지원해야 하는지 작성"></textarea></div></div>`],
    project: ['Create','New project',`<div class="form-grid"><div class="field full"><label>Project name</label><input placeholder="Public Analytics Project" /></div><div class="field"><label>Deployment mode</label><select><option>Restricted network</option><option>Connected</option><option>Air-gapped target</option></select></div><div class="field"><label>Default AI routing</label><select><option>Local preferred</option><option>Policy based</option></select></div><div class="field full"><label>Description</label><textarea></textarea></div></div>`],
    schedule: ['Schedule','Create recurring analysis',`<div class="form-grid"><div class="field full"><label>Analysis task</label><select><option>Environmental monthly operations</option></select></div><div class="field"><label>Frequency</label><select><option>Monthly</option><option>Weekly</option><option>Daily</option></select></div><div class="field"><label>Data window</label><select><option>Previous month</option><option>Previous day</option><option>Trailing 30 days</option></select></div><div class="field"><label>Run time</label><input value="01:00" /></div><div class="field"><label>Timezone</label><select><option>Asia/Seoul</option></select></div><div class="field full"><label>After run</label><select><option>QA → compare → report → analyst review</option></select></div></div>`],
    provider: ['Account','Add AI credential profile',`<div class="prototype-label">Publishing prototype에서는 실제 secret을 수집하지 않습니다. 구현 시 저장 후 secret value를 다시 조회할 수 없게 설계합니다.</div><div class="form-grid mt-14"><div class="field"><label>Provider</label><select><option>AGY</option><option>Claude Code</option><option>Codex</option><option>Commercial API</option><option>Local endpoint</option></select></div><div class="field"><label>Profile label</label><input placeholder="Personal profile A" /></div><div class="field full"><label>Authentication method</label><select><option>Provider-supported login / token</option><option>API key</option><option>Local endpoint</option></select></div></div>`],
    datasource: ['Data','Add data source',`<div class="form-grid"><div class="field"><label>Connector</label><select><option>PostgreSQL</option><option>Oracle</option><option>Tibero</option><option>MySQL</option><option>File</option></select></div><div class="field"><label>Access mode</label><select><option>Read-only</option></select></div><div class="field full"><label>Connection label</label><input placeholder="analytics-readonly" /></div><div class="field full"><label>Security</label><div class="prototype-label">Credentials are stored outside analysis artifacts. Query timeout, row limits and read-only validation are mandatory.</div></div></div>`],
    run: ['Execute','Run analysis',`<div class="form-grid"><div class="field full"><label>Pipeline</label><select><option>v7 · current approved pipeline</option></select></div><div class="field"><label>Data window</label><select><option>Previous month</option><option>Custom window</option></select></div><div class="field"><label>AI profile</label><select><option>Local Analysis / Open-weight</option><option>Personal AGY</option></select></div><div class="field full"><label>Run policy</label><div class="prototype-label">Execution produces a fixed Run Manifest and cannot silently change model/provider after start.</div></div></div>`],
    'activate-model': ['Model governance','Review model activation',`<div class="prototype-label">Synthetic comparison only. Activation is never automatic in this publishing prototype.</div><div class="grid three mt-14"><div class="metric-box"><span>Current v3</span><strong>9.7%</strong><small>MAPE</small></div><div class="metric-box"><span>Candidate v4</span><strong>9.3%</strong><small>MAPE</small></div><div class="metric-box"><span>Drift</span><strong>Normal</strong><small>current window</small></div></div><div class="field mt-14"><label>Decision note</label><textarea placeholder="승인/보류 근거"></textarea></div>`],
    network: ['Security','Network & egress policy',`<dl class="definition-list"><div class="definition-row"><dt>Mode</dt><dd>Restricted Network</dd></div><div class="definition-row"><dt>External LLM</dt><dd>Blocked for protected tasks</dd></div><div class="definition-row"><dt>Local model</dt><dd>Allowed</dd></div><div class="definition-row"><dt>Audit</dt><dd>Provider profile + model + request purpose recorded</dd></div><div class="definition-row"><dt>Claim policy</dt><dd>Do not claim zero-egress until runtime verification exists</dd></div></dl>`]
  };
  const [e,t,b] = templates[type] || ['Details','Prototype action','<p>Publishing interaction placeholder.</p>'];
  eyebrow.textContent = e; title.textContent = t; body.innerHTML = b;
  footer.innerHTML = `<button class="button" id="modalCancel">Cancel</button><button class="button primary" id="modalConfirm">${type==='activate-model'?'Approve candidate':'Save draft'}</button>`;
  backdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('modalCancel').onclick = closeModal;
  document.getElementById('modalConfirm').onclick = () => { closeModal(); toast(type==='activate-model'?'Prototype approval recorded locally':'Prototype draft action completed'); };
}

function closeModal() {
  document.getElementById('modalBackdrop').hidden = true;
  document.body.style.overflow = '';
}

function toast(message) {
  const region = document.getElementById('toastRegion');
  const el = document.createElement('div');
  el.className = 'toast'; el.textContent = message; region.appendChild(el);
  setTimeout(()=>el.remove(), 3200);
}

function selectNav(page) {
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('is-active', n.dataset.page===page));
}

function goPage(page) {
  state.page = page;
  if (page !== 'task-detail') selectNav(page);
  document.getElementById('sidebar').classList.remove('is-open');
  renderCurrent();
}

function openTask(id) {
  state.selectedTask = id;
  state.taskTab = 'overview';
  state.page = 'task-detail';
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('is-active', n.dataset.page==='tasks'));
  renderCurrent();
}

function bindDynamic() {
  document.querySelectorAll('[data-page-jump]').forEach(el=>el.addEventListener('click',()=>goPage(el.dataset.pageJump)));
  document.querySelectorAll('[data-task-id]').forEach(el=>el.addEventListener('click',(e)=>{ if(e.target.closest('button') && e.currentTarget!==e.target.closest('button')) return; openTask(el.dataset.taskId); }));
  document.querySelectorAll('[data-open-modal]').forEach(el=>el.addEventListener('click',()=>openModal(el.dataset.openModal)));
  document.querySelectorAll('[data-toast]').forEach(el=>el.addEventListener('click',()=>toast(el.dataset.toast)));
  document.querySelectorAll('[data-task-tab]').forEach(el=>el.addEventListener('click',()=>{ state.taskTab=el.dataset.taskTab; document.querySelectorAll('[data-task-tab]').forEach(t=>t.classList.toggle('is-active',t===el)); document.getElementById('taskTabPanel').innerHTML=renderTaskTab(tasks.find(t=>t.id===state.selectedTask),state.taskTab); bindDynamic(); }));
  const filter = document.getElementById('taskFilter');
  if(filter) { filter.value=state.taskFilter; filter.onchange=()=>{ state.taskFilter=filter.value; renderCurrent(); }; }
  const search = document.getElementById('taskSearch');
  if(search) search.oninput=()=>{ const q=search.value.toLowerCase(); document.getElementById('taskTableBody').innerHTML=taskRows(tasks.filter(t=>`${t.name} ${t.project} ${t.type}`.toLowerCase().includes(q))); bindDynamic(); };
  document.querySelectorAll('[data-citation]').forEach(el=>el.addEventListener('click',()=>{ document.querySelectorAll('.bbox-highlight').forEach(b=>b.classList.remove('is-visible')); document.getElementById(`bbox${el.dataset.citation}`)?.classList.add('is-visible'); toast(`Source evidence highlighted for ${el.textContent.trim()}`); }));
  const evalBtn=document.getElementById('runEvalButton'); if(evalBtn) evalBtn.onclick=()=>{ state.evalRun=true; renderCurrent(); toast('Synthetic mini-eval completed · values are illustrative'); };
}

document.querySelectorAll('.nav-item').forEach(item=>item.addEventListener('click',()=>goPage(item.dataset.page)));
document.getElementById('mobileMenu').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('is-open'));
document.getElementById('modalClose').addEventListener('click',closeModal);
document.getElementById('modalBackdrop').addEventListener('click',(e)=>{ if(e.target.id==='modalBackdrop') closeModal(); });
document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') { closeModal(); document.getElementById('sidebar').classList.remove('is-open'); } });
document.getElementById('globalProfile').addEventListener('change',(e)=>toast(`AI profile changed for new executions: ${e.target.value}`));
document.getElementById('notificationButton').addEventListener('click',()=>toast('3 items require analyst review'));
document.getElementById('workspaceSwitcher').addEventListener('click',()=>toast('Single workspace in this publishing build'));

renderCurrent();
