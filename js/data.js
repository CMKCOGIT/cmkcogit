/* ============================================
   COGIT — Editable Data
   All content centralized for easy updates
   ============================================ */

// ── Site Configuration ──
const siteConfig = {
  // Google Analytics — insert your GA4 ID (e.g. 'G-XXXXXXXXXX')
  gaId: '',

  // Set to true to show cookie consent banner before loading analytics
  requireCookieConsent: true,

  // Response time text shown in the contact section
  responseTimeText: 'Após recebermos sua solicitação, entraremos em contato pelo canal informado.',

  // Canonical domain
  canonicalDomain: 'https://cmkcogit.com.br',

  // Company info for schema.org
  companyName: 'CMKCOGIT',
  companyAlternateName: 'COGIT',
  companyEmail: 'contato@cmkcogit.com.br',
  companyCity: 'São José do Rio Preto',
  companyState: 'SP',
  companyCountry: 'BR'
};

// ── SVG Icons ──
const ICONS = {
  arrowRight: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  check: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  plus: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  chevronDown: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  dash: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  chevronLeft: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  chevronRight: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  send: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',

  // Service icons
  systems: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M10 6h4"/><path d="M10 17h4"/><path d="M6 10v4"/><path d="M17 10v4"/></svg>',
  saas: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
  automation: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="10" width="4" height="4" rx="1"/><rect x="17" y="10" width="4" height="4" rx="1"/><rect x="10" y="3" width="4" height="4" rx="1"/><rect x="10" y="17" width="4" height="4" rx="1"/><path d="M7 12h3"/><path d="M14 12h3"/><path d="M12 7v3"/><path d="M12 14v3"/><path d="M7.5 7.5L9 9"/><path d="M16.5 16.5L15 15"/><path d="M16.5 7.5L15 9"/><path d="M7.5 16.5L9 15"/></svg>',
  platforms: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>',
  ai: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  mvp: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  websites: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
  landing: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><path d="M9 13l3 3 5-5"/></svg>',
  consulting: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
  otherSolutions: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h6v6H4z"/><path d="M14 4h6v6h-6z"/><path d="M14 14h6v6h-6z"/><path d="M4 14h6v6H4z"/><path d="M10 7h4"/><path d="M10 17h4"/><path d="M7 10v4"/><path d="M17 10v4"/></svg>',

  // Methodology icons
  loupe: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><circle cx="11" cy="11" r="4"/></svg>',
  branches: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v12"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>',
  blocks: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  validate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  build: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l-5.5 3.5v7L12 16l5.5-3.5v-7L12 2z"/><path d="M12 22l-5.5-3.5v-7L12 15l5.5-3.5v-7L12 8z"/></svg>',
  evolve: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',

  // Impact icons
  leaf: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg>',
  book: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  heart: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  users: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  building: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><line x1="8" y1="6" x2="10" y2="6"/><line x1="14" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/></svg>',
  handshake: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 17a4 4 0 0 0 4-4V7"/><path d="M7 7v6a4 4 0 0 0 4 4"/><path d="M1 10l4-2 4 2"/><path d="M15 10l4-2 4 2"/><path d="M5 8v6"/><path d="M19 8v6"/></svg>',

  // Challenge icons
  globe: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  zap: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  rocket: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',

  // Social icons
  instagram: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
  linkedin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
  mail: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  whatsapp: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
};


