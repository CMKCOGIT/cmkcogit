/* COGIT — consent-gated analytics. No pre-consent pings or event queue. */
let cogitAnalyticsLoaded = false;
let cogitAnalyticsLoading = false;
function initAnalytics() {
  const gaId = typeof siteConfig !== 'undefined' ? siteConfig.gaId : '';
  if (!/^G-[A-Z0-9]+$/.test(gaId || '') || !window.CogitPrivacy?.allows('analytics')) return;
  if (cogitAnalyticsLoaded || cogitAnalyticsLoading) return;
  cogitAnalyticsLoading = true;
  window['ga-disable-' + gaId] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    if (window.CogitPrivacy?.allows('analytics')) window.dataLayer.push(arguments);
  };
  window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  window.gtag('js', new Date());
  window.gtag('config', gaId, {
    send_page_view: true,
    page_location: location.origin + location.pathname,
    page_referrer: '',
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: 15552000,
    cookie_update: false
  });
  const script = document.createElement('script');
  script.id = 'cogit-analytics-script';
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId);
  script.async = true;
  script.referrerPolicy = 'no-referrer';
  script.onload = () => { cogitAnalyticsLoaded = true; cogitAnalyticsLoading = false; };
  script.onerror = () => { cogitAnalyticsLoading = false; script.remove(); window.dataLayer = []; };
  document.head.append(script);
}
window.gtag = function() {};
function stopAnalytics() {
  const gaId = typeof siteConfig !== 'undefined' ? siteConfig.gaId : '';
  const wasRunning = cogitAnalyticsLoaded || cogitAnalyticsLoading;
  if (gaId) window['ga-disable-' + gaId] = true;
  window.gtag = function() {};
  window.dataLayer = [];
  document.getElementById('cogit-analytics-script')?.remove();
  const domains = location.hostname.split('.').map((_, i, a) => a.slice(i).join('.'));
  const paths = ['/', ...location.pathname.split('/').slice(0, -1).map((_, i, a) => a.slice(0, i + 1).join('/') + '/')];
  document.cookie.split(';').map(cookie => cookie.trim().split('=')[0]).filter(name => /^(_ga|_gid|_gat)(_|$)/.test(name)).forEach(name => {
    paths.forEach(path => {
      document.cookie = name + '=; Max-Age=0; path=' + path;
      domains.forEach(domain => { document.cookie = name + '=; Max-Age=0; path=' + path + '; domain=' + domain; });
    });
  });
  cogitAnalyticsLoaded = false;
  cogitAnalyticsLoading = false;
  // Unload a previously authorized vendor completely, including its own listeners.
  if (wasRunning) location.reload();
}
window.addEventListener('cogit:consent-change', event => {
  if (event.detail.analytics) initAnalytics(); else stopAnalytics();
});
function trackEvent(eventName, params) {
  if (!window.CogitPrivacy?.allows('analytics') || !(cogitAnalyticsLoaded || cogitAnalyticsLoading)) return;
  if (!/^[a-z][a-z0-9_]{0,39}$/.test(eventName)) return;
  const source = typeof params === 'string' ? { event_label: params } : (params || {});
  const safe = {};
  const allowed = ['event_category', 'event_label', 'service', 'services', 'selected', 'step', 'step_name', 'challenge', 'objective', 'option'];
  allowed.forEach(key => {
    const value = source[key];
    if (typeof value === 'number' || typeof value === 'boolean') safe[key] = value;
    else if (typeof value === 'string') safe[key] = value.slice(0, 120);
  });
  window.gtag('event', eventName, safe);
}

let cogitAnalyticsEventsBound = false;
function bindAnalyticsEvents() {
  if (cogitAnalyticsEventsBound) return;
  cogitAnalyticsEventsBound = true;
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


function initCookieBanner() { window.CogitPrivacy?.init(); }
