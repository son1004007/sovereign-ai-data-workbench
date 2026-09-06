(() => {
  'use strict';

  // app-v2.js owns publishing state. This helper reconciles the rendered
  // document-detail panel after a scenario filter changes so the visible list
  // and visible detail can never describe different synthetic states.
  document.addEventListener('click', (event) => {
    const scenario = event.target.closest('[data-doc-scenario]');
    if (!scenario) return;

    requestAnimationFrame(() => {
      const rows = Array.from(document.querySelectorAll('[data-document-id]'));
      const selected = document.querySelector('[data-document-id].selected-row');

      if (rows.length > 0 && (!selected || !rows.includes(selected))) {
        rows[0].click();
        return;
      }

      if (rows.length === 0) {
        const detail = document.querySelector('.doc-layout > aside.panel');
        if (detail) {
          detail.innerHTML = [
            '<div class="empty-state detail-empty">',
            '<b>선택할 문서가 없습니다.</b>',
            '<span>현재 화면 상태와 일치하는 문서가 생기면 상세 정보가 표시됩니다.</span>',
            '</div>',
          ].join('');
        }
      }
    });
  });
})();
