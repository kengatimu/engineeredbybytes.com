/* =============================================================
   EBB SYSTEMS — PROFILE DRAWER
   ============================================================= */

(function () {
  'use strict';

  const drawer   = document.getElementById('profileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  // Multiple open triggers (desktop button inside body, mobile button after
  // mission/vision). Fall back to legacy id for any older markup.
  const openBtns = Array.from(document.querySelectorAll(
    '[data-open-profile], #openProfileDrawer'
  ));
  const closeBtn = document.getElementById('closeProfileDrawer');

  if (!drawer || !backdrop || openBtns.length === 0) return;

  // The button to return focus to after closing — whichever was clicked last.
  let lastTrigger = openBtns[0];

  function openDrawer() {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastTrigger && lastTrigger.focus();
  }

  openBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      lastTrigger = btn;
      openDrawer();
    });
  });
  closeBtn && closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // Trap focus inside drawer when open
  drawer.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    const focusable = drawer.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });

})();
