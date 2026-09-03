// Publishing extensions that keep product concepts visible before backend contracts exist.
// Loaded after app.js and intentionally depends only on the existing static prototype runtime.

const baseRenderCurrent = renderCurrent;
const baseRenderTaskDetail = renderTaskDetail;
const baseRenderTaskTab = renderTaskTab;

function renderRecipes() {
  const recipes = [
    { id: 'monthly-trend', name: 'Monthly Trend & Change', type: 'Statistical', version: 'v3', status: 'Validated', use: 8, inputs: 'date, dimension, metric, comparison' },
    { id: 'top-n', name: 'Top-N Contribution', type: 'BI', version: 'v2', status: 'Validated', use: 6, inputs: 'dimension, metric, top_n, period' },
    { id: 'data-profile', name: 'Data Quality Profile', type: 'Quality', version: 'v4', status: 'Validated', use: 11, inputs: 'source, grain, date_column, key candidates' },
    { id: 'forecast-baseline', name: 'Forecast Baseline Pack', type: 'ML · Forecast', version: 'v2', status: 'Validated', use: 4, inputs: 'target, horizon, cadence, split policy' },
    { id: 'anomaly-detection', name: 'Anomaly Detection Review', type: 'ML · Anomaly', version: 'v3', status: 'Validated', use: 5, inputs: 'features, threshold policy, review labels' },
    { id: 'document-evidence', name: 'Document Evidence Retrieval', type: 'RAG', version: 'v1', status: 'Draft', use: 2, inputs: 'document set, query, top_k, citation policy' },
  ];

  return `${pageHead('Reusable analysis assets','Analysis Recipes','한 번 검증한 분석 절차는 다시 생성하지 않고 버전이 있는 Recipe로 재사용합니다. LLM은 파라미터와 예외를 제안하지만 구조는 플랫폼이 소유합니다.', `<button class="button primary" data-toast="Recipe creation workflow will be backed by a validated pipeline contract">+ New recipe</button>`)}
  <div class="prototype-label mb-14">현재 Recipe 내용과 사용 횟수는 UI 검토용 synthetic data입니다. 실제 구현에서는 recipe-spec과 pipeline version이 source of truth가 됩니다.</div>
  <div class="grid three">
    ${recipes.map(r=>`<article class="card"><div class="card-body">
      <div class="flex space-between"><span class="badge ${r.status==='Validated'?'ok':'warn'}">${r.status}</span><span class="badge neutral">${r.version}</span></div>
      <h3 style="margin:12px 0 3px;font-size:14px">${r.name}</h3>
      <div class="small muted">${r.type}</div>
      <dl class="definition-list mt-14"><div class="definition-row"><dt>Inputs</dt><dd>${r.inputs}</dd></div><div class="definition-row"><dt>Used by</dt><dd>${r.use} analysis tasks</dd></div><div class="definition-row"><dt>Execution</dt><dd>Version-pinned · deterministic core</dd></div></dl>
      <div class="flex space-between mt-10"><button class="button sm" data-toast="${r.name} specification opened">Inspect spec</button><button class="button sm" data-toast="Recipe parameter preview opened">Use recipe</button></div>
    </div></article>`).join('')}
  </div>
  <article class="card mt-14"><header class="card-head"><div><div class="card-title">Recipe promotion rule</div><div class="card-subtitle">임의 생성 코드를 반복 사용하는 대신 검증된 분석 흐름을 승격</div></div></header><div class="card-body"><div class="stage-row"><div class="stage done"><strong>01</strong><span>Generated / manual analysis</span></div><div class="stage done"><strong>02</strong><span>QA passed</span></div><div class="stage current"><strong>03</strong><span>Parameterize</span></div><div class="stage"><strong>04</strong><span>Regression tests</span></div><div class="stage"><strong>05</strong><span>Analyst approval</span></div><div class="stage"><strong>06</strong><span>Validated recipe</span></div></div></div></article>`;
}