// ── Problem Flows Data (Identificação do Desafio - Home) ──
const problemFlowsData = [
  {
    id: 'vender-online',
    title: 'Quero vender ou me posicionar melhor online',
    description: 'Site institucional, Landing Page e presença digital.',
    icon: 'globe',
    subQuestions: [
      { id: 'site-novo', title: 'Site institucional profissional', description: 'Apresentar a empresa, autoridade e serviços.', preselect: ['site-institucional'] },
      { id: 'lp-vendas', title: 'Landing Page de alta conversão', description: 'Para campanhas de tráfego pago e captação direta de leads.', preselect: ['landing-page'] },
      { id: 'redesign', title: 'Modernizar site atual ultrapassado', description: 'Melhorar layout, carregamento e experiência mobile.', preselect: ['site-institucional'] },
      { id: 'posicionamento', title: 'Melhorar autoridade e credibilidade', description: 'Transmitir mais valor e confiança aos clientes.', preselect: ['site-institucional'] },
      { id: 'outro-presenca', title: 'Outro objetivo de presença digital', description: 'Necessidade específica para canais web.', preselect: ['site-institucional'] }
    ],
    recommendations: ['sites-institucionais', 'landing-pages'],
    recommendationTitle: 'Presença Digital Estratégica',
    recommendationSubtitle: 'Site Institucional ou Landing Page',
    recommendationText: 'Estruturar canais profissionais com clareza de posicionamento, design premium e arquitetura orientada à conversão.',
    estimateText: 'A partir de R$ 990',
    preselect: ['site-institucional']
  },
  {
    id: 'automatizar-processo',
    title: 'Quero automatizar um processo',
    description: 'Reduza tarefas manuais e conecte ferramentas.',
    icon: 'zap',
    subQuestions: [
      { id: 'planilhas', title: 'Trabalho repetitivo em planilhas', description: 'Consolidação e digitação manual diária.', preselect: ['automacao'] },
      { id: 'ferramentas', title: 'Quero conectar ferramentas ou APIs', description: 'Integrar sistemas que hoje operam isolados.', preselect: ['automacao', 'integracao-externa'] },
      { id: 'atendimento', title: 'Preciso automatizar atendimento / WhatsApp', description: 'Triagem rápida e notificações automáticas.', preselect: ['automacao'] },
      { id: 'organizar', title: 'Organizar dados e rotinas operacionais', description: 'Fluxos de trabalho padronizados e automáticos.', preselect: ['automacao'] },
      { id: 'outro-automacao', title: 'Outro fluxo que toma muito tempo', description: 'Processo repetitivo da equipe.', preselect: ['automacao'] }
    ],
    recommendations: ['automacao', 'outras-solucoes'],
    recommendationTitle: 'Automação + Integração',
    recommendationSubtitle: 'Rotinas Inteligentes & Conexão de Ferramentas',
    recommendationText: 'Reduzir tempo em tarefas manuais, eliminar retrabalho e conectar suas ferramentas atuais com estabilidade.',
    estimateText: 'A partir de R$ 990',
    preselect: ['automacao']
  },
  {
    id: 'sistema-operacao',
    title: 'Preciso de um sistema para minha operação',
    description: 'Centralize processos e organize sua gestão.',
    icon: 'systems',
    subQuestions: [
      { id: 'gestao-interna', title: 'Controle de processos internos e tarefas', description: 'Esteiras de trabalho e permissões da equipe.', preselect: ['sistema'] },
      { id: 'portal-clientes', title: 'Área restrita para clientes ou parceiros', description: 'Login seguro, documentos e chamados.', preselect: ['sistema', 'painel-cliente'] },
      { id: 'substituir-planilhas', title: 'Planilhas que já não suportam mais o volume', description: 'Muitos erros manuais e lentidão na rotina.', preselect: ['sistema'] },
      { id: 'painel-indicadores', title: 'Dashboard de indicadores e relatórios', description: 'Visibilidade gerencial consolidada em tempo real.', preselect: ['sistema', 'dashboard'] },
      { id: 'outro-sistema', title: 'Outro software sob medida para a operação', description: 'Regras de negócio específicas da empresa.', preselect: ['sistema'] }
    ],
    recommendations: ['sistemas-personalizados', 'outras-solucoes'],
    recommendationTitle: 'Sistema Personalizado',
    recommendationSubtitle: 'Software Sob Medida para sua Operação',
    recommendationText: 'Construir um software adaptado com precisão às regras do seu negócio, sem limitações de plataformas genéricas.',
    estimateText: 'A partir de R$ 7.900',
    preselect: ['sistema']
  },
  {
    id: 'ideia-papel',
    title: 'Quero tirar uma ideia do papel',
    description: 'MVP, SaaS e novos produtos digitais.',
    icon: 'rocket',
    subQuestions: [
      { id: 'mvp-validacao', title: 'Construir um MVP para validar com o mercado', description: 'Versão prática para testar hipóteses com usuários reais.', preselect: ['mvp'] },
      { id: 'saas-assinatura', title: 'Criar um SaaS com cobrança recorrente', description: 'Plataforma multi-inquilino com assinaturas.', preselect: ['saas'] },
      { id: 'plataforma-marketplace', title: 'Plataforma conectando dois públicos', description: 'Marketplace ou ecossistema intermediário.', preselect: ['plataforma'] },
      { id: 'digitalizar-servico', title: 'Transformar um serviço presencial em digital', description: 'Automatizar a entrega e escala do serviço.', preselect: ['mvp'] },
      { id: 'outro-produto', title: 'Outra ideia de produto inovador', description: 'Projeto em fase de concepção técnica.', preselect: ['mvp'] }
    ],
    recommendations: ['mvp', 'saas', 'plataformas'],
    recommendationTitle: 'Desenvolvimento de Produto Digital',
    recommendationSubtitle: 'MVP ou Plataforma SaaS',
    recommendationText: 'Construir a primeira versão funcional com arquitetura moderna e foco em validação rápida com baixo risco.',
    estimateText: 'A partir de R$ 9.900',
    preselect: ['mvp']
  },
  {
    id: 'ainda-nao-sei',
    title: 'Ainda não sei o que preciso',
    description: 'Conte o problema e ajudamos a estruturar o caminho.',
    icon: 'consulting',
    subQuestions: [
      { id: 'vender-melhor', title: 'Quero vender mais ou melhorar minha presença', description: 'Posicionamento digital e novos clientes.', preselect: ['site-institucional'] },
      { id: 'processo-manual', title: 'Tenho tarefas manuais e lentas na equipe', description: 'Gargalos e retrabalho na operação diária.', preselect: ['automacao'] },
      { id: 'desorganizacao', title: 'Falta organização e controle na operação', description: 'Informações soltas e sem padrão.', preselect: ['sistema'] },
      { id: 'criar-novo', title: 'Quero criar algo novo ou lançar um produto', description: 'Nova oportunidade de negócio no mercado.', preselect: ['mvp'] },
      { id: 'outro-diagnostico', title: 'Outro desafio específico da empresa', description: 'Conversar diretamente com a equipe técnica.', preselect: ['site-institucional'] }
    ],
    recommendations: ['consultoria', 'outras-solucoes'],
    recommendationTitle: 'Diagnóstico Sob Medida',
    recommendationSubtitle: 'Análise Consultiva Inicial',
    recommendationText: 'O melhor caminho é conversarmos sobre o seu cenário atual para desenhar a estrutura técnica mais eficiente.',
    estimateText: 'Diagnóstico personalizado',
    preselect: ['site-institucional']
  }
];

