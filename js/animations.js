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
      threshold: 0.01,
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
        threshold: 0.01,
        rootMargin: '0px 0px -40px 0px'
      });

      observer.observe(grid);
    });
  }

  // ── 3. Hero Initial Entrance Sequence ──
  // Sequence: Badge/Triad -> Title -> Subtitle -> Buttons -> Interactive Widget
  function initHeroEntrance() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const anim1 = heroSection.querySelector('.hero-animate-1'); // Badge
    const anim2 = heroSection.querySelector('.hero-animate-2'); // Triad
    const anim3 = heroSection.querySelector('.hero-animate-3'); // Title
    const anim4 = heroSection.querySelector('.hero-animate-4'); // Subtitle
    const animButtons = heroSection.querySelector('.hero-ctas'); // Buttons
    const animInteractive = heroSection.querySelector('.hero-interactive-container'); // Interactive Discovery Block
    const otherAnim5 = heroSection.querySelectorAll('.hero-animate-5:not(.hero-ctas):not(.hero-interactive-container)');

    if (prefersReducedMotion()) {
      heroSection.querySelectorAll('[class*="hero-animate-"]').forEach(el => {
        el.classList.add('is-hero-animated');
      });
      if (animInteractive) animInteractive.classList.add('is-hero-animated');
      return;
    }

    function triggerHeroSequence() {
      // 1. Hero Badge & Positioning Triad
      if (anim1) anim1.classList.add('is-hero-animated');
      if (anim2) anim2.classList.add('is-hero-animated');

      // 2. Main Title
      setTimeout(() => {
        if (anim3) anim3.classList.add('is-hero-animated');
      }, 90);

      // 3. Subtitle
      setTimeout(() => {
        if (anim4) anim4.classList.add('is-hero-animated');
      }, 220);

      // 4. Action Buttons
      setTimeout(() => {
        if (animButtons) animButtons.classList.add('is-hero-animated');
        otherAnim5.forEach(el => el.classList.add('is-hero-animated'));
      }, 360);

      // 5. Interactive Discovery Block
      setTimeout(() => {
        if (animInteractive) animInteractive.classList.add('is-hero-animated');
      }, 480);
    }

    const brandIntro = document.getElementById('brand-intro');
    if (brandIntro && !brandIntro.classList.contains('is-hidden')) {
      let isHeroTriggered = false;
      const checkIntro = setInterval(() => {
        if (brandIntro.classList.contains('is-exiting') || brandIntro.classList.contains('is-hidden')) {
          clearInterval(checkIntro);
          if (!isHeroTriggered) {
            isHeroTriggered = true;
            setTimeout(triggerHeroSequence, 120);
          }
        }
      }, 60);

      // Fallback
      setTimeout(() => {
        clearInterval(checkIntro);
        if (!isHeroTriggered) {
          isHeroTriggered = true;
          triggerHeroSequence();
        }
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
      threshold: 0.01,
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

        const targetEl = document.getElementById(targetId.slice(1));
        if (!targetEl) return;

        e.preventDefault();

        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth'
        });

        window.CogitHeader?.close(false);
        if (!targetEl.hasAttribute('tabindex')) targetEl.tabIndex = -1;
        targetEl.focus({preventScroll: true});
      });
    });
  }

  // ── 9. Brand Intro / Reveal Animation (~1.8s) ──
  function initBrandIntro() {
    const introEl = document.getElementById('brand-intro');
    if (!introEl) return;

    if (prefersReducedMotion()) {
      introEl.classList.add('is-hidden');
      document.body.classList.remove('intro-animating');
      return;
    }

    document.body.classList.add('intro-animating');

    let isExited = false;
    let exitTimer = null;
    let hideTimer = null;

    function exitIntro() {
      if (isExited) return;
      isExited = true;

      if (exitTimer) clearTimeout(exitTimer);

      introEl.classList.add('is-exiting');
      document.body.classList.remove('intro-animating');

      hideTimer = setTimeout(() => {
        introEl.classList.add('is-hidden');
      }, 480);
    }

    // Allow user to click to skip intro instantly
    introEl.addEventListener('click', exitIntro, { once: true });

    // Standard reveal dwell time (~1.5s)
    exitTimer = setTimeout(exitIntro, 1500);

    // Failsafe watchdog
    setTimeout(() => {
      document.body.classList.remove('intro-animating');
      if (!isExited) {
        exitIntro();
      }
      if (!introEl.classList.contains('is-hidden')) {
        introEl.classList.add('is-hidden');
      }
    }, 2200);
  }

  // ── Master Initialization ──
  function initAnimations() {
    document.documentElement.classList.add('animations-ready');
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
