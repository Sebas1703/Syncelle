
/**
 * Main Site Script
 * Loads the SiteUtils module for consistent functionality across all pages
 * This file is now just a loader for the modular system
 */

// Immediate hamburger menu functionality (fallback)
document.addEventListener('DOMContentLoaded', function() {
  initHamburgerMenu();
});

function initHamburgerMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('main-menu');
  
  console.log('Inicializando menú hamburguesa...', { navToggle, navMenu });
  
  if (!navToggle || !navMenu) {
    console.error('Elementos del menú no encontrados:', { navToggle, navMenu });
    return;
  }
  
  console.log('Menú hamburguesa inicializado correctamente');
  
  navToggle.addEventListener('click', function() {
    const isActive = navMenu.classList.toggle('is-active');
    navToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    
    if (isActive) {
      // Crear overlay
      createOverlay();
      document.body.classList.add('scroll-locked');
    } else {
      // Remover overlay
      removeOverlay();
      document.body.classList.remove('scroll-locked');
    }
  });
  
  // Cerrar menú al hacer clic en un enlace
  const navLinks = navMenu.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
      removeOverlay();
      document.body.classList.remove('scroll-locked');
    });
  });
}

function createOverlay() {
  // Remover overlay existente si hay uno
  removeOverlay();
  
  const overlay = document.createElement('div');
  overlay.classList.add('nav-overlay');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 15;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  `;
  
  document.body.appendChild(overlay);
  
  overlay.addEventListener('click', () => {
    const navMenu = document.getElementById('main-menu');
    const navToggle = document.querySelector('.nav-toggle');
    if (navMenu && navToggle) {
      navMenu.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
      removeOverlay();
      document.body.classList.remove('scroll-locked');
    }
  });
}

function removeOverlay() {
  const overlay = document.querySelector('.nav-overlay');
  if (overlay) {
    document.body.removeChild(overlay);
  }
}

// Load site utilities module (keep existing functionality)
if (typeof SiteUtilsClass === 'undefined') {
  // If SiteUtils module is not loaded, load it dynamically
  const script = document.createElement('script');
  script.src = '/src/utils/site-utils.js';
  script.onload = function() {
    console.log('Site utilities loaded successfully');
  };
  script.onerror = function() {
    console.error('Failed to load site utilities');
    // Fallback to basic functionality
    initBasicFunctionality();
  };
  document.head.appendChild(script);
} else {
  console.log('Site utilities already available');
}

/**
 * Fallback functionality if modules fail to load
 */
function initBasicFunctionality() {
  document.addEventListener('DOMContentLoaded', function () {
    // Basic contact form handling
    const form = document.getElementById('contact-form');
    const mensajeDiv = document.getElementById('form-mensaje');
    if (form && mensajeDiv) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        mensajeDiv.textContent = '';
        setTimeout(() => {
          mensajeDiv.textContent = getTranslation('msgSent');
          mensajeDiv.style.color = '#00F4AE';
          form.reset();
        }, 700);
      });
    }
  });
}
