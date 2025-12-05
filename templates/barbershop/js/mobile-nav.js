/**
 * Mobile Navigation Enhancement for Barbershop Template
 * Ensures hamburger menu works properly on all mobile devices
 */

document.addEventListener('DOMContentLoaded', function() {
  const navToggler = document.querySelector('.navbar-toggler');
  const sidebarMenu = document.getElementById('sidebarMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (!navToggler || !sidebarMenu) return;
  
  function closeMenu() {
    navToggler.classList.add('collapsed');
    navToggler.setAttribute('aria-expanded', 'false');
    sidebarMenu.classList.remove('show');
    sidebarMenu.classList.add('collapse');
    removeOverlay();
    document.body.style.overflow = '';
  }

  // Enhanced toggle functionality
  navToggler.addEventListener('click', function(e) {
    e.preventDefault();
    const isCollapsed = navToggler.classList.contains('collapsed');
    if (isCollapsed) {
      navToggler.classList.remove('collapsed');
      navToggler.setAttribute('aria-expanded', 'true');
      sidebarMenu.classList.add('show');
      sidebarMenu.classList.remove('collapse');
      createOverlay();
      document.body.style.overflow = 'hidden';
    } else {
      closeMenu();
    }
  });
  
  // Close menu when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      closeMenu();
    });
  });
  
  function createOverlay() {
    removeOverlay();
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,.5); z-index: 1040;`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', closeMenu);
  }
  
  function removeOverlay() {
    const overlay = document.querySelector('.mobile-nav-overlay');
    if (overlay) overlay.remove();
  }
  
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 768) closeMenu();
  });

  // Auto-close on hashchange (smooth scroll end)
  window.addEventListener('hashchange', closeMenu);

  if ('ontouchstart' in window) {
    navToggler.addEventListener('touchstart', function(e) { e.preventDefault(); }, { passive: false });
  }
}); 