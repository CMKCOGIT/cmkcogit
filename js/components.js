/* ============================================
   COGIT — Dynamic Component Rendering
   Renders data-driven sections from data.js
   ============================================ */

function getIcon(name) {
  return ICONS[name] || '';
}

// ── Render Challenge Grid ──
function renderChallenge() {
  const container = document.getElementById('challenge-grid');
  if (!container || typeof challengeData === 'undefined' || !challengeData.length) return;

  container.innerHTML = challengeData.map((item, i) => `
    <a href="${item.ctaLink}" class="challenge-card reveal reveal-delay-${i + 1}" id="challenge-${item.id}">
      <div class="challenge-card-icon">${getIcon(item.icon)}</div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <div class="challenge-card-tags">
        ${item.tags.map(t => `<span>${t}</span>`).join('')}
      </div>
      <span class="challenge-card-cta">${item.cta}</span>
    </a>
  `).join('');
}

// ── Render Hero Interactive — COGIT Diagnostic (Configurador: Grid de Serviços + Objetivo + Contexto + Resultado) ──
function renderHeroInteractive() {
  const container = document.getElementById('hero-interactive-container');
  if (!container) return;

  // ── Desafios de negócio ──
  const CHALLENGES = [
    { id: 'presenca', title: 'Presença digital', phrase: 'Fortalecer marca e gerar novas oportunidades.',
      iconSvg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="15" rx="2.5"/><line x1="2" y1="8" x2="22" y2="8"/><circle cx="5.5" cy="5.5" r="0.75" fill="currentColor"/><circle cx="8" cy="5.5" r="0.75" fill="currentColor"/><path d="M8 21h8"/><path d="M12 18v3"/></svg>'
    },
    { id: 'automacao', title: 'Automação', phrase: 'Eliminar tarefas manuais e melhorar processos.',
      iconSvg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="15" y="15" width="6" height="6" rx="1.5"/><circle cx="6" cy="18" r="2"/><path d="M9 6h5a2 2 0 0 1 2 2v7"/><path d="M6 9v7"/><polyline points="13 13 16 16 13 19"/></svg>'
    },
    { id: 'sistema', title: 'Sistema', phrase: 'Criar uma solução para uma operação específica.',
      iconSvg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/><path d="M7 11v2"/><path d="M17 11v2"/><path d="M11 7h2"/><path d="M11 17h2"/></svg>'
    },
    { id: 'produto', title: 'Produto digital', phrase: 'Transformar uma ideia em plataforma escalável.',
      iconSvg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 12l10 5 10-5"/><path d="M2 17l10 5 10-5"/></svg>'
    },
    { id: 'outro', title: 'Outro desafio', phrase: 'Encontrar o melhor caminho tecnológico.',
      iconSvg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/></svg>'
    }
  ];

  // ── Grid de Serviços com ícone + descrição + preço (Etapa 1) ──
  const SERVICES_GRID = [
    { id: 'site-institucional', name: 'Site Institucional', desc: 'Presença completa com autoridade.', priceLabel: 'A partir de R$ 1.990', challenge: 'presenca',
      iconSvg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>'
    },
    { id: 'landing-page', name: 'Landing Page', desc: 'Página estratégica para conversão.', priceLabel: 'A partir de R$ 990', challenge: 'presenca',
      iconSvg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><path d="M9 13l3 3 5-5"/></svg>'
    },
    { id: 'automacao-svc', name: 'Automação', desc: 'Elimine tarefas e conecte ferramentas.', priceLabel: 'A partir de R$ 990', challenge: 'automacao',
      iconSvg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="10" width="4" height="4" rx="1"/><rect x="17" y="10" width="4" height="4" rx="1"/><rect x="10" y="3" width="4" height="4" rx="1"/><rect x="10" y="17" width="4" height="4" rx="1"/><path d="M7 12h3M14 12h3M12 7v3M12 14v3"/></svg>'
    },
    { id: 'sistema-svc', name: 'Sistema Web', desc: 'Software exclusivo para sua operação.', priceLabel: 'A partir de R$ 7.900', challenge: 'sistema',
      iconSvg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M10 6h4M10 17h4M6 10v4M17 10v4"/></svg>'
    },
    { id: 'saas-svc', name: 'SaaS', desc: 'Plataforma com multiusuários e assinatura.', priceLabel: 'A partir de R$ 14.900', challenge: 'produto',
      iconSvg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>'
    },
    { id: 'mvp-svc', name: 'MVP', desc: 'Versão mínima para validar sua ideia.', priceLabel: 'A partir de R$ 9.900', challenge: 'produto',
      iconSvg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>'
    },
    { id: 'plataforma-svc', name: 'Plataforma', desc: 'Infraestrutura digital escalável e robusta.', priceLabel: 'A partir de R$ 11.900', challenge: 'produto',
      iconSvg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>'
    },
    { id: 'outro-svc', name: 'Outra Solução', desc: 'IA, integrações, consultoria e projetos únicos.', priceLabel: 'Sob consulta', challenge: 'outro',
      iconSvg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h6v6H4z"/><path d="M14 4h6v6h-6z"/><path d="M14 14h6v6h-6z"/><path d="M4 14h6v6H4z"/><path d="M10 7h4M10 17h4M7 10v4M17 10v4"/></svg>'
    }
  ];

  // ── Objetivos dinâmicos por serviço selecionado (Etapa 2) ──
  const OBJECTIVES_BY_SERVICE = {
    'mvp-svc': [
      { id: 'tirar-papel', label: 'Tirar minha ideia do papel' },
      { id: 'mvp-funcional', label: 'Criar um MVP funcional' },
      { id: 'validar-conceito', label: 'Validar meu conceito' },
      { id: 'testar-solucao', label: 'Testar uma nova solução' }
    ],
    'saas-svc': [
      { id: 'plataforma-escalavel', label: 'Criar uma plataforma escalável' },
      { id: 'ideia-em-produto', label: 'Transformar minha ideia em produto' },
      { id: 'sistema-assinatura', label: 'Criar um sistema por assinatura' },
      { id: 'validar-modelo', label: 'Validar modelo de negócio' }
    ],
    'plataforma-svc': [
      { id: 'plataforma-escalavel', label: 'Criar uma plataforma escalável' },
      { id: 'ideia-em-produto', label: 'Transformar minha ideia em produto' },
      { id: 'sistema-assinatura', label: 'Criar um sistema por assinatura' },
      { id: 'validar-modelo', label: 'Validar modelo de negócio' }
    ],
    'automacao-svc': [
      { id: 'automatizar-processos', label: 'Automatizar processos internos' },
      { id: 'reduzir-tarefas', label: 'Reduzir tarefas manuais' },
      { id: 'integrar-ferramentas', label: 'Integrar ferramentas existentes' },
      { id: 'fluxos-inteligentes', label: 'Criar fluxos inteligentes' }
    ],
    'sistema-svc': [
      { id: 'sistema-personalizado', label: 'Criar um sistema personalizado' },
      { id: 'melhorar-operacao', label: 'Melhorar minha operação' },
      { id: 'centralizar-informacoes', label: 'Centralizar informações' },
      { id: 'digitalizar-processos', label: 'Digitalizar processos' }
    ],
    'landing-page': [
      { id: 'captar-clientes', label: 'Captar novos clientes' },
      { id: 'apresentar-produto', label: 'Apresentar um produto' },
      { id: 'pagina-vendas', label: 'Criar uma página de vendas' },
      { id: 'validar-oferta', label: 'Validar uma oferta' }
    ],
    'site-institucional': [
      { id: 'apresentar-empresa', label: 'Apresentar minha empresa' },
      { id: 'fortalecer-marca', label: 'Fortalecer minha marca' },
      { id: 'gerar-autoridade', label: 'Gerar autoridade online' },
      { id: 'atrair-clientes', label: 'Atrair novos clientes' }
    ],
    'outro-svc': [
      { id: 'desafio-especifico', label: 'Resolver um desafio específico' },
      { id: 'explorar-tecnologia', label: 'Explorar possibilidades tecnológicas' },
      { id: 'avaliar-viabilidade', label: 'Avaliar viabilidade de um projeto' },
      { id: 'consultoria-medida', label: 'Consultoria e solução sob medida' }
    ]
  };

  function getObjectives(serviceId) {
    return OBJECTIVES_BY_SERVICE[serviceId] || OBJECTIVES_BY_SERVICE['site-institucional'];
  }

  // ── Mapeamento de resultado (Serviço + Objetivo) ──
  const SOLUTIONS_MAP = {
    // MVP
    'mvp-svc:tirar-papel': { solution: 'MVP Ágil e Funcional', desc: 'Transformar sua ideia em uma aplicação real no menor tempo e investimento viável.' },
    'mvp-svc:mvp-funcional': { solution: 'MVP Estruturado para Usuários Reais', desc: 'Versão com as principais funcionalidades para validar proposta de valor e coletar feedback.' },
    'mvp-svc:validar-conceito': { solution: 'Protótipo Funcional de Validação', desc: 'Testar a aceitação do público e principais hipóteses antes de escalar o desenvolvimento.' },
    'mvp-svc:testar-solucao': { solution: 'MVP de Teste de Mercado', desc: 'Desenvolvimento focado nas features críticas para mensurar viabilidade e retenção.' },

    // SaaS
    'saas-svc:plataforma-escalavel': { solution: 'Plataforma SaaS Escalável', desc: 'Arquitetura moderna em nuvem preparada para crescimento contínuo e alto volume de acessos.' },
    'saas-svc:ideia-em-produto': { solution: 'Produto Digital SaaS', desc: 'Estruturação completa de produto digital, do back-end robusto à experiência do usuário.' },
    'saas-svc:sistema-assinatura': { solution: 'Plataforma com Gestão de Assinaturas', desc: 'Controle automatizado de planos, cobranças recorrentes e liberação de acessos.' },
    'saas-svc:validar-modelo': { solution: 'SaaS Beta / Validação Comercial', desc: 'Primeira versão do produto digital para testar monetização e métricas de retenção.' },

    // Plataforma
    'plataforma-svc:plataforma-escalavel': { solution: 'Plataforma Digital Escalável', desc: 'Infraestrutura robusta para conectar múltiplos perfis de usuários com alto desempenho.' },
    'plataforma-svc:ideia-em-produto': { solution: 'Desenvolvimento de Plataforma Digital', desc: 'Engenharia de software focada em regras de negócio complexas e experiência intuitiva.' },
    'plataforma-svc:sistema-assinatura': { solution: 'Plataforma com Módulos e Permissões', desc: 'Controle granular de acessos, relatórios e monetização por perfil.' },
    'plataforma-svc:validar-modelo': { solution: 'Plataforma Piloto', desc: 'Lançamento piloto controlado para validação técnica e comercial.' },

    // Automação
    'automacao-svc:automatizar-processos': { solution: 'Automação de Processos Internos', desc: 'Eliminar gargalos operacionais e tarefas manuais recorrentes entre ferramentas.' },
    'automacao-svc:reduzir-tarefas': { solution: 'Fluxos Automatizados de Produtividade', desc: 'Liberar tempo da equipe substituindo atividades manuais por integrações inteligentes.' },
    'automacao-svc:integrar-ferramentas': { solution: 'Integrações via API e Webhooks', desc: 'Conectar CRMs, ERPs, gateways de pagamento e canais de comunicação em um fluxo único.' },
    'automacao-svc:fluxos-inteligentes': { solution: 'Automações Inteligentes com Notificações', desc: 'Alertas automáticos, disparo de mensagens e relatórios em tempo real para sua equipe.' },

    // Sistema Web
    'sistema-svc:sistema-personalizado': { solution: 'Sistema Web Sob Medida', desc: 'Software exclusivo desenvolvido para atender exatamente às regras e fluxos do seu negócio.' },
    'sistema-svc:melhorar-operacao': { solution: 'Plataforma de Gestão Operacional', desc: 'Organizar fluxos de trabalho, controle de demandas e histórico de atividades em um ambiente seguro.' },
    'sistema-svc:centralizar-informacoes': { solution: 'Painel Administrativo Centralizado', desc: 'Centralizar dados, dashboards e controles antes dispersos em múltiplos locais.' },
    'sistema-svc:digitalizar-processos': { solution: 'Aplicação Web de Digitalização', desc: 'Substituir planilhas e processos em papel por uma aplicação robusta com permissões e auditoria.' },

    // Landing Page
    'landing-page:captar-clientes': { solution: 'Landing Page de Alta Conversão', desc: 'Página direcionada para tráfego pago com copy persuasiva e foco em captação de leads.' },
    'landing-page:apresentar-produto': { solution: 'Landing Page de Produto', desc: 'Apresentação visual impactante destacando benefícios, demonstração e diferenciais.' },
    'landing-page:pagina-vendas': { solution: 'Página de Vendas Estratégica', desc: 'Estrutura completa com storytelling, quebra de objeções e chamada para ação direta.' },
    'landing-page:validar-oferta': { solution: 'Página de Validação de Oferta', desc: 'Estrutura ágil para mensurar interesse real do público antes de grandes investimentos.' },

    // Site Institucional
    'site-institucional:apresentar-empresa': { solution: 'Site Institucional Estruturado', desc: 'Apresentar sua história, diferenciais e serviços com clareza e autoridade institucional.' },
    'site-institucional:fortalecer-marca': { solution: 'Site Institucional de Alto Padrão', desc: 'Posicionar sua marca como referência no setor com design moderno e identidade consistente.' },
    'site-institucional:gerar-autoridade': { solution: 'Site com Portfólio e Cases', desc: 'Demonstrar credibilidade no mercado através de depoimentos, cases e certificações.' },
    'site-institucional:atrair-clientes': { solution: 'Site Institucional com Foco Comercial', desc: 'Estruturar canais de contato, formulários e CTAs para atrair e converter novas oportunidades.' },

    // Outra Solução
    'outro-svc:desafio-especifico': { solution: 'Consultoria e Solução Personalizada', desc: 'Análise aprofundada do seu desafio para desenhar a arquitetura técnica ideal.' },
    'outro-svc:explorar-tecnologia': { solution: 'Diagnóstico e Mapeamento Tecnológico', desc: 'Explorar tecnologias modernas e automações que podem alavancar seu negócio.' },
    'outro-svc:avaliar-viabilidade': { solution: 'Análise de Viabilidade Técnica e Estimativa', desc: 'Dimensionamento de escopo, prazos, riscos e investimentos para o projeto.' },
    'outro-svc:consultoria-medida': { solution: 'Solução Tecnológica Sob Medida', desc: 'Desenvolvimento personalizado de acordo com as necessidades exclusivas da sua empresa.' }
  };

  function getSolution(serviceId, objectiveId) {
    const key = `${serviceId}:${objectiveId}`;
    return SOLUTIONS_MAP[key] || { solution: 'Solução tecnológica sob medida', desc: 'A COGIT irá analisar seu cenário e propor o caminho mais adequado.' };
  }

  // ── State ──
  const state = {
    step: 0,
    challenge: null,
    selectedService: null,
    objective: null,
    context: ''
  };

  try {
    const saved = sessionStorage.getItem('cogit_diag_state');
    if (saved) {
      const p = JSON.parse(saved);
      if (p) {
        state.challenge = p.challenge || null;
        state.selectedService = p.selectedService || null;
        state.objective = p.objective || null;
        state.context = p.context || '';
      }
    }
  } catch (e) {}

  function saveState() {
    try { sessionStorage.setItem('cogit_diag_state', JSON.stringify({ challenge: state.challenge, selectedService: state.selectedService, objective: state.objective, context: state.context })); } catch (e) {}
  }

  function transitionTo(renderFn, direction = 'next') {
    const wrapper = container.querySelector('.hero-step-wrapper');
    if (wrapper) {
      wrapper.classList.add(direction === 'next' ? 'is-fading-left' : 'is-fading-right');
      setTimeout(() => {
        renderFn();
        const nw = container.querySelector('.hero-step-wrapper');
        if (nw) {
          nw.classList.add(direction === 'next' ? 'is-entering-right' : 'is-entering-left');
          requestAnimationFrame(() => setTimeout(() => nw.classList.remove('is-entering-right', 'is-entering-left'), 30));
        }
      }, 150);
    } else { renderFn(); }
  }

  function renderProgressDots(currentStep, total) {
    const labels = ['Solução', 'Objetivo', 'Contexto'];
    return `<div class="hero-diag-dots">
      ${labels.map((label, i) => {
        const n = i + 1;
        const isDone = currentStep > n;
        const isActive = currentStep === n;
        return `<div class="hero-diag-dot-item ${isDone ? 'is-done' : ''} ${isActive ? 'is-active' : ''}">
          <div class="hero-diag-dot">${isDone ? '<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>' : n}</div>
          <span class="hero-diag-dot-label">${label}</span>
        </div>${i < labels.length - 1 ? `<div class="hero-diag-dot-line${isDone ? ' is-done' : ''}"></div>` : ''}`;
      }).join('')}
    </div>`;
  }

  // ── ETAPA 0: Convite ──
  function renderStep0() {
    state.step = 0;
    container.innerHTML = `
      <div class="hero-step-wrapper hero-invite-view">
        <div class="hero-invite-content">
          <div class="hero-invite-text">
            <p class="hero-invite-eyebrow">COGIT DIAGNOSTIC</p>
            <h2 class="hero-invite-title">Qual é o próximo passo digital da sua empresa?</h2>
          </div>
          <button type="button" class="btn-hero-montar btn-hero-start" id="hero-btn-start">
            Iniciar diagnóstico <span>→</span>
          </button>
        </div>
      </div>
    `;
    const startBtn = document.getElementById('hero-btn-start');
    if (startBtn) startBtn.addEventListener('click', () => transitionTo(renderStep1, 'next'));
  }

  // ── ETAPA 1: Grid de Serviços (seleção única → define challenge) ──
  function renderStep1() {
    state.step = 1;

    const cardsHtml = SERVICES_GRID.map(svc => `
      <button type="button"
        class="hero-svc-card ${state.selectedService === svc.id ? 'is-selected' : ''}"
        data-id="${svc.id}" data-challenge="${svc.challenge}"
        aria-pressed="${state.selectedService === svc.id}"
      >
        <div class="hero-svc-check">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="hero-svc-icon">${svc.iconSvg}</div>
        <span class="hero-svc-name">${svc.name}</span>
      </button>
    `).join('');

    container.innerHTML = `
      <div class="hero-step-wrapper hero-step-1-view">
        <div class="hero-interactive-header">
          <div class="hero-discovery-topbar">
            <span class="hero-discovery-tag">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              COGIT DIAGNOSTIC
            </span>
            ${renderProgressDots(1, 3)}
          </div>
          <h2 class="hero-interactive-title">O que você precisa construir?</h2>
          <p class="hero-interactive-desc">Selecione o serviço que representa melhor sua necessidade.</p>
        </div>

        <div class="hero-svc-grid" role="group" aria-label="Selecione um serviço">
          ${cardsHtml}
        </div>

        <div class="hero-discovery-footer">
          <button type="button" class="btn-hero-back hero-btn-back-invite" id="hero-btn-back-invite">← Voltar</button>
          <button type="button" class="btn-hero-montar" id="hero-btn-continue-1" ${state.selectedService ? '' : 'disabled'}>
            Definir objetivo <span>→</span>
          </button>
        </div>
      </div>
    `;

    const cards = container.querySelectorAll('.hero-svc-card');
    const continueBtn = document.getElementById('hero-btn-continue-1');
    const backBtn = document.getElementById('hero-btn-back-invite');

    cards.forEach(card => {
      card.addEventListener('click', () => {
        state.selectedService = card.dataset.id;
        state.challenge = card.dataset.challenge;
        state.objective = null;
        saveState();
        cards.forEach(c => { c.classList.remove('is-selected'); c.setAttribute('aria-pressed', 'false'); });
        card.classList.add('is-selected');
        card.setAttribute('aria-pressed', 'true');
        if (continueBtn) continueBtn.removeAttribute('disabled');
        if (typeof trackEvent === 'function') trackEvent('hero_service_selected', card.dataset.id);
      });
    });

    if (backBtn) backBtn.addEventListener('click', () => transitionTo(renderStep0, 'back'));
    if (continueBtn) continueBtn.addEventListener('click', () => {
      if (!state.selectedService) return;
      transitionTo(renderStep2, 'next');
    });
  }

  // ── ETAPA 2: Grid de Objetivos Dinâmicos (Cards Quadrados) ──
  function renderStep2() {
    state.step = 2;

    const selectedSvc = SERVICES_GRID.find(s => s.id === state.selectedService);
    const objectives = getObjectives(state.selectedService);

    const cardsHtml = objectives.map(obj => `
      <button type="button"
        class="hero-objective-card ${state.objective === obj.id ? 'is-selected' : ''}"
        data-id="${obj.id}"
        aria-pressed="${state.objective === obj.id}"
      >
        <div class="hero-objective-check">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <span class="hero-objective-text">${obj.label}</span>
      </button>
    `).join('');

    container.innerHTML = `
      <div class="hero-step-wrapper hero-step-2-view">
        <div class="hero-interactive-header">
          <div class="hero-discovery-topbar">
            <span class="hero-discovery-tag">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="12" r="10"/><path d="M12 17h.01"/></svg>
              OBJETIVO
            </span>
            ${renderProgressDots(2, 3)}
          </div>

          <div class="hero-challenge-context-bar">
            <span class="hero-challenge-context-icon">${selectedSvc ? selectedSvc.iconSvg : ''}</span>
            <span class="hero-challenge-context-name">${selectedSvc ? selectedSvc.name : 'Solução selecionada'}</span>
            <span class="hero-challenge-context-price">${selectedSvc ? selectedSvc.priceLabel : ''}</span>
            <button type="button" class="hero-btn-edit-step" id="hero-btn-edit-challenge">Alterar</button>
          </div>

          <h2 class="hero-interactive-title" style="margin-top:10px;">Qual resultado você busca?</h2>
          <p class="hero-interactive-desc">Selecione o objetivo mais próximo da sua necessidade.</p>
        </div>

        <div class="hero-objective-grid" role="group" aria-label="Selecione o objetivo">
          ${cardsHtml}
        </div>

        <div class="hero-discovery-footer" style="margin-top: var(--space-4);">
          <button type="button" class="btn-hero-back" id="hero-btn-back-2">← Voltar</button>
          <button type="button" class="btn-hero-montar" id="hero-btn-continue-2" ${state.objective ? '' : 'disabled'}>
            Continuar <span>→</span>
          </button>
        </div>
      </div>
    `;

    const cards = container.querySelectorAll('.hero-objective-card');
    const continueBtn = document.getElementById('hero-btn-continue-2');
    const backBtn = document.getElementById('hero-btn-back-2');
    const editBtn = document.getElementById('hero-btn-edit-challenge');

    cards.forEach(card => {
      card.addEventListener('click', () => {
        state.objective = card.dataset.id;
        saveState();
        cards.forEach(c => {
          c.classList.remove('is-selected');
          c.setAttribute('aria-pressed', 'false');
        });
        card.classList.add('is-selected');
        card.setAttribute('aria-pressed', 'true');
        if (continueBtn) continueBtn.removeAttribute('disabled');
        if (typeof trackEvent === 'function') trackEvent('hero_objective_selected', card.dataset.id);
      });
    });

    if (backBtn) backBtn.addEventListener('click', () => transitionTo(renderStep1, 'back'));
    if (editBtn) editBtn.addEventListener('click', () => transitionTo(renderStep1, 'back'));
    if (continueBtn) continueBtn.addEventListener('click', () => {
      if (!state.objective) return;
      transitionTo(renderStep3, 'next');
    });
  }

  // ── ETAPA 3: Contexto ──
  function renderStep3() {
    state.step = 3;

    container.innerHTML = `
      <div class="hero-step-wrapper hero-step-3-view">
        <div class="hero-interactive-header">
          <div class="hero-discovery-topbar">
            <span class="hero-discovery-tag">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              CONTEXTO
            </span>
            ${renderProgressDots(3, 3)}
          </div>
          <h2 class="hero-interactive-title">Existe algo específico que devemos entender?</h2>
          <p class="hero-interactive-desc">Campo opcional — nos ajuda a direcionar melhor sua orientação.</p>
        </div>

        <div class="hero-context-field">
          <textarea id="hero-context-input" class="hero-textarea hero-textarea-lg" rows="4"
            placeholder="Ex: Hoje controlamos tudo por planilhas e queremos organizar nosso processo de vendas...">${state.context || ''}</textarea>
        </div>

        <div class="hero-discovery-footer" style="margin-top: var(--space-4);">
          <button type="button" class="btn-hero-back" id="hero-btn-back-3">← Voltar</button>
          <button type="button" class="btn-hero-montar" id="hero-btn-finalize">
            Gerar diagnóstico <span>→</span>
          </button>
        </div>
      </div>
    `;

    const textarea = document.getElementById('hero-context-input');
    const backBtn = document.getElementById('hero-btn-back-3');
    const finalBtn = document.getElementById('hero-btn-finalize');

    if (textarea) textarea.addEventListener('input', e => { state.context = e.target.value; saveState(); });
    if (backBtn) backBtn.addEventListener('click', () => transitionTo(renderStep2, 'back'));
    if (finalBtn) finalBtn.addEventListener('click', () => {
      if (textarea) state.context = textarea.value;
      saveState();
      transitionTo(renderAnalyzing, 'next');
    });
  }

  // ── TELA INTERMEDIÁRIA: Analisando ──
  function renderAnalyzing() {
    container.innerHTML = `
      <div class="hero-step-wrapper hero-analyzing-view">
        <div class="hero-analyzing-content">
          <div class="hero-analyzing-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <p class="hero-analyzing-label">Identificando seu cenário...</p>
          <div class="hero-analyzing-checks">
            <div class="hero-analyzing-check" id="acheck-1">
              <div class="hero-analyzing-check-dot"></div>
              <span>Solução identificada</span>
            </div>
            <div class="hero-analyzing-check" id="acheck-2">
              <div class="hero-analyzing-check-dot"></div>
              <span>Objetivo mapeado</span>
            </div>
            <div class="hero-analyzing-check" id="acheck-3">
              <div class="hero-analyzing-check-dot"></div>
              <span>Direcionamento estratégico definido</span>
            </div>
          </div>
        </div>
      </div>
    `;

    ['acheck-1', 'acheck-2', 'acheck-3'].forEach((id, i) => {
      setTimeout(() => { const el = document.getElementById(id); if (el) el.classList.add('is-done'); }, 450 + i * 430);
    });
    setTimeout(() => transitionTo(renderResult, 'next'), 450 + 3 * 430 + 650);
  }

  // ── RESULTADO: Diagnóstico Consultivo ──
  function renderResult() {
    const selectedSvc = SERVICES_GRID.find(s => s.id === state.selectedService);
    const objectives = getObjectives(state.selectedService);
    const objData = objectives.find(o => o.id === state.objective);
    const solution = getSolution(state.selectedService, state.objective);

    const phone = '5517981568889';
    const svcName = selectedSvc ? selectedSvc.name : 'Solução Digital';
    let waMsg = `Olá! Fiz um diagnóstico no site da COGIT:\n\n*Solução de interesse:* ${svcName}\n*Objetivo:* ${objData ? objData.label : (state.objective || 'Definir objetivo')}\n*Direcionamento:* ${solution.solution}`;
    if (state.context && state.context.trim()) waMsg += `\n*Contexto:* ${state.context.trim()}`;
    waMsg += `\n\nGostaria de receber uma orientação técnica da equipe COGIT!`;
    const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(waMsg)}`;

    container.innerHTML = `
      <div class="hero-step-wrapper hero-result-view">
        <div class="hero-interactive-header">
          <div class="hero-discovery-topbar">
            <span class="hero-discovery-tag hero-discovery-tag--success">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              DIAGNÓSTICO CONCLUÍDO
            </span>
          </div>
          <h2 class="hero-interactive-title">Entendemos seu cenário.</h2>
          <p class="hero-interactive-desc">Identificamos uma possível direção para o seu momento.</p>
        </div>

        <div class="hero-result-card">
          <div class="hero-result-row">
            <span class="hero-result-label">Solução selecionada</span>
            <span class="hero-result-value">
              <span class="hero-result-icon-inline">${selectedSvc ? selectedSvc.iconSvg : ''}</span>
              ${svcName}
            </span>
          </div>
          <div class="hero-result-divider"></div>
          <div class="hero-result-row">
            <span class="hero-result-label">Investimento inicial</span>
            <span class="hero-result-value hero-result-value--accent">${selectedSvc ? selectedSvc.priceLabel : 'Sob consulta'}</span>
          </div>
          <div class="hero-result-divider"></div>
          <div class="hero-result-row">
            <span class="hero-result-label">Objetivo</span>
            <span class="hero-result-value">${objData ? objData.label : (state.objective || '—')}</span>
          </div>
          <div class="hero-result-divider"></div>
          <div class="hero-result-row hero-result-row--desc">
            <span class="hero-result-label">Direção recomendada</span>
            <span class="hero-result-value hero-result-value--accent">${solution.solution}</span>
          </div>
          <div class="hero-result-divider"></div>
          <div class="hero-result-row hero-result-row--desc">
            <span class="hero-result-label">Como ajuda</span>
            <span class="hero-result-desc">${solution.desc}</span>
          </div>
          ${state.context && state.context.trim() ? `
          <div class="hero-result-context">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>"${state.context.trim()}"</span>
          </div>` : ''}
        </div>

        <div class="hero-summary-actions">
          <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn-hero-montar btn-hero-whatsapp" id="hero-btn-whatsapp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            Receber orientação da COGIT
          </a>
          <div class="hero-summary-sub-actions">
            <a href="contato.html" class="hero-sub-link" id="hero-link-form">Ou preencher diagnóstico completo →</a>
            <button type="button" class="hero-btn-restart-flow" id="hero-btn-restart">← Refazer diagnóstico</button>
          </div>
        </div>
      </div>
    `;

    const waBtn = document.getElementById('hero-btn-whatsapp');
    const restartBtn = document.getElementById('hero-btn-restart');

    if (waBtn) waBtn.addEventListener('click', () => {
      if (typeof trackEvent === 'function') trackEvent('hero_whatsapp_conversion', { challenge: state.challenge, service: state.selectedService, objective: state.objective });
    });

    if (restartBtn) restartBtn.addEventListener('click', () => {
      state.challenge = null; state.selectedService = null; state.objective = null; state.context = '';
      saveState();
      transitionTo(renderStep0, 'back');
    });
  }

  // Expose global starter
  window.heroStartDiagnosis = function() {
    if (state.step === 0) {
      transitionTo(renderStep1, 'next');
    }
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  // Initial render
  renderStep0();
}



function updateHomeDynamicRecommendations(flowId) {
  const container = document.getElementById('dynamic-rec-grid');
  const sectionTitle = document.getElementById('rec-section-title');
  const sectionDesc = document.getElementById('rec-section-desc');
  if (!container) return;

  if (sectionTitle) sectionTitle.textContent = "Para o seu desafio, começaríamos por aqui.";
  if (sectionDesc) sectionDesc.textContent = "Com base no que você selecionou, estas são as soluções com maior aderência ao seu objetivo:";

  if (flowId === 'automatizar-processo') {
    container.innerHTML = `
      <div class="dynamic-rec-card reveal reveal-delay-1" style="border-color: rgba(74, 61, 219, 0.4);">
        <span class="dynamic-rec-card-tag" style="background: var(--purple); color: #fff;">RECOMENDADO</span>
        <h3>Automação de Processos</h3>
        <p>Elimine tarefas repetitivas, conecte planilhas e integre fluxos operacionais com WhatsApp e e-mails.</p>
        <div class="dynamic-rec-card-why"><strong>Por que recomendamos:</strong> Você indicou foco em produtividade e redução de trabalho manual.</div>
        <a href="solucoes/automacoes-e-integracoes.html" class="dynamic-rec-card-cta">Entender essa solução <span>→</span></a>
      </div>
      <div class="dynamic-rec-card reveal reveal-delay-2">
        <span class="dynamic-rec-card-tag">CONEXÃO TÉCNICA</span>
        <h3>Integrações com APIs</h3>
        <p>Sincronização contínua de dados entre CRMs, sistemas legados, gateways e ferramentas de terceiros.</p>
        <div class="dynamic-rec-card-why"><strong>Por que recomendamos:</strong> Garante que as ferramentas que você já usa trabalhem integradas.</div>
        <a href="solucoes/automacoes-e-integracoes.html" class="dynamic-rec-card-cta">Entender essa solução <span>→</span></a>
      </div>
      <div class="dynamic-rec-card reveal reveal-delay-3">
        <span class="dynamic-rec-card-tag">VISIBILIDADE</span>
        <h3>Dashboards Gerenciais</h3>
        <p>Centralize indicadores e dados gerados pelos seus processos em painéis visuais em tempo real.</p>
        <div class="dynamic-rec-card-why"><strong>Por que recomendamos:</strong> Acompanhe os resultados das rotinas automatizadas com clareza.</div>
        <a href="solucoes/plataformas-e-outras-solucoes.html" class="dynamic-rec-card-cta">Entender essa solução <span>→</span></a>
      </div>
    `;
  } else if (flowId === 'vender-online') {
    container.innerHTML = `
      <div class="dynamic-rec-card reveal reveal-delay-1" style="border-color: rgba(74, 61, 219, 0.4);">
        <span class="dynamic-rec-card-tag" style="background: var(--purple); color: #fff;">RECOMENDADO</span>
        <h3>Site Institucional</h3>
        <p>Estrutura profissional com múltiplas páginas para transmitir credibilidade e autoridade da sua marca.</p>
        <div class="dynamic-rec-card-why"><strong>Por que recomendamos:</strong> Ideal para comunicar seu posicionamento e gerar confiança no mercado.</div>
        <a href="solucoes/sites-institucionais.html" class="dynamic-rec-card-cta">Entender essa solução <span>→</span></a>
      </div>
      <div class="dynamic-rec-card reveal reveal-delay-2">
        <span class="dynamic-rec-card-tag">ALTA CONVERSÃO</span>
        <h3>Landing Page de Vendas</h3>
        <p>Página estratégica pensada para campanhas de tráfego e captura direta de leads qualificados.</p>
        <div class="dynamic-rec-card-why"><strong>Por que recomendamos:</strong> Foco direto em conversão sem pontos de distração para o usuário.</div>
        <a href="solucoes/landing-pages.html" class="dynamic-rec-card-cta">Entender essa solução <span>→</span></a>
      </div>
      <div class="dynamic-rec-card reveal reveal-delay-3">
        <span class="dynamic-rec-card-tag">AUTOMAÇÃO COMERCIAL</span>
        <h3>Integração com WhatsApp</h3>
        <p>Direcione os leads do site diretamente para o WhatsApp com mensagens pré-formatadas.</p>
        <div class="dynamic-rec-card-why"><strong>Por que recomendamos:</strong> Agiliza o primeiro contato comercial e aumenta as taxas de resposta.</div>
        <a href="solucoes/automacoes-e-integracoes.html" class="dynamic-rec-card-cta">Entender essa solução <span>→</span></a>
      </div>
    `;
  } else if (flowId === 'sistema-operacao') {
    container.innerHTML = `
      <div class="dynamic-rec-card reveal reveal-delay-1" style="border-color: rgba(74, 61, 219, 0.4);">
        <span class="dynamic-rec-card-tag" style="background: var(--purple); color: #fff;">RECOMENDADO</span>
        <h3>Sistema Personalizado</h3>
        <p>Software desenvolvido sob medida para as regras operacionais da sua empresa.</p>
        <div class="dynamic-rec-card-why"><strong>Por que recomendamos:</strong> Elimina gargalos de planilhas e softwares genéricos engessados.</div>
        <a href="solucoes/sistemas-personalizados.html" class="dynamic-rec-card-cta">Entender essa solução <span>→</span></a>
      </div>
      <div class="dynamic-rec-card reveal reveal-delay-2">
        <span class="dynamic-rec-card-tag">GESTÃO VISUAL</span>
        <h3>Painel Administrativo</h3>
        <p>Controle de permissões, perfis de usuários e relatórios operacionais consolidados.</p>
        <div class="dynamic-rec-card-why"><strong>Por que recomendamos:</strong> Garante segurança de dados e governança interna.</div>
        <a href="solucoes/plataformas-e-outras-solucoes.html" class="dynamic-rec-card-cta">Entender essa solução <span>→</span></a>
      </div>
      <div class="dynamic-rec-card reveal reveal-delay-3">
        <span class="dynamic-rec-card-tag">CONECTIVIDADE</span>
        <h3>Integrações de Banco de Dados</h3>
        <p>Conexão com sistemas financeiros, notas fiscais ou bancos legados.</p>
        <div class="dynamic-rec-card-why"><strong>Por que recomendamos:</strong> Mantém a consistência das informações em toda a empresa.</div>
        <a href="solucoes/automacoes-e-integracoes.html" class="dynamic-rec-card-cta">Entender essa solução <span>→</span></a>
      </div>
    `;
  } else if (flowId === 'ideia-papel') {
    container.innerHTML = `
      <div class="dynamic-rec-card reveal reveal-delay-1" style="border-color: rgba(74, 61, 219, 0.4);">
        <span class="dynamic-rec-card-tag" style="background: var(--purple); color: #fff;">RECOMENDADO</span>
        <h3>MVP Funcional</h3>
        <p>Primeira versão do produto digital para validação rápida de hipóteses e atração dos primeiros usuários.</p>
        <div class="dynamic-rec-card-why"><strong>Por que recomendamos:</strong> Reduz o risco de investimento permitindo testar antes de construir um sistema gigante.</div>
        <a href="solucoes/saas-e-produtos-digitais.html" class="dynamic-rec-card-cta">Entender essa solução <span>→</span></a>
      </div>
      <div class="dynamic-rec-card reveal reveal-delay-2">
        <span class="dynamic-rec-card-tag">ESCALABILIDADE</span>
        <h3>Produto SaaS</h3>
        <p>Arquitetura multi-inquilino, cobrança recorrente e infraestrutura em nuvem preparada para escala.</p>
        <div class="dynamic-rec-card-why"><strong>Por que recomendamos:</strong> Estrutura sólida para modelos de receita recorrente.</div>
        <a href="solucoes/saas-e-produtos-digitais.html" class="dynamic-rec-card-cta">Entender essa solução <span>→</span></a>
      </div>
      <div class="dynamic-rec-card reveal reveal-delay-3">
        <span class="dynamic-rec-card-tag">ECOSSISTEMA</span>
        <h3>Plataforma Digital</h3>
        <p>Ambiente que conecta múltiplos tipos de usuários com regras de negócio personalizadas.</p>
        <div class="dynamic-rec-card-why"><strong>Por que recomendamos:</strong> Ideal para marketplaces e plataformas intermediárias.</div>
        <a href="solucoes/plataformas-e-outras-solucoes.html" class="dynamic-rec-card-cta">Entender essa solução <span>→</span></a>
      </div>
    `;
  } else if (flowId === 'ainda-nao-sei') {
    container.innerHTML = `
      <div class="dynamic-rec-card reveal reveal-delay-1" style="border-color: rgba(74, 61, 219, 0.4);">
        <span class="dynamic-rec-card-tag" style="background: var(--purple); color: #fff;">DIAGNÓSTICO</span>
        <h3>Análise e Diagnóstico Técnico</h3>
        <p>Ajudamos a identificar os principais gargalos e oportunidades digitais para o momento atual da sua empresa.</p>
        <div class="dynamic-rec-card-why"><strong>Por que recomendamos:</strong> Você indicou que ainda está avaliando o melhor formato técnico.</div>
        <a href="contato.html" class="dynamic-rec-card-cta">Falar com especialista <span>→</span></a>
      </div>
      <div class="dynamic-rec-card reveal reveal-delay-2">
        <span class="dynamic-rec-card-tag">AUTOMAÇÃO</span>
        <h3>Otimização de Processos</h3>
        <p>Identificação de rotinas manuais que podem ser integradas para liberar tempo da sua equipe.</p>
        <div class="dynamic-rec-card-why"><strong>Por que recomendamos:</strong> Gera resultados rápidos e redução imediata de trabalho braçal.</div>
        <a href="solucoes/automacoes-e-integracoes.html" class="dynamic-rec-card-cta">Entender essa solução <span>→</span></a>
      </div>
      <div class="dynamic-rec-card reveal reveal-delay-3">
        <span class="dynamic-rec-card-tag">PRESENÇA</span>
        <h3>Estruturação de Canais</h3>
        <p>Sites e canais de contato pensados para aumentar autoridade e gerar oportunidades comerciais.</p>
        <div class="dynamic-rec-card-why"><strong>Por que recomendamos:</strong> Garante que seu negócio seja encontrado e compreendido com clareza.</div>
        <a href="solucoes/sites-institucionais.html" class="dynamic-rec-card-cta">Entender essa solução <span>→</span></a>
      </div>
    `;
  }
}

window.continueToConfigurator = function(preselectStr) {
  if (preselectStr) {
    sessionStorage.setItem('cogit_preselect', preselectStr);
  }
  const target = window.location.pathname.includes('/solucoes/') || window.location.pathname.includes('/projetos/') ? '../monte-sua-solucao.html' : 'monte-sua-solucao.html';
  window.location.href = target;
};

// ── Render Services Grid ──
function renderServices() {
  const container = document.getElementById('services-grid');
  if (!container || !servicesData.length) return;

  container.innerHTML = servicesData.map((service, i) => {
    const ctaText = service.id === 'outras-solucoes' ? 'Conte o que você precisa' : 'Conheça a solução';
    const targetUrl = service.id === 'outras-solucoes' ? '#contact' : '#configurator';
    
    return `
      <a href="${targetUrl}" class="service-card reveal reveal-delay-${(i % 3) + 1} ${service.highlight ? 'service-card-highlight' : ''}" id="service-${service.id}" aria-label="Conheça a solução de ${service.title}">
        <div class="service-card-header">
          ${service.tag ? `<span class="service-card-tag">${service.tag}</span>` : ''}
          <div class="service-card-icon">${getIcon(service.icon)}</div>
        </div>
        <h3>${service.title}</h3>
        <p>${service.description}</p>
        <span class="service-card-arrow">
          ${ctaText} ${getIcon('arrowRight')}
        </span>
      </a>
    `;
  }).join('');
}

// ── Render Process Timeline (Interactive) ──
function renderProcess() {
  const container = document.getElementById('process-steps-container');
  if (!container || !processData.length) return;

  container.innerHTML = processData.map((step, i) => `
    <div class="process-step" data-step="${i + 1}" id="process-step-${i + 1}">
      <div class="process-step-icon-wrapper">
        <div class="process-step-icon">${getIcon(step.icon)}</div>
        ${i < processData.length - 1 ? '<div class="process-step-line"><div class="process-step-line-fill"></div></div>' : ''}
      </div>
      <div class="process-step-content">
        <span class="process-step-number">${step.number}</span>
        <h3>${step.title}</h3>
        <p class="process-step-keywords">${step.keywords}</p>
        <p class="process-step-desc">${step.description}</p>
      </div>
    </div>
  `).join('');

  // Initialize Scroll Spy for Methodology
  initProcessScrollSpy();
}

function initProcessScrollSpy() {
  const steps = document.querySelectorAll('.process-step');
  const visualGraphic = document.getElementById('process-visual-graphic');
  if (!steps.length || !visualGraphic) return;

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -50% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stepNum = entry.target.getAttribute('data-step');
        
        steps.forEach(s => s.classList.remove('active'));
        entry.target.classList.add('active');

        visualGraphic.className = 'process-visual-graphic state-' + stepNum;
      }
    });
  }, observerOptions);

  steps.forEach(step => observer.observe(step));
}

// ── Render Starting Points (Pricing) ──
function renderPricing() {
  const container = document.getElementById('pricing-grid');
  if (!container || !plansData.length) return;

  container.innerHTML = plansData.map((plan, i) => {
    let priceText = 'Sob análise';
    if (plan.priceId && typeof startingOptionsData !== 'undefined' && startingOptionsData[plan.priceId]) {
      const pData = startingOptionsData[plan.priceId];
      priceText = `R$ ${pData.basePrice.toLocaleString('pt-BR')}`;
    } else if (plan.price) {
      priceText = plan.price;
    }

    const preselectAttr = plan.primaryCtaPreselect ? `data-preselect='${JSON.stringify(plan.primaryCtaPreselect)}'` : '';

    return `
      <div class="pricing-card ${plan.cardType ? `pricing-card-${plan.cardType}` : ''} ${plan.featured ? 'is-featured' : ''} reveal reveal-delay-${i + 1}" id="plan-${plan.id}">
        
        <div class="pricing-card-header">
          <div class="pricing-card-id">
            <span class="pricing-card-number">${plan.number}</span>
            <span class="pricing-card-tag">${plan.tag}</span>
          </div>
          <h3 class="pricing-card-title">${plan.title}</h3>
          <p class="pricing-card-desc">${plan.description}</p>
        </div>

        <div class="pricing-card-ideal">
          <span class="pricing-ideal-label">IDEAL PARA</span>
          <p class="pricing-ideal-text">${plan.idealFor}</p>
        </div>

        <div class="pricing-card-block">
          <h4 class="pricing-block-title">${plan.solutionsHeader || 'SOLUÇÕES POSSÍVEIS'}</h4>
          <ul class="pricing-solutions-list">
            ${plan.solutions.map(sol => `<li>${sol}</li>`).join('')}
          </ul>
        </div>

        <div class="pricing-card-footer mt-auto">
          <div class="pricing-investment">
            <span class="pricing-investment-title">INVESTIMENTO INICIAL</span>
            ${plan.priceLabel ? `<span class="price-label">${plan.priceLabel}</span>` : ''}
            <span class="price-value">${priceText}</span>
            <p class="price-subtext">${plan.priceExplanation}</p>
            ${plan.secondaryExplanation ? `<p class="price-subtext-alt">${plan.secondaryExplanation}</p>` : ''}
          </div>
          
          ${plan.advancedNote ? `
            <div class="pricing-advanced-note">
              <p>${plan.advancedNote}</p>
              <a href="${plan.advancedLinkUrl}">${plan.advancedLinkText}</a>
            </div>
          ` : ''}

          ${plan.estimatedTime ? `<p class="pricing-time">Prazo estimado<br><strong>${plan.estimatedTime}</strong></p>` : ''}
          
          <div class="pricing-ctas">
            <button type="button" class="btn btn-primary pricing-cta-primary" ${preselectAttr} onclick="if(window.ConfiguratorApp) window.ConfiguratorApp.preselectAndScroll(JSON.parse(this.getAttribute('data-preselect')))">${plan.primaryCta}</button>
            ${plan.secondaryCta ? `<a href="${plan.secondaryCtaLink}" class="btn btn-secondary pricing-cta-secondary">${plan.secondaryCta}</a>` : ''}
          </div>
        </div>
        
      </div>
    `;
  }).join('');
}

// ── Render Cases & Projects (Cards Retangulares sem imagem e sem chips de linguagem) ──
function renderCases() {
  const container = document.getElementById('cases-grid');
  if (!container) return;

  if (!casesData || !casesData.length) {
    container.innerHTML = `
      <div class="cases-empty">
        <h3>Projetos em desenvolvimento</h3>
        <p>Estamos construindo soluções para diferentes desafios. Em breve, compartilharemos aqui os resultados de projetos reais.</p>
      </div>
    `;
    return;
  }

  const isSubfolder = window.location.pathname.includes('/projetos') || window.location.pathname.includes('/solucoes');
  const targetUrl = isSubfolder ? '../contato.html' : 'contato.html';

  container.innerHTML = casesData.map((c, i) => {
    const delayClass = `reveal-delay-${(i % 3) + 1}`;
    
    return `
      <div class="case-card ${delayClass}" id="case-${c.id}">
        <div class="case-card-header">
          <span class="case-card-tag">
            <span class="case-status-pulse"></span>
            ${c.statusTag || 'PRODUTO EM EVOLUÇÃO'}
          </span>
          <span class="case-card-segment">${c.segment}</span>
        </div>

        <h3 class="case-card-title">${c.title}</h3>
        <p class="case-card-desc">${c.solution}</p>
        
        ${c.highlights && c.highlights.length ? `
          <div class="case-card-highlights-box">
            <ul class="case-card-highlights">
              ${c.highlights.map(h => `
                <li>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>${h}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        <a href="${targetUrl}" class="case-card-cta">
          Entender essa solução <span>→</span>
        </a>
      </div>
    `;
  }).join('');
}

// ── Render Impact Grid ──
function renderImpact() {
  const container = document.getElementById('impact-grid');
  if (!container || !impactData.length) return;

  container.innerHTML = impactData.map(item => `
    <div class="impact-card">
      <div class="impact-card-icon">${getIcon(item.icon)}</div>
      <span>${item.title}</span>
    </div>
  `).join('');
}

// ── Render & Initialize FAQ ──
function renderFAQ() {
  const container = document.getElementById('faq-list');
  // Only render if container exists and is empty or specifically meant for dynamic faqData
  if (container && typeof faqData !== 'undefined' && faqData.length && container.children.length === 0) {
    container.innerHTML = faqData.map((item, i) => `
      <div class="faq-item" id="faq-${i}">
        <button class="faq-question" type="button" aria-expanded="false" aria-controls="faq-answer-${i}">
          <span>${item.question}</span>
          <span class="faq-icon faq-icon-plus">${getIcon('plus')}</span>
        </button>
        <div class="faq-answer" id="faq-answer-${i}" role="region">
          <div class="faq-answer-inner">
            ${item.answer}
          </div>
        </div>
      </div>
    `).join('');
  }

  // Bind click handlers for all FAQ lists across the site
  initFaqAccordions();
}

function initFaqAccordions() {
  const faqLists = document.querySelectorAll('.faq-list');
  faqLists.forEach(list => {
    list.querySelectorAll('.faq-question').forEach(btn => {
      if (btn.dataset.faqBound === 'true') return;
      btn.dataset.faqBound = 'true';

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const item = btn.closest('.faq-item');
        if (!item) return;

        const answer = item.querySelector('.faq-answer');
        if (!answer) return;

        const isOpen = item.classList.contains('is-open');

        // Close all other items in the same FAQ list
        list.querySelectorAll('.faq-item').forEach(fi => {
          fi.classList.remove('is-open');
          const ans = fi.querySelector('.faq-answer');
          if (ans) ans.style.maxHeight = null;
          const qBtn = fi.querySelector('.faq-question');
          if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
        });

        // Toggle current item
        if (!isOpen) {
          item.classList.add('is-open');
          answer.style.maxHeight = (answer.scrollHeight + 30) + 'px';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });
}

// ── Render Form Selects ──
function renderFormOptions() {
  const typeSelect = document.getElementById('project-type');
  const budgetSelect = document.getElementById('budget-range');

  if (typeSelect) {
    typeSelect.innerHTML = `<option value="" disabled selected>Selecione o tipo</option>` +
      projectTypes.map(t => `<option value="${t}">${t}</option>`).join('');
  }

  if (budgetSelect) {
    budgetSelect.innerHTML = `<option value="" disabled selected>Selecione (opcional)</option>` +
      budgetRanges.map(b => `<option value="${b}">${b}</option>`).join('');
  }

  // Auto-fill from Hero Discovery if navigated from Step 3
  try {
    const prefill = sessionStorage.getItem('cogit_contact_prefill');
    if (prefill) {
      const data = JSON.parse(prefill);
      const descEl = document.getElementById('description');
      if (descEl && !descEl.value) {
        let msg = '';
        if (data.solutions && data.solutions.length) {
          msg += `Soluções de interesse: ${data.solutions.join(', ')}\n`;
        }
        if (data.objective) {
          msg += `Objetivo principal: ${data.objective}\n`;
        }
        if (data.details) {
          msg += `Detalhes da ideia: ${data.details}\n`;
        }
        descEl.value = msg.trim();
      }
    }
  } catch (e) {}
}

// ── Render Footer Social Links ──
function renderFooterSocial() {
  const container = document.getElementById('footer-social');
  if (!container) return;

  let html = '';
  if (socialLinks.instagram && socialLinks.instagram !== '#') {
    html += `<a href="${socialLinks.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${getIcon('instagram')}</a>`;
  }
  if (socialLinks.linkedin && socialLinks.linkedin !== '#') {
    html += `<a href="${socialLinks.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">${getIcon('linkedin')}</a>`;
  }
  if (socialLinks.email) {
    html += `<a href="${socialLinks.email}" aria-label="E-mail">${getIcon('mail')}</a>`;
  }

  container.innerHTML = html;
}

