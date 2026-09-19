/* ==========================================================================
   Micro-interações — Motion Dev (Motion One)
   Efeitos táticos de hover e tap (escala com spring) em CTAs e cards.
   ========================================================================== */

import { animate, spring } from 'motion';

const SPRING = spring({ stiffness: 420, damping: 26, mass: 0.7 });

function bindHoverTap(el, { hoverScale = 1.045, tapScale = 0.96 } = {}) {
  if (!el) return;

  el.addEventListener('pointerenter', () => {
    animate(el, { scale: hoverScale }, { easing: SPRING });
  });

  el.addEventListener('pointerleave', () => {
    animate(el, { scale: 1 }, { easing: SPRING });
  });

  el.addEventListener('pointerdown', () => {
    animate(el, { scale: tapScale }, { easing: SPRING });
  });

  el.addEventListener('pointerup', () => {
    animate(el, { scale: hoverScale }, { easing: SPRING });
  });

  el.addEventListener('pointercancel', () => {
    animate(el, { scale: 1 }, { easing: SPRING });
  });
}

function bindCardLift(el) {
  if (!el) return;

  el.addEventListener('pointerenter', () => {
    animate(
      el,
      { y: -6, scale: 1.015 },
      { easing: SPRING }
    );
  });

  el.addEventListener('pointerleave', () => {
    animate(el, { y: 0, scale: 1 }, { easing: SPRING });
  });
}

export function initMicroInteractions() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  // Botões de CTA (WhatsApp, gold, navy, ghost)
  document.querySelectorAll('[data-motion="cta"]').forEach((btn) => {
    bindHoverTap(btn, { hoverScale: 1.045, tapScale: 0.96 });
  });

  // Cards interativos (galeria, unidades, níveis, pilares)
  document.querySelectorAll('[data-motion="card"]').forEach((card) => {
    bindCardLift(card);
  });

  // Botão flutuante do WhatsApp
  const waFloat = document.getElementById('wa-float');
  if (waFloat) {
    bindHoverTap(waFloat, { hoverScale: 1.1, tapScale: 0.92 });
  }
}
