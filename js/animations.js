/* ============================================
   COGIT — Animations Controller
   High Performance, GPU-Accelerated Animation Engine
   "Antes de construir, entendemos o problema."
   ============================================ */

(function() {
  'use strict';

  // ── Reduced Motion Preference Check ──
  const prefersReducedMotion = () => {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  // ── 1. Scroll Reveal Observer (Universal) ──
  function initScrollReveal() {
    if (prefersReducedMotion()) {
      document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade').forEach(el => {
        el.classList.add('is-visible');
      });
      return;
    }

    const revealElements = document.querySelectorAll(
      '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade'
    );

    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Lazy trigger & zero memory leak
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // ── 2. Lateral & Directional Card Stagger Animations ──
  // Card 1: Left (-40px) | Card 2: Bottom (30px) | Card 3: Right (40px)
  function initCardStaggerAnimation() {
    if (prefersReducedMotion()) {
      document.querySelectorAll('.card-stagger-item, .dynamic-rec-card, .home-process-card, .case-card, .service-card, .package-card, .feature-card').forEach(card => {
        card.classList.add('is-visible');
      });
      return;
    }

    const gridSelectors = [
      '.dynamic-rec-grid',
      '.cases-grid',
      '.packages-grid',
      '.home-process-grid',
      '.services-grid',
      '.pricing-grid',
      '.features-grid',
      '.start-features-grid',
      '.start-plans-grid',
      '.solution-cards-grid',
      '.challenge-grid'
    ];

    const cardGrids = document.querySelectorAll(gridSelectors.join(', '));

    cardGrids.forEach(grid => {
      const cards = Array.from(grid.children).filter(child => child.nodeType === 1 && !child.classList.contains('grid-ignore'));
      if (!cards.length) return;

      cards.forEach((card, index) => {
        card.classList.add('card-stagger-item');
        
        // Directional variation: 1 -> Left, 2 -> Bottom, 3 -> Right
        const mod = index % 3;
        if (mod === 0) {
          card.classList.add('card-from-left');
        } else if (mod === 1) {
          card.classList.add('card-from-bottom');
        } else {
          card.classList.add('card-from-right');
        }

        // Stagger delay (0ms, 100ms, 200ms...)
        const delay = (index % 6) * 100;
        card.style.setProperty('--card-stagger-delay', `${delay}ms`);
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const gridCards = entry.target.querySelectorAll('.card-stagger-item');
            gridCards.forEach(card => card.classList.add('is-visible'));
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      });

      observer.observe(grid);
    });
  }

  // ── 3. Hero Initial Entrance Sequence ──
  // Title -> Subtitle -> Buttons -> Interactive Widget
  function initHeroEntrance() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    if (prefersReducedMotion()) {
      heroContent.querySelectorAll('[class*="hero-animate-"]').forEach(el => {
        el.classList.add('is-hero-animated');
      });
      return;
    }

    function triggerHeroSequence() {
      const anim1 = heroContent.querySelector('.hero-animate-1'); // Badge / Label
      const anim2 = heroContent.querySelector('.hero-animate-2'); // Triad
      const anim3 = heroContent.querySelector('.hero-animate-3'); // Title (Priority 1)
      const anim4 = heroContent.querySelector('.hero-animate-4'); // Subtitle (Priority 2)
      const anim5 = heroContent.querySelectorAll('.hero-animate-5'); // CTA Buttons & Widget (Priority 3)

      if (anim1) anim1.classList.add('is-hero-animated');
      if (anim2) anim2.classList.add('is-hero-animated');
      if (anim3) anim3.classList.add('is-hero-animated');

      setTimeout(() => {
        if (anim4) anim4.classList.add('is-hero-animated');
      }, 140);

      setTimeout(() => {
        anim5.forEach(el => el.classList.add('is-hero-animated'));
      }, 260);
    }

    const brandIntro = document.getElementById('brand-intro');
    if (brandIntro && !brandIntro.classList.contains('is-hidden')) {
      // Listen for brand intro exit
      const checkIntro = setInterval(() => {
        if (brandIntro.classList.contains('is-exiting') || brandIntro.classList.contains('is-hidden')) {
          clearInterval(checkIntro);
          setTimeout(triggerHeroSequence, 120);
        }
      }, 100);
      // Fallback
      setTimeout(() => {
        clearInterval(checkIntro);
        triggerHeroSequence();
      }, 2200);
    } else {
      setTimeout(triggerHeroSequence, 80);
    }
  }

  // ── 4. Methodology Line Animation (Pensar → Estruturar → Construir) ──
  // Step 1 appears -> Line connects -> Step 2 appears -> Line connects -> Step 3 appears
  function initMethodologyAnimation() {
    const methodSection = document.querySelector('#how-it-works, .process-section, .methodology-section');
    if (!methodSection) return;

    const cards = methodSection.querySelectorAll('.home-process-card, .process-step');
    if (!cards.length) return;

    if (prefersReducedMotion()) {
      cards.forEach(card => card.classList.add('is-visible', 'methodology-active'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('is-visible', 'methodology-active');
            }, index * 260);
          });
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    observer.observe(methodSection);
  }

  // ── 5. Metric & Number Counter Animation ──
  function initCounterAnimation() {
    const counterElements = document.querySelectorAll('[data-counter], .stat-number, .metric-value, .count-up');
    if (!counterElements.length) return;

    if (prefersReducedMotion()) return;

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function animateCount(el) {
      const targetStr = el.dataset.counter || el.textContent.trim();
      const match = targetStr.match(/([\D]*)([\d.,]+)([\D]*)/);
      if (!match) return;

      const prefix = match[1] || '';
      const rawNum = match[2].replace(/\./g, '').replace(',', '.');
      const suffix = match[3] || '';
      const targetVal = parseFloat(rawNum);
      if (isNaN(targetVal)) return;

      const isDecimal = match[2].includes(',') || match[2].includes('.');
      const decimals = isDecimal ? 1 : 0;
      const duration = 1200;
      let start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const current = targetVal * easeOutExpo(progress);

        const formatted = current.toLocaleString('pt-BR', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        });

        el.textContent = `${prefix}${formatted}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = targetStr;
        }
      }

      requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });

    counterElements.forEach(el => observer.observe(el));
  }

  // ── 6. Button Tactile Micro-Interactions (Click & Hover) ──
  function initButtonInteractions() {
    const buttonSelectors = '.btn, .btn-hero-montar, .btn-hero-start, .btn-hero-back, .whatsapp-btn, .diag-btn-next, .diag-btn-prev, .header-cta';
    
    document.addEventListener('pointerdown', (e) => {
      const btn = e.target.closest(buttonSelectors);
      if (btn) {
        btn.classList.add('is-pressed');
      }
    });

    document.addEventListener('pointerup', () => {
      document.querySelectorAll('.is-pressed').forEach(el => el.classList.remove('is-pressed'));
    });

    document.addEventListener('pointercancel', () => {
      document.querySelectorAll('.is-pressed').forEach(el => el.classList.remove('is-pressed'));
    });
  }

  // ── 7. Dark Section Progressive Glow & Contrast ──
  function initDarkSectionGlow() {
    const darkSections = document.querySelectorAll('.hero, .section-dark, .cta-banner, .footer, .hero-interactive-container');
    if (!darkSections.length || prefersReducedMotion()) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-dark-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05
    });

    darkSections.forEach(sec => observer.observe(sec));
  }

  // ── 8. Smooth Scroll Anchor Navigation ──
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#' || targetId.length <= 1) return;

        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        e.preventDefault();

        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth'
        });

        // Close mobile menu if open
        const mobileMenu = document.querySelector('.mobile-menu');
        const menuToggle = document.querySelector('.menu-toggle');
        if (mobileMenu && mobileMenu.classList.contains('is-open')) {
          mobileMenu.classList.remove('is-open');
          if (menuToggle) menuToggle.classList.remove('is-active');
          document.body.classList.remove('no-scroll');
        }
      });
    });
  }

  // ── 9. Brand Intro / Reveal Animation (~1.8s) ──
  function initBrandIntro() {
    const introEl = document.getElementById('brand-intro');
    if (!introEl) return;

    if (prefersReducedMotion()) {
      introEl.classList.add('is-hidden');
      return;
    }

    document.body.classList.add('intro-animating');

    let isExited = false;
    function exitIntro() {
      if (isExited) return;
      isExited = true;

      introEl.classList.add('is-exiting');
      document.body.classList.remove('intro-animating');

      setTimeout(() => {
        introEl.classList.add('is-hidden');
      }, 480);
    }

    introEl.addEventListener('click', exitIntro, { once: true });
    setTimeout(exitIntro, 1500);

    setTimeout(() => {
      document.body.classList.remove('intro-animating');
      if (!introEl.classList.contains('is-hidden')) {
        introEl.classList.add('is-hidden');
      }
    }, 2200);
  }

  // ── Master Initialization ──
  function initAnimations() {
    initBrandIntro();
    initHeroEntrance();
    initScrollReveal();
    initCardStaggerAnimation();
    initMethodologyAnimation();
    initCounterAnimation();
    initButtonInteractions();
    initDarkSectionGlow();
    initSmoothScroll();
  }

  // Expose global animation controller
  window.COGIT_ANIMATIONS = {
    init: initAnimations,
    refresh: function() {
      initScrollReveal();
      initCardStaggerAnimation();
      initCounterAnimation();
      initDarkSectionGlow();
    }
  };

  // Expose for main.js compatibility
  window.initAnimations = initAnimations;

})();
