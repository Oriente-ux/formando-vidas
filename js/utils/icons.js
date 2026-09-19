/* ==========================================================================
   Ícones — helper do Lucide (UMD global)
   Substitui <i data-lucide="..."> por SVGs. Chamar após cada render dinâmico
   e no boot (ícones estáticos do HTML). Idempotente: elementos já trocados
   não possuem mais o atributo data-lucide.
   ========================================================================== */

export function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}
