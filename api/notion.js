/* ==========================================================================
   Centro Educacional Formando Vidas — Proxy do Notion (Vercel Serverless)
   Consulta a base "Mural" e devolve avisos + eventos normalizados.

   Variáveis de ambiente (definir com: vercel env add):
     NOTION_TOKEN — token da integração interna (ntn_...)
     NOTION_DB_ID — ID do banco "Mural" (32 caracteres hex)

   Modo degradado: sem as env vars, responde { ok:false, configured:false }
   e o site continua usando os dados estáticos de schoolData.js.
   ========================================================================== */

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

/* Normaliza nomes de propriedades (ignora acentos e maiúsculas) */
function norm(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function findProp(page, names) {
  const wanted = names.map(norm);
  for (const key of Object.keys(page.properties || {})) {
    if (wanted.includes(norm(key))) return page.properties[key];
  }
  return null;
}

function propText(page, names) {
  const p = findProp(page, names);
  if (!p) return '';
  if (p.type === 'title' && Array.isArray(p.title)) {
    return p.title.map((t) => t.plain_text).join('');
  }
  if (p.type === 'rich_text' && Array.isArray(p.rich_text)) {
    return p.rich_text.map((t) => t.plain_text).join('');
  }
  return '';
}

function propSelect(page, names) {
  const p = findProp(page, names);
  return p && p.type === 'select' && p.select ? p.select.name : '';
}

function propDate(page, names) {
  const p = findProp(page, names);
  return p && p.type === 'date' && p.date && p.date.start ? p.date.start : '';
}

function propCheckbox(page, names) {
  const p = findProp(page, names);
  return !!(p && p.type === 'checkbox' && p.checkbox);
}

/* Hoje em America/Manaus no formato YYYY-MM-DD (comparável com datas do Notion) */
function todayManaus() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Manaus' });
}

async function queryNotion(token, dbId) {
  const res = await fetch(`${NOTION_API}/databases/${dbId}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
      page_size: 100,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Notion ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

function normalize(results, today) {
  const avisos = [];
  const eventos = [];

  for (const page of results || []) {
    // Sem coluna "ativo", considera ativo
    const ativo = findProp(page, ['ativo']) ? propCheckbox(page, ['ativo']) : true;
    if (!ativo) continue;

    const validade = propDate(page, ['validade']);
    if (validade && validade < today) continue;

    const categoria = norm(propSelect(page, ['categoria']));
    const titulo = propText(page, ['titulo', 'título', 'name', 'nome']);
    const texto = propText(page, ['texto']);
    const dataEvento = propDate(page, ['data_evento', 'data do evento']);

    if (categoria === 'evento') {
      // Evento sem data é ignorado (não vira aviso)
      if (!dataEvento) continue;
      const dia = Number(dataEvento.slice(8, 10));
      if (dia >= 1 && dia <= 31) {
        eventos.push({ dia, titulo: titulo || texto || 'Evento', data: dataEvento });
      }
    } else {
      avisos.push({ texto: texto || titulo, icone: 'bell' });
    }
  }

  eventos.sort((a, b) => (a.data < b.data ? -1 : 1));
  return { avisos, eventos };
}

module.exports = async function handler(req, res) {
  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_DB_ID;

  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (!token || !dbId) {
    // Sem configuração: não cacheia para o site "acordar" assim que as env vars existirem
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok: false, configured: false, avisos: [], eventos: [] });
  }

  try {
    const today = todayManaus();
    const data = await queryNotion(token, dbId);
    const { avisos, eventos } = normalize(data.results, today);
    res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600');
    return res.status(200).json({ ok: true, configured: true, avisos, eventos });
  } catch (err) {
    console.error('[notion]', err.message);
    res.setHeader('Cache-Control', 'no-store');
    return res
      .status(502)
      .json({ ok: false, configured: true, avisos: [], eventos: [], erro: err.message });
  }
};