(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav: scrolled state + mobile burger ---------- */
  var nav = document.getElementById('nav');
  var navLinks = document.getElementById('navLinks');
  var navBurger = document.getElementById('navBurger');

  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  navBurger.addEventListener('click', function () {
    var open = navLinks.classList.toggle('is-open');
    navBurger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('is-open');
      navBurger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-fast');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Hero ember canvas (lightweight, no deps) ---------- */
  var canvas = document.getElementById('emberCanvas');
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var W, H;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function makeParticle() {
      return {
        x: Math.random() * W,
        y: H + Math.random() * 40,
        r: 1 + Math.random() * 2.2,
        speed: 0.3 + Math.random() * 0.9,
        drift: (Math.random() - 0.5) * 0.4,
        alpha: 0.15 + Math.random() * 0.5
      };
    }
    var count = Math.min(60, Math.floor((W * H) / 22000));
    for (var i = 0; i < count; i++) particles.push(makeParticle());

    function tick() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(function (p) {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -10) {
          p.y = H + 10;
          p.x = Math.random() * W;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(244,196,48,' + p.alpha + ')';
        ctx.shadowColor = 'rgba(244,196,48,0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Rules modal ---------- */
  var overlay = document.getElementById('modalOverlay');
  var modalBody = document.getElementById('modalBody');
  var modalClose = document.getElementById('modalClose');

  document.querySelectorAll('[data-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tplId = btn.getAttribute('data-modal');
      var tpl = document.getElementById(tplId);
      if (!tpl) return;
      modalBody.innerHTML = '';
      modalBody.appendChild(tpl.content.cloneNode(true));
      overlay.classList.add('is-open');
      modalClose.focus();
    });
  });

  function closeModal() {
    overlay.classList.remove('is-open');
  }
  modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- Register: on-demand embedded form ---------- */
  var formWrap = document.getElementById('formWrap');
  var formLoading = document.getElementById('formLoading');
  var formFallback = document.getElementById('formFallback');
  var frame = document.getElementById('registerFrame');
  var toggleBtn = document.getElementById('registerToggle');
  var formStarted = false;

  function startFormLoad() {
    if (formStarted) return;
    formStarted = true;

    frame.addEventListener('load', function () {
      if (formLoading) formLoading.style.display = 'none';
    });

    frame.src = frame.getAttribute('data-src');

    // If the frame never fires "load" within a few seconds (e.g. blocked by
    // network/browser policy before any navigation completes), swap to the
    // fallback panel instead of leaving a blank box on screen.
    setTimeout(function () {
      if (formLoading && formLoading.style.display !== 'none') {
        formLoading.style.display = 'none';
        if (formFallback) formFallback.hidden = false;
      }
    }, 6000);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      var isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        formWrap.hidden = true;
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = 'Prefer to fill it in without leaving this page? <span>Show form here ▾</span>';
      } else {
        formWrap.hidden = false;
        toggleBtn.setAttribute('aria-expanded', 'true');
        toggleBtn.innerHTML = 'Embedded form open below <span>Hide form ▴</span>';
        startFormLoad();
        formWrap.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
      }
    });
  }
})();
