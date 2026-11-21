// DoramasJing — doramas en español (latino y subtitulado) para Kino:
// catálogo multi-fuente con búsqueda, fichas, episodios y filtros de idioma.
// Repositorio: https://github.com/Susejing/DoramasJing
//
// Copyright (C) 2026 Susejing
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
//
// DoramasJing v0.1.0 «LA LUPA DEL PRIMER DÍA» — el hermano doramero de
// la familia (AniJing 0.6.95 es su padrino de maquinaria). Tres fuentes
// directas sondeadas desde el escritorio el 21 nov 2026:
//   * kdramas.lat        — catálogo server-rendered en /series con
//                          etiquetas «ESPAÑOL LATINO / SUB ESPAÑOL».
//   * yandispoiler.net   — URLs perfectas: /series/slug/, /temporadas/
//                          slug-temporada-N/, /episodios/slug-NxM/.
//   * doramaslatinox.com — catálogo accesible, regionalidad clara
//                          (China/Corea/Japón, audio latino y sub).
// VERDAD IMPORTANTE: las aduanas del reproductor de yandispoiler (el
// juego de «encuentra las flores», el temporizador, los enlaces
// protegidos) NO se adivinan desde acá. Por eso esta versión es LA LUPA
// (la escuela que curó a MangaTrack 0.4.76→0.4.77 en una sola ronda):
// catálogo, fichas, episodios y búsqueda funcionando con parsers
// generosos, Y los settings «Sondear …» que escriben en el Registro del
// teléfono las HUELLAS del HTML crudo (estados, letras, inventario de
// anclas y vocabulario de imágenes). Con esas huellas, la 0.2 trae
// reproductores con datos y no con adivinanzas. resolver() aún no
// promete nada: falla con mensaje honesto. Nada de mentiras en pantalla.

const VERSION = '0.1.0';

const BASE_KDLA = 'https://kdramas.lat';
const BASE_YANDI = 'https://yandispoiler.net';
const BASE_DLAT = 'https://doramaslatinox.com';

const PATRON_KDLA = '(?:https?:\\/\\/[a-z0-9.-]+\\/?)?(?:\\/)?(?:serie|series|drama|title)s?\\/[a-z0-9-]+\\/?';
const PATRON_YANDI = '(?:https?:\\/\\/[a-z0-9.-]+\\/?)?(?:\\/)?series\\/[a-z0-9-]+\\/?';
const PATRON_DLAT = '(?:https?:\\/\\/[a-z0-9.-]+\\/?)?(?:\\/)?(?:drama|serie|ver|title)s?\\/[a-z0-9-]+\\/?';

const FUENTES = {};
function registrarFuente(f) { FUENTES[f.id] = f; }

// ---------- utilería común (escuela AniJing) ----------

function log(m, extra) {
  try { kino.log('[DoramasJing] ' + m, extra); } catch (e) { /* el Registro nunca rompe */ }
}

function errorDe(code, msg, userMessage) {
  return kino.error(code, msg, { userMessage: userMessage || msg });
}

/* El puente del traductor (escuela MangaTrack v0.4.73): si Kino niega el
 * directo, el mismo camino viaja por *.translate.goog con guiones. */
function puenteDe(url) {
  const m = /^https?:\/\/([^/]+)(\/.*)?$/i.exec(String(url || ''));
  if (!m) return null;
  return 'https://' + m[1].replace(/\./g, '-') + '.translate.goog' + (m[2] || '/') + '?_x_tr_sl=auto&_x_tr_tl=es&_x_tr_hl=es';
}

async function traerEnCrudo(url, opts) {
  const o = opts || {};
  let r = null;
  try {
    r = await kino.fetch(url, {
      headers: Object.assign({
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }, o.headers || {}),
      timeoutMs: o.timeoutMs || 12000
    });
  } catch (eDirecto) {
    const code = (eDirecto && eDirecto.code) || '';
    if (code !== 'permission_denied' && code !== 'tool_denied' && code !== 'policy_rejected') throw eDirecto;
    /* Kino negó el directo: la escuela MangaTrack — el puente del traductor. */
    const pv = puenteDe(url);
    if (!pv) throw eDirecto;
    log('Kino negó el directo (' + String(url).split('/')[2] + '): probando el puente del traductor');
    r = await kino.fetch(pv, { headers: o.headers || {}, timeoutMs: o.timeoutMs || 16000 });
  }
  return r;
}

