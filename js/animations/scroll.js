/* ==========================================================================
   Scroll — GSAP + ScrollTrigger
   Revelação em cascata (stagger) para cards de unidades, níveis e seções.
   ========================================================================== */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Barra de progresso de leitura ---------- */
  gsap.to('#progress-bar', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      start: 0,
      end: 'max',
      scrub: 0.3,
    },
  });

  /* ---------- Estado do header ao rolar ---------- */
  const header = document.getElementById('header');
  if (header) {
    ScrollTrigger.create({
      start: 24,
      end: 'max',
      onToggle: (self) => header.classList.toggle('is-scrolled', self.isActive),
    });
  }

  if (reducedMotion) return;

  /* ---------- Revelação individual [data-reveal] ---------- */
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    const dir = el.dataset.reveal || 'up';
    const from = {
      up: { y: 48 },
      down: { y: -48 },
      left: { x: -56 },
      right: { x: 56 },
      scale: { scale: 0.9 },
    }[dir] || { y: 48 };

    gsap.from(el, {
      ...from,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 86%',
        once: true,
      },
    });
  });

  /* ---------- Revelação em cascata [data-stagger] ---------- */
  gsap.utils.toArray('[data-stagger]').forEach((group) => {
    const items = group.querySelectorAll('[data-stagger-item]');
    if (!items.length) return;

    gsap.from(items, {
      y: 56,
      opacity: 0,
      duration: 0.85,
      ease: 'power3.out',
      stagger: 0.14,
      scrollTrigger: {
        trigger: group,
        start: 'top 84%',
        once: true,
      },
    });
  });

  /* ---------- Parallax suave do conteúdo do hero ---------- */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    gsap.to(heroContent, {
      y: -70,
      opacity: 0.25,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  /* ---------- Refresh após carregamento de imagens ---------- */
  if (document.readyState === 'complete') {
    ScrollTrigger.refresh();
  } else {
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }
}
