/* ============================================
   COGIT — Configurator Module
   Interactive "Monte sua Solução" builder
   ============================================ */

const ConfiguratorApp = (() => {

  // ── State ──
  const state = {
    currentStep: 1,
    totalSteps: 4,
    selectedServices: [],   // [{serviceId, levelId, levelName, price, priceType}]
    selectedAddons: [],     // [{addonId, name, price, priceType}]
    solutionModel: null,    // 'modelos-prontos' | 'sob-medida' (para serviços de presença digital)
    isComplex: false,
    formData: {}
  };

  // ── DOM References ──
  let containerEl = null;
  let lastRenderedStep = null;

  // ── Helpers ──
  function formatPrice(value) {
    if (!value || value === null) return null;
    // If already has R$ prefix
    if (typeof value === 'string' && value.includes('R$')) return value;
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (!isNaN(numValue)) {
      return `R$ ${numValue.toLocaleString('pt-BR')}`;
    }
    return `R$ ${value}`;
  }

  function getPriceDisplay(priceType, price) {
    switch (priceType) {
      case 'fixed':
        return `<span class="cfg-price-value">${formatPrice(price)}</span>`;
      case 'from':
        return `<span class="cfg-price-value">A partir de ${formatPrice(price)}</span>`;
      case 'analysis':
      case 'custom':
        return `<span class="cfg-price-analysis">Sob análise</span>`;
      default:
        return '';
    }
  }

  function getAddonPriceDisplay(priceType, price) {
    switch (priceType) {
      case 'fixed':
        return `+ ${formatPrice(price)}`;
      case 'from':
        return `A partir de ${formatPrice(price)}`;
      case 'analysis':
      case 'custom':
        return 'Sob análise';
      default:
        return '';
    }
  }

  // ── Helpers — Presença Digital ──

  // IDs que ativam o fluxo de modelo (Prontos / Sob Medida)
  const PRESENCA_DIGITAL_IDS = ['site-institucional', 'landing-page', 'portfolio'];

  function isPresencaDigitalOnly() {
    if (state.selectedServices.length === 0) return false;
    return state.selectedServices.every(s => PRESENCA_DIGITAL_IDS.includes(s.serviceId));
  }

  function checkComplexity() {
    const ids = state.selectedServices.map(s => s.serviceId);
    const combos = configuratorData.complexCombinations || [];
    for (const combo of combos) {
      if (combo.every(id => ids.includes(id))) {
        return true;
      }
    }
    // Also complex if any selected service is analysis-only
    const hasMultipleAnalysis = state.selectedServices.filter(s => s.priceType === 'analysis' || s.priceType === 'custom').length >= 2;
    return hasMultipleAnalysis;
  }

  function calculateTotal() {
    state.isComplex = checkComplexity();
    if (state.isComplex) return null;

    let hasCustomItems = false;
    let total = 0;

    state.selectedServices.forEach(s => {
      if (s.priceType === 'analysis' || s.priceType === 'custom') {
        hasCustomItems = true;
      } else if (s.price != null && !isNaN(s.price)) {
        total += parseFloat(s.price);
      }
    });

    state.selectedAddons.forEach(a => {
      if (a.priceType === 'analysis' || a.priceType === 'custom') {
        hasCustomItems = true;
      } else if (a.price != null && !isNaN(a.price)) {
        total += parseFloat(a.price) * (a.quantity || 1);
      }
    });

    if (hasCustomItems && total > 0) {
      return { type: 'partial', value: total };
    }
    if (hasCustomItems) {
      return { type: 'custom' };
    }
    if (total > 0) {
      return { type: 'fixed', value: total };
    }
    return { type: 'placeholder' };
  }

  function trackEvent(action, label) {
    if (typeof window.trackEvent === 'function') window.trackEvent(action, label);
  }

  // ── Render ──

  function render() {
    if (!containerEl) return;

    const previousStep = lastRenderedStep;
    const active = document.activeElement;
    const focusIndex = containerEl.contains(active) ? Array.from(containerEl.querySelectorAll('button, input, textarea, a')).indexOf(active) : -1;
    const focusKey = active?.id || null;
    containerEl.querySelectorAll('.cfg-form input:not([type="checkbox"]), .cfg-form textarea').forEach(field => {
      state.formData[field.id] = field.value;
    });
    containerEl.innerHTML = `
      <div class="cfg-wrapper">
        <div class="cfg-main">
          ${renderProgressBar()}
          ${renderCurrentStep()}
          ${renderNavigation()}
        </div>
        ${renderSummaryPanel()}
      </div>
    `;

    containerEl.querySelectorAll('.cfg-form input:not([type="checkbox"]), .cfg-form textarea').forEach(field => {
      field.value = state.formData[field.id] || '';
    });
    bindEvents();
    if (previousStep !== null && previousStep !== state.currentStep) CogitUI.focusHeading(containerEl.querySelector('.cfg-step'));
    else if (focusIndex >= 0) {
      const target = (focusKey && document.getElementById(focusKey)) || containerEl.querySelectorAll('button, input, textarea, a')[focusIndex];
      target?.focus({preventScroll: true});
    }
    lastRenderedStep = state.currentStep;
  }

  function renderProgressBar() {
    const steps = ['Soluções', isPresencaDigitalOnly() ? 'Modelo' : 'Nível', 'Adicionais', 'Estimativa'];
    return `
      <div class="cfg-progress">
        <div class="cfg-progress-bar">
          <div class="cfg-progress-fill" style="width: ${(state.currentStep / state.totalSteps) * 100}%"></div>
        </div>
        <div class="cfg-progress-steps">
          ${steps.map((label, i) => `
            <span class="cfg-progress-step ${i + 1 === state.currentStep ? 'is-active' : ''} ${i + 1 < state.currentStep ? 'is-done' : ''}">${i + 1}<span class="sr-only">: ${label}${i + 1 === state.currentStep ? ', etapa atual' : ''}</span></span>
          `).join('')}
        </div>
        <span class="cfg-progress-label">${state.currentStep} de ${state.totalSteps}</span>
      </div>
    `;
  }

  function renderCurrentStep() {
    switch (state.currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return '';
    }
  }

  // ── Step 1: Service Selection ──
  function renderStep1() {
    const services = configuratorData.services;

    // Map configurator IDs to servicesData IDs to centralize pricing
    const serviceIdMap = {
      'site-institucional': 'sites-institucionais',
      'landing-page': 'landing-pages',
      'portfolio': 'modelos-prontos',
      'automacao': 'automacao',
      'sistema': 'sistemas',
      'saas': 'saas',
      'mvp': 'mvp',
      'plataforma': 'plataformas',
      'inteligencia-artificial': 'inteligencia-artificial',
      'consultoria': 'consultoria'
    };

    return `
      <div class="cfg-step" data-step="1">
        <h3 class="cfg-step-title">O que você precisa construir?</h3>
        <p class="cfg-step-subtitle">Selecione um ou mais serviços.</p>
        <div class="cfg-services-grid">
          ${services.map(service => {
            const isSelected = state.selectedServices.some(s => s.serviceId === service.id);
            const sourceData = servicesData.find(s => s.id === serviceIdMap[service.id]);
            const priceText = sourceData && sourceData.basePrice ? `A partir de R$ ${sourceData.basePrice.toLocaleString('pt-BR')}` : 'Sob análise';
            
            return `
              <button class="cfg-service-card ${isSelected ? 'is-selected' : ''}" data-service-id="${service.id}" type="button" aria-pressed="${isSelected}">
                <div class="cfg-service-card-icon">${ICONS[service.icon] || ''}</div>
                <span class="cfg-service-card-name">${service.name}</span>
                <span class="cfg-service-card-price-hint">${priceText}</span>
                <div class="cfg-service-card-check">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // ── Step 2: Level Selection (serviços comuns) ou Modelo (presença digital) ──
  function renderStep2() {
    // Se todos os serviços selecionados são de presença digital → nova tela de escolha de modelo
    if (isPresencaDigitalOnly()) {
      return renderStep2Modelo();
    }

    // Fluxo original para demais serviços (inalterado)
    const servicesWithDetails = state.selectedServices.map(sel => {
      const serviceData = configuratorData.services.find(s => s.id === sel.serviceId);
      return { ...sel, data: serviceData };
    });

    return `
      <div class="cfg-step" data-step="2">
        <h3 class="cfg-step-title">Escolha o nível</h3>
        <p class="cfg-step-subtitle">Para cada solução, selecione o nível de complexidade.</p>
        <div class="cfg-levels-list">
          ${servicesWithDetails.map(s => {
            if (!s.data) return '';
            if (s.data.hasLevels) {
              return `
                <div class="cfg-level-group">
                  <h4 class="cfg-level-group-title">
                    <span class="cfg-level-group-icon">${ICONS[s.data.icon] || ''}</span>
                    ${s.data.name}
                  </h4>
                  <div class="cfg-level-options">
                    ${s.data.levels.map(level => {
                      const isSelected = s.levelId === level.id;
                      return `
                        <button class="cfg-level-card ${isSelected ? 'is-selected' : ''}" data-service-id="${s.serviceId}" data-level-id="${level.id}" type="button" aria-pressed="${isSelected}">
                          <div class="cfg-level-card-header">
                            <span class="cfg-level-card-name">${level.name}</span>
                            <div class="cfg-level-card-radio ${isSelected ? 'is-checked' : ''}"></div>
                          </div>
                          <p class="cfg-level-card-desc">${level.description}</p>
                          <div class="cfg-level-card-price">${getPriceDisplay(level.priceType, level.price)}</div>
                          ${level.priceType === 'analysis' ? '<span class="cfg-level-diagnosis-link">Necessita diagnóstico técnico</span>' : ''}
                        </button>
                      `;
                    }).join('')}
                  </div>
                </div>
              `;
            } else {
              return `
                <div class="cfg-level-group cfg-level-single">
                  <h4 class="cfg-level-group-title">
                    <span class="cfg-level-group-icon">${ICONS[s.data.icon] || ''}</span>
                    ${s.data.name}
                  </h4>
                  <p class="cfg-level-single-desc">${s.data.description}</p>
                  <div class="cfg-level-card-price">${getPriceDisplay(s.data.priceType, s.data.price)}</div>
                </div>
              `;
            }
          }).join('')}
        </div>
      </div>
    `;
  }

  // ── Step 2 Alternativo: Escolha de Modelo (Presença Digital) ──
  function renderStep2Modelo() {
    const modeloProntos   = state.solutionModel === 'modelos-prontos';
    const modeloSobMedida = state.solutionModel === 'sob-medida';

    // Ícone de relâmpago para Modelos Prontos
    const iconZap = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
    // Ícone de compass/design para Sob Medida
    const iconDesign = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`;

    const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>`;

    return `
      <div class="cfg-step" data-step="2-modelo">
        <h3 class="cfg-step-title">Como você deseja construir sua solução?</h3>
        <p class="cfg-step-subtitle">Escolha o modelo ideal para o seu projeto.</p>

        <div class="cfg-modelo-grid">

          <!-- Card 01: Modelos Prontos -->
          <button
            class="cfg-modelo-card ${modeloProntos ? 'is-selected' : ''}"
            data-modelo-id="modelos-prontos" aria-pressed="${modeloProntos}"
            type="button"
            id="cfg-modelo-prontos"
          >
            <div class="cfg-modelo-card-header">
              <div class="cfg-modelo-card-icon cfg-modelo-icon-zap">${iconZap}</div>
              <div class="cfg-level-card-radio ${modeloProntos ? 'is-checked' : ''}"></div>
            </div>
            <h4 class="cfg-modelo-card-title">Modelos Prontos</h4>
            <p class="cfg-modelo-card-desc">
              Escolha uma estrutura já desenvolvida pela COGIT e personalize com sua identidade visual, conteúdo e informações do seu negócio.
            </p>
            <ul class="cfg-modelo-features">
              <li>${checkIcon}<span>Mais rápido</span></li>
              <li>${checkIcon}<span>Melhor custo-benefício</span></li>
              <li>${checkIcon}<span>Ideal para colocar sua presença digital no ar</span></li>
            </ul>
          </button>

          <!-- Card 02: Modelos Sob Medida -->
          <button
            class="cfg-modelo-card ${modeloSobMedida ? 'is-selected' : ''}"
            data-modelo-id="sob-medida" aria-pressed="${modeloSobMedida}"
            type="button"
            id="cfg-modelo-sob-medida"
          >
            <div class="cfg-modelo-card-header">
              <div class="cfg-modelo-card-icon cfg-modelo-icon-design">${iconDesign}</div>
              <div class="cfg-level-card-radio ${modeloSobMedida ? 'is-checked' : ''}"></div>
            </div>
            <h4 class="cfg-modelo-card-title">Modelos Sob Medida</h4>
            <p class="cfg-modelo-card-desc">
              Construímos uma solução totalmente personalizada, pensada para suas necessidades, objetivos e diferenciais.
            </p>
            <ul class="cfg-modelo-features">
              <li>${checkIcon}<span>Design exclusivo</span></li>
              <li>${checkIcon}<span>Estrutura personalizada</span></li>
              <li>${checkIcon}<span>Maior nível de estratégia e desenvolvimento</span></li>
            </ul>
          </button>

        </div>
      </div>
    `;
  }

  // ── Step 3: Addons ──
  function renderStep3() {
    // Determine allowed addons based on selected services
    const allowedAddonIds = new Set();
    state.selectedServices.forEach(s => {
      const sData = configuratorData.services.find(srv => srv.id === s.serviceId);
      if (sData && sData.allowedAddons) {
        sData.allowedAddons.forEach(id => allowedAddonIds.add(id));
      }
    });

    // Handle "Automação" condition
    const hasAutomationService = state.selectedServices.some(s => s.serviceId === 'automacao');
    
    let filteredAddons = configuratorData.addons.filter(a => allowedAddonIds.has(a.id));
    if (hasAutomationService) {
      filteredAddons = filteredAddons.filter(a => a.id !== 'automacao-extra');
    }

    if (filteredAddons.length === 0) {
      return `
        <div class="cfg-step" data-step="3">
          <h3 class="cfg-step-title">Tudo certo!</h3>
          <p class="cfg-step-subtitle">As soluções selecionadas não exigem adicionais nesta etapa. Clique em continuar.</p>
        </div>
      `;
    }

    return `
      <div class="cfg-step" data-step="3">
        <h3 class="cfg-step-title">Quer adicionar algo?</h3>
        <p class="cfg-step-subtitle">Selecione funcionalidades adicionais de acordo com a sua necessidade (opcional).</p>
        <div class="cfg-addons-grid">
          ${filteredAddons.map(addon => {
            const selectedItem = state.selectedAddons.find(a => a.addonId === addon.id);
            const isSelected = !!selectedItem;
            
            let quantityControls = '';
            if (addon.allowQuantity && isSelected) {
              const qty = selectedItem.quantity || 1;
              quantityControls = `
                <div class="cfg-addon-quantity">
                  <button type="button" class="cfg-addon-qty-btn" aria-label="Diminuir quantidade de ${addon.name}" data-addon-action="minus" data-addon-id="${addon.id}">-</button>
                  <span class="cfg-addon-qty-val" aria-live="polite" aria-atomic="true">${qty}</span>
                  <button type="button" class="cfg-addon-qty-btn" aria-label="Aumentar quantidade de ${addon.name}" data-addon-action="plus" data-addon-id="${addon.id}">+</button>
                </div>
              `;
            }

            return `
              <div class="cfg-addon-card ${isSelected ? 'is-selected' : ''}" data-addon-id="${addon.id}">
                <button type="button" class="cfg-addon-select" data-addon-id="${addon.id}" aria-pressed="${isSelected}"><span class="cfg-addon-card-check" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span class="cfg-addon-card-name">${addon.name}</span></button>
                ${quantityControls}
                ${!quantityControls ? `<span class="cfg-addon-card-price">${getAddonPriceDisplay(addon.priceType, addon.price)}</span>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // ── Step 4: Summary + Form ──
  function renderStep4() {
    state.isComplex = checkComplexity();
    const total = calculateTotal();

    let estimateHTML = '';

    if (state.isComplex) {
      estimateHTML = `
        <div class="cfg-estimate cfg-estimate-custom">
          <h4>Projeto personalizado</h4>
          <p>Essa combinação exige avaliação técnica para estimarmos corretamente escopo, prazo e investimento.</p>
        </div>
      `;
    } else if (total) {
      switch (total.type) {
        case 'fixed':
        case 'partial':
          estimateHTML = `
            <div class="cfg-estimate">
              <span class="cfg-estimate-label">Total estimado</span>
              <span class="cfg-estimate-value">R$ ${total.value.toLocaleString('pt-BR')}</span>
              ${total.type === 'partial' ? '<p class="cfg-estimate-note" style="color: var(--purple); font-weight: bold;">+ Itens que precisam de análise técnica</p>' : ''}
              <p class="cfg-estimate-note" style="margin-top: 8px;">Com base no escopo essencial das opções selecionadas.</p>
            </div>
          `;
          break;
        case 'custom':
        case 'analysis':
          estimateHTML = `
            <div class="cfg-estimate cfg-estimate-custom">
              <h4>Projeto personalizado</h4>
              <p>Os serviços selecionados exigem avaliação técnica para definir investimento.</p>
            </div>
          `;
          break;
        case 'placeholder':
          estimateHTML = `
            <div class="cfg-estimate">
              <span class="cfg-estimate-label">Estimativa inicial</span>
              <span class="cfg-estimate-value cfg-estimate-placeholder">Valores serão definidos</span>
              <p class="cfg-estimate-note">Os valores estão sendo configurados pela COGIT.</p>
            </div>
          `;
          break;
      }
    }

    return `
      <div class="cfg-step" data-step="4">
        <h3 class="cfg-step-title">Sua estimativa está pronta.</h3>

        <div class="cfg-result">
          <div class="cfg-result-items">
            <h4 class="cfg-result-section-title">Soluções</h4>
            ${state.selectedServices.map(s => {
              const sData = configuratorData.services.find(srv => srv.id === s.serviceId);
              return `
                <div class="cfg-result-item" style="flex-direction: column; align-items: flex-start; gap: 4px;">
                  <span class="cfg-result-item-name">${sData ? sData.name : s.serviceId}</span>
                  <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                    <span style="font-size: 13px; color: var(--text-secondary);">${s.levelName || 'Escopo base'}</span>
                    <span class="cfg-result-item-price">${s.priceType === 'analysis' || s.priceType === 'custom' ? 'Sob análise' : (s.price != null ? `R$ ${s.price.toLocaleString('pt-BR')}` : 'A definir')}</span>
                  </div>
                </div>
              `;
            }).join('')}

            ${state.selectedAddons.length > 0 ? `
              <h4 class="cfg-result-section-title" style="margin-top: var(--space-6);">Adicionais</h4>
              ${state.selectedAddons.map(a => {
                const isCustom = a.priceType === 'analysis' || a.priceType === 'custom';
                const priceLabel = isCustom ? 'Sob análise' : (a.price != null ? `+ R$ ${(a.price * (a.quantity || 1)).toLocaleString('pt-BR')}` : 'A definir');
                const qtyLabel = a.quantity && a.quantity > 1 ? ` × ${a.quantity}` : '';
                return `
                <div class="cfg-result-item">
                  <span class="cfg-result-item-name" style="font-weight: normal;">${a.name}${qtyLabel}</span>
                  <span class="cfg-result-item-price" style="font-size: 13px;">${priceLabel}</span>
                </div>
                `;
              }).join('')}
            ` : ''}
          </div>

          ${estimateHTML}

          ${state.solutionModel ? `
            <div class="cfg-result-modelo-badge">
              <span class="cfg-result-modelo-label">Modelo escolhido</span>
              <span class="cfg-result-modelo-value">${state.solutionModel === 'modelos-prontos' ? '⚡ Modelos Prontos' : '◉ Modelos Sob Medida'}</span>
            </div>
          ` : ''}

          <p class="cfg-transparency-note">Esta estimativa considera o escopo base das opções selecionadas. O investimento final poderá variar conforme complexidade, integrações, regras de negócio e necessidades específicas.</p>
        </div>

        <!-- Configuration Form -->
        <form class="cfg-form" id="cfg-contact-form" novalidate>
          <h4 class="cfg-form-title">Quero conversar sobre este projeto</h4>
          <div class="cfg-form-grid">
            <div class="form-group">
              <label class="form-label" for="cfg-name">Nome <span class="required">*</span></label>
              <input class="form-input" type="text" id="cfg-name" name="name" autocomplete="name" maxlength="120" placeholder="Seu nome" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="cfg-company">Empresa</label>
              <input class="form-input" type="text" id="cfg-company" name="company" autocomplete="organization" maxlength="160" placeholder="Nome da empresa">
            </div>
            <div class="form-group">
              <label class="form-label" for="cfg-email">E-mail <span class="required">*</span></label>
              <input class="form-input" type="email" id="cfg-email" name="email" autocomplete="email" maxlength="254" placeholder="seu@email.com" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="cfg-whatsapp">WhatsApp <span class="required">*</span></label>
              <input class="form-input" type="tel" id="cfg-whatsapp" name="whatsapp" autocomplete="tel" maxlength="16" placeholder="(00) 00000-0000" required>
            </div>
            <div class="form-group full-width">
              <label class="form-label" for="cfg-notes">Conte algum detalhe importante sobre seu projeto</label>
              <textarea class="form-textarea" maxlength="2000" id="cfg-notes" name="notes" placeholder="Informações adicionais sobre o projeto..." rows="3"></textarea>
            </div>
          </div>
          ${CogitPrivacy.formMarkup('cfg-contact-consent')}
          <p class="cfg-transparency-note">Seus dados só serão compartilhados quando você continuar e enviar a mensagem no WhatsApp. Recusar cookies opcionais não impede o contato.</p>
          <p id="cfg-contact-status" class="form-status" role="status"></p>
          <button class="btn btn-primary btn-lg cfg-submit-btn" type="submit" id="cfg-submit">
            Preparar mensagem no WhatsApp →
          </button>
          
          <div style="text-align: center; margin-top: 16px;">
            <span style="font-size: 13px; color: var(--text-tertiary);">ou</span>
          </div>

          <a href="https://wa.me/5517981568889" target="_blank" rel="noopener noreferrer" class="cfg-advanced-link" id="cfg-whatsapp-direct" style="display: flex; align-items: center; justify-content: center; gap: 8px; color: #25D366;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.571c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Conversar apenas sobre a configuração
          </a>
        </form>
      </div>
    `;
  }

  // ── Summary Panel ──
  function renderSummaryPanel() {
    if (state.selectedServices.length === 0 && state.currentStep < 4) {
      return '<div class="cfg-summary cfg-summary-empty"><p>Selecione serviços para ver o resumo.</p></div>';
    }

    if (state.currentStep === 4) return ''; // Already shown inline

    const total = calculateTotal();
    state.isComplex = checkComplexity();

    let totalHTML = '';
    let additionalInfo = '';

    if (state.isComplex) {
      totalHTML = '<span class="cfg-summary-total-value" style="font-size: 20px;">Projeto personalizado</span>';
    } else if (total) {
      switch (total.type) {
        case 'fixed':
        case 'partial':
          totalHTML = `<span class="cfg-summary-total-value">R$ ${total.value.toLocaleString('pt-BR')}</span>`;
          if (total.type === 'partial') {
             additionalInfo = '<div style="font-size: 11px; color: var(--purple); font-weight: bold; margin-top: 4px;">+ Necessidades sob análise</div>';
          }
          break;
        case 'analysis':
        case 'custom':
          totalHTML = '<span class="cfg-summary-total-value">Sob análise</span>';
          break;
        case 'placeholder':
          totalHTML = '<span class="cfg-summary-total-value">A definir</span>';
          break;
      }
    }

    return `
      <div class="cfg-summary">
        <h4 class="cfg-summary-title">Sua solução</h4>
        <div class="cfg-summary-items">
          ${state.selectedServices.map(s => {
            const sData = configuratorData.services.find(srv => srv.id === s.serviceId);
            const isCustom = s.priceType === 'analysis' || s.priceType === 'custom';
            return `
              <div class="cfg-summary-item">
                <div class="cfg-summary-item-row">
                  <span>${sData ? sData.name : s.serviceId}</span>
                </div>
                ${sData && sData.hasLevels ? `
                  <div class="cfg-summary-item-level">
                    <span>${s.levelName || 'Escopo base'}</span>
                    <span>${isCustom ? 'Sob análise' : (s.price != null ? `R$ ${s.price.toLocaleString('pt-BR')}` : '—')}</span>
                  </div>
                ` : `
                  <div class="cfg-summary-item-level">
                    <span>Escopo base</span>
                    <span>${isCustom ? 'Sob análise' : (s.price != null ? `R$ ${s.price.toLocaleString('pt-BR')}` : '—')}</span>
                  </div>
                `}
              </div>
            `;
          }).join('')}
          ${state.selectedAddons.map(a => {
            const isCustom = a.priceType === 'analysis' || a.priceType === 'custom';
            const qtyLabel = a.quantity && a.quantity > 1 ? ` × ${a.quantity}` : '';
            return `
              <div class="cfg-summary-item cfg-summary-addon">
                <div class="cfg-summary-item-row">
                  <span>${a.name}${qtyLabel}</span>
                  <span>${isCustom ? 'Sob análise' : (a.price != null ? `+ R$ ${(a.price * (a.quantity || 1)).toLocaleString('pt-BR')}` : '—')}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        <div class="cfg-summary-total">
          <span class="cfg-summary-total-label">Estimativa Inicial</span>
          ${totalHTML}
          ${additionalInfo}
          ${state.solutionModel ? `
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-subtle)">
              <div style="font-size: 11px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px;">Modelo</div>
              <div style="font-size: 13px; color: var(--purple); font-weight: 600;">${state.solutionModel === 'modelos-prontos' ? '⚡ Modelos Prontos' : '◉ Modelos Sob Medida'}</div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // ── Navigation ──
  function renderNavigation() {
    const canGoBack = state.currentStep > 1;
    const canGoNext = state.currentStep < state.totalSteps;

    let nextDisabled = false;

    // Etapa 1: deve ter pelo menos 1 serviço selecionado
    if (state.currentStep === 1 && state.selectedServices.length === 0) {
      nextDisabled = true;
    }

    // Etapa 2 de presença digital: deve ter modelo selecionado
    if (state.currentStep === 2 && isPresencaDigitalOnly() && !state.solutionModel) {
      nextDisabled = true;
    }

    return `
      <div class="cfg-nav">
        ${canGoBack ? `<button class="btn btn-secondary-dark cfg-nav-btn cfg-nav-back" type="button" id="cfg-back">← Voltar</button>` : '<div></div>'}
        ${canGoNext ? `<button class="btn btn-primary cfg-nav-btn cfg-nav-next ${nextDisabled ? 'is-disabled' : ''}" type="button" id="cfg-next" ${nextDisabled ? 'disabled' : ''}>Continuar →</button>` : ''}
      </div>
    `;
  }

  // ── Event Binding ──
  function bindEvents() {
    // Service selection (Step 1)
    containerEl.querySelectorAll('.cfg-service-card').forEach(card => {
      card.addEventListener('click', () => {
        const serviceId = card.dataset.serviceId;
        toggleService(serviceId);
      });
    });

    // Level selection (Step 2 — fluxo original)
    containerEl.querySelectorAll('.cfg-level-card').forEach(card => {
      card.addEventListener('click', () => {
        const serviceId = card.dataset.serviceId;
        const levelId = card.dataset.levelId;
        selectLevel(serviceId, levelId);
      });
    });

    // Modelo selection (Step 2 — presença digital)
    containerEl.querySelectorAll('.cfg-modelo-card').forEach(card => {
      card.addEventListener('click', () => {
        const modeloId = card.dataset.modeloId;
        selectSolutionModel(modeloId);
      });
    });

    // Addon selection (Step 3)
    containerEl.querySelectorAll('.cfg-addon-select').forEach(card => {
      card.addEventListener('click', () => {
        const addonId = card.dataset.addonId;
        toggleAddon(addonId);
      });
    });

    // Navigation
    const backBtn = document.getElementById('cfg-back');
    const nextBtn = document.getElementById('cfg-next');
    if (backBtn) backBtn.addEventListener('click', goBack);
    if (nextBtn) nextBtn.addEventListener('click', goNext);

    // Addon quantity
    containerEl.querySelectorAll('.cfg-addon-qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent card toggle
        const addonId = btn.dataset.addonId;
        const action = btn.dataset.addonAction;
        updateAddonQuantity(addonId, action);
      });
    });

    // Submit
    document.getElementById('cfg-contact-form')?.addEventListener('submit', submitConfiguration);

    // WhatsApp Direct
    const whatsappDirectBtn = document.getElementById('cfg-whatsapp-direct');
    if (whatsappDirectBtn) {
      whatsappDirectBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openWhatsAppDirect();
      });
    }

    // WhatsApp mask for configurator form
    const cfgWhatsapp = document.getElementById('cfg-whatsapp');
    if (cfgWhatsapp) {
      cfgWhatsapp.addEventListener('input', (e) => {
        e.target.value = CogitUI.formatPhone(e.target.value);
        e.target.setCustomValidity('');
      });
    }
  }

  // ── Actions ──

  function toggleService(serviceId) {
    const existing = state.selectedServices.findIndex(s => s.serviceId === serviceId);
    if (existing >= 0) {
      state.selectedServices.splice(existing, 1);
      trackEvent('configurator_deselect', serviceId);
    } else {
      const serviceData = configuratorData.services.find(s => s.id === serviceId);
      const entry = {
        serviceId,
        levelId: null,
        levelName: null,
        price: serviceData.hasLevels ? null : serviceData.price,
        priceType: serviceData.hasLevels ? null : serviceData.priceType
      };

      // Auto-select first level if has levels
      if (serviceData.hasLevels && serviceData.levels.length > 0) {
        const firstLevel = serviceData.levels[0];
        entry.levelId = firstLevel.id;
        entry.levelName = firstLevel.name;
        entry.price = firstLevel.price;
        entry.priceType = firstLevel.priceType;
      }

      state.selectedServices.push(entry);
      trackEvent('configurator_select', serviceId);
    }

    // Resetar modelo ao mudar seleção de serviço (pode mudar o contexto de presença digital)
    const allowed = new Set(state.selectedServices.flatMap(service => configuratorData.services.find(item => item.id === service.serviceId)?.allowedAddons || []));
    if (state.selectedServices.some(service => service.serviceId === 'automacao')) allowed.delete('automacao-extra');
    state.selectedAddons = state.selectedAddons.filter(addon => allowed.has(addon.addonId));
    state.solutionModel = null;
    render();
  }

  function selectSolutionModel(modeloId) {
    state.solutionModel = modeloId;
    trackEvent('configurator_modelo', modeloId);
    render();
  }

  function selectLevel(serviceId, levelId) {
    const entry = state.selectedServices.find(s => s.serviceId === serviceId);
    if (!entry) return;

    const serviceData = configuratorData.services.find(s => s.id === serviceId);
    if (!serviceData || !serviceData.hasLevels) return;

    const level = serviceData.levels.find(l => l.id === levelId);
    if (!level) return;

    entry.levelId = level.id;
    entry.levelName = level.name;
    entry.price = level.price;
    entry.priceType = level.priceType;

    trackEvent('configurator_level', `${serviceId}:${levelId}`);
    render();
  }

  function toggleAddon(addonId) {
    const existing = state.selectedAddons.findIndex(a => a.addonId === addonId);
    if (existing >= 0) {
      state.selectedAddons.splice(existing, 1);
    } else {
      const addonData = configuratorData.addons.find(a => a.id === addonId);
      if (addonData) {
        state.selectedAddons.push({
          addonId: addonData.id,
          name: addonData.name,
          price: addonData.price,
          priceType: addonData.priceType,
          quantity: addonData.allowQuantity ? 1 : null
        });
      }
    }
    render();
  }

  function updateAddonQuantity(addonId, action) {
    const addon = state.selectedAddons.find(a => a.addonId === addonId);
    if (!addon || addon.quantity == null) return;

    if (action === 'plus') {
      addon.quantity = Math.min(99, addon.quantity + 1);
    } else if (action === 'minus') {
      if (addon.quantity > 1) {
        addon.quantity--;
      } else {
        // Remove addon if minus at 1
        const index = state.selectedAddons.indexOf(addon);
        state.selectedAddons.splice(index, 1);
      }
    }
    render();
  }

  function goNext() {
    if (state.currentStep === 1 && state.selectedServices.length === 0) return;

    // Etapa 2 de presença digital: não avançar sem modelo selecionado
    if (state.currentStep === 2 && isPresencaDigitalOnly() && !state.solutionModel) return;

    // Etapa 1 → determinar próxima etapa
    if (state.currentStep === 1) {
      // Se presença digital: sempre vai para Step 2 (escolha de modelo)
      if (isPresencaDigitalOnly()) {
        state.currentStep = 2;
        trackEvent('configurator_step', 'step_2_modelo');
        render();
        scrollToConfigurator();
        return;
      }

      // Demais serviços: pular Step 2 se nenhum tem níveis
      const hasLeveledServices = state.selectedServices.some(s => {
        const data = configuratorData.services.find(srv => srv.id === s.serviceId);
        return data && data.hasLevels;
      });
      if (!hasLeveledServices) {
        state.currentStep = 3; // Skip to addons
        trackEvent('configurator_step', 'step_3');
        render();
        scrollToConfigurator();
        return;
      }
    }

    if (state.currentStep < state.totalSteps) {
      state.currentStep++;
      trackEvent('configurator_step', `step_${state.currentStep}`);
      render();
      scrollToConfigurator();
    }
  }

  function goBack() {
    if (state.currentStep > 1) {
      // Se na etapa 3 e todos os serviços são presença digital → voltar para etapa 2 (modelo)
      if (state.currentStep === 3 && isPresencaDigitalOnly()) {
        state.currentStep = 2;
        render();
        scrollToConfigurator();
        return;
      }

      // Se na etapa 3 e nenhum serviço comum tem níveis → voltar para etapa 1
      if (state.currentStep === 3) {
        const hasLeveledServices = state.selectedServices.some(s => {
          const data = configuratorData.services.find(srv => srv.id === s.serviceId);
          return data && data.hasLevels;
        });
        if (!hasLeveledServices) {
          state.currentStep = 1;
          render();
          scrollToConfigurator();
          return;
        }
      }
      state.currentStep--;
      render();
      scrollToConfigurator();
    }
  }

  function scrollToConfigurator() {
    const el = document.getElementById('configurator');
    if (el) {
      const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
      window.scrollTo({ top, behavior: CogitUI.motion() });
    }
  }

  function openWhatsAppDirect(contact = null) {
    const phone = "5517981568889";
    let message = "Olá! Montei uma configuração no site da COGIT e gostaria de conversar sobre o projeto.\n\n";
    
    if (state.selectedServices.length > 0) {
      message += "*Soluções:*\n";
      state.selectedServices.forEach(s => {
        const sData = configuratorData.services.find(srv => srv.id === s.serviceId);
        const name = sData ? sData.name : s.serviceId;
        const level = s.levelName ? ` ${s.levelName}` : '';
        const price = s.priceType === 'analysis' || s.priceType === 'custom' ? 'Sob análise' : (s.price != null ? `R$ ${s.price.toLocaleString('pt-BR')}` : 'A definir');
        message += `- ${name}${level} — ${price}\n`;
      });

      // Incluir modelo escolhido se presença digital
      if (state.solutionModel) {
        const modeloLabel = state.solutionModel === 'modelos-prontos' ? 'Modelos Prontos' : 'Modelos Sob Medida';
        message += `*Modelo escolhido:* ${modeloLabel}\n`;
      }

      message += "\n";
    }

    if (state.selectedAddons.length > 0) {
      message += "*Adicionais:*\n";
      state.selectedAddons.forEach(a => {
        const price = a.priceType === 'analysis' || a.priceType === 'custom' ? 'Sob análise' : (a.price != null ? `R$ ${(a.price * (a.quantity || 1)).toLocaleString('pt-BR')}` : 'A definir');
        const qtyLabel = a.quantity && a.quantity > 1 ? ` (${a.quantity}x)` : '';
        message += `- ${a.name}${qtyLabel} — ${price}\n`;
      });
      message += "\n";
    }

    const total = calculateTotal();
    if (state.isComplex) {
      message += "*Estimativa inicial apresentada:* Projeto personalizado (Sob análise)\n";
    } else if (total) {
      if (total.type === 'fixed') {
        message += `*Estimativa inicial apresentada:* R$ ${total.value.toLocaleString('pt-BR')}\n`;
      } else if (total.type === 'partial') {
        message += `*Estimativa inicial apresentada:* R$ ${total.value.toLocaleString('pt-BR')} + itens sob análise\n`;
      } else if (total.type === 'custom' || total.type === 'analysis') {
        message += `*Estimativa inicial apresentada:* Sob análise\n`;
      }
    }

    if (contact) {
      message += `\n*Nome:* ${contact.name}\n*Empresa:* ${contact.company || 'Não informada'}\n*E-mail:* ${contact.email}\n*WhatsApp:* ${contact.whatsapp}\n*Contexto:* ${contact.notes || 'Não informado'}\n\n${CogitPrivacy.consentReceipt()}`;
    }
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
  }

  function submitConfiguration(event) {
    event.preventDefault();
    const form = document.getElementById('cfg-contact-form');
    const phone = document.getElementById('cfg-whatsapp');
    const validPhone = /^\d{10,11}$/.test(phone.value.replace(/\D/g, ''));
    phone.setCustomValidity(validPhone ? '' : 'Informe um telefone com DDD e 10 ou 11 dígitos.');
    const name = document.getElementById('cfg-name');
    name.setCustomValidity(name.value.trim() ? '' : 'Informe seu nome.');
    name.addEventListener('input', () => name.setCustomValidity(''), {once: true});
    // Native validation plus an explicit, separate contact authorization.
    for (const field of form.querySelectorAll('input:not([type="checkbox"]), textarea')) {
      field.setAttribute('aria-invalid', String(!field.checkValidity()));
      if (!field.reportValidity()) return;
    }
    if (!CogitPrivacy.authorize(form)) return;
    const contact = Object.fromEntries(['name', 'company', 'email', 'whatsapp', 'notes'].map(key => [key, document.getElementById('cfg-' + key).value.trim()]));
    openWhatsAppDirect(contact);
    document.getElementById('cfg-contact-status').textContent = 'Mensagem preparada. Revise e envie no WhatsApp para a Cogit receber sua solicitação. Se a janela não abriu, permita pop-ups deste site e tente novamente.';
    trackEvent('configurator_completed', `services:${state.selectedServices.length},addons:${state.selectedAddons.length}`);
  }

  function reset() {
    state.currentStep = 1;
    state.selectedServices = [];
    state.selectedAddons = [];
    state.solutionModel = null;
    state.isComplex = false;
    state.formData = {};
    render();
  }

  function preselectAndScroll(servicesArray) {
    if (!containerEl || !servicesArray || servicesArray.length === 0) return;

    // Reset current state
    state.selectedServices = [];
    state.selectedAddons = [];
    state.solutionModel = null;
    state.isComplex = false;
    state.formData = {};
    
    // Auto-select the provided services
    Array.from(new Set(servicesArray)).forEach(serviceId => {
      const serviceData = configuratorData.services.find(s => s.id === serviceId);
      if (serviceData) {
        const entry = {
          serviceId,
          levelId: null,
          levelName: null,
          price: serviceData.hasLevels ? null : serviceData.price,
          priceType: serviceData.hasLevels ? null : serviceData.priceType
        };

        if (serviceData.hasLevels && serviceData.levels.length > 0) {
          const firstLevel = serviceData.levels[0];
          entry.levelId = firstLevel.id;
          entry.levelName = firstLevel.name;
          entry.price = firstLevel.price;
          entry.priceType = firstLevel.priceType;
        }

        state.selectedServices.push(entry);
      }
    });

    if (!state.selectedServices.length) { state.currentStep = 1; render(); return; }

    // Advance to the appropriate step
    if (isPresencaDigitalOnly()) {
      // Presença digital → Step 2 (escolha de modelo)
      state.currentStep = 2;
    } else {
      // Demais serviços: Step 2 se algum tem níveis, caso contrário Step 3
      const hasLeveledServices = state.selectedServices.some(s => {
        const data = configuratorData.services.find(srv => srv.id === s.serviceId);
        return data && data.hasLevels;
      });
      state.currentStep = hasLeveledServices ? 2 : 3;
    }

    render();
    scrollToConfigurator();
  }

  // ── Init ──
  function init() {
    containerEl = document.getElementById('configurator-app');
    if (!containerEl) return;

    trackEvent('configurator_open', 'loaded');

    // Check URL params first
    const urlParams = new URLSearchParams(window.location.search);
    const urlProblem = urlParams.get('problem');
    const urlServices = urlParams.get('services');
    let preselectStr = urlServices;

    if (!preselectStr && urlProblem && typeof problemFlowsData !== 'undefined') {
      const problem = problemFlowsData.find(p => p.id === urlProblem);
      if (problem && problem.preselect) {
        preselectStr = problem.preselect.join(',');
      }
    }

    if (preselectStr) {
      const servicesArray = preselectStr.split(',').map(s => s.trim()).filter(Boolean);
      if (servicesArray.length > 0) {
        preselectAndScroll(servicesArray);
        return;
      }
    }

    render();
  }

  return { init, reset, preselectAndScroll };

})();


function initConfigurator() {
  ConfiguratorApp.init();
}
