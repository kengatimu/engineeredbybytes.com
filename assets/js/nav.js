/* =============================================================
   EBB SYSTEMS — NAV + SCROLL BEHAVIOUR
   ============================================================= */

(function () {
  'use strict';

  const navbar    = document.querySelector('.navbar');
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileNav = document.querySelector('.navbar__mobile');
  const navLinks  = document.querySelectorAll('.navbar__link');

  /* ----------------------------------------------------------
     Navbar: transparent → solid on scroll
     ---------------------------------------------------------- */
  function updateNavbar() {
    if (!navbar) return;
    if (navbar.dataset.static) return; // pinned solid — don't override
    if (window.scrollY > 60) {
      navbar.classList.remove('navbar--transparent');
      navbar.classList.add('navbar--solid');
    } else {
      navbar.classList.add('navbar--transparent');
      navbar.classList.remove('navbar--solid');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ----------------------------------------------------------
     Hamburger: open / close mobile drawer
     ---------------------------------------------------------- */
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('.navbar__mobile-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ----------------------------------------------------------
     Active link — two modes:
     1. Single-page (index.html): IntersectionObserver on sections
     2. Multi-page (about.html etc.): pathname matching
     ---------------------------------------------------------- */
  const isSinglePage = !!document.querySelector('section[id], div[id]') &&
    Array.from(navLinks).some(function (l) {
      return (l.getAttribute('href') || '').startsWith('#');
    });

  if (isSinglePage) {
    // Collect all anchored sections
    const sections = Array.from(
      document.querySelectorAll('section[id]')
    );

    function setActive(id) {
      navLinks.forEach(function (link) {
        link.classList.remove('active');
        const href = link.getAttribute('href') || '';
        if (href === '#' + id || href === '#hero' && id === 'hero') {
          link.classList.add('active');
        }
      });
    }

    if ('IntersectionObserver' in window && sections.length > 0) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      }, {
        rootMargin: '-40% 0px -55% 0px'
      });

      sections.forEach(function (s) { observer.observe(s); });
    }

    // Also handle hash on load
    if (window.location.hash) {
      setActive(window.location.hash.replace('#', ''));
    }

  } else {
    // Multi-page: match by pathname
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(function (link) {
      const href = (link.getAttribute('href') || '').split('/').pop();
      if (href === currentPage) {
        link.classList.add('active');
      }
    });
  }

  /* ----------------------------------------------------------
     Scroll reveal: fade-in sections as they enter viewport
     ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ----------------------------------------------------------
     Smooth scroll: anchor links (all #href clicks)
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        // Close mobile nav if open
        if (mobileNav) {
          mobileNav.classList.remove('open');
          hamburger && hamburger.classList.remove('open');
          hamburger && hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
        const offset = 72; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
