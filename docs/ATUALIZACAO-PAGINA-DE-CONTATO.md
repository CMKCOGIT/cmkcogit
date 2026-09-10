# Atualização da página de contato

## Decisão de experiência

A página `contato.html` deixou de repetir o configurador. O papel de cada jornada agora fica claro:

- **Contato:** conversar, tirar dúvidas e contar um desafio com poucas informações.
- **Monte sua solução:** combinar serviços, objetivos e recursos para obter uma estimativa inicial.

## Nova estrutura

1. Abertura com proposta direta e canais de WhatsApp e e-mail.
2. Formulário curto com nome, empresa opcional, canal de retorno e descrição do desafio.
3. Mensagem preparada no WhatsApp, sempre revisada e confirmada pelo visitante antes do envio.
4. Contexto preservado quando o visitante chega por links com `?solucao=` sem pedir que ele selecione o serviço outra vez.
5. Dúvidas gerais em acordeão para reduzir objeções antes do contato.
6. Atalho secundário para o configurador, sem competir com a conversa direta.

## UX, acessibilidade e privacidade

- Conteúdo adaptado de 300 a 1920 pixels, sem rolagem horizontal nas larguras verificadas.
- Hierarquia de títulos, foco visível, campos rotulados e acordeões acessíveis.
- Animações leves com respeito à preferência de movimento reduzido.
- Autorização de contato separada dos cookies opcionais.
- Nenhum dado digitado é salvo no navegador ou enviado automaticamente.

## Arquivos alterados

- `contato.html`
- `css/contact-page.css`
- `js/contact-page.js`
