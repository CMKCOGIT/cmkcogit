# Relatório da revisão COGIT

Data: 9 de setembro de 2026.

## Escopo e preservação

O arquivo original continha 47 arquivos: 24 documentos HTML, incluindo 21 páginas de conteúdo, dois redirecionamentos e o arquivo de verificação do Google. Nenhum arquivo original foi removido. Foram preservados a estrutura estática, a marca, as imagens, os serviços e os valores cadastrados. As mudanças de conteúdo se concentram em consentimento, clareza do contato e correções de comportamento.

A revisão incluiu páginas, referências internas, estilos compartilhados, componentes dinâmicos, navegação, formulários, estado das escolhas, estimativas e integrações existentes. O site público não foi publicado por esta entrega: o resultado é o pacote de arquivos revisados.

## Design e leitura

Os cards coloridos competiam com títulos, descrições e botões, principalmente na comparação entre modelos prontos e sob medida. A nova família usa grafite para a superfície, texto claro para leitura e roxo para ação, seleção e foco. O fundo azul institucional das seções permanece.

| Papel | Cor |
|---|---|
| Roxo principal original | `#4A3DDB` |
| Superfície do card | `#242329` |
| Superfície ao passar o mouse | `#2B2932` |
| Superfície selecionada | `#302B3A` |
| Texto principal | `#FAFAFC` |
| Texto secundário | `#C6C3CF` |
| Indicador de seleção | `#A78BFA` |
| Foco em fundo escuro | `#C4B5FD` |

O mesmo sistema foi aplicado ao diagnóstico da página inicial, ao configurador de orçamento e ao diagnóstico completo. Títulos, ícones, descrições e ações têm funções visuais distintas. A seleção dos modelos na página inicial usa radios nativos; ações secundárias ficam separadas da seleção. Os botões principais continuam roxos.

Contrastes calculados: texto principal/card 14,95:1; texto secundário/card 8,99:1; texto secundário/card selecionado 7,90:1; branco/botão roxo 7,04:1. Esses pares superam 4,5:1. Isso verifica os pares de cores especificados, não constitui uma certificação de acessibilidade de toda a aplicação.

## Responsividade e navegação

- Grids automáticos podem encolher abaixo de suas antigas larguras mínimas fixas.
- Cards de modelos, formulário e resumo passam para uma coluna quando o espaço exige.
- Elementos flexíveis aceitam quebra de linha; títulos, textos longos e botões não dependem de uma largura fixa.
- As colunas da metodologia passaram de percentuais que somavam 100% mais o espaçamento para frações que respeitam o espaço disponível.
- Animações laterais em telas pequenas foram ajustadas para não criar transbordamento horizontal.
- Menu móvel com foco, Escape, bloqueio de interação de fundo e submenus fora da ordem de foco quando fechados.
- O botão fixo de contato fica oculto junto aos formulários e ao rodapé, para não cobrir campos nem as preferências de cookies.
- Diálogo de modelos nativo, com foco modal, fechamento e retorno ao acionador.
- Link para pular ao conteúdo, foco nas novas etapas, estados de seleção acessíveis e controles de quantidade acionáveis pelo teclado.
- Respeito à preferência por movimento reduzido; conteúdo principal continua legível sem animações ou JavaScript.
- Fontes locais e campos com texto de pelo menos 16 px, reduzindo a necessidade de zoom automático em dispositivos móveis.

## Cookies, termos e dados

O comportamento anterior lembrava somente a aceitação, não oferecia preferências completas e não mantinha uma recusa de modo consistente entre páginas.

Agora há três ações: aceitar opcionais, rejeitar opcionais e configurar preferências. A escolha é lembrada por até 180 dias, com versão e expiração; valores inválidos ou antigos não autorizam análise. O rodapé permite rever e retirar a decisão. O bloqueio de armazenamento no navegador não impede o uso da página: nesse caso a escolha dura somente naquela página.

O Google Analytics só é carregado depois de uma autorização válida e da configuração de um ID GA4. Não há fila de eventos ou requisições de Analytics antes disso. A revogação interrompe eventos, remove cookies de análise acessíveis à origem e recarrega a página se o fornecedor já estava carregado. A integração não envia nome, telefone, e-mail ou contexto dos formulários como parâmetros de eventos; os parâmetros e fragmentos da URL não integram a configuração de página enviada. Recursos publicitários permanecem desativados.

