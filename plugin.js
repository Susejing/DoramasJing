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
//
// v0.1.1 «EL REGISTRO HABLÓ» (21 nov 2026, primeras huellas reales del
// teléfono): kdramas.lat usa /drama/NNNNN con pósters Next.js (marcador
// data: + la URL real más adelante: fallback de imagen generosa);
// yandispoiler cierra 503 al fetch directo → el buque ahora también
// brinca al traductor en no-ok (503/429/502/403); doramaslatinox
// confiesa TODO: fichas /series/slug/, episodios /episodio/slug-NxM/ y
// pósters directos de image.tmdb.org → parser de episodios propio; los
// sondeos suben la huérfana a 3000 letras y listan las URLs de imagen
// absolutas que encuentren.
//
// v0.2.0 «LA FICHA CONFESÓ» (21 nov 2026, Registro III): kdramas.lat
// usa pósters de image.tmdb.org escondidos CODIFICADOS en el srcSet
// (url=https%3A%2F%2F...) → decodificador propio; su ficha /drama/NNNNN
// trae og:title/og:description/og:image completos → parser con manifiesto
// og. Yandispoiler cerró 503 al directo Y 400 al traductor → escalera de
// 3 peldaños: directo ▸ traductor (separador ? o & correcto) ▸ navegador
// oculto (kino.browser.page, solo desde search/home/browse/episodes/
// resolve con la persona en la app; los sondeos marcan escalera:false).
// DoramasLatinoX: páginas de episodio con «Season Episodes List»
// (/episodio/slug-NxM/), og:image = logo del sitio (se prefiere la
// primera URL de image.tmdb.org). El reproductor apunta a la 0.3.
//
// v0.2.1 «EL LISTADO HONESTO» (21 nov, Registro IV): kdla NO confiesa
// capítulos en el HTML crudo (villa Next.js: el listado viaja por JS) →
// devolver [] hace que Kino diga «la lista de capítulos no es válida»;
// ahora cae con mensaje honesto que manda al título a las otras fuentes.
// dlat gana dos respaldos de listado: la página /temporada/slug-…-1/ y la
// del episodio 1x1 (trae la «Season Episodes List» completa). Yandi
// cerrada (503) también cae con mensaje honesto.
//
// v0.2.2 «EL SLUG VECINO» (22 nov, Registro V): la página 1x1 inventada
// da 404 — el slug interno de un título puede NO ser el de su ficha
// (p. ej. when-i-meet-the-moon vs cuando-encuentre-la-luna). Cura:
// cosechar de la ficha CUALQUIER ancla /episodio/<otro-slug>-NxM/ y con
// ese episodio vecino robar su «Season Episodes List» completa. Los
// pósters de kdla en el Inicio: el srcSet real viaja como proxy
// /_next/image?url=… → el decodificador TMDB gana ANTES que el proxy. Y
// el navegador oculto ya no acepta páginas 404 disfrazadas de éxito.
//
// v0.3.0 «LA FLECHITA EN EL LIENZO» (22 nov, scuola AniJing screen):
// pantalla propia con selector de fuente EN EL LIENZO (botón «tune»
// arriba: lista con ✓ sobre la fuente activa; cada bloque de «Todas»
// lleva su encabezado tocable), filas reutilizadas del Inicio y la
// elección guardada en kino.storage — no sustituye al setting de
// Ajustes: ES la flechita que se ve.
// v0.2.4 «EL VECINO ORDENADO» (22 nov, log 01:49): la re-lectura del
// vecino ya funciona con UN solo vecino si comparte palabra (≥3 letras)
// con el slug; vecinos ordenados por afinidad antes de re-leer/visitar.
// v0.2.3 «LA FLECHITA DE LA FUENTE» (22 nov, capturas en vivo): la 0.2.2
// desbloqueó a Yandispoiler (el navegador oculto la abrió) y su lista
// volvió a casa POR PRIMERA VEZ — y Kino la rechazó: el contrato
// KinoEpisode pide { season, number, ref, title } dentro de
// { episodes: [...] }, no { id, num } pelados. Cura de forma. Y el
// selector pedido: setting «Fuente preferida» (todas/kdla/yandi/dlat) que
// decide qué filas arma el Inicio y a quién pregunta la búsqueda.

const VERSION = '0.3.0';

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
 * directo, el mismo camino viaja por *.translate.goog con guiones.
 * v0.2.0: separador correcto (? o &) cuando el camino ya trae query. */
