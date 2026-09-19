/* ==========================================================================
   Mural — bento grid dinâmico da página inicial
   Notícias em destaque, avisos rápidos, calendário do mês, serviços
   (Biblioteca, Calendário, Portal do Aluno, Secretaria, Refeitório) e fotos.
   ========================================================================== */

import { MURAL } from '../data/schoolData.js';
import { refreshIcons } from '../utils/icons.js';

const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function buildCalendar() {
  const { ano, mes } = MURAL.calendario;
  const first = new Date(ano, mes, 1);
  const startDay = first.getDay(); // 0 = domingo
  const total = new Date(ano, mes + 1, 0).getDate();
  const eventos = MURAL.eventos.reduce((acc, e) => {
    acc[e.dia] = e.titulo;
    return acc;
  }, {});

  const hoje = new Date();
  let cells = '';
  for (let i = 0; i < startDay; i += 1) {
    cells += '<span class="mural-cal-cell is-empty"></span>';
  }
  for (let d = 1; d <= total; d += 1) {
    const ev = eventos[d];
    const isToday =
      hoje.getFullYear() === ano && hoje.getMonth() === mes && hoje.getDate() === d;
    cells += `<span class="mural-cal-cell${ev ? ' has-event' : ''}${isToday ? ' is-today' : ''}"${ev ? ` title="${ev}"` : ''}>${d}${ev ? '<i></i>' : ''}</span>`;
  }

  return `
    <div class="mural-cal-head">
      <strong>${MURAL.calendario.rotulo}</strong>
      <span class="mural-cal-dias">${DIAS_SEMANA.map((d) => `<span>${d}</span>`).join('')}</span>
    </div>
    <div class="mural-cal-grid">${cells}</div>
  `;
}

export function renderMural() {
  const grid = document.getElementById('mural-grid');
  if (!grid) return;

  const [destaque, ...outras] = MURAL.noticias;

  grid.innerHTML = `
    <article class="mural-card mural-destaque" data-motion="card">
      <img src="${destaque.img}" alt="${destaque.titulo}" loading="lazy" decoding="async" />
      <div class="mural-destaque-body">
        <span class="mural-tag">${destaque.tag}</span>
        <h3>${destaque.titulo}</h3>
        <p>${destaque.resumo}</p>
        <span class="mural-data">${destaque.data}</span>
      </div>
    </article>

    <article class="mural-card mural-avisos" data-motion="card">
      <h3 class="mural-card-title"><i data-lucide="bell"></i> Avisos rápidos</h3>
      <ul class="mural-avisos-list">
        ${MURAL.avisos
          .map(
            (a) => `
          <li><i data-lucide="${a.icone}"></i><span>${a.texto}</span></li>
        `
          )
          .join('')}
      </ul>
    </article>

    <article class="mural-card mural-calendario" data-motion="card">
      <h3 class="mural-card-title"><i data-lucide="calendar-days"></i> Calendário</h3>
      ${buildCalendar()}
    </article>

    <article class="mural-card mural-servicos" data-motion="card">
      <h3 class="mural-card-title"><i data-lucide="layout-grid"></i> Serviços</h3>
      <ul class="mural-servicos-list">
        ${MURAL.servicos
          .map(
            (s) => `
          <li><i data-lucide="${s.icone}"></i><span>${s.nome}</span></li>
        `
          )
          .join('')}
      </ul>
    </article>

    <article class="mural-card mural-noticias" data-motion="card">
      <h3 class="mural-card-title"><i data-lucide="newspaper"></i> Notícias</h3>
      <ul class="mural-noticias-list">
        ${outras
          .map(
            (n) => `
          <li>
            <span class="mural-tag">${n.tag}</span>
            <strong>${n.titulo}</strong>
            <span class="mural-data">${n.data}</span>
          </li>
        `
          )
          .join('')}
      </ul>
    </article>

    <div class="mural-card mural-fotos" data-motion="card">
      <h3 class="mural-card-title"><i data-lucide="camera"></i> Fotos recentes</h3>
      <div class="mural-fotos-strip">
        ${MURAL.fotos
          .map(
            (f) => `
          <a href="#galeria" aria-label="Ver na galeria: ${f.alt}">
            <img src="${f.src}" alt="${f.alt}" loading="lazy" decoding="async" />
          </a>
        `
          )
          .join('')}
      </div>
    </div>
  `;

  refreshIcons();
}
