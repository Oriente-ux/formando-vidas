/* ==========================================================================
   Centro Educacional Formando Vidas — App (orquestrador ES6+)
   ========================================================================== */

// Núcleo local (sem CDN) — carregado estaticamente: as seções essenciais
// funcionam mesmo se qualquer biblioteca externa falhar.
import { renderUnidades, initVisitaModal } from './components/unidades.js';
import { renderContato } from './components/contato.js';
import { renderGaleria } from './components/galeria.js';
import { renderProposta } from './components/proposta.js';
import { renderMural } from './components/mural.js';
import { renderMatriculas } from './components/matriculas.js';
import { refreshIcons } from './utils/icons.js';

/* ---------- Navegação mobile ---------- */
function initMobileNav() {
  const burger = document.getElementById('nav-burger');
  const mobileNav = document.getElementById('mobile-nav');
  const closeBtn = document.getElementById('mobile-nav-close');
  if (!burger || !mobileNav) return;

  const open = () => {
    mobileNav.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };
  const close = () => {
    mobileNav.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) close();
  });
}

/* ---------- Preloader ---------- */
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  if (!preloader.classList.contains('is-done')) {
    preloader.classList.add('is-done');
    document.body.classList.add('is-loaded');
  }
}

function preloaderSafety() {
  // Se algo falhar (ex.: CDN), garante que o site nunca fique bloqueado
  setTimeout(hidePreloader, 4500);
}

/* ---------- Módulos opcionais (CDN) ----------
   Carregados dinamicamente: cada falha é isolada e nunca derruba o app.
   O preloader é liberado pela animação do logo ou pelo fallback de segurança. */
async function loadEnhancements() {
  const jobs = [
    import('./animations/scroll.js').then((m) => m.initScrollAnimations()),
    import('./animations/micro.js').then((m) => m.initMicroInteractions()),
    import('./three/hero3D.js').then((m) =>
      m.initHero3D(document.getElementById('hero-canvas'))
    ),
    import('./animations/logo.js').then((m) => m.initLogoAnimation()),
  ];
  const results = await Promise.allSettled(jobs);
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`[app] Falha ao iniciar módulo opcional #${i}:`, r.reason);
    }
  });
}

/* ---------- Boot ---------- */
function boot() {
  try {
    renderUnidades();
    renderContato();
    renderGaleria();
    renderProposta();
    renderMural();
    renderMatriculas();
    refreshIcons(); // ícones estáticos do HTML (nav, eyebrows, footer)
  } catch (err) {
    console.error('[app] Falha ao renderizar componentes:', err);
  }

  try {
    initVisitaModal();
  } catch (err) {
    console.error('[app] Falha ao iniciar modal:', err);
  }

  try {
    initMobileNav();
  } catch (err) {
    console.error('[app] Falha ao iniciar navegação:', err);
  }

  loadEnhancements().catch((err) => {
    console.error('[app] Falha ao carregar módulos opcionais:', err);
  });

  preloaderSafety();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
