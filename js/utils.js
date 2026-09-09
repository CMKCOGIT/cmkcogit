/* Small shared helpers; no storage or external requests. */
window.CogitUI = {
  escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
  },
  formatPhone(value) {
    const digits = String(value).replace(/\D/g, '').slice(0, 11);
    if (!digits) return '';
    if (digits.length <= 2) return `(${digits}`;
    const split = digits.length === 10 ? 6 : 7;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, split)}${digits.length > split ? '-' + digits.slice(split) : ''}`;
  },
  motion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'; },
  focusHeading(container) {
    const heading = container?.querySelector('h1, h2, h3, h4');
    if (heading) { heading.tabIndex = -1; heading.focus({preventScroll: true}); }
  }
};
