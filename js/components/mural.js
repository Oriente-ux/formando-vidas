/* ==========================================================================
   Mural — bento grid dinâmico da página inicial
   Notícias em destaque, avisos rápidos, calendário do mês, card promocional
   do Instagram e fotos.

   Avisos e eventos podem vir do Notion (via /api/notion). Se a API não
   estiver configurada ou falhar, o mural usa os dados estáticos de
   schoolData.js — o site nunca fica sem conteúdo.
   ========================================================================== */

import { MURAL } from '../data/schoolData.js';
import { refreshIcons } from '../utils/icons.js';

const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const NOTION_CACHE_KEY = 'mural-notion-v1';
const NOTION_CACHE_TTL = 10 * 60 * 1000; // 10 minutos

/* Escapa HTML para textos vindos do Notion */
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function calendarHTML(calendario, eventos) {
  const { ano, mes } = calendario;
  const first = new Date(ano, mes, 1);
  const startDay = first.getDay(); // 0 = domingo
  const total = new Date(ano, mes + 1, 0).getDate();

  // Só eventos do mês exibido (eventos de outros meses são ignorados)
  const mapa = eventos
    .filter((e) => {
      const [y, m] = String(e.data || '').split('-').map(Number);
      return y === ano && m === mes + 1;
    })
    .reduce((acc, e) => {
      acc[e.dia] = e.titulo;
      return acc;
    }, {});

  const hoje = new Date();
  let cells = '';
  for (let i = 0; i < startDay; i += 1) {
    cells += '<span class="mural-cal-cell is-empty"></span>';
  }
  for (let d = 1; d <= total; d += 1) {
    const ev = mapa[d];
    const isToday =
      hoje.getFullYear() === ano && hoje.getMonth() === mes && hoje.getDate() === d;
    cells += `<span class="mural-cal-cell${ev ? ' has-event' : ''}${isToday ? ' is-today' : ''}"${ev ? ` title="${esc(ev)}"` : ''}>${d}${ev ? '<i></i>' : ''}</span>`;
  }

  return {
    head: `
      <strong>${esc(calendario.rotulo)}</strong>
      <span class="mural-cal-dias">${DIAS_SEMANA.map((d) => `<span>${d}</span>`).join('')}</span>
    `,
    grid: cells,
  };
}

function avisosHTML(avisos) {
  return avisos
    .map(
      (a) => `
        <li><i data-lucide="${esc(a.icone || 'bell')}"></i><span>${esc(a.texto)}</span></li>
      `
    )
    .join('');
}

export function renderMural() {
  const grid = document.getElementById('mural-grid');
  if (!grid) return;

  const [destaque, ...outras] = MURAL.noticias;
  const cal = calendarHTML(MURAL.calendario, MURAL.eventos);

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
        ${avisosHTML(MURAL.avisos)}
      </ul>
    </article>

    <article class="mural-card mural-calendario" data-motion="card">
      <h3 class="mural-card-title"><i data-lucide="calendar-days"></i> Calendário</h3>
      <div class="mural-cal-head">${cal.head}</div>
      <div class="mural-cal-grid">${cal.grid}</div>
    </article>

    <article class="mural-card mural-instagram" data-motion="card">
      <div class="mural-instagram-icon"><i data-lucide="instagram"></i></div>
      <h3 class="mural-instagram-title">${MURAL.instagram.titulo}</h3>
      <p>${MURAL.instagram.descricao}</p>
      <a
        class="btn btn--instagram"
        href="${MURAL.instagram.link}"
        target="_blank"
        rel="noopener"
        data-motion="cta"
      >
        <i data-lucide="instagram"></i>
        ${MURAL.instagram.cta}
      </a>
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
  hydrateMuralFromNotion();
}

/* ---------- Notion (CMS) ---------- */

async function fetchNotion() {
  try {
    const cached = JSON.parse(localStorage.getItem(NOTION_CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.t < NOTION_CACHE_TTL) return cached.data;

    const res = await fetch('/api/notion', { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.ok && data.configured) {
      localStorage.setItem(NOTION_CACHE_KEY, JSON.stringify({ t: Date.now(), data }));
    }
    return data;
  } catch (err) {
    console.warn('[mural] Notion indisponível — usando dados estáticos:', err);
    return null;
  }
}

/* Substitui apenas avisos e calendário quando o Notion responde */
async function hydrateMuralFromNotion() {
  const dados = await fetchNotion();
  if (!dados || !dados.ok || !dados.configured) return;
  if (!dados.avisos.length && !dados.eventos.length) return;

  const avisosList = document.querySelector('.mural-avisos-list');
  if (avisosList && dados.avisos.length) {
    avisosList.innerHTML = avisosHTML(dados.avisos);
  }

  const calHead = document.querySelector('.mural-cal-head');
  const calGrid = document.querySelector('.mural-cal-grid');
  if (calHead && calGrid && dados.eventos.length) {
    const cal = calendarHTML(MURAL.calendario, dados.eventos);
    calHead.innerHTML = cal.head;
    calGrid.innerHTML = cal.grid;
  }

  refreshIcons();
}