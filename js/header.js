/* ============================================
   COGIT — Header Controller
   Sticky header + mobile menu
   ============================================ */

function initHeader() {
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuOverlay = document.getElementById('menu-overlay');

  if (!header) return;

  // ── Sticky Header ──
  const scrollThreshold = 50;

  function handleScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > scrollThreshold) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // ── Mobile Menu Controller ──
  const closeBtn = document.getElementById('mobile-menu-close') || mobileMenu?.querySelector('.mobile-menu-close');

  let returnFocus = null;
  let inertElements = [];
  if (mobileMenu) mobileMenu.inert = true;
  function openMobileMenu() {
    if (!mobileMenu) return;
    returnFocus = document.activeElement;
    mobileMenu.inert = false;
    mobileMenu.classList.add('is-open');
    inertElements = Array.from(document.body.children).filter(el => el !== mobileMenu && el !== menuOverlay && !el.contains(mobileMenu) && !el.inert && !['SCRIPT', 'STYLE'].includes(el.tagName));
    inertElements.forEach(el => el.inert = true);
    closeBtn?.focus();
    if (menuToggle) {
      menuToggle.classList.add('is-active');
      menuToggle.setAttribute('aria-expanded', 'true');
    }
    if (menuOverlay) menuOverlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function closeMobileMenu(restoreFocus = true) {
    if (!mobileMenu) return;
    const wasOpen = mobileMenu.classList.contains('is-open');
    mobileMenu.classList.remove('is-open');
    mobileMenu.inert = true;
    inertElements.forEach(el => el.inert = false); inertElements = [];
    if (wasOpen && restoreFocus) returnFocus?.focus({preventScroll: true});
    if (menuToggle) {
      menuToggle.classList.remove('is-active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
    if (menuOverlay) menuOverlay.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  window.CogitHeader = {close: closeMobileMenu};
  window.matchMedia('(min-width: 1201px)').addEventListener('change', event => { if (event.matches) closeMobileMenu(false); });
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      if (mobileMenu.classList.contains('is-open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMobileMenu);
    }

    // Submenu / Accordion Toggle for Soluções
    const accordionTriggers = mobileMenu.querySelectorAll('.mobile-accordion-trigger');
    accordionTriggers.forEach(trigger => {
      const panel = trigger.nextElementSibling;
      if (panel) panel.inert = trigger.getAttribute('aria-expanded') !== 'true';
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = trigger.closest('.mobile-nav-accordion');
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

        if (parent) {
          parent.classList.toggle('is-expanded');
          trigger.setAttribute('aria-expanded', String(!isExpanded));
          if (panel) panel.inert = isExpanded;
        }
      });
    });

    // Close menu when clicking regular links
    mobileMenu.querySelectorAll('a:not(.mobile-accordion-trigger)').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    mobileMenu.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const items = Array.from(mobileMenu.querySelectorAll('a[href], button:not([disabled])')).filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden' && !el.closest('[inert]'));
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    });

    // Close menu on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMobileMenu();
        menuToggle.focus();
      }
    });

    // Close on overlay click
    if (menuOverlay) {
      menuOverlay.addEventListener('click', closeMobileMenu);
    }
  }

  // ── Active Nav Link ──
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const headerHeight = header.offsetHeight + 100;

    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerHeight;
      if (window.scrollY >= sectionTop) {
        currentSection = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
}
