/* Monarch Liquor - Main JavaScript */

// Signals CSS that JS is available (scroll-reveal styles are gated on html.js
// so content is never hidden for no-JS visitors).
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Copyright Year ---
  var yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- Mobile Menu (slide-in drawer with focus trap) ---
  var hamburger = document.querySelector('.hamburger');
  var mobileMenu = document.querySelector('.mobile-menu');
  var mobileClose = document.querySelector('.mobile-menu-close');
  var inertTargets = ['main', '.footer', '.store-strip', '.navbar', '.announcement-bar', '.about-blurb', '.sticky-cta', '.marketplaces']
    .map(function (sel) { return document.querySelector(sel); })
    .filter(Boolean);
  var lastFocus = null;

  function focusables() {
    return Array.prototype.slice.call(
      mobileMenu.querySelectorAll('a[href], button:not([disabled])')
    ).filter(function (el) { return el.offsetParent !== null; });
  }

  function openMobileMenu() {
    lastFocus = document.activeElement;
    mobileMenu.classList.add('active');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('menu-open');
    inertTargets.forEach(function (el) { el.inert = true; });
    var first = focusables()[0];
    if (first) first.focus();
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.body.classList.remove('menu-open');
    inertTargets.forEach(function (el) { el.inert = false; });
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', openMobileMenu);
    if (location.hash === '#menu') openMobileMenu();
    if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (!mobileMenu.classList.contains('active')) return;
      if (e.key === 'Escape') {
        closeMobileMenu();
        return;
      }
      if (e.key === 'Tab') {
        var items = focusables();
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var navbar = document.querySelector('.navbar');
        var navbarHeight = navbar ? navbar.offsetHeight : 0;
        var targetPos = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
        window.scrollTo({ top: targetPos, behavior: reduceMotion ? 'auto' : 'smooth' });
        if (target.tabIndex < 0) target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
    });
  });

  // --- Scroll reveal ---
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (!('IntersectionObserver' in window) || reduceMotion) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(function (el) { revealObserver.observe(el); });
    }
  }

  // --- Navbar scroll shadow (class toggle, throttled by rAF) ---
  var navbarEl = document.querySelector('.navbar');
  if (navbarEl) {
    var ticking = false;
    var update = function () {
      navbarEl.classList.toggle('is-scrolled', window.scrollY > 10);
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

});
