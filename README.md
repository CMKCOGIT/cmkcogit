# COGIT — site revisado

Revisão de 9 de setembro de 2026 a partir do ZIP original. O site continua em HTML, CSS e JavaScript, sem dependências de produção ou etapa de build.

## O que mudou

- Cards de serviços, objetivos e modelos com superfícies grafite, textos claros e o roxo original da marca nos controles e ações.
- Seleção consistente, contraste, foco de teclado, botões e espaçamentos revisados.
- Layouts preparados para larguras a partir de 300 px; correções em grids, animações laterais, metodologia, menu, rodapé e formulários.
- Consentimento com aceitar, recusar, configurar e revogar cookies opcionais. Autorização de contato separada e desmarcada inicialmente.
- Fontes Inter e Manrope locais, sem conexão com Google Fonts durante a navegação.
- Dados de formulário sem gravação em sessionStorage ou console. Texto livre protegido contra interpretação como HTML.
- Contato pelo WhatsApp com mensagem preparada após autorização. A confirmação de recebimento que existia sem envio foi corrigida.

## Usar os arquivos

Para hospedar, utilize o conteúdo da pasta `cmkcogit` como a raiz do site, preservando `assets`, `css`, `js`, `solucoes` e `projetos`. A pasta `docs` e os arquivos de revisão em `tools` são documentação e apoio local; não são necessários na hospedagem pública.

Para testar localmente com Node.js 20.11 ou superior:

```sh
node tools/preview.mjs --port 4173
```

Abra `http://localhost:4173/`. Não é necessário instalar pacotes. A página `http://localhost:4173/tools/review.html` permite escolher páginas e larguras para revisão visual.

Para executar as verificações repetíveis:

```sh
node tools/check.mjs
```

Os atalhos `npm run dev` e `npm run check` executam esses mesmos comandos.

## Arquivos para manutenção

- `css/refinements.css`: ajustes compartilhados e cores dos cards. A paleta principal permanece em `css/variables.css`.
- `js/privacy.js`: consentimento, preferências e autorização de contato.
- `js/analytics.js`: carregamento da análise somente após consentimento.
- `js/components.js`: diagnóstico da página inicial e diálogo de modelos.
- `js/configurator.js`: estimativa, adicionais e mensagem do configurador.
- `js/form.js`: diagnóstico completo da página de contato.
- `js/utils.js`: escape de texto, telefone, movimento reduzido e foco.
- `docs/RELATORIO.md`: achados, alterações, testes e limites da entrega.

## Configurações existentes

O identificador `siteConfig.gaId` em `js/data.js` permanece vazio, como no original. Não há coleta de Analytics enquanto ele não for configurado; mesmo configurado, o carregamento depende da autorização do visitante.

O projeto não contém um backend de formulários. O canal implementado utiliza o WhatsApp existente da COGIT. O visitante precisa revisar e enviar a mensagem no WhatsApp para a equipe recebê-la. O site não afirma que uma mensagem apenas preparada já foi recebida.

Os arquivos originais não incluíam demonstrações reais dos modelos. O botão “Ver modelo” abre informações e orienta a solicitar os modelos disponíveis à equipe. Não foram inventados exemplos de projetos.

As fontes locais mantêm suas licenças SIL Open Font License em `assets/fonts`.
