/* Movimento leve e contextual da página Sobre & projetos. */
document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('.page-about-v2');
  if (!body) return;

  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = Array.from(document.querySelectorAll('[data-about-reveal]'));

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('is-visible'));
    document.querySelectorAll('[data-story-line]').forEach(line => line.classList.add('is-drawn'));
    return;
  }

  body.classList.add('about-motion-ready');
  revealItems.forEach((item, index) => {
    item.style.setProperty('--about-delay', (index % 3) * 70 + 'ms');
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      entry.target.querySelectorAll('[data-story-line]').forEach(line => line.classList.add('is-drawn'));
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

  revealItems.forEach(item => observer.observe(item));

  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('[data-interactive-surface]').forEach(surface => {
    let frame = null;
    surface.addEventListener('pointermove', event => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = surface.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        surface.style.setProperty('--pointer-x', x * 100 + '%');
        surface.style.setProperty('--pointer-y', y * 100 + '%');
        surface.style.setProperty('--tilt-x', (x - 0.5) * 2.2 + 'deg');
        surface.style.setProperty('--tilt-y', (0.5 - y) * 2.2 + 'deg');
      });
    });
    surface.addEventListener('pointerleave', () => {
      if (frame) cancelAnimationFrame(frame);
      surface.style.setProperty('--tilt-x', '0deg');
      surface.style.setProperty('--tilt-y', '0deg');
      surface.style.setProperty('--pointer-x', '80%');
      surface.style.setProperty('--pointer-y', '20%');
    });
  });
});
