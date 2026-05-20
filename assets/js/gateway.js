/* =============================================================
   EBB SYSTEMS — GATEWAY PAGE INTERACTIONS
   ============================================================= */

(function () {
  'use strict';

  /* --- Animated number counters -------------------------------- */
  var counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    var counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el      = entry.target;
        var target  = parseFloat(el.dataset.counter);
        var final   = el.dataset.final || String(target);
        var duration = 1600;
        var start   = performance.now();

        function tick(now) {
          var t     = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(eased * target);
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = final;
        }
        requestAnimationFrame(tick);
        counterObs.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { counterObs.observe(el); });
  }

  /* --- Animated speed bars ------------------------------------- */
  var speedFills = document.querySelectorAll('.gw-speed-row__fill');
  if (speedFills.length && 'IntersectionObserver' in window) {
    var barObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          barObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    speedFills.forEach(function (el) { barObs.observe(el); });
  }

  /* --- Security tile stagger on scroll ------------------------- */
  var secGrid = document.querySelector('.gw-sec-grid');
  if (secGrid && 'IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var tiles = entry.target.querySelectorAll('.gw-sec-tile');
        tiles.forEach(function (tile, i) {
          setTimeout(function () { tile.classList.add('visible'); }, i * 90);
        });
        secObs.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    secObs.observe(secGrid);
  }

  /* --- Top-nav scrollspy (crimson underline on active) --------- */
  var navLinks = document.querySelectorAll('.gw-topbar__nav a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var linkById = {};
    var targets  = [];
    navLinks.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) { linkById[id] = a; targets.push(el); }
    });

    var activeId = null;
    function setActive(id) {
      if (id === activeId) return;
      activeId = id;
      navLinks.forEach(function (a) { a.classList.remove('is-active'); });
      if (id && linkById[id]) linkById[id].classList.add('is-active');
    }

    var inView = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { inView[e.target.id] = e.isIntersecting; });
      // Pick the topmost section currently in the trigger zone (document order)
      for (var i = 0; i < targets.length; i++) {
        if (inView[targets[i].id]) { setActive(targets[i].id); return; }
      }
    }, {
      rootMargin: '-72px 0px -55% 0px',
      threshold: 0
    });

    targets.forEach(function (el) { spy.observe(el); });
  }

})();