// ── Solutions Groups (Hub de Soluções) ──
const solutionsGroupsData = [
  {
    id: 'atrair-converter',
    title: 'Atrair e converter',
    description: 'Para empresas que precisam melhorar presença, posicionamento e geração de oportunidades.',
    services: ['cogit-start', 'sites-institucionais', 'landing-pages']
  },
  {
    id: 'ganhar-eficiencia',
    title: 'Ganhar eficiência',
    description: 'Para reduzir tarefas manuais, conectar ferramentas e melhorar processos.',
    services: ['automacao', 'outras-solucoes']
  },
  {
    id: 'organizar-operacao',
    title: 'Organizar a operação',
    description: 'Centralize processos e estruture informações.',
    services: ['sistemas-personalizados', 'plataformas']
  },
  {
    id: 'criar-novo',
    title: 'Criar algo novo',
    description: 'Transforme ideias em negócios e produtos digitais.',
    services: ['mvp', 'saas']
  }
];


// ── Services Data (Nova ordem) ──
const servicesData = [
  {
    id: 'sistemas-personalizados',
    title: 'Sistemas Personalizados',
    description: 'Digitalize operações, centralize processos e construa soluções adaptadas à realidade do seu negócio.',
    icon: 'systems',
    slug: 'sistemas-personalizados',
    tag: 'SOB MEDIDA',
    highlight: true,
    basePrice: 7900,
    priceType: 'startingAt',
    priceNote: 'Projetos de maior complexidade são avaliados individualmente.',
    customAnalysis: true
  },
  {
    id: 'saas',
    title: 'SaaS',
    description: 'Transforme uma ideia ou processo em um produto digital recorrente e preparado para crescer.',
    icon: 'saas',
    slug: 'saas',
    tag: 'ESCALÁVEL',
    basePrice: 14900,
    priceType: 'startingAt',
    priceNote: 'O investimento varia conforme funcionalidades, arquitetura e integrações.',
    customAnalysis: true
  },
  {
    id: 'automacao',
    title: 'Automação',
    description: 'Reduza tarefas manuais, conecte ferramentas e torne seus processos mais eficientes.',
    icon: 'automation',
    slug: 'automacao',
    tag: 'EFICIÊNCIA',
    basePrice: 990,
    priceType: 'startingAt',
    priceNote: 'Valor referente a automações de escopo básico.',
    customAnalysis: true
  },
  {
    id: 'plataformas',
    title: 'Plataformas',
    description: 'Ambientes digitais e ecossistemas capazes de conectar usuários, serviços e operações.',
    icon: 'platforms',
    slug: 'plataformas',
    tag: 'ECOSSISTEMAS',
    basePrice: 11900,
    priceType: 'startingAt',
    priceNote: 'Projetos avançados são avaliados conforme estrutura e complexidade.',
    customAnalysis: true
  },
  {
    id: 'mvp',
    title: 'MVP',
    description: 'Tire sua ideia do papel, valide hipóteses e construa sua primeira versão funcional.',
    icon: 'mvp',
    slug: 'mvp',
    tag: 'VALIDAÇÃO',
    basePrice: 9900,
    priceType: 'startingAt',
    priceNote: 'O investimento depende do escopo da primeira versão do produto.',
    customAnalysis: true
  },
  {
    id: 'cogit-start',
    title: 'COGIT Start',
    description: 'Soluções digitais pré-estruturadas e adaptadas à sua marca. Portfólios, Landing Pages e Sites com entrega ágil a partir de 5 dias úteis.',
    icon: 'zap',
    slug: 'cogit-start',
    tag: 'ÁGIL & ACESSÍVEL',
    basePrice: 790,
    priceType: 'startingAt',
    priceNote: 'Portfólios (R$ 790), Landing Pages (R$ 990) e Sites (R$ 1.990).',
    customAnalysis: false
  },
  {
    id: 'sites-institucionais',
    title: 'Sites Institucionais',
    description: 'Construa uma presença digital profissional capaz de comunicar valor, posicionamento e confiança.',
    icon: 'websites',
    slug: 'sites-institucionais',
    tag: 'PRESENÇA',
    basePrice: 1990,
    priceType: 'startingAt',
    priceNote: 'Valor referente à estrutura institucional essencial.',
    customAnalysis: true
  },
  {
    id: 'landing-pages',
    title: 'Landing Pages',
    description: 'Páginas estratégicas para campanhas, lançamentos, geração de leads e conversão.',
    icon: 'landing',
    slug: 'landing-pages',
    tag: 'CONVERSÃO',
    basePrice: 990,
    priceType: 'startingAt',
    priceNote: 'Valor referente à estrutura essencial de Landing Page.',
    customAnalysis: true
  },
  {
    id: 'outras-solucoes',
    title: 'Outras Soluções',
    description: 'Dashboards, integrações, APIs, painéis, automações específicas e outras soluções digitais desenvolvidas de acordo com a necessidade do seu projeto.',
    icon: 'otherSolutions',
    slug: 'outras-solucoes',
    tag: 'MAIS POSSIBILIDADES',
    basePrice: 0,
    priceType: 'custom',
    priceNote: 'O investimento é definido conforme a demanda.',
    customAnalysis: true
  }
];