function motivoDeR(r) {
  if (!r) return 'sin respuesta';
  const st = r.status != null ? 'status ' + r.status : '';
  return st + ' (' + (r.ok ? 'ok' : 'no-ok') + ')';
}

function motivos(r) { return motivoDeR(r); }

async function traerPagina(url, opts) {
  const o = opts || {};
  try {
    const r = await traerEnCrudo(url, o);
    let text = '';
    try { text = String((r && r.text) ? await r.text() : ''); }
    catch (eT) {
      try { text = String(JSON.stringify(await r.json())); } catch (eJ) { text = ''; }
    }
    return { ok: !!(r && r.ok), status: r && r.status, text: text };
  } catch (e) {
    log('traerPagina ' + url + ' falló: ' + ((e && e.message) || e));
    return null;
  }
}

// ---------- la lupa: huellas del HTML crudo (escuela MangaTrack 0.4.76) ----------

function conteosDe(html) {
  const t = String(html || '');
  return {
    letras: t.length,
    anclas: (t.match(/<a\s/gi) || []).length,
    imgs: (t.match(/<img\b/gi) || []).length,
    dsrc: (t.match(/\bdata-src\s*=/gi) || []).length,
    lazys: (t.match(/\b(?:data-lazy(?:-src)?|data-original)\s*=/gi) || []).length,
    homecover: (t.match(/\bdata-home-cover-src\s*=/gi) || []).length,
    webp: (t.match(/\.webp\b/gi) || []).length,
    avif: (t.match(/\.avif\b/gi) || []).length,
    jpg: (t.match(/\.(?:jpe?g|png)\b/gi) || []).length
  };
}

function vocabularioDe(html) {
  const c = conteosDe(html);
  return 'img=' + c.imgs + ' dsrc=' + c.dsrc + ' lazys=' + c.lazys +
    ' homecover=' + c.homecover + ' avif=' + c.avif + ' webp=' + c.webp + ' jpg=' + c.jpg;
}

/* Los primeros N anclas distintas que matcheen el patrón, VERBATIM. */
function inventarioDe(html, patron, tope) {
  const t = String(html || '');
  const re = new RegExp('href\\s*=\\s*["\'](' + patron + ')["\']', 'gi');
  const vistos = {};
  const out = [];
  let m;
  while ((m = re.exec(t)) !== null && out.length < (tope || 14)) {
    const u = m[1];
    if (vistos[u]) continue;
    vistos[u] = 1;
    out.push(u);
  }
  return out;
}

/* La huérfana: ~800 letras crudas alrededor de la primera ancla del
 * patrón — la materia prima exacta para escribir los parsers de la 0.2. */
function huespedDe(html, patron) {
  const t = String(html || '');
  const re = new RegExp('href\\s*=\\s*["\'](' + patron + ')["\']', 'gi');
  const m = re.exec(t);
  if (!m) return '(el patrón no apareció: ' + patron + ')';
  return t.slice(Math.max(0, m.index - 80), m.index + 800).replace(/\s+/g, ' ');
}

async function sondeaFuente(nombre, base, destinos, patron) {
  const partes = [];
  await Promise.all(destinos.map(async (d) => {
    const url = base + d;
    try {
      const r = await traerEnCrudo(url, {});
      const t = r && r.text ? await r.text() : '';
      const v = vocabularioDe(t);
      const inv = inventarioDe(t, patron);
      let huella = huespedDe(t, patron);
      if (huella.length > 900) huella = huella.slice(0, 900);
      log('sonda ' + nombre + d + ': ' + motivoDeR(r) + ', ' + t.length + ' letras, ' + v + ', anclas-serie: ' + (inv.length ? inv.join(' | ').slice(0, 500) : 'NINGUNA'));
      if (inv.length) log('sonda ' + nombre + ' huérfana ' + d + ': ' + huella);
      partes.push(d + ' ' + t.length + 'l/' + inv.length);
    } catch (e) {
      log('sonda ' + nombre + d + ' FALLO: ' + ((e && e.message) || String(e)));
      partes.push(d + ' FALLO');
    }
  }));
  return 'Sondeo ' + nombre + ': ' + partes.join(' · ') + '. Mándame el Registro (Ajustes ▸ Registro de DoramasJing) y afino los parsers con datos reales.';
}

