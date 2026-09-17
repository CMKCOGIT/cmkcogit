import { atualizarSenha, enviarRecuperacaoSenha } from '../integracao/supabase/auth.js';

const form = document.querySelector('[data-auth-recovery]');
const feedback = form?.querySelector('[data-form-feedback]');
const button = form?.querySelector('[type="submit"]');
const buttonLabel = button?.querySelector('[data-button-label]');

function showFeedback(message, state = 'info') {
  feedback.textContent = message;
  feedback.dataset.state = state;
  feedback.hidden = false;
}

function setLoading(active) {
  button.disabled = active;
  button.classList.toggle('is-loading', active);
  button.setAttribute('aria-busy', String(active));
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validPassword(value) {
  return value.length >= 8 && /[A-Za-zÀ-ÿ]/.test(value) && /[0-9]/.test(value);
}

form?.querySelectorAll('[data-password-toggle]').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const input = document.getElementById(toggle.dataset.passwordToggle);
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    toggle.textContent = show ? 'Ocultar' : 'Mostrar';
    toggle.setAttribute('aria-pressed', String(show));
  });
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  feedback.hidden = true;
  const mode = form.dataset.authRecovery;

  if (mode === 'request') {
    const email = form.elements.email.value.trim().toLowerCase();
    if (!validEmail(email)) {
      showFeedback('Digite um e-mail válido.', 'error');
      form.elements.email.focus();
      return;
    }

    setLoading(true);
    buttonLabel.textContent = 'Enviando…';
    try {
      await enviarRecuperacaoSenha(email);
      showFeedback('Se o e-mail estiver cadastrado, você receberá o link de recuperação em instantes.', 'success');
      form.reset();
    } catch (error) {
      console.error('Falha ao solicitar recuperação:', error);
      showFeedback('Não foi possível enviar o link agora. Tente novamente em alguns minutos.', 'error');
    } finally {
      setLoading(false);
      buttonLabel.textContent = 'Enviar link de recuperação';
    }
    return;
  }

  const password = form.elements.senha.value;
  const confirmation = form.elements.confirmar_senha.value;
  if (!validPassword(password)) {
    showFeedback('Use oito caracteres ou mais, incluindo uma letra e um número.', 'error');
    form.elements.senha.focus();
    return;
  }
  if (password !== confirmation) {
    showFeedback('As senhas não coincidem.', 'error');
    form.elements.confirmar_senha.focus();
    return;
  }

  setLoading(true);
  buttonLabel.textContent = 'Salvando…';
  try {
    await atualizarSenha(password);
    showFeedback('Senha atualizada. Você já pode entrar novamente.', 'success');
    window.setTimeout(() => window.location.replace('login.html?senha=atualizada'), 1200);
  } catch (error) {
    console.error('Falha ao atualizar senha:', error);
    showFeedback('O link pode ter expirado. Solicite uma nova recuperação.', 'error');
    setLoading(false);
    buttonLabel.textContent = 'Salvar nova senha';
  }
});