renderTaskTab = function(task, tab) {
  if (tab === 'execution') {
    return `<div class="grid two">
      <div>
        <div class="flex space-between"><div><div class="card-title">Code & Execution Workspace</div><div class="card-subtitle">실제 구현에서는 승인된 pipeline version과 sandbox execution을 연결</div></div><span class="badge info">Read-only data</span></div>
        <div class="tabs mt-14"><button class="tab is-active">SQL</button><button class="tab">Python</button><button class="tab">Execution log</button></div>
        <div class="code-block">-- synthetic publishing sample\nSELECT month, facility_id, AVG(metric_value) AS monthly_avg\nFROM analytics_monthly\nWHERE observed_at >= :window_start\n  AND observed_at < :window_end\nGROUP BY month, facility_id\nORDER BY month, facility_id;</div>
        <div class="prototype-label mt-10">LLM-generated code is not authoritative. Before execution it must pass schema/policy validation, read-only enforcement and bounded runtime rules.</div>
      </div>
      <div>
        <div class="card-title">Execution contract</div>
        <dl class="definition-list mt-10"><div class="definition-row"><dt>Pipeline</dt><dd>monthly-operations / v7</dd></div><div class="definition-row"><dt>Environment</dt><dd>Python 3.11 · controlled runner</dd></div><div class="definition-row"><dt>DB access</dt><dd>read-only · timeout 30s · row bound</dd></div><div class="definition-row"><dt>Recipe</dt><dd>monthly-trend/v3 + forecast-baseline/v2</dd></div><div class="definition-row"><dt>Idempotency</dt><dd>run key + data window</dd></div><div class="definition-row"><dt>Output</dt><dd>run-manifest/v1</dd></div></dl>
        <div class="code-block mt-14">09:41:03  data_quality_gate  PASS\n09:41:08  statistical_recipe PASS\n09:41:21  feature_pipeline    PASS\n09:41:32  model_scoring       PASS\n09:41:37  report_artifacts     GENERATED\n09:41:38  human_review         PENDING</div>
      </div>
    </div>`;
  }

  if (tab === 'results') {
    return `<div class="grid two">
      <div class="grid">
        <div class="metric-grid"><div class="metric-box"><span>Monthly average</span><strong>72.4</strong><small>synthetic · +4.1% MoM</small></div><div class="metric-box"><span>Anomalies</span><strong>12</strong><small>7 from Facility B</small></div><div class="metric-box"><span>Forecast MAPE</span><strong>9.7%</strong><small>synthetic comparison</small></div></div>
        ${chartBars([46,52,48,64,69,72,61,76,81,73,84,79])}
        <div class="table-wrap"><table><thead><tr><th>Facility</th><th>Average</th><th>MoM</th><th>Anomaly</th><th>Review</th></tr></thead><tbody><tr><td>A</td><td>64.8</td><td>+1.2%</td><td>2</td><td><span class="badge ok">Normal</span></td></tr><tr><td>B</td><td>81.7</td><td>+8.6%</td><td>7</td><td><span class="badge warn">Inspect</span></td></tr><tr><td>C</td><td>70.6</td><td>+3.0%</td><td>3</td><td><span class="badge ok">Normal</span></td></tr></tbody></table></div>
      </div>
      <div class="grid">
        <article class="card"><header class="card-head"><div><div class="card-title">Evidence-backed interpretation</div><div class="card-subtitle">정형 계산 결과를 기반으로 LLM이 설명만 작성</div></div></header><div class="card-body small">Facility B의 월간 평균 변화가 가장 크게 나타났습니다. 플랫폼은 원인을 자동 확정하지 않고, 유지보수 일정 등 추가 근거 확인을 analyst review로 남깁니다.<br><br><strong>Calculation source:</strong> SQL result artifact + anomaly recipe output<br><strong>AI role:</strong> narrative drafting only</div></article>
        <article class="card"><header class="card-head"><div><div class="card-title">Output artifacts</div><div class="card-subtitle">동일 Run에서 재현 가능한 산출물</div></div></header><div class="card-body action-list"><div class="action-item"><span class="status-dot status-ok"></span><div class="action-copy"><strong>result-table/v1</strong><span>Structured rows + metric metadata</span></div><button class="button sm" data-toast="Result artifact inspected">Inspect</button></div><div class="action-item"><span class="status-dot status-ok"></span><div class="action-copy"><strong>chart-spec/v1</strong><span>Validated chart configuration</span></div><button class="button sm" data-toast="Chart specification inspected">Inspect</button></div><div class="action-item"><span class="status-dot status-warn"></span><div class="action-copy"><strong>analysis-report/v1</strong><span>Draft · human review required</span></div><button class="button sm" data-toast="Report draft opened">Review</button></div></div></article>
      </div>
    </div>`;
  }

  return baseRenderTaskTab(task, tab);
};

renderTaskDetail = function(taskId) {
  const task = tasks.find(t=>t.id===taskId) || tasks[0];
  state.selectedTask = task.id;
  const tabs = ['overview','requirements','data','plan','execution','results','runs','experiments','models','qa','reports','history'];
  const labels = {overview:'Overview',requirements:'Requirements',data:'Data',plan:'Analysis Plan',execution:'Code & Execution',results:'Results',runs:'Runs',experiments:'Experiments',models:'Models',qa:'QA',reports:'Reports',history:'History'};
  return `${pageHead(task.project,task.name,`${task.type} · ${task.mode} · owner ${task.owner}`,
    `<button class="button" data-page-jump="tasks">← All tasks</button><button class="button primary" data-open-modal="run">Run analysis</button>`)}
    <article class="card mb-14"><div class="card-body detail-summary"><div><div class="flex wrap">${stageBadge(task.stage)} ${statusBadge(task.status)} <span class="badge neutral">${task.mode}</span><span class="badge neutral">${task.type}</span></div><div class="mt-14">${taskStages(task)}</div></div><div class="small muted">Last updated<br><strong style="color:var(--text)">${task.updated}</strong></div></div></article>
    <article class="card"><div class="tabs">${tabs.map(t=>`<button class="tab ${state.taskTab===t?'is-active':''}" data-task-tab="${t}">${labels[t]}</button>`).join('')}</div><div class="card-body" id="taskTabPanel">${renderTaskTab(task,state.taskTab)}</div></article>`;
};

renderCurrent = function() {
  if (state.page === 'recipes') {
    const root = document.getElementById('pageRoot');
    const breadcrumb = document.getElementById('breadcrumb');
    root.innerHTML = renderRecipes();
    breadcrumb.textContent = 'Analysis Recipes';
    root.focus({preventScroll:true});
    bindDynamic();
    return;
  }
  baseRenderCurrent();
};
