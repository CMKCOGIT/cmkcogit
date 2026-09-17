# WaveType — plataforma front-end

Plataforma navegável da WaveType. A entrega une a experiência pública de digitação, a apresentação comercial do produto, autenticação real com Supabase e as áreas protegidas de aluno e professor. Os dados internos dos painéis ainda são demonstrativos até que cada módulo de negócio seja conectado.

## Como executar

1. Instale as dependências com `npm install`.
2. Crie o arquivo `.env` a partir de `.env.example`.
3. Inicie o projeto com `npm run dev`.
4. Gere a versão de produção com `npm run build`.

Não abra os arquivos HTML diretamente. O Vite é responsável por carregar as variáveis do Supabase e compilar os módulos JavaScript.

Principais endereços:

- Área do aluno: `app/aluno/index.html`
- Área do professor: `app/professor/index.html`
- Login: `/login.html`
- Cadastro: `/cadastro.html`
- Recuperação: `/recuperar-senha.html`

## Páginas entregues

### Público

- `index.html`: digitação imediata, resultado, apresentação do produto e demonstrações.
- `como-funciona.html`: método e explicação das métricas.
- `escolas.html`: proposta para professores e instituições.
- `sobre.html`: origem, missão, visão, propósito e valores.
- `login.html` e `cadastro.html`: acesso real com Supabase Auth.
- `recuperar-senha.html` e `redefinir-senha.html`: recuperação e troca segura de senha.
- `auth-callback.html`: retorno do login com Google.

### Aluno

- Visão geral, prática, resultados, conquistas e ranking.
- Entrada em turma por código.
- Métricas e histórico em estados demonstrativos.

### Professor

- Visão geral, turmas, alunos, exercícios e relatórios.
- Modais de nova turma, novo exercício e novo aluno.
- Busca visual de alunos e estados de acompanhamento.

## Organização

```text
assets/                 fontes, logos, favicons e imagens oficiais
css/
  style.css             experiência pública e teste de digitação
  platform.css          design system e interfaces autenticadas
app/
  aluno/                páginas do aluno
  professor/            páginas do professor
js/
  script.js             lógica original do teste de digitação
  site.js               navegação e tema do site público
  public-gate.js        convite de login em recursos protegidos
  auth-ui.js            cadastro e login conectados ao Supabase
  auth-recovery.js      recuperação e redefinição de senha
  auth-callback.js      finalização do OAuth
  platform-shell.js     proteção de sessão, logout, sidebar, topbar e tema
integracao/supabase/    cliente, autenticação, módulos de dados e schema
docs/                   contrato de dados e guia de integração
```

## Identidade aplicada

- Tipografia de interface: Manrope.
- Tipografia de digitação e métricas: IBM Plex Mono.
- Paleta: Action Blue, Wave Blue, Flow Violet, Evolution Aqua, Deep Ink e Soft Mist; o modo escuro usa apenas as extensões oficiais do kit.
- Marca oficial em SVG e favicons do brand kit.

Não adicione outra fonte ou cor sem revisar o manual da marca.

## O que está funcional agora

- Teste de digitação completo, com níveis, tempos, frases/palavras, métricas, gráfico e histórico local.
- Tema claro/escuro.
- Navegação responsiva de todas as páginas.
- Cadastro, confirmação de e-mail, login por senha e login com Google.
- Recuperação e redefinição de senha.
- Persistência de sessão, proteção das áreas internas e logout.
- Busca local na tabela de alunos.
- Modais e estados de retorno para ações do professor.

## Próxima integração

Leia `docs/INTEGRACAO-SUPABASE.md` e `docs/CONTRATO-DE-DADOS.md`. A autenticação já está conectada, mas turmas, exercícios, resultados, XP, conquistas, sequência de dias e notificações ainda precisam substituir os dados demonstrativos.