// ── Render Testimonials ──
function renderTestimonials() {
  // Check if testimonials section placeholder exists in HTML
  // If not, we can dynamically inject it before FAQ
  if (typeof testimonialsData === 'undefined' || !testimonialsData.length) return;

  const faqSection = document.getElementById('faq');
  if (!faqSection) return;

  // Create testimonials section
  const section = document.createElement('section');
  section.className = 'section testimonials-section has-data';
  section.id = 'testimonials';
  section.setAttribute('aria-label', 'Depoimentos');
  section.innerHTML = `
    <div class="container">
      <div class="section-header center reveal">
        <span class="section-label" style="justify-content: center;">DEPOIMENTOS</span>
        <h2>Experiências de quem construiu com a gente</h2>
      </div>
      <div class="testimonials-grid">
        ${testimonialsData.map(t => {
          const initial = t.name ? t.name.charAt(0).toUpperCase() : '?';
          const avatarContent = t.photo 
            ? `<img src="${t.photo}" alt="Foto de ${t.name}" loading="lazy">` 
            : initial;
          const roleText = [t.role, t.company].filter(Boolean).join(' · ');
          return `
            <div class="testimonial-card reveal">
              <p class="testimonial-card-quote">${t.testimonial}</p>
              <div class="testimonial-card-author">
                <div class="testimonial-card-avatar">${avatarContent}</div>
                <div class="testimonial-card-info">
                  <h4>${t.name}</h4>
                  ${roleText ? `<p>${roleText}</p>` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Insert before FAQ
  faqSection.parentNode.insertBefore(section, faqSection);
}

// ── Initialize All Components ──
function initComponents() {
  renderChallenge();
  renderHeroInteractive();
  renderServices();
  renderProcess();
  renderPricing();
  renderCases();
  renderImpact();
  renderFAQ();
  renderFormOptions();
  renderFooterSocial();
  renderTestimonials();
}

