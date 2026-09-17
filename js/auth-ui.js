import {
    cadastrarUsuario,
    getUsuarioAtual,
    loginComEmailSenha,
    loginComGoogle,
    obterSessao
} from '../integracao/supabase/auth.js';

(function () {
    'use strict';

    const form = document.querySelector('[data-auth-form]');
    if (!form) return;

    const mode = form.dataset.authForm;
    const feedback = form.querySelector('[data-form-feedback]');
    const submitButton = form.querySelector('[type="submit"]');
    const submitLabel = submitButton?.querySelector('[data-button-label]');

    function showFeedback(message, state) {
        if (!feedback) return;
        feedback.textContent = message;
        feedback.dataset.state = state || 'info';
        feedback.hidden = false;
    }

    function hideFeedback() {
        if (!feedback) return;
        feedback.hidden = true;
        feedback.textContent = '';
        feedback.removeAttribute('data-state');
    }

    function setLoading(isLoading) {
        if (!submitButton) return;
        submitButton.disabled = isLoading;
        submitButton.classList.toggle('is-loading', isLoading);
        submitButton.setAttribute('aria-busy', String(isLoading));
        if (submitLabel) {
            const loadingLabel = mode === 'cadastro' ? 'Criando conta…' : 'Entrando…';
            submitLabel.textContent = isLoading ? loadingLabel : (submitButton.dataset.submitLabel || 'Continuar');
        }
    }

    function setFieldError(name, message) {
        const input = form.elements.namedItem(name);
        const error = form.querySelector(`[data-error-for="${name}"]`);
        if (input instanceof RadioNodeList) return;
        if (input) input.setAttribute('aria-invalid', message ? 'true' : 'false');
        if (error) error.textContent = message || '';
    }

    function emailIsValid(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 190;
    }

    function passwordIsValid(value) {
        return value.length >= 8 && /[A-Za-zÀ-ÿ]/.test(value) && /[0-9]/.test(value);
    }

    const signupValidators = {
        nome(value) {
            const length = value.trim().length;
            if (!length) return 'Informe seu nome completo.';
            if (length < 2) return 'Use pelo menos 2 caracteres.';
            if (length > 120) return 'O nome deve ter no máximo 120 caracteres.';
            return '';
        },
        email(value) {
            if (!value.trim()) return 'Informe seu e-mail.';
            return emailIsValid(value.trim()) ? '' : 'Digite um e-mail válido.';
        },
        senha(value) {
            if (!value) return 'Crie uma senha.';
            return passwordIsValid(value) ? '' : 'Use 8 caracteres ou mais, incluindo uma letra e um número.';
        },
        confirmar_senha(value) {
            if (!value) return 'Confirme sua senha.';
            return value === form.elements.senha.value ? '' : 'As senhas não coincidem.';
        },
        aceite(value, input) {
            return input.checked ? '' : 'Confirme a criação da conta para continuar.';
        }
    };

    function validateSignupField(name) {
        const input = form.elements.namedItem(name);
        const validator = signupValidators[name];
        if (!input || !validator || input instanceof RadioNodeList) return true;
        const message = validator(input.value, input);
        setFieldError(name, message);
        return !message;
    }

    function validateSignup() {
        const fields = ['nome', 'email', 'senha', 'confirmar_senha', 'aceite'];
        const invalidFields = fields.filter((name) => !validateSignupField(name));
        if (invalidFields.length) {
            const firstInvalid = form.elements.namedItem(invalidFields[0]);
            if (firstInvalid && !(firstInvalid instanceof RadioNodeList)) firstInvalid.focus();
            showFeedback('Revise os campos destacados antes de continuar.', 'error');
            return false;
        }
        return true;
    }

    function updatePasswordRules() {
        const value = form.elements.senha?.value || '';
        const states = {
            length: value.length >= 8,
            letter: /[A-Za-zÀ-ÿ]/.test(value),
            number: /[0-9]/.test(value)
        };
        Object.entries(states).forEach(([rule, isValid]) => {
            form.querySelector(`[data-password-rule="${rule}"]`)?.classList.toggle('is-valid', isValid);
        });
    }

    function friendlySignupError(error) {
        const message = String(error?.message || '').toLowerCase();
        if (message.includes('already registered') || message.includes('already exists') || message.includes('user already')) {
            return 'Este e-mail já está cadastrado. Entre na sua conta ou use outro endereço.';
        }
        if (message.includes('rate limit') || message.includes('too many')) {
            return 'Foram feitas muitas tentativas. Aguarde alguns minutos e tente novamente.';
        }
        if (message.includes('fetch') || message.includes('network') || message.includes('failed to load')) {
            return 'Não foi possível conectar ao cadastro agora. Verifique sua conexão e tente novamente.';
        }
        if (message.includes('password')) {
            return 'A senha não atende aos requisitos de segurança.';
        }
        return 'Não foi possível concluir o cadastro. Revise os dados e tente novamente.';
    }

    async function redirectToUserArea() {
        const usuario = await getUsuarioAtual();
        const tipo = usuario?.tipo === 'professor' ? 'professor' : 'aluno';
        window.location.replace(`app/${tipo}/index.html`);
    }

    form.querySelectorAll('[data-password-toggle]').forEach((button) => {
        button.addEventListener('click', () => {
            const input = document.getElementById(button.dataset.passwordToggle);
            if (!input) return;
            const shouldShow = input.type === 'password';
            input.type = shouldShow ? 'text' : 'password';
            button.textContent = shouldShow ? 'Ocultar' : 'Mostrar';
            button.setAttribute('aria-pressed', String(shouldShow));
            button.setAttribute('aria-label', shouldShow ? 'Ocultar senha' : 'Mostrar senha');
            input.focus();
        });
    });

    if (mode === 'cadastro') {
        updatePasswordRules();

        ['nome', 'email', 'senha', 'confirmar_senha'].forEach((name) => {
            const input = form.elements.namedItem(name);
            input?.addEventListener('blur', () => validateSignupField(name));
            input?.addEventListener('input', () => {
                hideFeedback();
                if (input.getAttribute('aria-invalid') === 'true') validateSignupField(name);
                if (name === 'senha') {
                    updatePasswordRules();
                    if (form.elements.confirmar_senha.value) validateSignupField('confirmar_senha');
                }
            });
        });

        form.elements.aceite?.addEventListener('change', () => {
            hideFeedback();
            validateSignupField('aceite');
        });

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            hideFeedback();
            if (!validateSignup()) return;

            const payload = {
                nome: form.elements.nome.value.trim(),
                email: form.elements.email.value.trim().toLowerCase(),
                senha: form.elements.senha.value,
                tipo: form.querySelector('[name="tipo"]:checked')?.value || 'aluno'
            };

            setLoading(true);
            showFeedback('Criando sua conta com segurança…', 'info');

            try {
                const result = await cadastrarUsuario(payload);

                if (result?.session) {
                    showFeedback('Conta criada. Preparando seu espaço na WaveType…', 'success');
                    window.setTimeout(redirectToUserArea, 700);
                    return;
                }

                showFeedback('Conta criada. Confira seu e-mail para confirmar o acesso à WaveType.', 'success');
                form.reset();
                form.querySelector('[name="tipo"][value="aluno"]').checked = true;
                updatePasswordRules();
            } catch (error) {
                console.error('Falha ao criar a conta WaveType:', error);
                showFeedback(friendlySignupError(error), 'error');
            } finally {
                setLoading(false);
            }
        });

        return;
    }

    const authNotice = new URLSearchParams(window.location.search);
    if (authNotice.has('confirmado')) {
        showFeedback('E-mail confirmado. Agora você já pode entrar.', 'success');
    } else if (authNotice.has('senha')) {
        showFeedback('Senha atualizada. Entre com sua nova senha.', 'success');
    } else if (authNotice.has('saiu')) {
        showFeedback('Sessão encerrada com segurança.', 'success');
    } else if (authNotice.has('acesso')) {
        showFeedback('Entre para acessar essa área da WaveType.', 'info');
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        hideFeedback();
        const email = form.elements.email?.value.trim().toLowerCase() || '';
        const password = form.querySelector('[name="senha"]');

        if (!emailIsValid(email)) {
            showFeedback('Digite um e-mail válido.', 'error');
            form.elements.email?.focus();
            return;
        }
        if (!password?.value) {
            showFeedback('Informe sua senha.', 'error');
            password?.focus();
            return;
        }

        setLoading(true);
        showFeedback('Validando seu acesso…', 'info');
        try {
            await loginComEmailSenha({ email, senha: password.value });
            showFeedback('Acesso confirmado. Abrindo seu espaço…', 'success');
            await redirectToUserArea();
        } catch (error) {
            console.error('Falha no login WaveType:', error);
            showFeedback('E-mail ou senha incorretos.', 'error');
            setLoading(false);
        }
    });

    const googleButton = document.querySelector('[data-google-login]');
    const googleEnabled = import.meta.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === 'true';
    if (googleButton && !googleEnabled) {
        googleButton.hidden = true;
        googleButton.previousElementSibling?.setAttribute('hidden', '');
    }

    googleButton?.addEventListener('click', async (event) => {
        const button = event.currentTarget;
        button.disabled = true;
        showFeedback('Abrindo o acesso com Google…', 'info');
        try {
            await loginComGoogle();
        } catch (error) {
            console.error('Falha no login com Google:', error);
            showFeedback('Não foi possível iniciar o acesso com Google.', 'error');
            button.disabled = false;
        }
    });

    obterSessao().then((session) => {
        if (session) redirectToUserArea();
    }).catch((error) => console.error('Não foi possível restaurar a sessão:', error));
})();
