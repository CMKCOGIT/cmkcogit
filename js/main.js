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

  // Analytics always requires an explicit, current opt-in.
  if (typeof initCookieBanner === 'function') initCookieBanner();
  if (typeof initAnalytics === 'function') initAnalytics();
  if (typeof bindAnalyticsEvents === 'function') bindAnalyticsEvents();

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
        window.open(url, '_blank', 'noopener,noreferrer');
        setState('closed');
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
    const previouslyOpen = hubEl.dataset.state !== 'closed';
    hubEl.dataset.state = state;
    triggerBtn.setAttribute('aria-expanded', String(state !== 'closed'));
    if (popup) popup.inert = state !== 'whatsapp';
    const channels = document.getElementById('ch-channels') || hubEl.querySelector('.ch-channels');
    if (channels) channels.inert = state !== 'channels';
    if (state === 'closed' && previouslyOpen && hubEl.contains(document.activeElement)) triggerBtn.focus();
    else if (state === 'whatsapp') closeBtn?.focus();
    if (state === 'channels' && typeof trackEvent === 'function') trackEvent('contact_hub_open');
    if (state === 'whatsapp' && typeof trackEvent === 'function') trackEvent('whatsapp_menu_open');
  }

  triggerBtn.setAttribute('aria-controls', 'whatsapp-popup');
  setState('closed');

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

  function updateVisibility() {
    const protectedAreas = ['hero', 'contact', 'configurator', 'diagnostic-experience', 'footer'];
    const nearContent = protectedAreas.some(id => {
      const element = document.getElementById(id);
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });
    const isMobile = window.matchMedia('(max-width: 992px)').matches;
    const hero = document.getElementById('hero');
    const heroRect = hero ? hero.getBoundingClientRect() : null;
    const heroInView = Boolean(heroRect && heroRect.top < window.innerHeight && heroRect.bottom > 0);
    document.body.classList.toggle('is-hero-diagnostic-visible', isMobile && heroInView);
    const visible = isMobile && window.scrollY > 400 && !nearContent;
    mobileCta.classList.toggle('is-visible', visible);
    mobileCta.inert = !visible;
    mobileCta.setAttribute('aria-hidden', String(!visible));
  }
  window.addEventListener('scroll', updateVisibility, {passive: true});
  window.addEventListener('resize', updateVisibility, {passive: true});
  updateVisibility();
}

// ── Response Time Text ──
function initResponseTime() {
  const responseTimeEl = document.getElementById('response-time-text');
  if (responseTimeEl && typeof siteConfig !== 'undefined' && siteConfig.responseTimeText) {
    responseTimeEl.textContent = siteConfig.responseTimeText;
  }
}