// ── Starting Options Data (Valores Base) ──
const startingOptionsData = {
  presenca: { basePrice: 1990, priceType: 'startingAt' },
  operacao: { basePrice: 2490, priceType: 'startingAt' },
  produto:  { basePrice: 9900, priceType: 'startingAt' }
};

// ── Starting Points Data (Formas de Começar) ──
const plansData = [
  {
    id: 'presenca',
    number: '01',
    tag: 'PARA POSICIONAR E CONVERTER',
    title: 'Presença Digital',
    description: 'Para empresas e profissionais que precisam fortalecer sua presença online, apresentar melhor o negócio e criar canais capazes de gerar oportunidades.',
    idealFor: 'Empresas que precisam criar ou profissionalizar sua presença digital.',
    solutionsHeader: 'SOLUÇÕES POSSÍVEIS',
    solutions: [
      'Site institucional',
      'Landing Page',
      'Formulários',
      'Integração com WhatsApp',
      'Analytics',
      'SEO inicial'
    ],
    priceLabel: 'A partir de',
    priceId: 'presenca',
    priceExplanation: 'Valor considerando uma estrutura institucional essencial. O investimento pode variar conforme páginas, conteúdo, funcionalidades e integrações.',
    estimatedTime: 'A partir de 2 semanas',
    primaryCta: 'Quero melhorar minha presença →',
    primaryCtaPreselect: ['site-institucional'],
    secondaryCta: 'Ver soluções de presença',
    secondaryCtaLink: '/solucoes/sites-institucionais.html',
    featured: false,
    cardType: 'neutral'
  },
  {
    id: 'operacao',
    number: '02',
    tag: 'SOLUÇÃO SOB MEDIDA',
    title: 'Operação Digital',
    description: 'Para empresas que precisam reduzir tarefas manuais, organizar processos, conectar ferramentas ou desenvolver tecnologia adaptada à própria operação.',
    idealFor: 'Empresas que já possuem uma operação e querem ganhar eficiência, organização e escala através da tecnologia.',
    solutionsHeader: 'SOLUÇÕES POSSÍVEIS',
    solutions: [
      'Sistemas personalizados',
      'Automações',
      'Dashboards',
      'Painéis administrativos',
      'Integrações',
      'Banco de dados'
    ],
    priceLabel: 'Projetos a partir de',
    priceId: 'operacao',
    priceExplanation: 'O investimento varia conforme processos, integrações, regras de negócio e complexidade técnica.',
    advancedNote: 'Projetos com sistemas personalizados, múltiplas integrações ou regras avançadas passam por diagnóstico técnico.',
    advancedLinkText: 'Preciso de uma solução mais complexa →',
    advancedLinkUrl: '/contato.html',
    primaryCta: 'Quero melhorar minha operação →',
    primaryCtaPreselect: ['sistema', 'automacao'],
    secondaryCta: null,
    featured: true,
    cardType: 'highlight'
  },
  {
    id: 'produto',
    number: '03',
    tag: 'PARA CRIAR E VALIDAR',
    title: 'Produto Digital',
    description: 'Para empresas, startups e empreendedores que desejam transformar uma ideia em um produto digital capaz de ser validado, utilizado e evoluído.',
    idealFor: 'Novos produtos, startups, novas unidades de negócio e empresas que desejam transformar uma ideia em tecnologia.',
    solutionsHeader: 'O PROCESSO PODE ENVOLVER',
    solutions: [
      'Discovery',
      'UX/UI',
      'MVP',
      'SaaS',
      'Plataforma',
      'Validação'
    ],
    priceLabel: 'Projetos a partir de',
    priceId: 'produto',
    priceExplanation: 'O investimento final é definido após entendimento do produto, funcionalidades, arquitetura e estratégia de validação.',
    secondaryExplanation: 'Projetos SaaS podem partir de R$ 14.900.',
    primaryCta: 'Quero apresentar minha ideia →',
    primaryCtaPreselect: ['mvp'],
    secondaryCta: 'Entender como criamos produtos',
    secondaryCtaLink: '/como-trabalhamos.html',
    featured: false,
    cardType: 'neutral-alt'
  }
];


