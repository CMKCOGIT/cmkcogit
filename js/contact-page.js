/* COGIT — contato direto */
(function () {
  'use strict';

  const serviceNames = {
    portfolio: 'Portfólio',
    'site-institucional': 'Site institucional',
    'landing-page': 'Landing Page',
    automacao: 'Automação',
    sistema: 'Sistema personalizado',
    'sistemas-personalizados': 'Sistema personalizado',
    saas: 'SaaS',
    mvp: 'MVP',
    plataforma: 'Plataforma digital',
    'modelos-prontos': 'Modelo pronto',
    'modelos-sob-medida': 'Projeto sob medida'
  };

  function initReveal() {
    const elements = Array.from(document.querySelectorAll('[data-contact-reveal]'));
    if (!elements.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      elements.forEach(element => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    elements.forEach(element => observer.observe(element));
  }

  function initContext() {
    const slug = new URLSearchParams(window.location.search).get('solucao');
    const context = document.getElementById('contact-context');
    if (!slug || !context) return '';
    const label = serviceNames[slug] || slug.replace(/-/g, ' ');
    context.textContent = `Você veio da página: ${label}. Não precisa selecionar o serviço novamente.`;
    context.hidden = false;
    return label;
  }

  function initCounter() {
    const field = document.getElementById('contact-message');
    const counter = document.getElementById('contact-message-count');
    if (!field || !counter) return;
    const update = () => { counter.textContent = `${field.value.length}/500`; };
    field.addEventListener('input', update);
    update();
  }

  function markValidity(form) {
    form.querySelectorAll('input[required], textarea[required]').forEach(field => {
      field.setAttribute('aria-invalid', String(!field.checkValidity()));
      field.addEventListener('input', () => field.setAttribute('aria-invalid', String(!field.checkValidity())), { once: true });
    });
  }

  function initForm(serviceContext) {
    const form = document.getElementById('contact-conversation-form');
    if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      markValidity(form);
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (window.CogitPrivacy && !window.CogitPrivacy.authorize(form)) return;

      const name = form.elements.name.value.trim();
      const company = form.elements.company.value.trim();
      const returnChannel = form.elements.return.value.trim();
      const message = form.elements.message.value.trim();
      const receipt = window.CogitPrivacy?.consentReceipt?.() || 'Autorização de contato: confirmada.';
      const lines = [
        'Olá, COGIT. Quero conversar sobre um projeto.',
        '',
        `Nome: ${name}`,
        company ? `Empresa: ${company}` : '',
        `Retorno: ${returnChannel}`,
        serviceContext ? `Contexto de interesse: ${serviceContext}` : '',
        '',
        'O que preciso resolver:',
        message,
        '',
        receipt
      ].filter(Boolean);
      if (typeof window.trackEvent === 'function') window.trackEvent('contact_message_prepared', { source: serviceContext ? 'solution_page' : 'contact_page' });
      window.open(`https://wa.me/5517981568889?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer');
    });
  }

  function initChannelTracking() {
    document.querySelectorAll('[data-contact-channel]').forEach(link => {
      link.addEventListener('click', () => {
        if (typeof window.trackEvent === 'function') window.trackEvent('contact_channel_click', { channel: link.dataset.contactChannel });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    const context = initContext();
    initCounter();
    initForm(context);
    initChannelTracking();
  });
})();
