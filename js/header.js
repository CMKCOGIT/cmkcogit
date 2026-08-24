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
  let lastScroll = 0;
  const scrollThreshold = 50;

  function handleScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > scrollThreshold) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // ── Mobile Menu Controller ──
  const closeBtn = document.getElementById('mobile-menu-close') || mobileMenu?.querySelector('.mobile-menu-close');

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('is-open');
    if (menuToggle) {
      menuToggle.classList.add('is-active');
      menuToggle.setAttribute('aria-expanded', 'true');
    }
    if (menuOverlay) menuOverlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('is-open');
    if (menuToggle) {
      menuToggle.classList.remove('is-active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
    if (menuOverlay) menuOverlay.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

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
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = trigger.closest('.mobile-nav-accordion');
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

        if (parent) {
          parent.classList.toggle('is-expanded');
          trigger.setAttribute('aria-expanded', !isExpanded);
        }
      });
    });

    // Close menu when clicking regular links
    mobileMenu.querySelectorAll('a:not(.mobile-accordion-trigger)').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
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
