/* ============================================================
   ZooLoop — Mobile Navigation & Interactive Scripts
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  let backdrop = document.querySelector('.nav-backdrop');

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }

  function toggleMenu(e) {
    if (e) e.preventDefault();
    if (!hamburger || !navLinks) return;
    const isActive = hamburger.classList.toggle('is-active');
    navLinks.classList.toggle('is-active');
    backdrop.classList.toggle('is-active');
    document.body.style.overflow = isActive ? 'hidden' : '';
  }

  function closeMenu() {
    if (!hamburger || !navLinks) return;
    hamburger.classList.remove('is-active');
    navLinks.classList.remove('is-active');
    backdrop.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  // Close menu when clicking any nav link
  if (navLinks) {
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Navbar Scroll Transition
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Global Scroll Reveal for all sections
  const sections = document.querySelectorAll('section, .reveal');
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        if (e.target.classList.contains('reveal')) {
            e.target.classList.add('visible'); // keep original class just in case
        }
        scrollObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(sec => {
    if (!sec.classList.contains('scroll-reveal') && !sec.classList.contains('reveal')) {
      sec.classList.add('scroll-reveal');
    }
    scrollObserver.observe(sec);
  });
});

// Fast, snappy circle transition across all pages
(function () {
  var DURATION = 350; // 350ms quick page switch

  function createOverlay() {
    var overlay = document.querySelector('.circle-transition-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'circle-transition-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  function setOrigin(overlay, x, y) {
    overlay.style.setProperty('--cx', x);
    overlay.style.setProperty('--cy', y);
  }

  function isInternalNavLink(link) {
    var href = link.getAttribute('href');
    if (!href) return false;
    if (href.charAt(0) === '#') return false;
    if (href.indexOf('mailto:') === 0) return false;
    if (href.indexOf('tel:') === 0) return false;
    if (link.target === '_blank') return false;
    if (/^https?:\/\//i.test(href) && href.indexOf(window.location.host) === -1) return false;
    return true;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var overlay = createOverlay();
    var storedOrigin = null;
    try {
      storedOrigin = JSON.parse(sessionStorage.getItem('zl-transition-origin'));
    } catch (e) { }

    if (storedOrigin && storedOrigin.x && storedOrigin.y) {
      setOrigin(overlay, storedOrigin.x, storedOrigin.y);
      sessionStorage.removeItem('zl-transition-origin');
    } else {
      setOrigin(overlay, '50%', '50%');
    }

    overlay.classList.add('is-covered');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.classList.add('is-animating');
        overlay.classList.remove('is-covered');
      });
    });

    var links = document.querySelectorAll('a[href]');
    links.forEach(function (link) {
      if (!isInternalNavLink(link)) return;
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        e.preventDefault();
        var rect = link.getBoundingClientRect();
        var cx = (((rect.left + rect.width / 2) / window.innerWidth) * 100).toFixed(2) + '%';
        var cy = (((rect.top + rect.height / 2) / window.innerHeight) * 100).toFixed(2) + '%';
        setOrigin(overlay, cx, cy);
        try {
          sessionStorage.setItem('zl-transition-origin', JSON.stringify({ x: cx, y: cy }));
        } catch (err) { }
        overlay.classList.add('is-animating');
        overlay.classList.add('is-covered');
        setTimeout(function () {
          window.location.href = href;
        }, DURATION);
      });
    });
  });
})();