// ── Configurator Data ──
const configuratorData = {
  services: [
    {
      id: 'site-institucional',
      name: 'Site Institucional',
      icon: 'websites',
      hasLevels: true,
      allowedAddons: ['pagina-adicional', 'blog', 'seo-avancado', 'copywriting', 'automacao-extra', 'integracao-crm', 'integracao-externa', 'area-restrita'],
      levels: [
        { id: 'essencial', name: 'Essencial', description: 'Até 5 páginas, responsivo, formulário, WhatsApp, SEO técnico inicial e Analytics.', priceType: 'from', price: 1990 },
        { id: 'profissional', name: 'Profissional', description: 'Mais páginas, maior personalização visual, blog ou estrutura de conteúdo, integrações simples e recursos adicionais.', priceType: 'from', price: 2990 },
        { id: 'avancado', name: 'Avançado', description: 'Área restrita, integrações, funcionalidades personalizadas, sistemas associados ou necessidades específicas.', priceType: 'custom', price: null }
      ]
    },
    {
      id: 'landing-page',
      name: 'Landing Page',
      icon: 'landing',
      hasLevels: true,
      allowedAddons: ['copywriting', 'seo-avancado', 'automacao-extra', 'integracao-crm', 'integracao-externa', 'analytics-avancado'],
      levels: [
        { id: 'essencial', name: 'Essencial', description: 'Landing Page objetiva, responsiva, formulário ou WhatsApp e estrutura básica de conversão.', priceType: 'fixed', price: 990 },
        { id: 'profissional', name: 'Profissional', description: 'Maior personalização, estrutura estratégica de conversão, Analytics, eventos, integrações simples e maior complexidade visual.', priceType: 'fixed', price: 1490 },
        { id: 'avancada', name: 'Avançada', description: 'Automações, CRM, integrações externas, lógica personalizada ou necessidades específicas.', priceType: 'from', price: 2490 }
      ]
    },
    {
      id: 'automacao',
      name: 'Automação',
      icon: 'automation',
      hasLevels: true,
      allowedAddons: ['dashboard', 'integracao-crm', 'integracao-api', 'integracao-externa'],
      levels: [
        { id: 'basica', name: 'Básica', description: 'Uma rotina principal, regras simples e baixo nível de integração.', priceType: 'fixed', price: 990 },
        { id: 'intermediaria', name: 'Intermediária', description: 'Múltiplos fluxos, planilhas, regras adicionais ou integrações simples.', priceType: 'fixed', price: 2490 },
        { id: 'avancada', name: 'Avançada', description: 'APIs, sistemas externos, múltiplas integrações, regras complexas ou alto volume de dados.', priceType: 'custom', price: null }
      ]
    },
    {
      id: 'sistema',
      name: 'Sistema Personalizado',
      icon: 'systems',
      hasLevels: false,
      priceType: 'from',
      price: 7900,
      description: 'Sistemas personalizados exigem avaliação técnica para definir escopo, prazo e investimento.',
      allowedAddons: ['dashboard', 'integracao-api', 'integracao-crm', 'area-restrita', 'automacao-extra']
    },
    {
      id: 'saas',
      name: 'SaaS',
      icon: 'saas',
      hasLevels: false,
      priceType: 'from',
      price: 14900,
      description: 'Produtos SaaS possuem escopos variados e são analisados individualmente.',
      allowedAddons: ['dashboard', 'integracao-api', 'integracao-crm', 'area-restrita']
    },
    {
      id: 'mvp',
      name: 'MVP',
      icon: 'mvp',
      hasLevels: false,
      priceType: 'from',
      price: 9900,
      description: 'MVPs são estruturados sob medida. Discovery, escopo e investimento são definidos em conjunto.',
      allowedAddons: ['dashboard', 'integracao-api', 'integracao-crm']
    },
    {
      id: 'plataforma',
      name: 'Plataforma',
      icon: 'platforms',
      hasLevels: false,
      priceType: 'from',
      price: 11900,
      description: 'Plataformas e ecossistemas digitais exigem diagnóstico detalhado.',
      allowedAddons: ['dashboard', 'integracao-api', 'integracao-crm', 'area-restrita']
    },
    {
      id: 'outras-solucoes',
      name: 'Outras Soluções',
      icon: 'otherSolutions',
      hasLevels: false,
      priceType: 'custom',
      price: null,
      description: 'Dashboards, integrações, APIs, áreas restritas e demandas específicas são definidas após entendimento do projeto.',
      allowedAddons: []
    }
  ],
  addons: [
    { id: 'pagina-adicional', name: 'Página adicional', priceType: 'fixed', price: 250, allowQuantity: true, unit: 'página' },
    { id: 'blog', name: 'Blog', priceType: 'fixed', price: 690 },
    { id: 'seo-avancado', name: 'SEO avançado', priceType: 'from', price: 990 },
    { id: 'copywriting', name: 'Copywriting', priceType: 'from', price: 690 },
    { id: 'automacao-extra', name: 'Automação', priceType: 'from', price: 990 },
    { id: 'integracao-externa', name: 'Integração externa', priceType: 'from', price: 1490 },
    { id: 'dashboard', name: 'Dashboard', priceType: 'from', price: 2490 },
    { id: 'area-restrita', name: 'Área restrita', priceType: 'custom', price: null },
    { id: 'integracao-crm', name: 'Integração com CRM', priceType: 'from', price: 1490 },
    { id: 'integracao-api', name: 'Integração com API', priceType: 'from', price: 1490 },
    { id: 'analytics-avancado', name: 'Analytics avançado', priceType: 'from', price: 690 }
  ],
  complexCombinations: [
    ['sistema', 'saas'],
    ['plataforma', 'saas']
  ]
};