// ---------- parsers generosos (v0.1: mejor esfuerzo documentado) ----------

function limpio(s) {
  return String(s || '').replace(/<[^>]*>/g, ' ').replace(/&[a-zA-Z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

function absoluta(u, origen) {
  const t = String(u || '').trim();
  if (!t || t.charAt(0) === '#') return '';
  if (/^https?:\/\//i.test(t)) return t;
  if (/^\/\//.test(t)) return 'https:' + t;
  if (/^data:/i.test(t)) return '';
  return (origen || '') + t;
}

/* La cara de un bloque, con el vocabulario del 21 nov (MangaTrack 0.4.77
 * incluido: data-home-cover-src antes que src, y el guardia anti data:). */
function caraDe(bloque, origen) {
  const t = String(bloque || '');
  const intentos = [
    /\bdata-src\s*=\s*["']([^"']+)["']/i,
    /\bdata-lazy-src\s*=\s*["']([^"']+)["']/i,
    /\b(?:data-lazy|data-original)\s*=\s*["']([^"']+)["']/i,
    /\bdata-home-cover-src\s*=\s*["']([^"']+)["']/i,
    /\b(?:data-srcset|srcset)\s*=\s*["']([^"'\s,]+)[^"']*["']/i,
    /\bsrc\s*=\s*["']([^"']+)["']/i
  ];
  for (let i = 0; i < intentos.length; i++) {
    const m = intentos[i].exec(t);
    const u = m ? absoluta(m[1], origen) : '';
    if (u && u.indexOf('data:') !== 0) return u;
  }
  const bg = /background(?:-image)?\s*:\s*url\((['"]?)([^'")]+)/i.exec(t);
  return bg ? absoluta(bg[2], origen) : '';
}

function slugATitulo(slug) {
  return String(slug || '').replace(/[-_]+/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }).trim();
}

/* Prefijos de camino que el patrón puede arrastrar: se quitan para que
 * el slug sea LIMPIO y cada fuente reconstruya su ficha a SU gusto. */
function valijaSlug(slug) {
  return String(slug || '')
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/^\//, '')
    .replace(/^(?:serie|series|drama|doramas|title|ver|temporadas?|episodios)\//i, '')
    .replace(/\/+$/, '');
}

function prefijoNombre(p) {
  return p === 'kdla' ? 'Kdramas.lat' : p === 'yandi' ? 'Yandispoiler' : 'DoramasLatinoX';
}

/* La tarjeta genérica: anclas del patrón del sitio + cara atrás/adelante
 * (ventana de 1500 letras, escuela 0.6.2 de AniJing) + idioma por texto. */
function tarjetasDe(html, origen, patron, prefijo) {
  const t = String(html || '');
  const re = new RegExp('href\\s*=\\s*["\'](' + patron + ')["\']', 'gi');
  const marcas = [];
  let m;
  while ((m = re.exec(t)) !== null) marcas.push({ slug: valijaSlug(m[1]), at: m.index, fin: re.lastIndex });
  const out = [];
  const vistos = {};
  for (let i = 0; i < marcas.length && out.length < 30; i++) {
    const slug = marcas[i].slug;
    if (!slug || vistos[slug]) continue;
    vistos[slug] = 1;
    const desde = marcas[i].at;
    const hasta = i + 1 < marcas.length ? marcas[i + 1].at : Math.min(t.length, desde + 2500);
    const antes = t.slice(Math.max(marcas[i].fin, desde - 1500), desde);
    const trozo = t.slice(desde, hasta);
    const poster = caraDe(trozo, origen) || caraDe(antes, origen);
    const tituloM = /<h[1-6]\b[^>]*>([\s\S]{2,200}?)<\/h[1-6]>/i.exec(trozo) ||
      /(?:title|aria-label)\s*=\s*["']([^"']{2,200})["']/i.exec(trozo) ||
      /<strong\b[^>]*>([\s\S]{2,200}?)<\/strong>/i.exec(trozo);
    const titulo = (tituloM ? limpio(tituloM[2] || tituloM[1]) : '') || slugATitulo(slug);
    const zona = limpio(antes.slice(-200) + ' ' + trozo.slice(0, 400)).toLowerCase();
    const badges = [];
    if (/latino|doblado|\bdub\b/.test(zona)) badges.push('Latino');
    if (/sub\s*(?:espa|titul)|subtitulado|\bsub\b/.test(zona)) badges.push('Sub');
    if (!badges.length && /espa[ñn]ol/.test(zona)) badges.push('Español');
    const anhoM = /\b(19\d{2}|20\d{2})\b/.exec(trozo);
    const item = {
      id: prefijo + '-' + slug,
      ref: prefijo + ':' + slug,
      title: titulo.slice(0, 200),
      kind: 'series',
      badges: badges.concat([prefijoNombre(prefijo)]).slice(0, 2)
    };
    if (poster) item.poster = poster;
    if (anhoM) item.year = anhoM[1];
    out.push(item);
  }
  return out;
}

/* La ficha genérica (título, og:description, og:image, año). */
function infoDePaginaSerie(html, slug, nombre, origen) {
  const t = String(html || '');
  const hM = /<h1\b[^>]*>([\s\S]{2,200}?)<\/h1>/i.exec(t);
  const titulo = (hM ? limpio(hM[1]) : '') || slugATitulo(slug);
  const dM = /<meta\s+name=["']description["']\s+content=["']([^"']{20,600})["']/i.exec(t);
  const descM = dM || /(?:sinopsis|description|resumen)[^>]*>([\s\S]{40,600}?)</i.exec(t);
  const anhoM = /\b(?:19|20)\d{2}\b/.exec(t);
  const caraM = /<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i.exec(t);
  const info = {
    title: titulo,
    description: descM ? limpio(descM[1]).slice(0, 500) : '',
    year: anhoM ? anhoM[0] : null,
    badges: [nombre]
  };
  const poster = caraM ? absoluta(caraM[1], origen) : caraDe(primerBloqueConImagen(t), origen);
  if (poster) info.poster = poster;
  return info;
}

function primerBloqueConImagen(html) {
  const m = /<img\b[^>]*>/i.exec(String(html || ''));
  return m ? m[0] : '';
}

/* ---------- fuente: kdramas.lat ---------- */

registrarFuente({
  id: 'kdla',
  etiqueta: 'Kdramas.lat',

  async buscar(q) {
    const t = String(q || '').trim();
    if (!t) return [];
    /* La puerta de búsqueda propia aún no confesada: la lupa prueba la
     * convención /buscar?q= y respalda con una pasada al catálogo /series
     * filtrando por título. Ambos caminos quedan en el Registro. */
    const rta1 = await traerPagina(BASE_KDLA + '/buscar?q=' + encodeURIComponent(t), { timeoutMs: 10000 });
    let items = rta1 && rta1.ok ? tarjetasDe(rta1.text, BASE_KDLA, PATRON_KDLA, 'kdla') : [];
    if (!items.length) {
      const rta2 = await traerPagina(BASE_KDLA + '/series', { timeoutMs: 12000 });
      const todos = rta2 && rta2.ok ? tarjetasDe(rta2.text, BASE_KDLA, PATRON_KDLA, 'kdla') : [];
      const nq = t.toLowerCase();
      items = todos.filter(function (x) { return (x.title || '').toLowerCase().indexOf(nq) >= 0; });
      if (!items.length) log('kdla buscar: /buscar y el filtro de /series no trajeron nada para «' + t + '» (¿búsqueda JS? el sondeo contará)');
    }
    return items.slice(0, 25);
  },

  async portada() {
    const tareas = [
      (async () => {
        const r = await traerPagina(BASE_KDLA + '/', 9000);
        const items = r && r.ok ? tarjetasDe(r.text, BASE_KDLA, PATRON_KDLA, 'kdla').slice(0, 20) : [];
        return items.length ? { id: 'kdla-inicio', title: 'Lo último · Kdramas.lat', ref: 'kdla-inicio', items: items } : null;
      })(),
      (async () => {
        const r = await traerPagina(BASE_KDLA + '/series', 12000);
        const items = r && r.ok ? tarjetasDe(r.text, BASE_KDLA, PATRON_KDLA, 'kdla').slice(0, 20) : [];
        return items.length ? { id: 'kdla-series', title: 'Catálogo · Kdramas.lat', ref: 'kdla-series', items: items } : null;
      })()
    ];
    const rtas = await Promise.all(tareas.map((x) => x.catch((e) => { log('kdla fila', (e && e.message) || e); return null; })));
    const filas = [];
    for (const f of rtas) if (f) filas.push(f);
    return filas;
  },

  async hoja(ref, cursor) {
    if (ref !== 'kdla-inicio' && ref !== 'kdla-series') return null;
    const camino = ref === 'kdla-series' ? '/series' : '/';
    const pag = parseInt(String(cursor || '1'), 10) || 1;
    if (pag > 1) return { items: [], next: null }; /* la lupa aún no sabe paginar este sitio */
    const r = await traerPagina(BASE_KDLA + camino, 12000);
    if (!r || !r.ok) throw errorDe('unavailable', 'kdramas.lat ' + motivos(r), 'Kdramas.lat no respondió. Revisa tu conexión o inténtalo en un rato.');
    const items = tarjetasDe(r.text, BASE_KDLA, PATRON_KDLA, 'kdla').slice(0, 60);
    if (!items.length) log('kdla hoja ' + camino + ': SIN tarjetas con el patrón actual — ' + vocabularioDe(r.text) + ' — inventario: ' + inventarioDe(r.text, PATRON_KDLA).join(' | ').slice(0, 500));
    return { items: items, next: null };
  },

  async detalle(slug) {
    const r = await traerPagina(BASE_KDLA + '/serie/' + slug, 12000);
    if (!r || !r.ok || !r.text) {
      const r2 = await traerPagina(BASE_KDLA + '/series/' + slug, 12000);
      if (!r2 || !r2.ok || !r2.text) return null;
      log('kdla detalle: la ficha vive en /series/' + slug + ' (no /serie/)');
      return infoDePaginaSerie(r2.text, slug, 'Kdramas.lat', BASE_KDLA);
    }
    return infoDePaginaSerie(r.text, slug, 'Kdramas.lat', BASE_KDLA);
  },

  async episodios() { return []; }, /* la lupa no inventa capítulos: el sondeo contará */

  async resolver() {
    throw errorDe('unavailable', 'resolver v0.1', 'La v0.1 es la lupa: el reproductor llega en la 0.2. Toca «Sondear Kdramas.lat» en Ajustes y mándame el Registro.');
  }
});

/* ---------- fuente: yandispoiler.net ---------- */

function episodiosYandi(html, slug) {
  const t = String(html || '');
  const re = new RegExp('href\\s*=\\s*["\'](?:https?:\\/\\/(?:www\\.)?yandispoiler\\.net)?\\/episodios\\/(' + slug + '-\\d+x\\d+)\\/?["\']', 'gi');
  const out = [];
  const vistos = {};
  let m;
  while ((m = re.exec(t)) !== null && out.length < 200) {
    const id = m[1];
    if (vistos[id]) continue;
    vistos[id] = 1;
    const nM = /(\d+)x(\d+)$/.exec(id);
    const num = nM ? parseInt(nM[2], 10) : out.length + 1;
    out.push({ id: 'yandi-' + id, num: num, title: 'Episodio ' + num, options: [] });
  }
  return out;
}

registrarFuente({
  id: 'yandi',
  etiqueta: 'Yandispoiler',

  async buscar(q) {
    const t = String(q || '').trim();
    if (!t) return [];
    const rta1 = await traerPagina(BASE_YANDI + '/?s=' + encodeURIComponent(t), { timeoutMs: 12000 });
    if (rta1 && rta1.ok) {
      const items = tarjetasDe(rta1.text, BASE_YANDI, PATRON_YANDI, 'yandi');
      if (items.length) return items.slice(0, 25);
    }
    /* Respaldo honesto: caminar /series/ y filtrar por título. */
    const rta2 = await traerPagina(BASE_YANDI + '/series/', { timeoutMs: 12000 });
    const todos = rta2 && rta2.ok ? tarjetasDe(rta2.text, BASE_YANDI, PATRON_YANDI, 'yandi') : [];
    const nq = t.toLowerCase();
    const filtrados = todos.filter(function (x) { return (x.title || '').toLowerCase().indexOf(nq) >= 0; });
    if (!filtrados.length) log('yandi buscar: /?s= y /series/ no trajeron nada para «' + t + '» (¿búsqueda JS? la sondea contará)');
    return filtrados.slice(0, 25);
  },

  async portada() {
    const tareas = [
      (async () => {
        const r = await traerPagina(BASE_YANDI + '/', 10000);
        const items = r && r.ok ? tarjetasDe(r.text, BASE_YANDI, PATRON_YANDI, 'yandi').slice(0, 20) : [];
        return items.length ? { id: 'yandi-inicio', title: 'Destacados · Yandispoiler', ref: 'yandi-inicio', items: items } : null;
      })(),
      (async () => {
        const r = await traerPagina(BASE_YANDI + '/series/', 12000);
        const items = r && r.ok ? tarjetasDe(r.text, BASE_YANDI, PATRON_YANDI, 'yandi').slice(0, 20) : [];
        return items.length ? { id: 'yandi-series', title: 'Series · Yandispoiler', ref: 'yandi-series', items: items } : null;
      })()
    ];
    const rtas = await Promise.all(tareas.map((x) => x.catch((e) => { log('yandi fila', (e && e.message) || e); return null; })));
    const filas = [];
    for (const f of rtas) if (f) filas.push(f);
    return filas;
  },

  async hoja(ref, cursor) {
    if (ref !== 'yandi-inicio' && ref !== 'yandi-series') return null;
    const pag = parseInt(String(cursor || '1'), 10) || 1;
    if (ref === 'yandi-series') {
      const camino = pag > 1 ? '/series/?page=' + pag : '/series/';
      const r = await traerPagina(BASE_YANDI + camino, 12000);
      if (!r || !r.ok) {
        if (pag > 1) return { items: [], next: null };
        throw errorDe('unavailable', 'yandispoiler ' + motivos(r), 'Yandispoiler no respondió. Revisa tu conexión o inténtalo en un rato.');
      }
      const items = tarjetasDe(r.text, BASE_YANDI, PATRON_YANDI, 'yandi').slice(0, 60);
      const next = items.length >= 40 ? String(pag + 1) : null;
      return { items: items, next: next };
    }
    if (pag > 1) return { items: [], next: null };
    const r = await traerPagina(BASE_YANDI + '/', 10000);
    if (!r || !r.ok) throw errorDe('unavailable', 'yandispoiler ' + motivos(r), 'Yandispoiler no respondió.');
    return { items: tarjetasDe(r.text, BASE_YANDI, PATRON_YANDI, 'yandi').slice(0, 60), next: null };
  },

  async detalle(slug) {
    const r = await traerPagina(BASE_YANDI + '/series/' + slug + '/', 12000);
    if (!r || !r.ok || !r.text) return null;
    return infoDePaginaSerie(r.text, slug, 'Yandispoiler', BASE_YANDI);
  },

  async episodios(slug) {
    /* La lista vive en la ficha y en /temporadas/: la 0.2 la leerá con
     * la huella del sondeo. v0.1: lo que la forma conocida de URL dé. */
    const r1 = await traerPagina(BASE_YANDI + '/series/' + slug + '/', 12000);
    let eps = r1 && r1.ok ? episodiosYandi(r1.text, slug) : [];
    if (!eps.length) {
      const r2 = await traerPagina(BASE_YANDI + '/temporadas/' + slug + '-temporada-1/', 12000);
      eps = r2 && r2.ok ? episodiosYandi(r2.text, slug) : [];
      if (eps.length) log('yandi episodios ' + slug + ': la lista vive en /temporadas/ (la ficha no la trae)');
    }
    if (!eps.length) log('yandi episodios ' + slug + ': SIN episodios con el patrón actual (¿viajan por JS? la sondea contará)');
    return eps;
  },

  async resolver() {
    throw errorDe('unavailable', 'resolver v0.1', 'La v0.1 es la lupa: el reproductor llega en la 0.2. Toca «Sondear Yandispoiler» en Ajustes y mándame el Registro.');
  }
});

/* ---------- fuente: doramaslatinox.com ---------- */

registrarFuente({
  id: 'dlat',
  etiqueta: 'DoramasLatinoX',

  async buscar(q) {
    const t = String(q || '').trim();
    if (!t) return [];
    const rta1 = await traerPagina(BASE_DLAT + '/?s=' + encodeURIComponent(t), { timeoutMs: 12000 });
    if (rta1 && rta1.ok) {
      const items = tarjetasDe(rta1.text, BASE_DLAT, PATRON_DLAT, 'dlat');
      if (items.length) return items.slice(0, 25);
    }
    log('dlat buscar: /?s= no trajo nada para «' + t + '» (¿búsqueda interna JS? la sondea contará)');
    return [];
  },

  async portada() {
    const r = await traerPagina(BASE_DLAT + '/', 12000);
    if (r && r.ok) {
      const items = tarjetasDe(r.text, BASE_DLAT, PATRON_DLAT, 'dlat').slice(0, 20);
      if (items.length) {
        return [{ id: 'dlat-inicio', title: 'Doramas · DoramasLatinoX', ref: 'dlat-inicio', items: items }];
      }
      log('dlat portada: SIN tarjetas con el patrón actual — ' + vocabularioDe(r.text));
      return [];
    }
    return [];
  },

  async hoja(ref, cursor) {
    if (ref !== 'dlat-inicio') return null;
    const pag = parseInt(String(cursor || '1'), 10) || 1;
    if (pag > 1) return { items: [], next: null };
    const r = await traerPagina(BASE_DLAT + '/', 12000);
    if (!r || !r.ok) throw errorDe('unavailable', 'doramaslatinox ' + motivos(r), 'DoramasLatinoX no respondió. Revisa tu conexión o inténtalo en un rato.');
    return { items: tarjetasDe(r.text, BASE_DLAT, PATRON_DLAT, 'dlat').slice(0, 60), next: null };
  },

  async detalle(slug) {
    const caminos = ['/drama/' + slug, '/serie/' + slug, '/doramas/' + slug];
    for (const c of caminos) {
      const r = await traerPagina(BASE_DLAT + c, 10000);
      if (r && r.ok && r.text) {
        log('dlat detalle: la ficha vive en ' + c);
        const info = infoDePaginaSerie(r.text, slug, 'DoramasLatinoX', BASE_DLAT);
        if (info) return info;
      }
    }
    return null;
  },

  async episodios() { return []; }, /* la lupa no inventa capítulos */

  async resolver() {
    throw errorDe('unavailable', 'resolver v0.1', 'La v0.1 es la lupa: el reproductor llega en la 0.2. Toca «Sondear DoramasLatinoX» en Ajustes y mándame el Registro.');
  }
});

// ---------- la casa (search/home/browse/details/episodes/resolve) ----------

function partirRef(ref) {
  const p = String(ref || '').split(':');
  if (p.length < 2 || !FUENTES[p[0]]) return null;
  return { fuente: p[0], partes: p.slice(1) };
}

const MAX_ITEMS = 240;

async function search(query) {
  const q = query && typeof query.q === 'string' ? query.q.trim() : '';
  if (!q && !(query && (query.originalTitle || (query.altTitles || []).length))) return [];
  const fuentes = Object.values(FUENTES);
  const respuestas = await Promise.all(fuentes.map(async (f) => {
    try {
      if (typeof f.buscar !== 'function') return { items: [], fallo: false };
      return { items: await f.buscar(q || (query && query.originalTitle), query), fallo: false };
    } catch (e) {
      log('buscar falló en ' + f.id, (e && e.message) || String(e));
      return { items: [], fallo: true, error: e };
    }
  }));
  const salida = [];
  const vistos = {};
  let fallos = 0;
  let ultimoError = null;
  for (const rta of respuestas) {
    if (rta.fallo) { fallos++; ultimoError = rta.error; }
    for (const it of rta.items || []) {
      if (!it || !it.ref || vistos[it.ref]) continue;
      vistos[it.ref] = 1;
      salida.push(it);
    }
  }
  if (fallos === fuentes.length) {
    if (ultimoError && ultimoError.userMessage) throw ultimoError;
    throw kino.error('unavailable', 'ninguna fuente respondió', {
      userMessage: 'Ninguna fuente de doramas respondió la búsqueda.'
    });
  }
  if (!salida.length) log('search «' + q + '»: 0 resultados en las 3 fuentes (normal en la lupa: el sondeo contará cómo busca cada sitio)');
  return salida.slice(0, MAX_ITEMS);
}

/* La aduana del Inicio (escuela de la armadura 0.4.72): si una fuente
 * no trae nada, la fila avisa; el home NUNCA revienta entero. */
async function home() {
  const fuentes = Object.values(FUENTES);
  const rtas = await Promise.all(fuentes.map(async (f) => {
    try { return await f.portada(true); }
    catch (e) {
      log('portada falló en ' + f.id, (e && e.message) || String(e));
      return null;
    }
  }));
  const filas = [];
  for (let i = 0; i < fuentes.length; i++) {
    const nom = (fuentes[i] && fuentes[i].etiqueta) || 'la fuente';
    if (rtas[i] && rtas[i].length) {
      for (const fila of rtas[i]) filas.push(fila);
    } else {
      filas.push({ id: 'aviso-' + (fuentes[i] ? fuentes[i].id : 'x'), title: nom + ': sin datos por ahora', ref: '', items: [] });
    }
  }
  if (!filas.length) {
    throw kino.error('unavailable', 'ninguna fuente armó portada', {
      userMessage: 'Ninguna fuente respondió. Revisa tu conexión o inténtalo en un rato.'
    });
  }
  return filas;
}

async function browse(ref, cursor) {
  for (const f of Object.values(FUENTES)) {
    const hoja = await f.hoja(ref, cursor);
    if (hoja) return hoja;
  }
  throw kino.error('not_found', 'esa fila ya no existe', {
    userMessage: 'Esa fila ya no existe. Vuelve al Inicio.'
  });
}

async function episodes(ref) {
  const p = partirRef(ref);
  if (!p || !FUENTES[p.fuente] || !p.partes[0]) {
    throw kino.error('not_found', 'ref desconocida', {
      userMessage: 'Ese título ya no es válido. Búscalo de nuevo.'
    });
  }
  return FUENTES[p.fuente].episodios(p.partes[0]);
}

async function details(ref) {
  const p = partirRef(ref);
  if (!p || !FUENTES[p.fuente] || !p.partes[0]) return null;
  try { return await FUENTES[p.fuente].detalle(p.partes[0]); }
  catch (e) {
    log('detalle falló', (e && e.message) || String(e));
    return null;
  }
}

async function resolve(ref) {
  const p = partirRef(ref);
  if (!p || !FUENTES[p.fuente] || !p.partes[0]) {
    throw kino.error('not_found', 'ref inválida', {
      userMessage: 'Ese título ya no es válido. Búscalo de nuevo.'
    });
  }
  return FUENTES[p.fuente].resolver(p.partes[0], 1, null);
}

/* ---------- los sondeos (el corazón de la lupa) ---------- */

async function action(key) {
  if (key === 'sondaKdla') {
    const destinos = ['/', '/series', '/buscar?q=amor', '/serie/une-another', '/dramas'];
    return { message: await sondeaFuente('Kdramas.lat', BASE_KDLA, destinos, PATRON_KDLA) };
  }
  if (key === 'sondaYandi') {
    const destinos = ['/', '/series/', '/series/love-in-disguise/', '/temporadas/love-in-disguise-temporada-1/', '/episodios/love-in-disguise-1x9/'];
    return { message: await sondeaFuente('Yandispoiler', BASE_YANDI, destinos, PATRON_YANDI) };
  }
  if (key === 'sondaDlat') {
    const destinos = ['/', '/?s=amor', '/dramas', '/drama/un-ejemplo', '/catalogo'];
    return { message: await sondeaFuente('DoramasLatinoX', BASE_DLAT, destinos, PATRON_DLAT) };
  }
  if (key === 'acercaDe') {
    return { message: 'DoramasJing v' + VERSION + ' — doramas en español por Susejing, hermano de AniJing. GPL-3.0: usa, mejora y comparte con crédito.' };
  }
  return null;
}

{ search, home, browse, episodes, details, resolve, action };