function puenteDe(url) {
  const m = /^https?:\/\/([^/?]+)(\/.*)?$/i.exec(String(url || ''));
  if (!m) return null;
  const camino = m[2] || '/';
  const sep = camino.indexOf('?') >= 0 ? '&' : '?';
  return 'https://' + m[1].replace(/\./g, '-') + '.translate.goog' + camino + sep + '_x_tr_sl=auto&_x_tr_tl=es&_x_tr_hl=es';
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
  /* v0.1.1 (huella real del 21 nov): yandispoiler respondió 503 a TODO el
   * fetch directo. El buque también brinca al traductor en no-ok. */
  if (r && !r.ok && (r.status === 503 || r.status === 429 || r.status === 502 || r.status === 403)) {
    const pv2 = puenteDe(url);
    if (pv2) {
      try {
        const r2 = await kino.fetch(pv2, { headers: o.headers || {}, timeoutMs: (o.timeoutMs || 12000) + 4000 });
        if (r2 && r2.ok) {
          log('el sitio cerró ' + r.status + ' (' + String(url).split('/')[2] + '): el puente del traductor respondió');
          return r2;
        }
        log('el sitio cerró ' + r.status + ' y el puente también (' + (r2 && r2.status) + ')');
      } catch (eP) { log('el sitio cerró ' + r.status + ' y el puente falló: ' + ((eP && eP.message) || eP)); }
    }
  }
  /* v0.2.0: tercer peldaño para 503/400 (huella yandispoiler del 21 nov):
   * el navegador oculto de Kino. Solo con la persona en la app y desde
   * search/home/browse/episodes/resolve — los sondeos marcan escalera:false. */
  const escalera = o.escalera !== false;
  if ((r == null || (r && !r.ok)) && escalera && kino.browser && typeof kino.browser.page === 'function') {
    try {
      const p = await kino.browser.page(url, { timeoutMs: o.timeoutMs || 12000 });
      const htmlN = p && p.html ? String(p.html) : '';
      const stN = (p && p.status) != null ? (p && p.status) : 200;
      /* v0.2.2 (Registro V, 21:50): el navegador trajo una carta de «no
       * encontrado» con 60907 letras — página grande NO es página buena.
       * Respetar el status real del navegador. */
      if (htmlN.length > 200 && stN > 0 && stN < 400) {
        log('el navegador oculto trajo ' + htmlN.length + ' letras (' + String(url).split('/')[2] + ')');
        return { ok: true, status: stN, text: function () { return Promise.resolve(htmlN); }, json: function () { return Promise.resolve({}); } };
      }
      log('el navegador oculto no trajo página buena (status ' + stN + ', ' + htmlN.length + ' letras)');
    } catch (eN) {
      const codeN = (eN && eN.code) || '';
      if (codeN !== 'not_allowed' && codeN !== 'rate_limited') log('el navegador oculto no pudo: ' + (codeN || (eN && eN.message) || eN));
    }
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

/* La huérfana: ~3000 letras crudas alrededor de la primera ancla del
 * patrón — la materia prima exacta para escribir los parsers. v0.2.0:
 * si el PRIMER ancla vive en el <head>, centrar en el ancla objetivo. */
function huespedDe(html, patron, objetivo) {
  const t = String(html || '');
  const re = new RegExp('href\\s*=\\s*["\'](' + patron + ')["\']', 'gi');
  const m = re.exec(t);
  if (!m) return '(el patrón no apareció: ' + patron + ')';
  /* v0.2.0: cuando el PRIMER ancla vive en el <head> (canonical/og:url),
   * centrar la huérfana en el ancla del OBJETIVO (p. ej. 'episodio'). */
  let centro = m.index;
  if (objetivo) {
    const re2 = new RegExp('href\\s*=\\s*["\'](' + objetivo + ')["\']', 'gi');
    const m2 = re2.exec(t);
    if (m2 && m2.index > m.index) centro = m2.index;
  }
  return t.slice(Math.max(0, centro - 80), centro + 3000).replace(/\s+/g, ' ');
}

async function sondeaFuente(nombre, base, destinos, patron, objetivo) {
  const partes = [];
  await Promise.all(destinos.map(async (d) => {
    const url = base + d;
    try {
      const r = await traerEnCrudo(url, { escalera: false, timeoutMs: 12000 });
      const t = r && r.text ? await r.text() : '';
      const v = vocabularioDe(t);
      const inv = inventarioDe(t, patron);
      let huella = huespedDe(t, patron, objetivo);
      if (huella.length > 3000) huella = huella.slice(0, 3000);
      /* v0.1.1: la lista de URLs de imagen absolutas (kdla esconde el póster
       * más adelante en el bloque; así el Registro confiesa el host). */
      const imgs = [];
      const reImg = /https?:\/\/[^"'\s\\]+?\.(?:jpe?g|webp|png|avif)/gi;
      let mi;
      while ((mi = reImg.exec(t)) !== null && imgs.length < 4) {
        if (imgs.indexOf(mi[0]) < 0) imgs.push(mi[0]);
      }
      log('sonda ' + nombre + d + ': ' + motivoDeR(r) + ', ' + t.length + ' letras, ' + v + ', anclas-serie: ' + (inv.length ? inv.join(' | ').slice(0, 500) : 'NINGUNA'));
      if (imgs.length) log('sonda ' + nombre + ' imágenes ' + d + ': ' + imgs.join(' | ').slice(0, 500));
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
    /* v0.2.0: los srcSet codificados de Next.js traman 'url=https%3A…' con
     * la base pegada por absoluta(): NO son URLs. Se saltan aquí CRUDOS y
     * los gana urlDeSrcSet al final de la cadena. */
    if (m && m[1] && /^url=/.test(m[1])) continue;
    const u = m ? absoluta(m[1], origen) : '';
    if (u && u.indexOf('data:') !== 0) return u;
  }
  const bg = /background(?:-image)?\s*:\s*url\((['"]?)([^'")]+)/i.exec(t);
  const bgU = bg ? absoluta(bg[2], origen) : '';
  /* v0.2.2: el marcador difuminado de kdla es un data: conjunto — nunca gana. */
  return bgU && bgU.indexOf('data:') !== 0 ? bgU : '';
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

/* v0.1.1 (huella kdla): los pósters viajan como URL absoluta jpg/webp más
 * adelante del bloque (Next.js con marcador data:). Rescate generoso. */
function primeraImagenDe(t) {
  const m = /https?:\/\/[^"'\s\\]+?\.(?:jpe?g|webp|png|avif)/i.exec(String(t || ''));
  return m ? m[0] : '';
}

/* v0.2.0 (huella kdla): el póster del bloque viaja CODIFICADO en el
 * srcSet de Next.js — url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2F...jpg */
function urlDeSrcSet(t) {
  const m = /url=(https?%3A%2F%2F[^&"'\s]+)/i.exec(String(t || ''));
  if (!m) return '';
  try { return decodeURIComponent(m[1]); } catch (e) { return ''; }
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
    /* v0.2.2 (Registro V, pósters kdla vacíos en el Inicio): el srcSet de
     * kdla viaja como proxy /_next/image?url=<tmdb codificada> — el
     * decodificador gana ANTES que caraDe (que cae en el proxy o en el
     * marcador data:), para entregar la TMDB limpia y P334. */
    const poster = urlDeSrcSet(trozo) || urlDeSrcSet(antes) || caraDe(trozo, origen) || caraDe(antes, origen) || primeraImagenDe(trozo) || primeraImagenDe(antes);
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
  const ogM = /<meta\s+property=["']og:title["']\s+content=["']([^"']{2,200})["']/i.exec(t);
  const titulo = (hM ? limpio(hM[1]) : '')
    || (ogM ? limpio(ogM[1]).replace(/\s*\|\s*[^|]+$/, '').trim() : '')
    || slugATitulo(slug);
  const dM = /<meta\s+name=["']description["']\s+content=["']([^"']{20,600})["']/i.exec(t);
  const ogD = /<meta\s+property=["']og:description["']\s+content=["']([^"']{20,600})["']/i.exec(t);
  const descM = dM || ogD || /(?:sinopsis|description|resumen)[^>]*>([\s\S]{40,600}?)</i.exec(t);
  const anhoM = /\b(?:19|20)\d{2}\b/.exec(t);
  const caraM = /<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i.exec(t);
  const info = {
    title: titulo,
    description: descM ? limpio(descM[1]).slice(0, 500) : '',
    year: anhoM ? anhoM[0] : null,
    badges: [nombre]
  };
  /* v0.2.0 (huellas): el póster real es de image.tmdb.org en kdla y dlat;
   * en dlat el og:image es el logo del sitio, así que TMDB gana. */
  const tmM = /https:\/\/image\.tmdb\.org\/t\/p\/[^"'\s\\]+/.exec(t);
  const poster = tmM ? absoluta(tmM[0], origen) : (caraM ? absoluta(caraM[1], origen) : caraDe(primerBloqueConImagen(t), origen)) || urlDeSrcSet(t);
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
    /* Huellas 21 nov: la ficha vive en /drama/NNNNN (numérica) y trae
     * og:title/og:description/og:image completos. */
    const r = await traerPagina(BASE_KDLA + '/drama/' + slug, 12000);
    if (!r || !r.ok || !r.text) {
      log('kdla detalle: /drama/' + slug + ' no confesó (' + motivoDeR(r) + ')');
      return null;
    }
    return infoDePaginaSerie(r.text, slug, 'Kdramas.lat', BASE_KDLA);
  },

  async episodios() {
    /* v0.2.1: la ficha de kdla no trae capítulos en el HTML crudo (el
     * listado viaja por JS). [] hace que Kino diga «lista no válida»:
     * caer con mensaje honesto es la mejor escuela. */
    throw errorDe('unavailable', 'kdla episodios sin patrón aún', 'Kdramas.lat aún no confiesa sus capítulos (los sondeos siguen buscando). Prueba este título en DoramasLatinoX o Yandispoiler.');
  },

  async resolver() {
    throw errorDe('unavailable', 'resolver v0.1', 'La lupa v0.2 afina fichas y episodios: el reproductor llega en la 0.3. Toca «Sondear Kdramas.lat» en Ajustes y mándame el Registro.');
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
    const temp = nM ? parseInt(nM[1], 10) : 1;
    const num = nM ? parseInt(nM[2], 10) : out.length + 1;
    /* v0.2.3 (capturas del 22 nov): KinoEpisode pide { season, number, ref,
     * title } — con { id, num } la lista «no es válida» (el primer regreso
     * real de yandi lo destapó; escuela: evitar [] era media cura, la
     * otra media era la FORMA del episodio). */
    out.push({ season: temp, number: num, ref: 'yandi:' + id, title: 'Episodio ' + num });
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
    /* La lista vive en la ficha y en /temporadas/: la 0.3 la leerá con
     * la huella del sondeo. v0.2: lo que la forma conocida de URL dé. */
    const r1 = await traerPagina(BASE_YANDI + '/series/' + slug + '/', 12000);
    let eps = r1 && r1.ok ? episodiosYandi(r1.text, slug) : [];
    if (!eps.length) {
      const r2 = await traerPagina(BASE_YANDI + '/temporadas/' + slug + '-temporada-1/', 12000);
      eps = r2 && r2.ok ? episodiosYandi(r2.text, slug) : [];
      if (eps.length) log('yandi episodios ' + slug + ': la lista vive en /temporadas/ (la ficha no la trae)');
    }
    if (!eps.length) throw errorDe('unavailable', 'yandi episodios cerrados', 'Yandispoiler sigue bloqueando las lecturas (503). Prueba este título en Kdramas.lat o DoramasLatinoX.');
    return eps;
  },

  async resolver() {
    throw errorDe('unavailable', 'resolver v0.1', 'La lupa v0.2 afina fichas y episodios: el reproductor llega en la 0.3. Toca «Sondear Yandispoiler» en Ajustes y mándame el Registro.');
  }
});

/* ---------- fuente: doramaslatinox.com ---------- */

/* Huella del 21 nov: los capítulos son /episodio/slug-NxM/ (misma
 * gramática de yandispoiler). Mismo rescate por patrón de URL. */
function episodiosDlat(html, slug) {
  const t = String(html || '');
  const re = new RegExp('href\\s*=\\s*["\'](?:https?:\\/\\/(?:www\\.)?doramaslatinox\\.com)?\\/episodio\\/(' + slug + '-\\d+x\\d+)\\/?["\']', 'gi');
  const out = [];
  const vistos = {};
  let m;
  while ((m = re.exec(t)) !== null && out.length < 200) {
    const id = m[1];
    if (vistos[id]) continue;
    vistos[id] = 1;
    const nM = /(\d+)x(\d+)$/.exec(id);
    const num = nM ? parseInt(nM[2], 10) : out.length + 1;
    const temp = nM ? parseInt(nM[1], 10) : 1;
    /* v0.2.3: contrato KinoEpisode (season/number/ref), escuela del episodio válido. */
    out.push({ season: temp, number: num, ref: 'dlat:' + id, title: 'Episodio ' + num });
  }
  return out;
}

/* v0.2.2 (Registro V): el slug interno de los episodios puede NO ser el
 * de la ficha (when-i-meet-the-moon vs cuando-encuentre-la-luna — la
 * página 1x1 del slug de la ficha dio 404). Cosechar CUALQUIER ancla
 * /episodio/<otro-slug>-NxM/ de la página: el vecino confiesa el slug
 * verdadero y su página trae la «Season Episodes List» completa. */
function vecinosDeEpisodio(html) {
  const t = String(html || '');
  const re = /href\s*=\s*["'](?:https?:\/\/(?:www\.)?doramaslatinox\.com)?\/episodio\/([a-z0-9][a-z0-9-]*-\d+x\d+)\/?["']/gi;
  const vistos = {};
  const out = [];
  let m;
  while ((m = re.exec(t)) !== null && out.length < 20) {
    const id = m[1];
    if (vistos[id]) continue;
    vistos[id] = 1;
    const baseM = /^(.*?)-(\d+)x(\d+)$/.exec(id);
    out.push({ id: id, slug: baseM ? baseM[1] : id });
  }
  return out;
}

/* v0.2.2: un solo juicio para TODAS las huellas (ficha, búsqueda,
 * temporada, episodio 1x1). Orden por huella: 1) patrón del slug propio;
 * 2) si la página ya muestra ≥2 anclas con OTRO slug, re-leerla con ese
 * slug (la página confesó el vecino en su propia carne); 3) visitar la
 * página del vecino (hasta 3) y robar su «Season Episodes List». */
/* v0.2.4 (Registro VI, log 01:49): la ficha de «cuando-encuentre la moon»
 * traía SU lista bajo el slug del vecino «amor-bajo-la-luz-de la luna» y
 * la cura se cayó al respaldo de búsqueda: la guarda exigía DOS vecinos
 * distintos y solo había UNO. Ahora un único vecino basta SI comparte
 * alguna palabra (≥3 letras) con el slug. Y como la barra lateral puede
 * meter episodiós de otros shows, los vecinos se ordenan por palabras
 * compartidas antes de re-leer o visitar. */
function puntosDeVecino(vslug, slug) {
  const palabras = (' ' + slug + ' ').split('-').filter(function (w) { return w.length >= 3; });
  return vslug.split('-').filter(function (w) { return palabras.indexOf(w) >= 0; }).length;
}

function vecinosOrdenados(vecinos, slug) {
  return vecinos.slice().sort(function (a, b) {
    return puntosDeVecino(b.slug, slug) - puntosDeVecino(a.slug, slug);
  });
}

async function episodiosDeHuellas(huellas, slug) {
  for (const h of huellas) {
    if (!h) continue;
    let eps = episodiosDlat(h, slug);
    if (eps.length) return eps;
    const vecinos = vecinosOrdenados(vecinosDeEpisodio(h), slug);
    if (vecinos.length && puntosDeVecino(vecinos[0].slug, slug) > 0) {
      const propio = episodiosDlat(h, vecinos[0].slug);
      if (propio.length >= 2) {
        log('dlat episodios ' + slug + ': la propia página traía la lista bajo el slug del vecino «' + vecinos[0].slug + '»');
        return propio;
      }
    }
    for (let i = 0; i < vecinos.length && i < 3; i++) {
      const v = vecinos[i];
      const rpv = await traerPagina(BASE_DLAT + '/episodio/' + v.id + '/', 12000);
      eps = rpv && rpv.ok ? episodiosDlat(rpv.text, v.slug) : [];
      if (eps.length) {
        log('dlat episodios ' + slug + ': el vecino ' + v.id + ' confiesa el slug verdadero — lista completa robada de su «Season Episodes List»');
        return eps;
      }
      log('dlat episodios ' + slug + ': el vecino ' + v.id + ' no cedió su lista');
    }
  }
  return [];
}

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
    /* Huella del 21 nov: la ficha vive en /series/slug/ (raíz con post-id). */
    const caminos = ['/series/' + slug + '/', '/series/' + slug, '/drama/' + slug, '/serie/' + slug, '/doramas/' + slug];
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

  async episodios(slug) {
    /* Huella del 21 nov: capítulos /episodio/slug-NxM/ listados en la
     * ficha (y hasta en los resultados de búsqueda). Rescate por patrón. */
    const rta1 = await traerPagina(BASE_DLAT + '/series/' + slug + '/', 12000);
    let eps = await episodiosDeHuellas([rta1 && rta1.text], slug);
    if (!eps.length) {
      const rta2 = await traerPagina(BASE_DLAT + '/?s=' + encodeURIComponent(slug), 10000);
      eps = await episodiosDeHuellas([rta2 && rta2.text], slug);
      if (eps.length) log('dlat episodios ' + slug + ': la lista apareció en la búsqueda (?s=), no en la ficha');
    }
    /* v0.2.1 (huella del episodio 1x6): respaldo por página de temporada. */
    if (!eps.length) {
      const rta3 = await traerPagina(BASE_DLAT + '/temporada/' + slug + '-temporada-1/', 12000);
      eps = await episodiosDeHuellas([rta3 && rta3.text], slug);
      if (eps.length) log('dlat episodios ' + slug + ': la lista vive en /temporada/slug-temporada-1/');
    }
    /* v0.2.1 (huella del episodio 1x6): la página del PRIMER episodio trae
     * la «Season Episodes List» completa — el respaldo astuto. */
    if (!eps.length) {
      const rta4 = await traerPagina(BASE_DLAT + '/episodio/' + slug + '-1x1/', 12000);
      eps = await episodiosDeHuellas([rta4 && rta4.text], slug);
      if (eps.length) log('dlat episodios ' + slug + ': la lista apareció en la página del episodio 1x1 (Season Episodes List)');
    }
    if (!eps.length) throw errorDe('unavailable', 'dlat episodios sin patrón', 'DoramasLatinoX no listó capítulos para este título (las fuentes pueden tener catálogos distintos). Busca la serie en el Inicio o en las otras fuentes.');
    return eps;
  },

  async resolver() {
    throw errorDe('unavailable', 'resolver v0.1', 'La lupa v0.2 afina fichas y episodios: el reproductor llega en la 0.3. Toca «Sondear DoramasLatinoX» en Ajustes y mándame el Registro.');
  }
});

// ---------- la casa (search/home/browse/details/episodes/resolve) ----------

function partirRef(ref) {
  const p = String(ref || '').split(':');
  if (p.length < 2 || !FUENTES[p[0]]) return null;
  return { fuente: p[0], partes: p.slice(1) };
}

const MAX_ITEMS = 240;

/* v0.2.3 «LA FLECHITA DE LA FUENTE» (pedido del 22 nov): un selector en
 * Configurar (setting select «fuente») decide si el Inicio y la búsqueda
 * hablan de TODAS las fuentes o de UNA sola, como la flechita de
 * MangaTrack. Se lee con la escuela AniJing (configDe con guardias). */
function configDe(clave) {
  try {
    if (kino.config && typeof kino.config.get === 'function') return kino.config.get(clave);
  } catch (e) {}
  try {
    if (kino.config && kino.config[clave] != null) return kino.config[clave];
  } catch (e) {}
  return '';
}

function fuenteDeConfig() {
  const v = String(configDe('fuente') || '').toLowerCase().trim();
  return (v === 'kdla' || v === 'yandi' || v === 'dlat') ? v : '';
}

function fuentesActivas() {
  const elegida = fuenteDeConfig();
  return (elegida && FUENTES[elegida]) ? [FUENTES[elegida]] : Object.values(FUENTES);
}

async function search(query) {
  const q = query && typeof query.q === 'string' ? query.q.trim() : '';
  if (!q && !(query && (query.originalTitle || (query.altTitles || []).length))) return [];
  const fuentes = fuentesActivas();
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
  const fuentes = fuentesActivas();
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
  /* v0.2.3: KinoEpisodes pide un OBJETO con la lista adentro — si la
   * fuente devolvió el array pelado, se envuelve aquí (y la FUENTE ya
   * emite episodios con la forma KinoEpisode: season/number/ref/title). */
  const r = await FUENTES[p.fuente].episodios(p.partes[0]);
  return Array.isArray(r) ? { episodes: r } : r;
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
    /* Huella 21 nov: catálogo /series y fichas /drama/NNNNN (el 404 de
     * /serie/ y /dramas ya confesado). La ficha real revela episodios. */
    const destinos = ['/', '/series', '/drama/70754', '/buscar?q=amor'];
    return { message: await sondeaFuente('Kdramas.lat', BASE_KDLA, destinos, PATRON_KDLA, 'capitulo|episodio') };
  }
  if (key === 'sondaYandi') {
    const destinos = ['/', '/series/', '/series/love-in-disguise/', '/temporadas/love-in-disguise-temporada-1/', '/episodios/love-in-disguise-1x9/'];
    return { message: await sondeaFuente('Yandispoiler', BASE_YANDI, destinos, PATRON_YANDI, 'episodio') };
  }
  if (key === 'sondaDlat') {
    /* Huella 21 nov: fichas /series/slug/ y capítulos /episodio/slug-NxM/ */
    const destinos = ['/', '/?s=amor', '/series/cuando-encuentre-la-luna/', '/temporada/cuando-encuentre-la-luna-temporada-1/', '/episodio/erase-un-amor-rural-1x6/'];
    return { message: await sondeaFuente('DoramasLatinoX', BASE_DLAT, destinos, PATRON_DLAT, 'episodio') };
  }
  if (key === 'acercaDe') {
    return { message: 'DoramasJing v' + VERSION + ' — doramas en español por Susejing, hermano de AniJing. GPL-3.0: usa, mejora y comparte con crédito.' };
  }
  return null;
}

/* ===================== LA PANTALLA (v0.3.0, escuela AniJing) ===================== */

const CLAVE_FUENTE_PANTALLA = 'doramasjing_fuente_pantalla';

function fuenteValidaPantalla(x) {
  const v = String(x || '').toLowerCase().trim();
  return (v === 'todas' || v === 'kdla' || v === 'yandi' || v === 'dlat') ? v : '';
}

function fuenteDePantalla(state) {
  if (state && fuenteValidaPantalla(state.fuente)) return state.fuente;
  try {
    const g = kino.storage && kino.storage.get;
    if (typeof g === 'function') return fuenteValidaPantalla(kino.storage.get(CLAVE_FUENTE_PANTALLA)) || 'todas';
  } catch (e) { /* el almacen falla sin miedo: 'todas' */ }
  return 'todas';
}

/* Las mismas filas del Inicio, con la fuente elegida en EL LIENZO
 * (no el setting de Ajustes). Cada fila viaja sellada con su fuente
 * (fila.fuente) para que «Todas» pueda agrupar por bloques tocables. */
async function pantallaCargar(fuente) {
  const elegida = fuenteValidaPantalla(fuente) || 'todas';
  const fuentes = (elegida !== 'todas' && FUENTES[elegida]) ? [FUENTES[elegida]] : Object.values(FUENTES);
  const rtas = await Promise.all(fuentes.map(async (f) => {
    try { const filas = await f.portada(true); for (const fila of filas || []) fila.fuente = f.id; return filas || []; }
    catch (e) {
      log('portada falló en ' + f.id + ' (pantalla)', (e && e.message) || String(e));
      return [];
    }
  }));
  const filas = [];
  for (let i = 0; i < fuentes.length; i++) {
    const nom = (fuentes[i] && fuentes[i].etiqueta) || 'la fuente';
    if (rtas[i] && rtas[i].length) for (const fila of rtas[i]) filas.push(fila);
    else filas.push({ id: 'aviso-' + (fuentes[i] ? fuentes[i].id : 'x'), fuente: fuentes[i] ? fuentes[i].id : 'x', title: nom + ': sin datos por ahora', ref: '', items: [] });
  }
  return filas;
}

function rielDePantalla(fila) {
  if (!fila || !fila.items || !fila.items.length) {
    return { type: 'Text', text: String((fila && fila.title) || ''), style: 'bodySmall', padding: 4 };
  }
  const riel = { type: 'titleRail', title: String(fila.title || ''), items: fila.items };
  if (fila.ref) riel.ref = String(fila.ref);
  return riel;
}

async function screen(arg) {
  const a = arg || {};
  const state = a.state && typeof a.state === 'object' ? a.state : {};
  const filas = Array.isArray(state.filas) ? state.filas : null;
  const cuerpo = [];
  if (state.elegirFuentes === true) {
    /* El selector dibujado AQUÍ, sin el corte de 8 del menú nativo:
     * una fila por fuente con ✓ sobre la activa (escuela AniJing
     * 0.6.11 «La lista completa»). */
    const actual = fuenteValidaPantalla(state.fuente) || 'todas';
    const opciones = [{ id: 'todas', nombre: 'Todas las fuentes' }].concat(Object.values(FUENTES).map((f) => ({ id: f.id, nombre: f.etiqueta || f.id })));
    for (const x of opciones) {
      cuerpo.push({ type: 'Text', text: (x.id === actual ? '✓ ' : '') + x.nombre, style: 'h3', onTap: { event: 'elegirFuente', arg: x.id } });
    }
    cuerpo.push({ type: 'Button', labelText: 'Cancelar', onPressed: 'cerrarFuentes', alignSelf: 'center' });
  } else if (state.errorPantalla === true) {
    cuerpo.push({ type: 'errorState', title: 'No se pudo cargar', text: 'Ninguna fuente respondió. Revisa tu conexión y vuelve a probar.' });
    cuerpo.push({ type: 'Button', labelText: 'Reintentar', onPressed: 'recargar', alignSelf: 'center' });
  } else if (filas && !filas.length) {
    cuerpo.push({ type: 'emptyState', title: 'Nada por ahora', text: 'Ninguna fuente trajo doramas en este momento. Prueba con otra o vuelve más tarde.', icon: 'movie' });
    cuerpo.push({ type: 'Button', labelText: 'Reintentar', onPressed: 'recargar', alignSelf: 'center' });
  } else if (!filas) {
    cuerpo.push({ type: 'Skeleton', shape: 'block', height: 240 });
  } else if ((fuenteValidaPantalla(state.fuente) || 'todas') === 'todas') {
    /* «Todas»: UN bloque por fuente, encabezado grande tocable —
     * toucharlo pasa a esa fuente (escuela AniJing 0.5.0). */
    const bloques = [];
    const vistos = {};
    for (const fila of filas) {
      const fid = fila.fuente || 'x';
      if (!vistos[fid]) { vistos[fid] = true; bloques.push({ fuente: fid, rieles: [] }); }
      for (const b of bloques) if (b.fuente === fid) b.rieles.push(rielDePantalla(fila));
    }
    for (const b of bloques) {
      const f = FUENTES[b.fuente];
      const hijos = [{
        type: 'Text', text: f ? f.etiqueta : b.fuente, style: 'h3',
        tooltip: 'Ver solo esta fuente', tooltipEn: 'Show this source only',
        onTap: { event: 'fuente', arg: b.fuente }
      }];
      for (const riel of b.rieles) hijos.push(riel);
      cuerpo.push({ type: 'Column', gap: 12, children: hijos });
    }
    cuerpo.push({ type: 'Text', text: 'DoramasJing v' + VERSION + ' · El dorama con la firma de Susejing', style: 'caption', padding: 4 });
  } else {
    for (const fila of filas) cuerpo.push(rielDePantalla(fila));
    cuerpo.push({ type: 'Text', text: 'DoramasJing v' + VERSION + ' · El dorama con la firma de Susejing', style: 'caption', padding: 4 });
  }
  return {
    type: 'Scaffold',
    appBar: {
      type: 'AppBar', dense: true, divider: false, mergeWithKinoBar: true,
      leading: { type: 'IconButton', icon: 'arrow_back', labelText: 'Cerrar', onPressed: { go: { close: true } } },
      title: 'DoramasJing',
      actions: [
        { type: 'IconButton', icon: 'tune', labelText: 'Elegir fuente', onPressed: 'fuentes' }
      ]
    },
    body: {
      type: 'SingleChildScrollView',
      children: [{
        type: 'Column',
        gap: 16,
        padding: { compact: 12, medium: 16, expanded: 24 },
        children: cuerpo
      }]
    }
  };
}

async function screenEvent(e) {
  const ev = e || {};
  const state = ev.state && typeof ev.state === 'object' ? ev.state : {};
  const nombre = String(ev.name || '');
  if (nombre === 'open' || nombre === 'recargar') {
    const fuente = fuenteDePantalla(state);
    try {
      const filas = await pantallaCargar(fuente);
      return { state: { fuente: fuente, filas: filas, errorPantalla: false } };
    } catch (err) {
      log('cargar la pantalla falló', (err && err.message) || String(err));
      return { state: { fuente: fuente, errorPantalla: true } };
    }
  }
  if (nombre === 'fuentes') {
    const ns = Object.assign({}, state);
    ns.elegirFuentes = !ns.elegirFuentes;
    return { state: ns };
  }
  if (nombre === 'cerrarFuentes') {
    const ns = Object.assign({}, state);
    ns.elegirFuentes = false;
    return { state: ns };
  }
  if (nombre === 'elegirFuente' || nombre === 'fuente') {
    const nueva = fuenteValidaPantalla(ev.arg) || 'todas';
    try {
      if (kino.storage && typeof kino.storage.set === 'function') kino.storage.set(CLAVE_FUENTE_PANTALLA, nueva);
    } catch (eS) {
      log('no se pudo guardar la fuente', (eS && eS.message) || String(eS));
    }
    try {
      const filas = await pantallaCargar(nueva);
      const rta = { state: { fuente: nueva, filas: filas, errorPantalla: false, elegirFuentes: false } };
      const nom = nueva === 'todas' ? 'Todas las fuentes' : ((FUENTES[nueva] && FUENTES[nueva].etiqueta) || nueva);
      rta.toast = nom;
      return rta;
    } catch (err) {
      log('cargar «' + nueva + '» falló', (err && err.message) || String(err));
      return { state: { fuente: nueva, errorPantalla: true, elegirFuentes: false } };
    }
  }
  return null;
}

/* ===================== FIN DE LA PANTALLA ===================== */

export { search, home, browse, episodes, details, resolve, action, screen, screenEvent };