// ── Process Steps ──
const processData = [
  {
    number: '01',
    title: 'Entender',
    description: 'Compreendemos o problema, a oportunidade, os usuários e o contexto antes de propor qualquer tecnologia.',
    keywords: 'Problema • Usuário • Contexto',
    icon: 'loupe'
  },
  {
    number: '02',
    title: 'Pensar',
    description: 'Exploramos hipóteses, possibilidades e diferentes caminhos para encontrar a abordagem mais adequada.',
    keywords: 'Hipóteses • Possibilidades • Estratégia',
    icon: 'branches'
  },
  {
    number: '03',
    title: 'Estruturar',
    description: 'Transformamos possibilidades em escopo, prioridades, arquitetura e uma visão clara da solução.',
    keywords: 'Escopo • Arquitetura • Prioridades',
    icon: 'blocks'
  },
  {
    number: '04',
    title: 'Validar',
    description: 'Testamos hipóteses através de protótipos, MVPs ou validações antes de ampliar o investimento.',
    keywords: 'Protótipo • Teste • MVP',
    icon: 'validate'
  },
  {
    number: '05',
    title: 'Construir',
    description: 'Transformamos a estratégia em tecnologia através do desenvolvimento da solução.',
    keywords: 'Design • Desenvolvimento • Integração',
    icon: 'build'
  },
  {
    number: '06',
    title: 'Evoluir',
    description: 'Acompanhamos resultados, aprendemos com dados e identificamos oportunidades de melhoria e crescimento.',
    keywords: 'Dados • Aprendizado • Otimização',
    icon: 'evolve'
  }
];


