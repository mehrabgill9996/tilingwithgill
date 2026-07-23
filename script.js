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
    '.about-grid, .service-card, .why-card, .gallery-item, .testimonial-card, .contact-grid, .contact-compact, .quote-layout, .feedback-card, .thankyou-card, .section-heading'
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
    var submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showFormNote('Please fill in your name, email, and message.', 'error');
        return;
      }

      var originalBtnText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      var formData = new FormData(contactForm);
      var payload = Object.fromEntries(formData.entries());

      fetch(contactForm.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data.success) {
            contactForm.reset();

            // If this form declares a success redirect (e.g. the quote form
            // sending users to thankyou.html), send them there instead of
            // showing the inline note.
            var redirectUrl = contactForm.getAttribute('data-success-redirect');
            if (redirectUrl) {
              window.location.href = redirectUrl;
              return;
            }

            showFormNote('Thanks, ' + name.split(' ')[0] + '! Your message has been sent — we\'ll be in touch soon.', 'success');
          } else {
            showFormNote(result.data.message || 'Something went wrong. Please try again.', 'error');
          }
        })
        .catch(function () {
          showFormNote('Something went wrong. Please check your connection and try again.', 'error');
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
        });
    });
  }

  function showFormNote(text, type) {
    if (!formNote) return;
    formNote.textContent = text;
    formNote.classList.remove('success', 'error');
    formNote.classList.add(type);
  }

  /* ----- Feedback form handling ----- */
  // NOTE: This form is front-end only — on submit it simply shows an inline
  // confirmation message below. It does NOT send an email, make a network
  // request, or store the submission anywhere. To actually collect and
  // review feedback later, wire this form up to a backend or a service
  // like Formspree, Google Forms, or Web3Forms (as the quote form does).
  var feedbackForm = document.getElementById('feedback-form');
  var feedbackNote = document.getElementById('feedback-note');
  var starButtons = document.querySelectorAll('.star-rating .star');
  var starRatingWrap = document.getElementById('star-rating');
  var feedbackRatingInput = document.getElementById('feedback-rating');

  function setStars(rating) {
    starButtons.forEach(function (star) {
      var value = Number(star.getAttribute('data-value'));
      star.classList.toggle('active', value <= rating);
    });
  }

  if (starButtons.length && feedbackRatingInput) {
    starButtons.forEach(function (star) {
      star.addEventListener('click', function () {
        var value = Number(star.getAttribute('data-value'));
        feedbackRatingInput.value = String(value);
        setStars(value);
      });

      star.addEventListener('mouseenter', function () {
        setStars(Number(star.getAttribute('data-value')));
      });

      star.addEventListener('focus', function () {
        setStars(Number(star.getAttribute('data-value')));
      });
    });

    if (starRatingWrap) {
      starRatingWrap.addEventListener('mouseleave', function () {
        setStars(Number(feedbackRatingInput.value));
      });
    }
  }

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('feedback-name').value.trim();
      var comments = document.getElementById('feedback-comments').value.trim();
      var rating = Number(feedbackRatingInput ? feedbackRatingInput.value : 0);

      if (!name || !comments) {
        showFeedbackNote('Please add your name and a comment.', 'error');
        return;
      }

      if (!rating) {
        showFeedbackNote('Please select a star rating.', 'error');
        return;
      }

      // Submission is not sent or stored anywhere — see note above.
      showFeedbackNote('Thank you for your feedback!', 'success');
      feedbackForm.reset();
      setStars(0);
    });
  }

  function showFeedbackNote(text, type) {
    if (!feedbackNote) return;
    feedbackNote.textContent = text;
    feedbackNote.classList.remove('success', 'error');
    feedbackNote.classList.add(type);
  }

});
