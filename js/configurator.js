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
    isComplex: false,
    formData: {}
  };

  // ── DOM References ──
  let containerEl = null;

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

  function checkComplexity() {
    const ids = state.selectedServices.map(s => s.serviceId);
    const combos = configuratorData.complexCombinations || [];
    for (const combo of combos) {
      if (combo.every(id => ids.includes(id))) {
        return true;
      }
    }
    // Also complex if any selected service is analysis-only
    const allAnalysis = state.selectedServices.every(s => s.priceType === 'analysis' || s.priceType === 'custom');
    const hasMultipleAnalysis = state.selectedServices.filter(s => s.priceType === 'analysis' || s.priceType === 'custom').length >= 2;
    return hasMultipleAnalysis;
  }

  function calculateTotal() {
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
    console.log(`[COGIT Analytics] ${action}: ${label}`);
    // Replace with actual analytics when integrated
    if (typeof gtag === 'function') {
      gtag('event', action, { event_label: label });
    }
  }

  // ── Render ──

  function render() {
    if (!containerEl) return;

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

    bindEvents();
  }

  function renderProgressBar() {
    const steps = ['O que você precisa?', 'Qual nível?', 'Adicionais', 'Sua estimativa'];
    return `
      <div class="cfg-progress">
        <div class="cfg-progress-bar">
          <div class="cfg-progress-fill" style="width: ${(state.currentStep / state.totalSteps) * 100}%"></div>
        </div>
        <div class="cfg-progress-steps">
          ${steps.map((label, i) => `
            <span class="cfg-progress-step ${i + 1 === state.currentStep ? 'is-active' : ''} ${i + 1 < state.currentStep ? 'is-done' : ''}">${i + 1}</span>
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
              <button class="cfg-service-card ${isSelected ? 'is-selected' : ''}" data-service-id="${service.id}" type="button">
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

  // ── Step 2: Level Selection ──
  function renderStep2() {
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
                        <button class="cfg-level-card ${isSelected ? 'is-selected' : ''}" data-service-id="${s.serviceId}" data-level-id="${level.id}" type="button">
                          <div class="cfg-level-card-header">
                            <span class="cfg-level-card-name">${level.name}</span>
                            <div class="cfg-level-card-radio ${isSelected ? 'is-checked' : ''}"></div>
                          </div>
                          <p class="cfg-level-card-desc">${level.description}</p>
                          <div class="cfg-level-card-price">${getPriceDisplay(level.priceType, level.price)}</div>
                          ${level.priceType === 'analysis' ? '<a href="#contact" class="cfg-level-diagnosis-link">Solicitar diagnóstico</a>' : ''}
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
                  <button type="button" class="cfg-addon-qty-btn" data-addon-action="minus" data-addon-id="${addon.id}">-</button>
                  <span class="cfg-addon-qty-val">${qty}</span>
                  <button type="button" class="cfg-addon-qty-btn" data-addon-action="plus" data-addon-id="${addon.id}">+</button>
                </div>
              `;
            }

            return `
              <div class="cfg-addon-card ${isSelected ? 'is-selected' : ''}" data-addon-id="${addon.id}">
                <div class="cfg-addon-card-check">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span class="cfg-addon-card-name">${addon.name}</span>
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

          <p class="cfg-transparency-note">Esta estimativa considera o escopo base das opções selecionadas. O investimento final poderá variar conforme complexidade, integrações, regras de negócio e necessidades específicas.</p>
        </div>

        <!-- Configuration Form -->
        <div class="cfg-form">
          <h4 class="cfg-form-title">Quero conversar sobre este projeto</h4>
          <div class="cfg-form-grid">
            <div class="form-group">
              <label class="form-label" for="cfg-name">Nome <span class="required">*</span></label>
              <input class="form-input" type="text" id="cfg-name" placeholder="Seu nome" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="cfg-company">Empresa</label>
              <input class="form-input" type="text" id="cfg-company" placeholder="Nome da empresa">
            </div>
            <div class="form-group">
              <label class="form-label" for="cfg-email">E-mail <span class="required">*</span></label>
              <input class="form-input" type="email" id="cfg-email" placeholder="seu@email.com" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="cfg-whatsapp">WhatsApp <span class="required">*</span></label>
              <input class="form-input" type="tel" id="cfg-whatsapp" placeholder="(00) 00000-0000" required>
            </div>
            <div class="form-group full-width">
              <label class="form-label" for="cfg-notes">Conte algum detalhe importante sobre seu projeto</label>
              <textarea class="form-textarea" id="cfg-notes" placeholder="Informações adicionais sobre o projeto..." rows="3"></textarea>
            </div>
          </div>
          <button class="btn btn-primary btn-lg cfg-submit-btn" type="button" id="cfg-submit">
            Receber proposta com essa configuração →
          </button>
          
          <div style="text-align: center; margin-top: 16px;">
            <span style="font-size: 13px; color: var(--text-tertiary);">ou</span>
          </div>

          <a href="https://wa.me/5517981568889" target="_blank" rel="noopener noreferrer" class="cfg-advanced-link" id="cfg-whatsapp-direct" style="display: flex; align-items: center; justify-content: center; gap: 8px; color: #25D366;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.571c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Solicitar pelo WhatsApp
          </a>
        </div>
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
        </div>
      </div>
    `;
  }

  // ── Navigation ──
  function renderNavigation() {
    const canGoBack = state.currentStep > 1;
    const canGoNext = state.currentStep < state.totalSteps;
    const isLastStep = state.currentStep === state.totalSteps;

    let nextDisabled = false;
    if (state.currentStep === 1 && state.selectedServices.length === 0) {
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

    // Level selection (Step 2)
    containerEl.querySelectorAll('.cfg-level-card').forEach(card => {
      card.addEventListener('click', () => {
        const serviceId = card.dataset.serviceId;
        const levelId = card.dataset.levelId;
        selectLevel(serviceId, levelId);
      });
    });

    // Addon selection (Step 3)
    containerEl.querySelectorAll('.cfg-addon-card').forEach(card => {
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
    const submitBtn = document.getElementById('cfg-submit');
    if (submitBtn) submitBtn.addEventListener('click', submitConfiguration);

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
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length > 7) {
          value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        } else if (value.length > 2) {
          value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else if (value.length > 0) {
          value = `(${value}`;
        }
        e.target.value = value;
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
      addon.quantity++;
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

    // Skip step 2 if no services have levels and no services need level selection
    if (state.currentStep === 1) {
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
      // If on step 3 and no leveled services, go back to step 1
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
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  function openWhatsAppDirect() {
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

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  }

  function submitConfiguration() {
    const name = document.getElementById('cfg-name')?.value?.trim();
    const company = document.getElementById('cfg-company')?.value?.trim();
    const email = document.getElementById('cfg-email')?.value?.trim();
    const whatsapp = document.getElementById('cfg-whatsapp')?.value?.trim();
    const notes = document.getElementById('cfg-notes')?.value?.trim();

    // Basic validation
    if (!name || !email || !whatsapp) {
      alert('Por favor, preencha os campos obrigatórios (Nome, E-mail e WhatsApp).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    const total = calculateTotal();
    const configData = {
      services: state.selectedServices.map(s => {
        const sData = configuratorData.services.find(srv => srv.id === s.serviceId);
        return {
          service: sData ? sData.name : s.serviceId,
          level: s.levelName,
          price: s.price,
          priceType: s.priceType
        };
      }),
      addons: state.selectedAddons.map(a => ({
        name: a.name,
        price: a.price,
        priceType: a.priceType,
        quantity: a.quantity
      })),
      estimate: total,
      isComplex: state.isComplex,
      contact: { name, company, email, whatsapp },
      notes
    };

    console.log('[COGIT Configurator] Configuration submitted:', configData);
    trackEvent('configurator_completed', `services:${state.selectedServices.length},addons:${state.selectedAddons.length}`);
    trackEvent('proposal_requested', `services:${state.selectedServices.length}`);

    // Save configuration details to sessionStorage
    sessionStorage.setItem('cogit_submitted_config', JSON.stringify(configData));

    // Redirect to thank you page
    window.location.href = 'obrigado.html';
  }

  function reset() {
    state.currentStep = 1;
    state.selectedServices = [];
    state.selectedAddons = [];
    state.isComplex = false;
    state.formData = {};
    render();
  }

  function preselectAndScroll(servicesArray) {
    if (!containerEl || !servicesArray || servicesArray.length === 0) return;

    // Reset current state
    state.selectedServices = [];
    state.selectedAddons = [];
    state.isComplex = false;
    state.formData = {};
    
    // Auto-select the provided services
    servicesArray.forEach(serviceId => {
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

    // Advance to step 2 or 3 depending on whether any service has levels
    const hasLeveledServices = state.selectedServices.some(s => {
      const data = configuratorData.services.find(srv => srv.id === s.serviceId);
      return data && data.hasLevels;
    });

    if (hasLeveledServices) {
      state.currentStep = 2;
    } else {
      state.currentStep = 3; // skip level selection if none apply
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
    let preselectStr = sessionStorage.getItem('cogit_preselect') || urlServices;

    if (!preselectStr && urlProblem && typeof problemFlowsData !== 'undefined') {
      const problem = problemFlowsData.find(p => p.id === urlProblem);
      if (problem && problem.preselect) {
        preselectStr = problem.preselect.join(',');
      }
    }

    if (preselectStr) {
      sessionStorage.removeItem('cogit_preselect');
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
