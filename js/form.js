/* ============================================================
   COGIT Diagnostic — Configurator Controller
   "Antes de construir, entendemos o problema."
   ============================================================ */

function initForm() {

  // ── DOM Elements ──
  const form = document.getElementById('cogit-diagnostic-form');
  const resultScreen = document.getElementById('diag-result-screen');
  const configuratorLayout = document.getElementById('diag-configurator-layout');
  const resetBtn = document.getElementById('diag-reset-btn');
  const progressFill = document.getElementById('diag-progress-fill');
  const stepLabelsEl = document.getElementById('diag-step-labels');

  const servicesGrid = document.getElementById('diag-services-grid');
  const step2OptionsEl = document.getElementById('diag-step2-options');
  const step2Title = document.getElementById('diag-step2-title');
  const step2Subtitle = document.getElementById('diag-step2-subtitle');
  const selectionContext = document.getElementById('diag-selection-context');
  const selectionContextText = document.getElementById('diag-selection-context-text');

  // Panel elements
  const panelEmpty = document.getElementById('diag-panel-empty');
  const panelItems = document.getElementById('diag-panel-items');
  const panelComboMsg = document.getElementById('diag-panel-combo-msg');
  const panelEstimate = document.getElementById('diag-panel-estimate');
  const panelEstimateVal = document.getElementById('diag-panel-estimate-val');
  const panelCta = document.getElementById('diag-panel-cta');
  const panelCtaBtn = document.getElementById('diag-panel-cta-btn');

  if (!form || !servicesGrid) return;

  // ── State ──
  const diagState = {
    step: 1,
    totalSteps: 3,
    selectedServices: [], // [{id, name, price, priceLabel}]
    objective: '',
    context: '',
    name: '',
    company: '',
    whatsapp: '',
    email: '',
    origin: document.referrer || window.location.href
  };

  const stepNames = {
    1: 'Escolha sua solução',
    2: 'Defina seu objetivo',
    3: 'Conte seu cenário'
  };

  // ── Service Catalog (with icons from ICONS object + pricing) ──
  const SERVICES_CATALOG = [
    {
      id: 'site-institucional',
      name: 'Site Institucional',
      desc: 'Presença digital completa para apresentar sua empresa.',
      price: 1990,
      priceLabel: 'A partir de R$ 1.990',
      icon: 'websites',
      challenge: 'Presença digital'
    },
    {
      id: 'landing-page',
      name: 'Landing Page',
      desc: 'Página estratégica para campanhas e geração de leads.',
      price: 990,
      priceLabel: 'A partir de R$ 990',
      icon: 'landing',
      challenge: 'Presença digital'
    },
    {
      id: 'automacao',
      name: 'Automação',
      desc: 'Reduza tarefas manuais e conecte ferramentas.',
      price: 990,
      priceLabel: 'A partir de R$ 990',
      icon: 'automation',
      challenge: 'Processos e automações'
    },
    {
      id: 'sistema',
      name: 'Sistema Personalizado',
      desc: 'Software web exclusivo para sua operação.',
      price: 7900,
      priceLabel: 'A partir de R$ 7.900',
      icon: 'systems',
      challenge: 'Sistema próprio'
    },
    {
      id: 'saas',
      name: 'SaaS',
      desc: 'Plataforma com assinatura e multiusuários.',
      price: 14900,
      priceLabel: 'A partir de R$ 14.900',
      icon: 'saas',
      challenge: 'Produto digital'
    },
    {
      id: 'mvp',
      name: 'MVP',
      desc: 'Versão mínima para validar sua ideia no mercado.',
      price: 9900,
      priceLabel: 'A partir de R$ 9.900',
      icon: 'mvp',
      challenge: 'Produto digital'
    },
    {
      id: 'plataforma',
      name: 'Plataforma',
      desc: 'Infraestrutura digital escalável e robusta.',
      price: 11900,
      priceLabel: 'A partir de R$ 11.900',
      icon: 'platforms',
      challenge: 'Produto digital'
    },
    {
      id: 'outras-solucoes',
      name: 'Outras Soluções',
      desc: 'IA, integrações, consultoria e projetos específicos.',
      price: null,
      priceLabel: 'Sob consulta',
      icon: 'otherSolutions',
      challenge: 'Ainda avaliando'
    }
  ];

  // ── Objective Map (dynamic by selected services) ──
  const OBJECTIVES_MAP = {
    'site-institucional': {
      title: 'Qual é o foco do Site Institucional?',
      subtitle: 'Selecione a prioridade comercial mais relevante.',
      options: [
        { title: 'Melhorar autoridade e credibilidade', desc: 'Transmitir solidez e segurança para clientes corporativos.' },
        { title: 'Atrair clientes e gerar leads', desc: 'Captar contatos qualificados para reuniões e propostas.' },
        { title: 'Apresentar serviços com clareza', desc: 'Explicar de forma estruturada soluções complexas e diferenciais.' },
        { title: 'Modernizar presença desatualizada', desc: 'Substituir site ultrapassado por experiência moderna.' }
      ]
    },
    'landing-page': {
      title: 'Qual é o objetivo da Landing Page?',
      subtitle: 'O que a página precisa converter ou entregar?',
      options: [
        { title: 'Gerar leads para vendas e reuniões', desc: 'Captar contatos para o time comercial abordar.' },
        { title: 'Validar uma oferta ou produto', desc: 'Testar demanda antes de investir no desenvolvimento completo.' },
        { title: 'Divulgar uma campanha ou lançamento', desc: 'Foco em tráfego pago e conversão imediata.' },
        { title: 'Criar presença profissional rápida', desc: 'Colocar a marca online com agilidade e baixo custo.' }
      ]
    },
    'automacao': {
      title: 'Qual é o gargalo operacional principal?',
      subtitle: 'Onde está o maior ganho de eficiência para sua empresa?',
      options: [
        { title: 'Reduzir trabalho manual e retrabalho', desc: 'Eliminar tarefas repetitivas da equipe e mitigar erros.' },
        { title: 'Integrar ferramentas isoladas', desc: 'Conectar WhatsApp, CRM, ERPs, planilhas e APIs.' },
        { title: 'Automatizar atendimento ao cliente', desc: 'Triagem rápida, notificações automáticas e respostas ágeis.' },
        { title: 'Organizar processos e centralizar dados', desc: 'Fluxos estruturados com relatórios automáticos.' }
      ]
    },
    'sistema': {
      title: 'O que o sistema precisa resolver?',
      subtitle: 'Como a ferramenta vai apoiar a operação da empresa?',
      options: [
        { title: 'Substituir planilhas e processos manuais', desc: 'Criar plataforma web segura para centralizar a operação.' },
        { title: 'Criar área de clientes ou membros', desc: 'Portal com login seguro para entrega de serviços ou relatórios.' },
        { title: 'Automatizar regras de negócio exclusivas', desc: 'Codificar processos específicos que softwares prontos não suportam.' },
        { title: 'Integrar sistemas e bases de dados', desc: 'Conectar bases legadas a uma interface moderna e intuitiva.' }
      ]
    },
    'saas': {
      title: 'Em que estágio está o seu SaaS?',
      subtitle: 'Qual é o ponto de partida para o desenvolvimento?',
      options: [
        { title: 'Tenho a ideia e preciso validar', desc: 'Construir MVP enxuto para testar no mercado.' },
        { title: 'Tenho validação e preciso escalar', desc: 'Desenvolver plataforma robusta com cobrança recorrente.' },
        { title: 'Quero monetizar um serviço existente', desc: 'Transformar consultoria ou metodologia em produto digital.' },
        { title: 'Já tenho versão inicial e preciso evoluir', desc: 'Refatorar e ampliar funcionalidades de produto existente.' }
      ]
    },
    'mvp': {
      title: 'O que o MVP precisa provar?',
      subtitle: 'Qual hipótese de negócio deve ser validada?',
      options: [
        { title: 'Existe demanda real para minha solução', desc: 'Validar interesse e disposição de pagamento do público.' },
        { title: 'O processo funciona de ponta a ponta', desc: 'Testar fluxo operacional com usuários reais.' },
        { title: 'O produto resolve o problema central', desc: 'Confirmar que a funcionalidade principal entrega valor.' },
        { title: 'É possível adquirir clientes com esse produto', desc: 'Validar modelo de aquisição e conversão.' }
      ]
    },
    'plataforma': {
      title: 'Qual é o escopo da plataforma?',
      subtitle: 'Que tipo de infraestrutura digital é necessária?',
      options: [
        { title: 'Marketplace ou ecossistema de parceiros', desc: 'Plataforma conectando múltiplos lados do negócio.' },
        { title: 'Portal de alta escala e volume de acessos', desc: 'Infraestrutura robusta com performance garantida.' },
        { title: 'Sistema corporativo interno (ERP/BI)', desc: 'Centralizar dados de toda a organização.' },
        { title: 'Produto com integrações avançadas', desc: 'APIs, webhooks e conectores com múltiplos sistemas externos.' }
      ]
    },
    'outras-solucoes': {
      title: 'O que você mais precisa entender agora?',
      subtitle: 'Ajudamos a esclarecer antes de qualquer investimento técnico.',
      options: [
        { title: 'Diagnóstico de viabilidade e custos', desc: 'Entender faixas de investimento, prazos e complexidade.' },
        { title: 'Mapear prioridades para o momento', desc: 'Descobrir o melhor primeiro passo para a empresa.' },
        { title: 'Consultoria de arquitetura digital', desc: 'Como a tecnologia pode gerar retorno direto.' },
        { title: 'Planejamento de roadmap digital', desc: 'Desenhar evolução escalável sem desperdício de capital.' }
      ]
    }
  };

  // Combo messages for multiple selections
  const COMBO_MESSAGES = {
    'landing-page+automacao': 'Você está combinando presença digital + eficiência operacional — uma combinação poderosa para captação e conversão contínua.',
    'site-institucional+landing-page': 'Estrutura completa de presença digital: autoridade institucional + conversão por campanha.',
    'sistema+automacao': 'Você está desenhando uma operação inteligente — sistema próprio com fluxos automáticos integrados.',
    'saas+mvp': 'Do conceito à plataforma escalável — validar primeiro, construir com inteligência depois.',
    'site-institucional+automacao': 'Presença profissional com operação automatizada — marca forte e equipe eficiente.',
    'default-multiple': 'Você está construindo uma solução combinada. A COGIT vai identificar a arquitetura mais eficiente.'
  };

  // Strategic insight engine
  const INSIGHTS = {
    'site-institucional': {
      scenario: 'Sua empresa precisa de um posicionamento digital sólido para transmitir credibilidade antes de reuniões comerciais.',
      opportunity: 'Aumento de conversão em propostas e fechamentos por transmitir autoridade prévia ao cliente.',
      solution: 'Site Institucional de Autoridade',
      solutionDesc: 'Estrutura multi-página com design exclusivo, apresentação de serviços, cases e SEO On-Page.'
    },
    'landing-page': {
      scenario: 'Sua empresa precisa de um canal direto de atração focado em transformar tráfego em oportunidades de negócio.',
      opportunity: 'Redução no Custo por Lead (CPL) e aumento de conversões com narrativa persuasiva e carregamento veloz.',
      solution: 'Landing Page Estratégica de Alta Conversão',
      solutionDesc: 'Página única com copy direcionada para vendas, carregamento instantâneo e rastreamento completo de métricas.'
    },
    'automacao': {
      scenario: 'A equipe gasta tempo excessivo com tarefas manuais repetitivas e ferramentas desconectadas entre si.',
      opportunity: 'Economia de dezenas de horas semanais, eliminação de falhas humanas e respostas imediatas.',
      solution: 'Automações & Integrações de Fluxo',
      solutionDesc: 'Conexão inteligente entre WhatsApp, CRM, bancos de dados e planilhas para operar no piloto automático.'
    },
    'sistema': {
      scenario: 'Sua operação possui regras de negócio únicas que softwares genéricos de mercado não atendem.',
      opportunity: 'Criação de um ativo proprietário com segurança de dados, escalabilidade operacional e controle total.',
      solution: 'Sistema Web Sob Medida',
      solutionDesc: 'Software personalizado com banco de dados dedicado, área restrita com login e regras exclusivas.'
    },
    'saas': {
      scenario: 'Você possui uma ideia de produto digital que precisa ser construída como tecnologia escalável com receita recorrente.',
      opportunity: 'Geração de MRR (receita recorrente mensal) com um produto que vende enquanto você dorme.',
      solution: 'Plataforma SaaS Escalável',
      solutionDesc: 'Desenvolvimento com foco em onboarding, cobrança recorrente, multiusuários e alta disponibilidade.'
    },
    'mvp': {
      scenario: 'Você tem uma hipótese de produto e precisa testar no mercado real antes de investir em escala.',
      opportunity: 'Validação rápida com menor risco financeiro — descobrir o que funciona antes de construir tudo.',
      solution: 'MVP Ágil & Focado',
      solutionDesc: 'Desenvolvimento enxuto focando nas funcionalidades de maior impacto para validar e tração no mercado.'
    },
    'plataforma': {
      scenario: 'Seu modelo de negócio exige uma infraestrutura digital robusta para operar em alto volume e escala.',
      opportunity: 'Criar um ativo tecnológico de alto valor que sustente o crescimento sem limites de capacidade.',
      solution: 'Plataforma Digital de Alta Escala',
      solutionDesc: 'Arquitetura moderna com APIs escaláveis, painel administrativo robusto e integrações avançadas.'
    },
    'outras-solucoes': {
      scenario: 'Sua empresa entende que precisa avançar digitalmente, mas busca clareza estratégica sobre onde alocar recursos.',
      opportunity: 'Evitar desperdício de tempo e dinheiro construindo a ferramenta errada no momento errado.',
      solution: 'Diagnóstico Técnico Consultivo',
      solutionDesc: 'Reunião de alinhamento com especialistas da COGIT para desenhar a arquitetura e roadmap mais vantajoso.'
    }
  };

  // ── 1. Render Service Cards ──
  function renderServiceCards() {
    if (!servicesGrid) return;
    servicesGrid.innerHTML = SERVICES_CATALOG.map(svc => {
      const isSelected = diagState.selectedServices.some(s => s.id === svc.id);
      const iconSvg = (typeof ICONS !== 'undefined' && ICONS[svc.icon]) ? ICONS[svc.icon] : '';
      return `
        <button type="button"
          class="diag-svc-card ${isSelected ? 'is-selected' : ''}"
          data-svc-id="${svc.id}"
          aria-pressed="${isSelected}"
          title="${svc.name}"
        >
          <div class="diag-svc-check">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="diag-svc-icon">${iconSvg}</div>
          <span class="diag-svc-name">${svc.name}</span>
          <span class="diag-svc-desc">${svc.desc}</span>
          ${svc.price ? `<span class="diag-svc-price">${svc.priceLabel}</span>` : `<span class="diag-svc-price" style="color: var(--text-tertiary);">${svc.priceLabel}</span>`}
        </button>
      `;
    }).join('');

    // Bind click handlers
    servicesGrid.querySelectorAll('.diag-svc-card').forEach(card => {
      card.addEventListener('click', () => toggleService(card.dataset.svcId));
    });
  }

  // ── 2. Toggle Service ──
  function toggleService(svcId) {
    const svc = SERVICES_CATALOG.find(s => s.id === svcId);
    if (!svc) return;

    const existingIdx = diagState.selectedServices.findIndex(s => s.id === svcId);
    if (existingIdx >= 0) {
      diagState.selectedServices.splice(existingIdx, 1);
    } else {
      diagState.selectedServices.push({
        id: svc.id,
        name: svc.name,
        price: svc.price,
        priceLabel: svc.priceLabel,
        challenge: svc.challenge
      });
    }

    // Update card visual
    const cardEl = servicesGrid.querySelector(`[data-svc-id="${svcId}"]`);
    if (cardEl) {
      const selected = diagState.selectedServices.some(s => s.id === svcId);
      cardEl.classList.toggle('is-selected', selected);
      cardEl.setAttribute('aria-pressed', String(selected));
    }

    updatePanel();
    updateSelectionContext();
    updateNextBtn();

    if (typeof trackEvent === 'function') {
      trackEvent('diagnostic_service_toggle', { service: svcId, selected: existingIdx < 0 });
    }
  }

  // ── 3. Update Selection Context Banner ──
  function updateSelectionContext() {
    if (!selectionContext || !selectionContextText) return;
    const count = diagState.selectedServices.length;

    if (count === 0) {
      selectionContext.classList.remove('is-visible');
      return;
    }

    selectionContext.classList.add('is-visible');

    if (count === 1) {
      selectionContextText.textContent = `Você selecionou: ${diagState.selectedServices[0].name}. Avance para definir seu objetivo.`;
    } else {
      const names = diagState.selectedServices.map(s => s.name).join(' + ');
      selectionContextText.textContent = `Você está combinando: ${names}.`;
    }
  }

  // ── 4. Update Next Button (Step 1) ──
  function updateNextBtn() {
    const nextBtn = document.getElementById('diag-next-1');
    if (!nextBtn) return;
    const hasSelection = diagState.selectedServices.length > 0;
    nextBtn.disabled = !hasSelection;
    if (hasSelection) nextBtn.classList.remove('is-disabled');
    else nextBtn.classList.add('is-disabled');
  }

  // ── 5. Update Summary Panel ──
  function updatePanel() {
    if (!panelEmpty || !panelItems) return;
    const count = diagState.selectedServices.length;

    if (count === 0) {
      panelEmpty.style.display = 'block';
      panelItems.style.display = 'none';
      if (panelEstimate) panelEstimate.style.display = 'none';
      if (panelCta) panelCta.style.display = 'none';
      if (panelComboMsg) panelComboMsg.classList.remove('is-visible');
      return;
    }

    panelEmpty.style.display = 'none';
    panelItems.style.display = 'flex';
    if (panelEstimate) panelEstimate.style.display = 'block';
    if (panelCta) panelCta.style.display = 'flex';

    // Render items
    panelItems.innerHTML = diagState.selectedServices.map(svc => `
      <div class="diag-panel-item">
        <div class="diag-panel-item-left">
          <div class="diag-panel-item-dot"></div>
          <span class="diag-panel-item-name">${svc.name}</span>
        </div>
        <span class="diag-panel-item-price">${svc.priceLabel}</span>
      </div>
    `).join('');

    // Estimate
    const numericPrices = diagState.selectedServices.filter(s => s.price !== null).map(s => s.price);
    const hasAnalysis = diagState.selectedServices.some(s => s.price === null);

    if (panelEstimateVal) {
      if (numericPrices.length > 0) {
        const total = numericPrices.reduce((a, b) => a + b, 0);
        const formatted = `R$ ${total.toLocaleString('pt-BR')}`;
        panelEstimateVal.textContent = hasAnalysis ? `A partir de ${formatted}` : `A partir de ${formatted}`;
      } else {
        panelEstimateVal.textContent = 'Sob análise técnica';
      }
    }

    // Combo message
    if (panelComboMsg && count >= 2) {
      const comboKey = diagState.selectedServices.map(s => s.id).sort().join('+');
      const msg = COMBO_MESSAGES[comboKey] || COMBO_MESSAGES['default-multiple'];
      panelComboMsg.textContent = `"${msg}"`;
      panelComboMsg.classList.add('is-visible');
    } else if (panelComboMsg) {
      panelComboMsg.classList.remove('is-visible');
    }
  }

  // ── 6. Render Step 2 Dynamic Options ──
  function renderStep2() {
    if (!step2OptionsEl) return;

    // Determine primary service for objectives
    const primarySvc = diagState.selectedServices[0];
    if (!primarySvc) return;

    const objData = OBJECTIVES_MAP[primarySvc.id] || OBJECTIVES_MAP['outras-solucoes'];

    if (step2Title) step2Title.textContent = objData.title;
    if (step2Subtitle) step2Subtitle.textContent = objData.subtitle;

    step2OptionsEl.innerHTML = objData.options.map((opt, i) => `
      <div class="diag-option-item ${i === 0 ? 'is-selected' : ''}" data-value="${opt.title}">
        <div class="diag-option-content">
          <div class="diag-option-title">${opt.title}</div>
          <div class="diag-option-desc">${opt.desc}</div>
        </div>
        <div class="diag-option-radio"></div>
      </div>
    `).join('');

    diagState.objective = objData.options[0].title;

    step2OptionsEl.querySelectorAll('.diag-option-item').forEach(item => {
      item.addEventListener('click', () => {
        step2OptionsEl.querySelectorAll('.diag-option-item').forEach(it => it.classList.remove('is-selected'));
        item.classList.add('is-selected');
        diagState.objective = item.dataset.value;
      });
    });
  }

  // ── 7. Step Navigation ──
  function goToStep(targetStep) {
    if (targetStep < 1 || targetStep > diagState.totalSteps) return;

    if (targetStep === 2) renderStep2();

    // Hide all steps
    form.querySelectorAll('.diag-step').forEach(st => st.classList.remove('is-active'));

    // Show target
    const targetEl = form.querySelector(`.diag-step[data-step="${targetStep}"]`);
    if (targetEl) targetEl.classList.add('is-active');

    diagState.step = targetStep;
    updateProgressBar();

    // Scroll
    const diagSection = document.getElementById('diagnostic-experience');
    if (diagSection) {
      const headerH = document.querySelector('.header')?.offsetHeight || 80;
      const top = diagSection.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }

    if (typeof trackEvent === 'function') {
      trackEvent('diagnostic_step', { step: targetStep, step_name: stepNames[targetStep] });
    }
  }

  // ── 8. Update Progress Bar ──
  function updateProgressBar() {
    if (!progressFill) return;
    const pct = ((diagState.step / diagState.totalSteps) * 100).toFixed(1);
    progressFill.style.width = `${pct}%`;

    if (stepLabelsEl) {
      stepLabelsEl.innerHTML = Object.entries(stepNames).map(([num, label]) => {
        const n = parseInt(num, 10);
        let cls = '';
        if (n === diagState.step) cls = 'is-active';
        else if (n < diagState.step) cls = 'is-done';
        return `
          <div class="diag-progress-label-item ${cls}">
            <div class="diag-progress-step-dot">${n < diagState.step ? '✓' : n}</div>
            ${label}
          </div>
          ${n < diagState.totalSteps ? '<span class="diag-progress-step-sep">→</span>' : ''}
        `;
      }).join('');
    }
  }

  // ── 9. Strategic Insight Generation ──
  function generateInsights() {
    const primary = diagState.selectedServices[0];
    if (!primary) return;

    const insight = INSIGHTS[primary.id] || INSIGHTS['outras-solucoes'];

    const challenge = diagState.selectedServices.map(s => s.name).join(' + ');

    const elChallenge = document.getElementById('res-challenge-title');
    const elScenario = document.getElementById('res-scenario-desc');
    const elOppTitle = document.getElementById('res-opportunity-title');
    const elOppDesc = document.getElementById('res-opportunity-desc');
    const elSolTitle = document.getElementById('res-solution-title');
    const elSolDesc = document.getElementById('res-solution-desc');

    if (elChallenge) elChallenge.textContent = challenge;
    if (elScenario) elScenario.textContent = insight.scenario;
    if (elOppTitle) elOppTitle.textContent = diagState.objective || insight.opportunity;
    if (elOppDesc) elOppDesc.textContent = insight.opportunity;
    if (elSolTitle) elSolTitle.textContent = insight.solution;
    if (elSolDesc) elSolDesc.textContent = insight.solutionDesc;

    // WhatsApp link
    const wa = buildWhatsAppLink();
    const waCta = document.getElementById('res-whatsapp-cta');
    if (waCta) waCta.href = wa;
  }

  // ── 10. Build WhatsApp Link ──
  function buildWhatsAppLink() {
    const phone = '5517981568889';
    const services = diagState.selectedServices.map(s => `- ${s.name} (${s.priceLabel})`).join('\n');
    const msg = `Olá, equipe da COGIT! Realizei o *COGIT Diagnostic* e configurei minha solução:

🛠️ *Soluções selecionadas:*
${services}

🚀 *Objetivo estratégico:* ${diagState.objective}
📝 *Contexto:* ${diagState.context || 'Não informado'}

👤 *Nome:* ${diagState.name}
🏢 *Empresa:* ${diagState.company || 'Não informada'}
📱 *WhatsApp:* ${diagState.whatsapp}
✉️ *E-mail:* ${diagState.email}

Gostaria de receber a orientação estratégica da COGIT!`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }

  // ── 11. Auto-Detect Context from URL ──
  function autoDetectContext() {
    const urlParams = new URLSearchParams(window.location.search);
    const sol = urlParams.get('solucao') || urlParams.get('produto') || sessionStorage.getItem('cogit_preselect');
    const ref = document.referrer.toLowerCase();

    let preselect = null;
    if (sol) {
      const s = sol.toLowerCase();
      if (s.includes('landing') || s === 'lp') preselect = 'landing-page';
      else if (s.includes('site') || s.includes('institucional')) preselect = 'site-institucional';
      else if (s.includes('start') || s.includes('portfolio')) preselect = 'landing-page';
      else if (s.includes('automacao')) preselect = 'automacao';
      else if (s.includes('sistema') || s.includes('software')) preselect = 'sistema';
      else if (s.includes('saas')) preselect = 'saas';
      else if (s.includes('mvp')) preselect = 'mvp';
      else if (s.includes('plataforma')) preselect = 'plataforma';
    } else if (ref) {
      if (ref.includes('landing-pages')) preselect = 'landing-page';
      else if (ref.includes('sites-institucionais') || ref.includes('cogit-start')) preselect = 'site-institucional';
      else if (ref.includes('automacoes')) preselect = 'automacao';
      else if (ref.includes('sistemas-personalizados')) preselect = 'sistema';
      else if (ref.includes('saas-e-produtos')) preselect = 'saas';
    }

    if (preselect) toggleService(preselect);
  }

  // ── 12. WhatsApp Mask ──
  const waInput = document.getElementById('diag-whatsapp');
  if (waInput) {
    waInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      if (v.length > 7) v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
      else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
      else if (v.length > 0) v = `(${v}`;
      e.target.value = v;
    });
  }

  // ── 13. Validation ──
  function validateContact() {
    const name = document.getElementById('diag-name');
    const email = document.getElementById('diag-email');
    const wa = document.getElementById('diag-whatsapp');
    let valid = true;

    function check(field, isEmail = false, isPhone = false) {
      const group = field.closest('.form-group');
      const errEl = group?.querySelector('.form-error');
      const val = field.value.trim();
      let err = '';
      if (!val) err = 'Campo obrigatório';
      else if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) err = 'E-mail inválido';
      else if (isPhone && val.replace(/\D/g, '').length < 10) err = 'WhatsApp inválido com DDD';

      if (err) {
        group?.classList.add('has-error');
        if (errEl) errEl.textContent = err;
        return false;
      }
      group?.classList.remove('has-error');
      if (errEl) errEl.textContent = '';
      return true;
    }

    if (!check(name)) valid = false;
    if (!check(wa, false, true)) valid = false;
    if (!check(email, true, false)) valid = false;
    return valid;
  }

  // ── 14. Event Listeners ──

  // Next buttons (all steps)
  form.querySelectorAll('.diag-btn-next').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const n = parseInt(btn.dataset.next, 10);
      if (n) goToStep(n);
    });
  });

  // Prev buttons
  form.querySelectorAll('.diag-btn-prev').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const p = parseInt(btn.dataset.prev, 10);
      if (p) goToStep(p);
    });
  });

  // Panel CTA → jump to step 2
  if (panelCtaBtn) {
    panelCtaBtn.addEventListener('click', () => {
      if (diagState.selectedServices.length > 0) goToStep(2);
    });
  }

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateContact()) {
      form.querySelector('.has-error input')?.focus();
      return;
    }

    diagState.name = document.getElementById('diag-name')?.value.trim() || '';
    diagState.email = document.getElementById('diag-email')?.value.trim() || '';
    diagState.whatsapp = document.getElementById('diag-whatsapp')?.value.trim() || '';
    diagState.company = document.getElementById('diag-company')?.value.trim() || '';
    diagState.context = document.getElementById('diag-context-desc')?.value.trim() || '';

    generateInsights();

    // Analytics
    if (typeof trackEvent === 'function') {
      trackEvent('diagnostic_completed', {
        event_category: 'consulting_diagnostic',
        services: diagState.selectedServices.map(s => s.id).join(','),
        objective: diagState.objective
      });
    }

    console.log('COGIT Diagnostic Completed:', {
      services: diagState.selectedServices,
      objective: diagState.objective,
      context: diagState.context,
      contact: { name: diagState.name, email: diagState.email, whatsapp: diagState.whatsapp, company: diagState.company }
    });

    // Show result
    if (configuratorLayout) configuratorLayout.style.display = 'none';
    if (resultScreen) {
      resultScreen.style.display = 'block';
      resultScreen.classList.add('is-active');
      resultScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Reset
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      diagState.selectedServices = [];
      diagState.objective = '';
      diagState.step = 1;

      if (resultScreen) { resultScreen.style.display = 'none'; resultScreen.classList.remove('is-active'); }
      if (configuratorLayout) configuratorLayout.style.display = 'grid';

      form.querySelectorAll('.diag-step').forEach(st => st.classList.remove('is-active'));
      const step1 = form.querySelector('.diag-step[data-step="1"]');
      if (step1) step1.classList.add('is-active');

      renderServiceCards();
      updatePanel();
      updateProgressBar();
      updateNextBtn();
      if (selectionContext) selectionContext.classList.remove('is-visible');
    });
  }

  // ── 15. Initialise ──
  renderServiceCards();
  updateProgressBar();
  updateNextBtn();
  updatePanel();
  autoDetectContext();
}
