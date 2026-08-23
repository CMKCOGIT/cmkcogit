/* ============================================
   COGIT — Main Entry Point
   Initializes all modules on DOM ready
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all dynamic components
  if (typeof initComponents === 'function') initComponents();

  // Initialize FAQ Accordions (universal)
  if (typeof initFaqAccordions === 'function') initFaqAccordions();

  // Initialize configurator
  if (typeof initConfigurator === 'function') initConfigurator();

  // Initialize header (sticky + mobile menu)
  if (typeof initHeader === 'function') initHeader();

  // Initialize animations (scroll reveals, counters)
  if (typeof initAnimations === 'function') initAnimations();

  // Initialize form validation
  if (typeof initForm === 'function') initForm();

  // Contact Hub (ex-WhatsApp float)
  if (typeof initContactHub === 'function') initContactHub();

  // Initialize mobile fixed CTA
  if (typeof initMobileFixedCTA === 'function') initMobileFixedCTA();

  // Initialize Analytics (respects cookie consent)
  if (typeof siteConfig !== 'undefined' && siteConfig.requireCookieConsent) {
    if (typeof initCookieBanner === 'function') initCookieBanner();
    // If already consented, load analytics
    if (localStorage.getItem('cogit_cookie_consent') === 'accepted') {
      if (typeof initAnalytics === 'function') initAnalytics();
      if (typeof bindAnalyticsEvents === 'function') bindAnalyticsEvents();
    }
  } else {
    // No consent required — load directly
    if (typeof initAnalytics === 'function') initAnalytics();
    if (typeof bindAnalyticsEvents === 'function') bindAnalyticsEvents();
  }

  // Set response time text from config
  if (typeof initResponseTime === 'function') initResponseTime();
});

// ── Contact Hub (ex-WhatsApp Float) ──
function initContactHub() {
  const hubEl = document.getElementById('whatsapp-float');
  const triggerBtn = document.getElementById('whatsapp-float-btn');
  const popup = document.getElementById('whatsapp-popup');
  const closeBtn = document.getElementById('whatsapp-popup-close');
  const backBtn = document.getElementById('ch-back-btn');
  const optionsContainer = document.getElementById('whatsapp-popup-options');

  const btnInsta = document.getElementById('ch-instagram');
  const btnLinked = document.getElementById('ch-linkedin');
  const btnEmail = document.getElementById('ch-email');
  const btnWhats = document.getElementById('ch-whatsapp');

  if (!hubEl || !triggerBtn) return;

  // Render WhatsApp options
  if (optionsContainer && typeof whatsappOptions !== 'undefined') {
    optionsContainer.innerHTML = whatsappOptions.map(opt => `
      <button class="whatsapp-popup-option" data-message="${encodeURIComponent(opt.message)}" type="button">
        ${opt.label}
      </button>
    `).join('');

    // Bind option clicks
    optionsContainer.querySelectorAll('.whatsapp-popup-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const message = decodeURIComponent(btn.dataset.message);
        const baseUrl = (typeof socialLinks !== 'undefined' && socialLinks.whatsapp) ? socialLinks.whatsapp : 'https://wa.me/5517981568889';
        
        // Track analytics
        if (typeof trackEvent === 'function') {
           trackEvent('whatsapp_option_selected', { option: btn.textContent.trim() });
        }
        
        const url = `${baseUrl}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        hubEl.dataset.state = 'closed';
      });
    });
  }

  // Populate social links
  if (typeof socialLinks !== 'undefined') {
    if (btnInsta && socialLinks.instagram) btnInsta.href = socialLinks.instagram;
    else if (btnInsta) btnInsta.style.display = 'none';

    if (btnLinked && socialLinks.linkedin) btnLinked.href = socialLinks.linkedin;
    else if (btnLinked) btnLinked.style.display = 'none';

    if (btnEmail && socialLinks.email) btnEmail.href = socialLinks.email;
    else if (btnEmail) btnEmail.style.display = 'none';
  }

  // State Management
  function setState(state) {
    hubEl.dataset.state = state;
    if (state === 'channels' && typeof trackEvent === 'function') trackEvent('contact_hub_open');
    if (state === 'whatsapp' && typeof trackEvent === 'function') trackEvent('whatsapp_menu_open');
  }

  // Toggle Hub
  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const currentState = hubEl.dataset.state;
    if (currentState === 'closed') {
      setState('channels');
    } else {
      setState('closed');
    }
  });

  // Open WhatsApp Popup
  if (btnWhats) {
    btnWhats.addEventListener('click', (e) => {
      e.stopPropagation();
      setState('whatsapp');
    });
  }

  // Back button (from WhatsApp to Channels)
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setState('channels');
    });
  }

  // Close WhatsApp popup completely
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setState('closed');
    });
  }

  // Analytics for direct channels
  [btnInsta, btnLinked, btnEmail].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        if (typeof trackEvent === 'function') {
          const id = btn.id.replace('ch-', '');
          trackEvent(`${id}_click`);
        }
      });
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (hubEl && !hubEl.contains(e.target)) {
      setState('closed');
    }
  });
  
  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hubEl.dataset.state !== 'closed') {
      setState('closed');
    }
  });
}

// ── Mobile Fixed CTA ──
function initMobileFixedCTA() {
  const mobileCta = document.getElementById('mobile-fixed-cta');
  if (!mobileCta) return;

  let hasScrolled = false;
  const scrollThreshold = 400; // Show after scrolling 400px

  function handleScroll() {
    const currentScroll = window.scrollY;

    // Don't show when near the contact form (to avoid covering it)
    const contactSection = document.getElementById('contact');
    const configuratorSection = document.getElementById('configurator');
    let nearForm = false;

    if (contactSection) {
      const contactRect = contactSection.getBoundingClientRect();
      if (contactRect.top < window.innerHeight && contactRect.bottom > 0) {
        nearForm = true;
      }
    }

    if (configuratorSection) {
      const cfgRect = configuratorSection.getBoundingClientRect();
      if (cfgRect.top < window.innerHeight && cfgRect.bottom > 0) {
        nearForm = true;
      }
    }

    if (currentScroll > scrollThreshold && !nearForm) {
      if (!hasScrolled) {
        hasScrolled = true;
        mobileCta.classList.add('is-visible');
      }
    } else {
      if (hasScrolled || nearForm) {
        hasScrolled = false;
        mobileCta.classList.remove('is-visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
}

// ── Response Time Text ──
function initResponseTime() {
  const responseTimeEl = document.getElementById('response-time-text');
  if (responseTimeEl && typeof siteConfig !== 'undefined' && siteConfig.responseTimeText) {
    responseTimeEl.textContent = siteConfig.responseTimeText;
  }
}
