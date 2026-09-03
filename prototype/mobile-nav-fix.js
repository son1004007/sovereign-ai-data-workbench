(() => {
  'use strict';

  const sidebar = document.getElementById('sidebar');
  const menuButton = document.getElementById('mobileMenu');
  if (!sidebar || !menuButton) return;

  const backdrop = document.createElement('button');
  backdrop.type = 'button';
  backdrop.id = 'mobileNavBackdrop';
  backdrop.className = 'mobile-nav-backdrop';
  backdrop.setAttribute('aria-label', '메뉴 닫기');
  document.body.appendChild(backdrop);

  function syncState() {
    const isOpen = sidebar.classList.contains('open');
    document.body.classList.toggle('mobile-nav-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
  }

  function closeMenu() {
    sidebar.classList.remove('open');
    syncState();
  }

  // app-v2.js owns the actual page routing. This listener runs after it and
  // only handles the mobile navigation presentation state.
  document.addEventListener('click', (event) => {
    const menuItem = event.target.closest('#nav [data-page]');
    if (menuItem) {
      closeMenu();
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        document.getElementById('content')?.focus?.({ preventScroll: true });
      });
      return;
    }

    if (event.target === backdrop) closeMenu();
  });

  // app-v2.js toggles the sidebar. Reflect that result after its click handler.
  menuButton.addEventListener('click', () => requestAnimationFrame(syncState));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) closeMenu();
  });

  menuButton.setAttribute('aria-expanded', 'false');
  syncState();
})();
