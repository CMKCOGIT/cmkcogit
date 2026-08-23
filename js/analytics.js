/* ============================================
   COGIT — Analytics & Event Tracking
   Configurable GA4 + custom event helpers
   ============================================ */

// ── Google Analytics Loader ──
function initAnalytics() {
  const gaId = (typeof siteConfig !== 'undefined' && siteConfig.gaId) ? siteConfig.gaId : '';

  if (!gaId) {
    // No GA ID configured — skip loading
    window.gtag = function() {};
    return;
  }

  // Check cookie consent if banner is active
  if (typeof siteConfig !== 'undefined' && siteConfig.requireCookieConsent) {
    const consent = localStorage.getItem('cogit_cookie_consent');
    if (consent !== 'accepted') {
      window.gtag = function() {};
      return;
    }
  }

  // Load gtag.js asynchronously (non-blocking)
  const script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaId;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', gaId, {
    send_page_view: true
  });
}

// ── Event Tracking Helper ──
function trackEvent(eventName, params) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params || {});
  }
}

// ── Bind Analytics Events to DOM ──
function bindAnalyticsEvents() {
  // Contact CTA clicks (hero, final, header)
  document.querySelectorAll('[href="#contact"], [id*="cta"][id*="contact"]').forEach(function(el) {
    el.addEventListener('click', function() {
      trackEvent('contact_cta_click', {
        event_category: 'engagement',
        event_label: el.textContent.trim().substring(0, 50)
      });
    });
  });

  // Configurator CTA clicks
  document.querySelectorAll('[href="#configurator"]').forEach(function(el) {
    el.addEventListener('click', function() {
      trackEvent('configurator_started', {
        event_category: 'engagement',
        event_label: el.textContent.trim().substring(0, 50)
      });
    });
  });

  // Hero Interactive clicks
  document.addEventListener('click', function(e) {
    var heroOption = e.target.closest('.hero-interactive-option');
    if (heroOption) {
      trackEvent('hero_interactive_click', {
        event_category: 'engagement',
        event_label: heroOption.querySelector('h4') ? heroOption.querySelector('h4').textContent : heroOption.dataset.id
      });
    }
  });

  // WhatsApp clicks
  var whatsappBtn = document.getElementById('whatsapp-float-btn');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function() {
      trackEvent('whatsapp_click', { event_category: 'contact' });
    });
  }

  // WhatsApp popup option clicks
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('whatsapp-popup-option')) {
      trackEvent('whatsapp_click', {
        event_category: 'contact',
        event_label: e.target.textContent.trim()
      });
    }
  });

  // Social link clicks
  document.querySelectorAll('[aria-label="Instagram"]').forEach(function(el) {
    el.addEventListener('click', function() {
      trackEvent('instagram_click', { event_category: 'social' });
    });
  });

  document.querySelectorAll('[aria-label="LinkedIn"]').forEach(function(el) {
    el.addEventListener('click', function() {
      trackEvent('linkedin_click', { event_category: 'social' });
    });
  });

  document.querySelectorAll('[aria-label="E-mail"]').forEach(function(el) {
    el.addEventListener('click', function() {
      trackEvent('email_click', { event_category: 'contact' });
    });
  });

  // Solution card clicks
  document.querySelectorAll('.service-card').forEach(function(el) {
    el.addEventListener('click', function() {
      var title = el.querySelector('h3') ? el.querySelector('h3').textContent : '';
      trackEvent('solution_click', {
        event_category: 'engagement',
        event_label: title
      });
    });
  });

  // Investment card clicks
  document.querySelectorAll('.pricing-card').forEach(function(el) {
    el.addEventListener('click', function() {
      var title = el.querySelector('.pricing-card-title') ? el.querySelector('.pricing-card-title').textContent : '';
      trackEvent('investment_click', {
        event_category: 'engagement',
        event_label: title
      });
    });
  });

  // Mobile fixed CTA
  var mobileCta = document.getElementById('mobile-fixed-cta-btn');
  if (mobileCta) {
    mobileCta.addEventListener('click', function() {
      trackEvent('contact_cta_click', {
        event_category: 'engagement',
        event_label: 'mobile_fixed_cta'
      });
    });
  }
}

// ── Cookie Consent Banner ──
function initCookieBanner() {
  if (typeof siteConfig === 'undefined' || !siteConfig.requireCookieConsent) return;

  // Already consented
  if (localStorage.getItem('cogit_cookie_consent') === 'accepted') return;

  var banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.id = 'cookie-banner';
  banner.setAttribute('role', 'alert');
  banner.innerHTML = 
    '<div class="cookie-banner-inner">' +
      '<p>Este site utiliza cookies e ferramentas de análise para melhorar sua experiência. ' +
      'Ao continuar navegando, você concorda com nossa <a href="/privacidade.html">Política de Privacidade</a>.</p>' +
      '<div class="cookie-banner-actions">' +
        '<button class="btn btn-primary btn-sm" id="cookie-accept">Aceitar</button>' +
        '<button class="btn btn-secondary btn-sm" id="cookie-reject">Recusar</button>' +
      '</div>' +
    '</div>';
  
  document.body.appendChild(banner);

  // Show with animation
  requestAnimationFrame(function() {
    banner.classList.add('is-visible');
  });

  document.getElementById('cookie-accept').addEventListener('click', function() {
    localStorage.setItem('cogit_cookie_consent', 'accepted');
    banner.classList.remove('is-visible');
    setTimeout(function() { banner.remove(); }, 400);
    // Now load analytics
    initAnalytics();
    bindAnalyticsEvents();
  });

  document.getElementById('cookie-reject').addEventListener('click', function() {
    localStorage.setItem('cogit_cookie_consent', 'rejected');
    banner.classList.remove('is-visible');
    setTimeout(function() { banner.remove(); }, 400);
  });
}