// ── Impact Data (antigo Ventures) ──
const impactData = [
  { title: 'Sustentabilidade', icon: 'leaf' },
  { title: 'Educação', icon: 'book' },
  { title: 'Saúde', icon: 'heart' },
  { title: 'Impacto Social', icon: 'users' },
  { title: 'Cidades Inteligentes', icon: 'building' },
  { title: 'Terceiro Setor', icon: 'handshake' }
];


// ── Cases & Projects Data ──
const casesData = [
  {
    id: 'wavetype',
    title: 'WaveType',
    segment: 'EdTech / Educação Digital',
    status: 'Em desenvolvimento',
    statusTag: 'PRODUTO EM EVOLUÇÃO',
    solution: 'Plataforma digital para aprendizado de datilografia e ganho de velocidade e precisão na escrita, com gestão integrada de turmas e alunos para professores e modo individual.',
    highlights: [
      'Professores podem criar turmas e cadastrar alunos',
      'Acompanhamento de evolução e métricas de digitação',
      'Ambiente completo para treino e prática individual'
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'WebSockets'],
    image: 'assets/images/case-wavetype.jpg',
    ctaText: 'Entender arquitetura'
  },
  {
    id: 'nexus',
    title: 'Nexus',
    segment: 'Sustentabilidade & B2B',
    status: 'Em desenvolvimento',
    statusTag: 'PRODUTO EM EVOLUÇÃO',
    solution: 'Plataforma web para gestão sustentável de resíduos recicláveis, conectando empresas geradoras e compradores em um ambiente digital centralizado com gestão de pedidos e dashboards.',
    highlights: [
      'Gestão de pedidos e negociações diretas',
      'Controle operacional e rastreabilidade de resíduos',
      'Dashboards estratégicos e centralização de dados'
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'SQL'],
    image: 'assets/images/case-nexus.jpg',
    ctaText: 'Entender arquitetura'
  },
  {
    id: 'trivium-finance',
    title: 'Trivium Finance',
    segment: 'Fintech / Gestão Financeira',
    status: 'Em desenvolvimento',
    statusTag: 'PRODUTO EM EVOLUÇÃO',
    solution: 'Plataforma digital voltada para organização e planejamento financeiro pessoal, integrando assistente de inteligência artificial, notícias de mercado, calendário econômico e rastreamento de criptoativos.',
    highlights: [
      'Calendário econômico e notícias financeiras em tempo real',
      'Assistente conversacional com Inteligência Artificial',
      'Acompanhamento de ativos digitais e criptomoedas (BTC, ETH)'
    ],
    technologies: ['JavaScript', 'APIs Financeiras', 'IA Integrada', 'HTML5', 'CSS3', 'Node.js'],
    image: 'assets/images/case-trivium.jpg',
    ctaText: 'Entender arquitetura'
  }
];


