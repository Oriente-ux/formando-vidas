/* ==========================================================================
   Matrículas — documentos necessários (checkmarks) e etapas do processo
   ========================================================================== */

import { MATRICULAS, MENSAGENS, waLink } from '../data/schoolData.js';
import { refreshIcons } from '../utils/icons.js';

const WA_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.57-.35ZM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 9.88 9.9c0 5.44-4.44 9.87-9.89 9.87Zm8.42-18.3A11.8 11.8 0 0 0 12.04 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.94L.06 24l6.33-1.66a11.9 11.9 0 0 0 5.66 1.44h.01c6.54 0 11.88-5.33 11.88-11.89 0-3.18-1.24-6.16-3.47-8.4Z"/></svg>`;

export function renderMatriculas() {
  const grid = document.getElementById('matriculas-grid');
  if (!grid) return;

  grid.innerHTML = `
    <article class="matricula-card" data-motion="card">
      <h3 class="matricula-card-title"><i data-lucide="file-check"></i> Documentos necessários</h3>
      <ul class="check-list">
        ${MATRICULAS.documentos
          .map(
            (d) => `
          <li><i data-lucide="circle-check"></i><span>${d}</span></li>
        `
          )
          .join('')}
      </ul>
    </article>

    <article class="matricula-card matricula-card--etapas" data-motion="card">
      <h3 class="matricula-card-title"><i data-lucide="list-ordered"></i> Como matricular</h3>
      <ol class="etapas-list">
        ${MATRICULAS.etapas
          .map(
            (e, i) => `
          <li>
            <span class="etapa-num">${i + 1}</span>
            <span>${e}</span>
          </li>
        `
          )
          .join('')}
      </ol>
      <a
        class="btn btn--wa"
        href="${waLink(MENSAGENS.matricula)}"
        target="_blank"
        rel="noopener"
        data-motion="cta"
      >
        ${WA_SVG}
        Iniciar matrícula
      </a>
    </article>
  `;

  refreshIcons();
}
