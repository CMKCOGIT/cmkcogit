/* COGIT — explicit, versioned consent. No optional request before opt-in. */
window.CogitPrivacy = (() => {
  'use strict';
  const KEY = 'cogit_consent_v2';
  const VERSION = '2026-09-09';
  const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  const script = document.currentScript;
  const root = new URL('../', script.src);
  let choice = null;
  let ready = false;
  let expiryTimer;
  let returnFocus = null;

  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY));
      if (value && value.version === VERSION && typeof value.analytics === 'boolean' &&
          Number.isFinite(value.decidedAt) && Number.isFinite(value.expiresAt) &&
          value.decidedAt <= Date.now() && value.expiresAt > Date.now() &&
          value.expiresAt - value.decidedAt <= MAX_AGE) return value;
    } catch (_) { /* Storage may be unavailable; consent remains denied. */ }
    return null;
  }
  choice = read();
  function allows(category) {
    return category === 'analytics' && !!choice && choice.version === VERSION &&
      choice.expiresAt > Date.now() && choice.analytics === true;
  }
  function siteUrl(file) { return new URL(file, root).href; }
  function notify(previous) {
    window.dispatchEvent(new CustomEvent('cogit:consent-change', {
      detail: { analytics: allows('analytics'), previousAnalytics: !!previous, version: VERSION }
    }));
  }
  function armExpiry() {
    clearTimeout(expiryTimer);
    if (!choice) return;
    expiryTimer = setTimeout(() => {
      if (choice && choice.expiresAt <= Date.now()) {
        const previous = choice.analytics;
        choice = null;
        showBanner();
        notify(previous);
      } else armExpiry();
    }, Math.min(choice.expiresAt - Date.now() + 1, 2147483647));
  }
  function save(analytics) {
    const previous = allows('analytics');
    const now = Date.now();
    choice = { version: VERSION, necessary: true, analytics: analytics === true, decidedAt: now, expiresAt: now + MAX_AGE };
    try { localStorage.setItem(KEY, JSON.stringify(choice)); } catch (_) {}
    document.getElementById('cookie-banner')?.remove();
    closeSettings();
    armExpiry();
    notify(previous);
  }
  function showBanner() {
    if (document.getElementById('cookie-banner') || !document.body) return;
    const banner = document.createElement('section');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner is-visible';
    banner.setAttribute('aria-labelledby', 'cookie-title');
    banner.innerHTML = `<div class="cookie-banner-inner">
      <div class="cookie-copy"><h2 id="cookie-title">Sua privacidade, sua escolha.</h2>
        <p>Guardamos sua preferência de privacidade neste navegador. Cookies de análise são opcionais e só são ativados com sua autorização.
        Consulte a <a href="${siteUrl('privacidade.html')}">Política de Privacidade</a> e os <a href="${siteUrl('termos-de-uso.html')}">Termos de Uso</a>.</p>
      </div>
      <div class="cookie-banner-actions">
        <button type="button" class="cookie-action" id="cookie-reject">Rejeitar opcionais</button>
        <button type="button" class="cookie-action" id="cookie-accept">Aceitar opcionais</button>
        <button type="button" class="cookie-action cookie-action-settings" data-cookie-settings>Configurar preferências</button>
      </div></div>`;
    document.body.append(banner);
    banner.querySelector('#cookie-reject').addEventListener('click', () => save(false));
    banner.querySelector('#cookie-accept').addEventListener('click', () => save(true));
  }
  function closeSettings() {
    const dialog = document.getElementById('cookie-preferences');
    if (dialog?.open) dialog.close();
  }
  function openSettings() {
    let dialog = document.getElementById('cookie-preferences');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'cookie-preferences';
      dialog.className = 'cookie-dialog';
      dialog.setAttribute('aria-labelledby', 'cookie-preferences-title');
      dialog.innerHTML = `<div class="cookie-dialog-header">
        <h2 id="cookie-preferences-title">Preferências de privacidade</h2>
        <button type="button" class="cookie-dialog-close" aria-label="Fechar preferências">×</button>
      </div>
      <div class="cookie-category"><div><strong>Necessários — sempre ativos</strong>
        <p>Guardam sua escolha por até 180 dias. Não são usados para anúncios ou análise de navegação.</p></div></div>
      <div class="cookie-category"><input type="checkbox" id="cookie-analytics" aria-describedby="cookie-analytics-description">
        <div><label for="cookie-analytics">Análise de navegação</label>
          <p id="cookie-analytics-description">Permite medir páginas e interações com o Google Analytics, quando configurado. Nome, telefone, e-mail e textos dos formulários não são enviados para análise.</p></div></div>
      <p style="margin-top:16px">Os dados que você preencher só serão compartilhados ao autorizar o contato e abrir a mensagem no WhatsApp. Recusar cookies opcionais não impede esse contato.</p>
      <p style="margin-top:12px">Você pode mudar sua escolha neste painel a qualquer momento. Ao desativar uma análise já carregada, a página será recarregada para interrompê-la.</p>
      <div class="cookie-dialog-actions">
        <button type="button" class="cookie-action" id="cookie-save">Salvar preferências</button>
        <button type="button" class="cookie-action" id="cookie-reject-all">Rejeitar opcionais</button>
      </div>
      <p style="margin-top:16px"><a href="${siteUrl('privacidade.html')}">Política de Privacidade</a> · <a href="${siteUrl('termos-de-uso.html')}">Termos de Uso</a></p>`;
      document.body.append(dialog);
      dialog.querySelector('.cookie-dialog-close').addEventListener('click', closeSettings);
      dialog.querySelector('#cookie-save').addEventListener('click', () => save(dialog.querySelector('#cookie-analytics').checked));
      dialog.querySelector('#cookie-reject-all').addEventListener('click', () => save(false));
      dialog.addEventListener('close', () => { if (returnFocus?.isConnected) returnFocus.focus(); });
      dialog.addEventListener('click', event => { if (event.target === dialog) {
        const r = dialog.getBoundingClientRect();
        if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeSettings();
      }});
    }
    dialog.querySelector('#cookie-analytics').checked = allows('analytics');
    returnFocus = document.activeElement;
    if (!dialog.open) dialog.showModal();
  }
  function formMarkup(id, dark = false) {
    return `<div class="privacy-field${dark ? ' privacy-field-dark' : ''}">
      <label class="privacy-label" for="${id}">
        <input id="${id}" type="checkbox" data-contact-consent required aria-describedby="${id}-error">
        <span>Li os <a href="${siteUrl('termos-de-uso.html')}" target="_blank" rel="noopener noreferrer">Termos de Uso</a> e autorizo o uso dos dados informados para a COGIT responder à minha solicitação, conforme a <a href="${siteUrl('privacidade.html')}" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>.</span>
      </label>
      <p class="consent-error" id="${id}-error" aria-live="polite" hidden>Autorize o contato para compartilhar estas informações.</p>
    </div>`;
  }
  function authorize(container) {
    const checkbox = container?.querySelector('[data-contact-consent]');
    const valid = !!checkbox?.checked;
    const error = checkbox && document.getElementById(checkbox.id + '-error');
    if (error) error.hidden = valid;
    if (checkbox) checkbox.setAttribute('aria-invalid', String(!valid));
    if (!valid) checkbox?.focus();
    return valid;
  }
  function consentReceipt() {
    return `Autorização de contato: confirmada. Termos e política: ${VERSION}. Data: ${new Date().toISOString()}.`;
  }
  function init() {
    if (ready) return;
    ready = true;
    // Remove personal drafts and obsolete consent from the previous version.
    try { localStorage.removeItem('cogit_cookie_consent'); } catch (_) {}
    ['cogit_diag_state', 'cogit_submitted_config', 'cogit_contact_prefill', 'cogit_preselect'].forEach(key => {
      try { sessionStorage.removeItem(key); } catch (_) {}
    });
    const footer = document.querySelector('.footer-bottom-links') || document.querySelector('footer .container');
    if (footer && !footer.querySelector('[data-cookie-settings]')) {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'cookie-settings-link';
      button.dataset.cookieSettings = ''; button.textContent = 'Preferências de cookies';
      footer.append(button);
    }
    document.addEventListener('click', event => {
      if (event.target.closest('[data-cookie-settings]')) { event.preventDefault(); openSettings(); }
    });
    document.addEventListener('change', event => {
      if (event.target.matches('[data-contact-consent]') && event.target.checked) {
        event.target.setAttribute('aria-invalid', 'false');
        const error = document.getElementById(event.target.id + '-error');
        if (error) error.hidden = true;
      }
    });
    window.addEventListener('storage', event => {
      if (event.key === KEY || event.key === null) {
        const previous = allows('analytics'); choice = read();
        if (!choice) showBanner(); else document.getElementById('cookie-banner')?.remove();
        armExpiry(); notify(previous);
      }
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && choice && choice.expiresAt <= Date.now()) {
        const previous = choice.analytics; choice = null; showBanner(); notify(previous);
      }
    });
    if (!choice) showBanner();
    armExpiry();
  }
  document.addEventListener('DOMContentLoaded', init);
  return { init, allows, openSettings, formMarkup, authorize, consentReceipt, siteUrl, version: VERSION };
})();