// ── FAQ Data (Updated) ──
const faqData = [
  {
    question: 'Quanto custa desenvolver um projeto com a COGIT?',
    answer: 'Algumas soluções possuem valores iniciais definidos. Projetos personalizados variam conforme escopo, funcionalidades, integrações e complexidade técnica.'
  },
  {
    question: 'Preciso saber qual tecnologia utilizar?',
    answer: 'Não. Você pode começar explicando o problema, processo ou ideia. A COGIT ajuda a estruturar a solução e definir a tecnologia mais adequada.'
  },
  {
    question: 'Vocês desenvolvem projetos personalizados?',
    answer: 'Sim. Desenvolvemos sistemas, automações, plataformas, SaaS e outras soluções adaptadas às necessidades de cada projeto.'
  },
  {
    question: 'Posso combinar diferentes serviços?',
    answer: 'Sim. É possível combinar, por exemplo, site, automação, integrações, dashboards e outras funcionalidades em uma mesma solução.'
  },
  {
    question: 'Existe suporte após a entrega?',
    answer: 'Sim. Manutenção, suporte e evolução podem ser estruturados conforme o tipo de projeto e necessidade do cliente.'
  },
  {
    question: 'Quanto tempo demora um projeto?',
    answer: 'O prazo depende da complexidade, escopo e tipo de solução. Projetos mais simples podem ser entregues em semanas, enquanto soluções mais complexas seguem um cronograma definido em conjunto.'
  },
  {
    question: 'Vocês atendem empresas de outras cidades?',
    answer: 'Sim. Atendemos empresas de diferentes regiões. Todo o processo pode ser conduzido remotamente, desde o diagnóstico até a entrega e acompanhamento.'
  },
  {
    question: 'Como funciona o "Monte sua solução"?',
    answer: 'O configurador permite selecionar serviços e funcionalidades para visualizar uma estimativa inicial de investimento. Os valores apresentados são estimativas e não representam proposta comercial definitiva.'
  }
];


// ── Testimonials Data ──
// Add real testimonials here. Component is hidden when array is empty.
const testimonialsData = [
  // {
  //   name: 'Nome do Cliente',
  //   company: 'Empresa',
  //   role: 'Cargo',
  //   testimonial: 'Depoimento real do cliente.',
  //   photo: '', // optional
  //   projectLink: '' // optional
  // }
];


// ── Social Links ──
const socialLinks = {
  instagram: 'https://www.instagram.com/cmkcogit',
  linkedin: 'https://www.linkedin.com/in/cmkcogit',
  email: 'mailto:contato@cmkcogit.com.br',
  whatsapp: 'https://wa.me/5517981568889'
};


// ── Project Types (for form) ──
const projectTypes = [
  'Site',
  'Landing Page',
  'Sistema',
  'SaaS',
  'Automação',
  'MVP',
  'Outras Soluções'
];


// ── Budget Ranges (for form) ──
const budgetRanges = [
  'Até R$ 5.000',
  'R$ 5.000 – R$ 10.000',
  'R$ 10.000 – R$ 25.000',
  'R$ 25.000 – R$ 50.000',
  'Acima de R$ 50.000',
  'Ainda não sei'
];


// ── WhatsApp Quick Options ──
const whatsappOptions = [
  { label: 'Landing Page', message: 'Olá, tenho interesse em criar uma Landing Page com a COGIT.' },
  { label: 'Site Institucional', message: 'Olá, gostaria de entender sobre desenvolvimento de Site Institucional.' },
  { label: 'Solução Personalizada / Sistema', message: 'Olá, gostaria de conversar sobre uma solução personalizada.' },
  { label: 'COGIT Start (Pacote Rápido)', message: 'Olá, gostaria de entender sobre os pacotes COGIT Start.' },
  { label: 'Automação de Processos', message: 'Olá, gostaria de automatizar processos na minha empresa com a COGIT.' },
  { label: 'Produto Digital / SaaS / MVP', message: 'Olá, tenho uma ideia de produto digital / SaaS e quero estruturar com a COGIT.' },
  { label: 'Outro assunto', message: 'Olá, gostaria de conversar sobre meu projeto com a COGIT.' }
];
