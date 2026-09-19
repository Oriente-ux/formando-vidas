/* ==========================================================================
   Contato — render dos endereços das 3 unidades (seção + rodapé)
   Ícones via Lucide (data-lucide) + refreshIcons após o render.
   ========================================================================== */

import { UNIDADES, SCHOOL, waLink, MENSAGENS } from '../data/schoolData.js';
import { refreshIcons } from '../utils/icons.js';

export function renderContato() {
  // Seção de contato — lista das 3 unidades
  const contatoList = document.getElementById('contato-unidades');
  if (contatoList) {
    contatoList.innerHTML = UNIDADES.map(
      (u) => `
      <li class="contato-item" data-stagger-item>
        <strong>${u.nome}</strong>
        <address>${u.endereco}</address>
        <a href="${u.mapsLink}" target="_blank" rel="noopener">
          <i data-lucide="map-pin"></i>
          Abrir no Google Maps
          <i data-lucide="arrow-right"></i>
        </a>
      </li>
    `
    ).join('');
  }

  // Rodapé — coluna de unidades
  const footerList = document.getElementById('footer-unidades');
  if (footerList) {
    footerList.innerHTML = UNIDADES.map(
      (u) => `
      <li>
        <strong style="color:#fff;font-weight:600;">${u.nome}</strong>
        <address>${u.endereco}</address>
        <a href="${u.mapsLink}" target="_blank" rel="noopener" style="font-size:0.85rem;">
          Ver no Google Maps →
        </a>
      </li>
    `
    ).join('');
  }

  // Número de destaque na seção de contato
  // Atualiza apenas o nó de texto — preserva o ícone SVG dentro do link
  const waNumber = document.getElementById('contato-wa-number');
  if (waNumber) {
    let textNode = null;
    waNumber.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) textNode = node;
    });
    if (textNode) {
      textNode.nodeValue = SCHOOL.whatsapp.display;
    } else {
      waNumber.appendChild(document.createTextNode(SCHOOL.whatsapp.display));
    }
    waNumber.href = waLink(MENSAGENS.geral);
  }

  // Botão flutuante
  const waFloat = document.getElementById('wa-float');
  if (waFloat) {
    waFloat.href = waLink(MENSAGENS.geral);
    waFloat.setAttribute('aria-label', `Falar com ${SCHOOL.name} pelo WhatsApp ${SCHOOL.whatsapp.display}`);
  }

  refreshIcons();
}
