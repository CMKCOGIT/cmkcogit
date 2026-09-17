import { getUsuarioAtual, obterSessao } from '../integracao/supabase/auth.js';

const status = document.querySelector('[data-callback-status]');
const loginLink = document.querySelector('[data-callback-login]');

try {
  const session = await obterSessao();
  if (!session) throw new Error('Sessão não encontrada.');
  const usuario = await getUsuarioAtual();
  const tipo = usuario?.tipo === 'professor' ? 'professor' : 'aluno';
  status.textContent = 'Acesso confirmado. Abrindo a plataforma…';
  window.location.replace(`app/${tipo}/index.html`);
} catch (error) {
  console.error('Falha no retorno da autenticação:', error);
  status.textContent = 'Não foi possível concluir o acesso. Tente entrar novamente.';
  loginLink.hidden = false;
  document.querySelector('.status-loader')?.remove();
}
