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

  // ── Mobile Menu ──
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isActive = menuToggle.classList.contains('is-active');

      menuToggle.classList.toggle('is-active');
      mobileMenu.classList.toggle('is-open');
      if (menuOverlay) menuOverlay.classList.toggle('is-open');

      if (!isActive) {
        document.body.classList.add('no-scroll');
        menuToggle.setAttribute('aria-expanded', 'true');
      } else {
        document.body.classList.remove('no-scroll');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('is-active');
        mobileMenu.classList.remove('is-open');
        if (menuOverlay) menuOverlay.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        menuToggle.classList.remove('is-active');
        mobileMenu.classList.remove('is-open');
        if (menuOverlay) menuOverlay.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.focus();
      }
    });

    // Close on overlay click
    if (menuOverlay) {
      menuOverlay.addEventListener('click', () => {
        menuToggle.classList.remove('is-active');
        mobileMenu.classList.remove('is-open');
        menuOverlay.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
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
