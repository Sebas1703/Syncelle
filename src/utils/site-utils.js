/**
 * Site Utilities Module
 * Common functionality used across the site
 * Includes navigation, form handling, and UI enhancements
 */

class SiteUtils {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Initialize site utilities
   */
  init() {
    if (this.isInitialized) return;

    this.initNavigation();
    this.initFormHandling();
    this.initInputEnhancements();
    this.isInitialized = true;
  }

  /**
   * Initialize mobile navigation
   */
  initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('main-menu');
    let overlay = null;

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('is-active');
      navToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');

      if (isActive) {
        this.createOverlay((overlay) => {
          this.closeNavigation(navMenu, navToggle, overlay);
        });
      } else {
        this.removeOverlay();
      }
    });
  }

  /**
   * Create navigation overlay
   */
  createOverlay(onClickCallback) {
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);
    document.body.classList.add('scroll-locked');

    overlay.addEventListener('click', () => onClickCallback(overlay));
  }

  /**
   * Remove navigation overlay
   */
  removeOverlay() {
    const overlay = document.querySelector('.nav-overlay');
    if (overlay) {
      document.body.removeChild(overlay);
      document.body.classList.remove('scroll-locked');
    }
  }

  /**
   * Close navigation
   */
  closeNavigation(navMenu, navToggle, overlay = null) {
    navMenu.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    
    if (overlay) {
      document.body.removeChild(overlay);
      document.body.classList.remove('scroll-locked');
    } else {
      this.removeOverlay();
    }
  }

  /**
   * Initialize form handling
   */
  initFormHandling() {
    const contactForm = document.getElementById('contact-form');
    const mensajeDiv = document.getElementById('form-mensaje');

    if (!contactForm || !mensajeDiv) return;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleContactForm(contactForm, mensajeDiv);
    });
  }

  /**
   * Handle contact form submission
   */
  handleContactForm(form, messageElement) {
    messageElement.textContent = '';
    messageElement.className = 'form-message';

    // Simulate form processing
    setTimeout(() => {
      messageElement.textContent = '¡Gracias por tu mensaje! Te contactaremos pronto.';
      messageElement.classList.add('success');
      form.reset();
    }, 700);
  }

  /**
   * Initialize input enhancements
   */
  initInputEnhancements() {
    // Add focus effects to form inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement?.classList.add('focused');
      });

      input.addEventListener('blur', () => {
        if (!input.value.trim()) {
          input.parentElement?.classList.remove('focused');
        }
      });
    });
  }

  /**
   * Show loading state
   */
  showLoading(element, message = 'Cargando...') {
    if (!element) return;
    
    element.style.display = 'block';
    element.textContent = message;
    element.classList.add('loading');
  }

  /**
   * Hide loading state
   */
  hideLoading(element) {
    if (!element) return;
    
    element.style.display = 'none';
    element.classList.remove('loading');
  }

  /**
   * Show error message
   */
  showError(message, container = null) {
    if (container) {
      container.textContent = message;
      container.classList.add('error');
      container.style.display = 'block';
    } else {
      alert(message);
    }
  }

  /**
   * Show success message
   */
  showSuccess(message, container = null) {
    if (container) {
      container.textContent = message;
      container.classList.add('success');
      container.style.display = 'block';
    }
  }

  /**
   * Debounce function for performance
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Sanitize HTML to prevent XSS
   */
  sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  }
}

// Auto-initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  const siteUtils = new SiteUtils();
  siteUtils.init();
  
  // Make available globally
  window.SiteUtils = siteUtils;
});

// Export the class for manual initialization if needed
window.SiteUtilsClass = SiteUtils; 