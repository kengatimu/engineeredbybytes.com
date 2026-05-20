/* =============================================================
   EBB SYSTEMS — NETWORK SECTION + DRAWER
   ============================================================= */

(function () {
  'use strict';

  /* --- Badge stagger reveal on scroll ------------------------- */
  var badges = document.querySelectorAll('.sp-net-badge');
  if (badges.length && 'IntersectionObserver' in window) {
    var badgeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var siblings = entry.target.closest('.sp-net-cat__chips').querySelectorAll('.sp-net-badge');
          siblings.forEach(function (badge, i) {
            setTimeout(function () { badge.classList.add('badge-visible'); }, i * 60);
          });
          badgeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.sp-net-cat__chips').forEach(function (group) {
      badgeObserver.observe(group.querySelector('.sp-net-badge'));
    });
  } else {
    badges.forEach(function (b) { b.classList.add('badge-visible'); });
  }

  var drawer   = document.getElementById('networkDrawer');
  var backdrop = document.getElementById('netBackdrop');
  var openBtn  = document.getElementById('openNetworkDrawer');
  var closeBtn = document.getElementById('closeNetworkDrawer');
  var ctaLink  = document.getElementById('netDrawerContact');

  if (!drawer || !backdrop || !openBtn) return;

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
    openBtn.focus();
  }

  openBtn.addEventListener('click', openDrawer);
  closeBtn && closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
  ctaLink && ctaLink.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
  });

  drawer.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var focusable = drawer.querySelectorAll('a[href], button:not([disabled])');
    var first = focusable[0];
    var last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });

})();
