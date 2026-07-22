// =========================================================
// Tiling with Gill — Site Script
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ----- Footer year ----- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ----- Mobile nav toggle ----- */
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');

  function closeNav() {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ----- Sticky navbar background on scroll ----- */
  var header = document.getElementById('site-header');

  function handleHeaderScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  if (header) {
    handleHeaderScroll();
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  }

  /* ----- Back to top button ----- */
  var backToTop = document.getElementById('back-to-top');

  function handleBackToTop() {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  if (backToTop) {
    handleBackToTop();
    window.addEventListener('scroll', handleBackToTop, { passive: true });
  }

  /* ----- Smooth scroll for in-page anchor links (with fixed-header offset) ----- */
  var headerOffset = 80;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId.length < 2) return;

      var targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      var targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  /* ----- Scroll-reveal animations ----- */
  var revealTargets = document.querySelectorAll(
    '.about-grid, .service-card, .why-card, .gallery-item, .contact-grid, .section-heading'
  );

  revealTargets.forEach(function (el) {
    el.classList.add('reveal');
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: reveal everything immediately if IntersectionObserver isn't supported
    revealTargets.forEach(function (el) {
      el.classList.add('in-view');
    });
  }

  /* ----- Contact form handling ----- */
  var contactForm = document.getElementById('contact-form');
  var formNote = document.getElementById('form-note');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var phone = document.getElementById('phone').value.trim();
      var message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showFormNote('Please fill in your name, email, and message.', 'error');
        return;
      }

      // Build a mailto link so the user's email client opens with the message pre-filled
      var subject = encodeURIComponent('Free Quote Request from ' + name);
      var bodyLines = [
        'Name: ' + name,
        'Email: ' + email,
        'Phone: ' + (phone || 'N/A'),
        '',
        'Message:',
        message
      ];
      var body = encodeURIComponent(bodyLines.join('\n'));
      var mailtoLink = 'mailto:mehrabgill9996@gmail.com?subject=' + subject + '&body=' + body;

      window.location.href = mailtoLink;

      showFormNote('Thanks, ' + name.split(' ')[0] + '! Your email app should now open with your message ready to send.', 'success');
      contactForm.reset();
    });
  }

  function showFormNote(text, type) {
    if (!formNote) return;
    formNote.textContent = text;
    formNote.classList.remove('success', 'error');
    formNote.classList.add(type);
  }

});
