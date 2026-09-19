/* ==========================================================================
   Galeria / Feed — render dinâmico + lightbox acessível
   ========================================================================== */

import { GALERIA } from '../data/schoolData.js';

export function renderGaleria() {
  const grid = document.getElementById('galeria-grid');
  if (!grid) return;

  grid.innerHTML = GALERIA.map(
    (g, i) => `
    <figure class="galeria-item" data-motion="card" data-stagger-item>
      <img
        src="${g.src}"
        alt="${g.alt}"
        loading="lazy"
        decoding="async"
        width="640"
        height="480"
        data-lightbox-open="${i}"
      />
      <figcaption>
        <span>${g.caption}</span>
        <span class="tag">${g.tag}</span>
      </figcaption>
    </figure>
  `
  ).join('');

  initLightbox(grid);
}

function initLightbox(grid) {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const img = lightbox.querySelector('img');
  const caption = lightbox.querySelector('figcaption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const lastFocused = { el: null };

  const open = (index) => {
    const item = GALERIA[index];
    if (!item) return;
    lastFocused.el = document.activeElement;
    img.src = item.src;
    img.alt = item.alt;
    caption.textContent = item.caption;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const close = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocused.el && typeof lastFocused.el.focus === 'function') {
      lastFocused.el.focus();
    }
  };

  grid.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-lightbox-open]');
    if (trigger) open(Number(trigger.dataset.lightboxOpen));
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close();
  });
}
