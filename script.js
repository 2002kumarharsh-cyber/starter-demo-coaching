/**
 * Bright Future Coaching Academy - Interactivity Scripts
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Sticky Header Nav Scroll Effect
  // ==========================================
  const headerNav = document.getElementById('headerNav');
  const scrollThreshold = 50;

  const handleScroll = () => {
    if (window.scrollY > scrollThreshold) {
      headerNav.classList.add('scrolled');
    } else {
      headerNav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check on load


  // ==========================================
  // 2. Mobile Navigation Toggle Drawer
  // ==========================================
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = (open) => {
    const isOpening = open !== undefined ? open : !navMenu.classList.contains('open');
    
    if (isOpening) {
      navToggle.classList.add('open');
      navMenu.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    } else {
      navToggle.classList.remove('open');
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = ''; // Unlock scroll
    }
  };

  navToggle.addEventListener('click', () => toggleMenu());

  // Close mobile menu when clicking any navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close mobile menu if window is resized above tablet breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
      toggleMenu(false);
    }
  });


  // ==========================================
  // 3. Scrollspy: Active Nav Link Highlight
  // ==========================================
  const sections = document.querySelectorAll('section[id], header[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the focus window of the screen
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));


  // ==========================================
  // 4. FAQ Accordion (Dynamic Max-Height)
  // ==========================================
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Close other accordion panels
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
          otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current panel
      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = null;
        question.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });


  // ==========================================
  // 5. Contact Form Validation & Mock Submit
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const studentName = document.getElementById('studentName');
  const parentPhone = document.getElementById('parentPhone');
  const courseSelect = document.getElementById('courseSelect');
  const formSuccess = document.getElementById('formSuccess');

  // Utility to clear errors
  const clearError = (input, errorEl) => {
    input.classList.remove('error');
    errorEl.style.display = 'none';
  };

  // Utility to show errors
  const showError = (input, errorEl) => {
    input.classList.add('error');
    errorEl.style.display = 'block';
  };

  // Clear errors when user types or changes value
  studentName.addEventListener('input', () => clearError(studentName, document.getElementById('nameError')));
  parentPhone.addEventListener('input', () => clearError(parentPhone, document.getElementById('phoneError')));
  courseSelect.addEventListener('change', () => clearError(courseSelect, document.getElementById('courseError')));

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (!studentName.value.trim()) {
      showError(studentName, document.getElementById('nameError'));
      isValid = false;
    }

    // Validate Phone (Indian 10-digit mobile number)
    const phoneRegex = /^[6-9]\d{9}$/;
    // Remove space/hyphens/prefix for checking digits
    const cleanedPhone = parentPhone.value.replace(/[\s\-+]/g, '').slice(-10);
    if (!phoneRegex.test(cleanedPhone)) {
      showError(parentPhone, document.getElementById('phoneError'));
      isValid = false;
    }

    // Validate Course
    if (!courseSelect.value) {
      showError(courseSelect, document.getElementById('courseError'));
      isValid = false;
    }

    // Helper to handle visual success feedback
    const handleFormSuccess = () => {
      // Show Success Message
      formSuccess.style.display = 'flex';
      
      // Scroll to Success Message smooth
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Reset fields
      contactForm.reset();

      // Clear success feedback after 5 seconds
      setTimeout(() => {
        formSuccess.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => {
          formSuccess.style.display = 'none';
          formSuccess.style.animation = ''; // Reset animation style
        }, 300);
      }, 5000);
    };

    // If validation succeeds, trigger animated feedback / submit data
    if (isValid) {
      const actionUrl = contactForm.getAttribute('action');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerText;
      
      if (actionUrl && !actionUrl.includes('YOUR_FORM_ID_HERE')) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending Enquiry...';
        
        const data = new FormData(contactForm);
        
        fetch(actionUrl, {
          method: 'POST',
          body: data,
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(response => {
          if (response.ok) {
            handleFormSuccess();
          } else {
            alert('Something went wrong. Please check your details and try again or call us directly.');
          }
        })
        .catch(error => {
          alert('Network connection error. Please try calling us directly at +91 72481 32705.');
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
        });
      } else {
        // Local mockup demo mode fallback
        handleFormSuccess();
      }
    }
  });

});
