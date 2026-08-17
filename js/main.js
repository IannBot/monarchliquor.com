/* Monarch Liquor - Main JavaScript */

document.addEventListener('DOMContentLoaded', function () {

  // --- Copyright Year ---
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- Mobile Menu ---
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-menu-close');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      mobileMenu.classList.add('active');
      mobileMenu.setAttribute('aria-hidden', 'false');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    });

    if (mobileClose) {
      mobileClose.addEventListener('click', closeMobileMenu);
    }

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  function closeMobileMenu() {
    if (mobileMenu) {
      mobileMenu.classList.remove('active');
      mobileMenu.setAttribute('aria-hidden', 'true');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  // --- Location Tabs ---
  const tabButtons = document.querySelectorAll('.location-tab');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tab = this.getAttribute('data-tab');

      tabButtons.forEach(function (b) { b.classList.remove('active'); });
      tabPanels.forEach(function (p) { p.classList.remove('active'); });

      this.classList.add('active');
      var panel = document.querySelector('.tab-panel[data-tab="' + tab + '"]');
      if (panel) panel.classList.add('active');
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return; // Skip placeholder links
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var navbarHeight = document.querySelector('.navbar')
          ? document.querySelector('.navbar').offsetHeight
          : 0;
        var targetPos = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // --- Navbar scroll shadow ---
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    });
  }

});
