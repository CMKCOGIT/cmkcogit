import { getUsuarioAtual, obterSessao } from '../integracao/supabase/auth.js';

(function () {
    'use strict';

    const triggers = document.querySelectorAll('[data-auth-required]');
    if (!triggers.length) return;

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.hidden = true;
    backdrop.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="gate-title">
            <div class="modal-head"><div><span class="eyebrow">Continue sua evolução</span><h2 id="gate-title">Entre para salvar seu progresso</h2></div><button class="modal-close" type="button" aria-label="Fechar">×</button></div>
            <p>O teste continua gratuito e sem cadastro. Com uma conta, seus resultados, conquistas, ranking e turma ficam disponíveis em qualquer dispositivo.</p>
            <div class="modal-actions"><a class="button secondary" href="cadastro.html">Criar conta</a><a class="button" href="login.html">Entrar</a></div>
        </div>`;
    document.body.appendChild(backdrop);

    const open = () => {
        backdrop.hidden = false;
        backdrop.querySelector('.modal-close').focus();
    };
    const close = () => { backdrop.hidden = true; };

    triggers.forEach((trigger) => trigger.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
            const session = await obterSessao();
            if (session) {
                const usuario = await getUsuarioAtual();
                const tipo = usuario?.tipo === 'professor' ? 'professor' : 'aluno';
                window.location.href = `app/${tipo}/index.html`;
                return;
            }
        } catch (error) {
            console.error('Não foi possível consultar a sessão:', error);
        }
        open();
    }));
    backdrop.querySelector('.modal-close').addEventListener('click', close);
    backdrop.addEventListener('click', (event) => { if (event.target === backdrop) close(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
})();
