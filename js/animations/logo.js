/* ==========================================================================
   Logo & Preloader — Anime.js
   Animação de entrada do traço (stroke-dashoffset) + preenchimento suave.
   ========================================================================== */

import anime from 'animejs';

export function initLogoAnimation() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const ring = preloader.querySelector('.ring');
  const ringInner = preloader.querySelector('.ring--inner');
  const logoImg = preloader.querySelector('.preloader-logo img');
  const barFill = preloader.querySelector('.preloader-bar-fill');
  const name = preloader.querySelector('.preloader-name');

  const ringLen = ring ? ring.getTotalLength() : 0;
  const ringInnerLen = ringInner ? ringInner.getTotalLength() : 0;

  // Estado inicial
  if (ring) {
    ring.style.strokeDasharray = ringLen;
    ring.style.strokeDashoffset = ringLen;
  }
  if (ringInner) {
    ringInner.style.strokeDasharray = ringInnerLen;
    ringInner.style.strokeDashoffset = ringInnerLen;
  }
  if (logoImg) {
    logoImg.style.opacity = 0;
    logoImg.style.transform = 'scale(0.86)';
  }

  const tl = anime.timeline({
    easing: 'easeInOutQuad',
    complete: () => {
      preloader.classList.add('is-done');
      document.body.classList.add('is-loaded');
    },
  });

  // 1) Traço do anel externo (stroke-dashoffset)
  if (ring) {
    tl.add({
      targets: ring,
      strokeDashoffset: [ringLen, 0],
      duration: 900,
      easing: 'easeInOutCubic',
    });
  }

  // 2) Traço do anel interno
  if (ringInner) {
    tl.add(
      {
        targets: ringInner,
        strokeDashoffset: [ringInnerLen, 0],
        duration: 700,
        easing: 'easeInOutCubic',
      },
      '-=550'
    );
  }

  // 3) Preenchimento suave do logo (escala + opacidade)
  if (logoImg) {
    tl.add(
      {
        targets: logoImg,
        opacity: [0, 1],
        scale: [0.86, 1],
        duration: 650,
        easing: 'easeOutBack',
      },
      '-=450'
    );
  }

  // 4) Barra de progresso
  if (barFill) {
    tl.add(
      {
        targets: barFill,
        scaleX: [0, 1],
        duration: 800,
        easing: 'easeInOutQuad',
      },
      '-=500'
    );
  }

  // 5) Nome da instituição
  if (name) {
    tl.add(
      {
        targets: name,
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 500,
        easing: 'easeOutCubic',
      },
      '-=350'
    );
  }

  // 6) Saída do preloader
  tl.add({
    targets: preloader,
    opacity: [1, 0],
    duration: 550,
    easing: 'easeInOutQuad',
    delay: 250,
  });

  // 7) Entrada do logo no header
  const headerLogo = document.querySelector('.brand-logo img');
  if (headerLogo) {
    headerLogo.style.opacity = 0;
    headerLogo.style.transform = 'translateY(-8px)';
    tl.add(
      {
        targets: headerLogo,
        opacity: [0, 1],
        translateY: [-8, 0],
        duration: 600,
        easing: 'easeOutCubic',
      },
      '-=250'
    );
  }

  return tl;
}