A autorização de contato é independente dos cookies opcionais. O visitante pode rejeitar análise e ainda solicitar atendimento. A caixa de autorização vem desmarcada e faz referência aos termos e à política. Aceitar cookies não autoriza o envio de dados de formulário.

A comunicação necessária para servir o próprio site e os registros do provedor de hospedagem não são equivalentes a Analytics. Essa distinção foi incorporada à política. As configurações e os prazos de retenção da hospedagem e do atendimento externo dependem dos serviços utilizados pela COGIT e não podem ser determinados somente pelo ZIP.

## Formulários e lógica corrigidos

- Retirada de dados pessoais dos logs e do sessionStorage. Rascunhos permanecem somente na página aberta; as antigas chaves locais são limpas.
- Escape de texto livre na renderização do diagnóstico, inclusive ao voltar para a área de texto.
- Validação de telefone brasileiro com DDD e 10 ou 11 dígitos; máscara adequada aos dois formatos.
- Formulário final do configurador com campos, submissão e validação sem anúncio falso de recebimento.
- Conteúdo dos campos preservado ao voltar entre as etapas do configurador. A autorização de contato precisa ser confirmada novamente após reconstruir a etapa.
- Adicionais incompatíveis são retirados ao mudar os serviços; valores totais deixam de usar um estado de complexidade antigo.
- Controles de quantidade separados da seleção do adicional.
- Pré-seleção entre páginas por identificadores de serviço na URL, sem transportar dados pessoais.
- Portfólio incluído no diagnóstico completo, com descrição e recomendação próprias, sem ser confundido com Landing Page.
- Links antigos das páginas legais corrigidos; sitemap e metadados das páginas legais alinhados às rotas existentes.

## Verificações realizadas

1. **24 HTMLs inspecionados:** arquivos locais referenciados, âncoras, IDs únicos, idioma, zoom, scripts e elementos básicos de estrutura.
2. **21 páginas de conteúdo em oito larguras:** 300, 320, 375, 600, 768, 1024, 1440 e 1920 px, totalizando 168 combinações. A rodada após as correções não detectou transbordamentos horizontais nem imagens locais quebradas. Resultado em `responsividade.json`.
3. **18 verificações repetíveis de código e lógica:** sintaxe JavaScript, referências, armazenamento, consentimento, expiração, revogação, dados bloqueados em eventos, contraste, texto livre, telefone, totais, adicionais, quantidades e montagem da mensagem. Saída em `verificacoes.txt`; execução com `node tools/check.mjs`.
4. **Revisão no navegador:** comparação de modelos, seleção de radio, diálogo e fechamento, diagnóstico da página inicial a 300 px, menu e submenu móvel, texto digitado tratado literalmente, impedimento de contato sem autorização, navegação entre etapas, preservação visual dos campos e preparação da mensagem do diagnóstico completo.

As mensagens de teste utilizaram dados fictícios e não foram enviadas à COGIT. A montagem do link externo do configurador foi verificada com uma abertura simulada; não houve envio real a WhatsApp ou e-mail.

A auditoria de larguras mede as páginas em Chromium e foi complementada por revisão visual e de fluxos. Não equivale a testes em todos os aparelhos físicos ou em todos os navegadores. A coleta real do Google Analytics não foi validada contra uma propriedade externa, pois o ID do projeto está vazio.

## Pendências que dependem de conteúdo ou infraestrutura

- Configurar o ID GA4 caso a COGIT queira usar estatísticas opcionais.
- Conectar um backend se for desejado receber formulários diretamente, sem o visitante concluir o envio no WhatsApp. Nenhum backend estava presente no código recebido.
- Disponibilizar URLs, imagens ou arquivos reais dos modelos se o botão “Ver modelo” precisar apresentar uma demonstração visual efetiva.
- Publicar os arquivos revisados na hospedagem escolhida e conferir o domínio, redirecionamentos, cache e certificados nesse ambiente.

## Referências da configuração de consentimento e contraste

- [ANPD — Guia orientativo: cookies e proteção de dados pessoais](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf/@@display-file/file).
- [W3C — Understanding SC 1.4.3: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

O texto de privacidade foi alinhado ao comportamento implementado. Os tratamentos realizados pela hospedagem e após o recebimento de mensagens precisam corresponder às práticas reais da empresa.
