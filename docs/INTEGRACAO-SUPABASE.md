# Guia de integração com Supabase

## Estado atual

A autenticação está conectada ao Supabase. Cadastro, confirmação de e-mail, login, Google OAuth, restauração de sessão, recuperação de senha, redefinição de senha e logout usam `integracao/supabase/auth.js`. As páginas internas exigem sessão e redirecionam para a área correspondente ao tipo do usuário. Os dados dos painéis ainda são demonstrativos.

## Ambiente

O projeto usa Vite e lê estas variáveis do arquivo `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=false
```

A configuração `envPrefix` em `vite.config.js` permite manter os nomes `NEXT_PUBLIC_*`. A chave usada deve ser somente a publishable/anon. Nunca use `service_role` no navegador. Mantenha Google como `false` até habilitar o provider e cadastrar as URLs de retorno no painel do Supabase.

## Contrato do cadastro

O formulário envia somente este objeto para `cadastrarUsuario()`:

```js
{
  nome: 'Nome da pessoa',
  email: 'pessoa@exemplo.com',
  senha: 'senha digitada',
  tipo: 'aluno' // ou 'professor'
}
```

O formulário já importa diretamente `cadastrarUsuario()` de `integracao/supabase/auth.js`.

O retorno esperado segue o `data` do `supabase.auth.signUp()`:

- com `session`: a interface direciona para a área correspondente;
- sem `session`: a interface orienta a pessoa a confirmar o e-mail;
- com erro: a interface apresenta uma mensagem segura e mantém os dados para correção.

## Fluxo implementado

1. O Vite carrega o SDK `@supabase/supabase-js` e as variáveis públicas.
2. Cadastro e login chamam os serviços em `integracao/supabase/auth.js`.
3. Após o acesso, `getUsuarioAtual()` direciona:
   - `tipo === 'aluno'` → área do aluno;
   - `tipo === 'professor'` → área do professor.
4. `platform-shell.js` protege todas as páginas de `app/` e carrega o nome real do usuário.
5. O logout encerra a sessão no Supabase antes de voltar ao login.
6. O próximo passo é trocar os dados demonstrativos pelas funções abaixo.

## Mapa tela → serviço

| Tela/ação | Função existente | Observação |
|---|---|---|
| Cadastro | `cadastrarUsuario()` | conectado; confirmação de senha e aceite ficam apenas no front-end |
| Login | `loginComEmailSenha()` | conectado com mensagem genérica de erro |
| Google | `loginComGoogle()` | conectado a `auth-callback.html`; exige provider habilitado no painel |
| Recuperação | `enviarRecuperacaoSenha()` / `atualizarSenha()` | conectado |
| Perfil | `getUsuarioAtual()` | conectado; define papel, navegação e nome exibido |
| Logout | `logout()` | conectado |
| Nova turma | `criarTurma()` | modal usa `nome`; código é gerado no serviço |
| Entrar por código | `entrarNaTurma()` | requer correção de fluxo/RLS antes de funcionar |
| Listar turmas | `listarMinhasTurmas()` | cards prontos para receber o retorno |
| Alunos da turma | `listarAlunosDaTurma()` | requer política/RPC que permita os perfis |
| Novo exercício | `criarExercicio()` | campos usam o mesmo contrato do módulo |
| Exercícios | `listarExercicios()` | filtrar por `turmaId` |
| Salvar treino | `salvarResultado()` | conecte somente após o teste emitir o resultado final |
| Histórico | `listarMeusResultados()` | tabela e gráficos devem usar o retorno normalizado |
| Ranking | `buscarRankingExercicio()` | seletor define `exercicioId` |

## Entrega do resultado do teste

`js/script.js` foi mantido como a lógica independente da digitação. Quando o usuário finalizar um teste autenticado, exponha o resultado em um evento ou callback com esta forma:

```js
{
  exercicioId,
  ppm,
  precisao,
  acertos,
  erros,
  tempoSeg
}
```

O adaptador autenticado recebe esse objeto e chama `salvarResultado()`. Não coloque chamadas do Supabase dentro das funções de renderização de letras; isso preserva o teste e torna falhas de rede recuperáveis.

## Revisões obrigatórias no banco

### 1. Entrada por código está bloqueada pelo RLS atual

Antes da matrícula, o aluno não pode selecionar a turma, porque `turmas_select` só permite o professor dono ou um aluno já matriculado. Portanto, `entrarNaTurma()` não consegue localizar a turma pelo código.

Solução recomendada: criar uma RPC `entrar_na_turma(p_codigo)` com `SECURITY DEFINER`, validação do usuário e inserção controlada da matrícula. Não abra leitura pública de `turmas` apenas para contornar isso.

### 2. Professor não consegue ler o perfil dos alunos

`usuarios_select_own` permite que cada usuário veja apenas o próprio perfil. A consulta de `listarAlunosDaTurma()` tenta fazer join com `usuarios`, então os nomes/e-mails dos alunos podem ficar bloqueados.

Solução recomendada: uma RPC específica que retorne apenas os campos necessários dos alunos pertencentes às turmas do professor, ou uma policy cuidadosamente testada.

### 3. Possível recursão entre policies

`turmas_select` consulta `matriculas`, enquanto `matriculas_select` consulta `turmas`. Dependendo do plano da consulta, isso pode gerar recursão de RLS.

Teste o schema em um projeto limpo. Se houver recursão, mova as verificações de pertencimento para funções auxiliares `SECURITY DEFINER` com `search_path` fixo e permissões mínimas.

### 4. RPC de ranking

Confirme que `ranking_exercicio()` verifica se o usuário pode acessar o exercício solicitado. Por ser `SECURITY DEFINER`, ela não deve confiar apenas no identificador recebido. Revogue execução pública e conceda somente ao papel autenticado necessário.

### 5. Métricas calculadas no navegador

O módulo alerta corretamente que PPM e precisão enviados pelo cliente podem ser adulterados. Antes de usar ranking competitivo ou certificação, recalcule/valide o resultado em uma Edge Function ou serviço de servidor.

## Checklist de segurança

- Nunca enviar `service_role` para o navegador.
- Manter a `anon key` apenas como chave pública acompanhada de RLS correta.
- Validar autorização no banco, não apenas esconder botões.
- Não gerar senhas de alunos no navegador.
- Revisar redirects OAuth para produção e preview.
- Criar testes com dois professores, dois alunos e turmas diferentes para provar o isolamento.
- Usar dados fictícios nas demonstrações e screenshots.
