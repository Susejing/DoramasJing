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
// v0.3.4 «LA MEMORIA CRECE CON LA LUPA» (22 nov, capturas 21:51): la
// memoria de yandi seguía virgen porque el paso manual «pasa por el
// Inicio» pedía disciplina y las búsquedas del teléfono fueron de anime
// (0 resultados legítimos en sitios de doramas). Cura: si la lupa
// recibe items de una fuente, una fila «Tus búsquedas» alimenta su
// memoria SIN pisar las filas de la portada (fusión por id, tope de
// 6 filas). Buscar un dorama real de Yandispoiler basta para llenar
// la pantalla. Y la ficha kdla «뿌리깊은 나무» mostró el pendiente de
// siempre: episodios viajan por JS (sigue en la mesa, con el
// reproductor, para la obra grande de la 0.3).
// v0.3.2 «LA MEMORIA DE LA PANTALLA» (22 nov, capturas 19:13): la flechita
// VIVIÓ en el teléfono (0.3.1: pantalla, selector ✓, bloques tocables,
// pósters en kdla y dlat) — pero yandi «sin datos por ahora»: el navegador
// oculto NO está permitido dentro del lienzo propio (la plataforma solo lo
// deja en search/home/browse/episodes/details/section/resolve). Cura: cada
// portada buena se GUARDA en kino.storage (recortada, con marca de tiempo)
// y en la pantalla, si la fuente calla, se devuelve lo guardado con su
// edad al log. La memoria se llena en cualquier flujo de Kino que sí
// permita el navegador.
// v0.3.3 «EL NOMBRE INGLÉS CONFIESA EL SLUG» (22 nov, log 19:26 y sondeos
// de la 19:27): la ficha de dlat NO trae anclas /episodio/, la página
// /temporada/slug-temporada-1/ da 404 y el 1x1 del slug de la ficha
// TAMBIÉN da 404 (los dos 404 del navegador oculto en el log). Pero la
// ficha confiesa su «Nombre inglés:» (la emperatriz divorciada = The
// Remarried Empress; el caso luna → when-i-meet-the-moon ya lo cantó
// en la 0.2.2). Cura: candidatos slug-izados del nombre inglés para la
// página 1x1 y para la búsqueda CON ESPACIOS (WordPress ignora los
// guiones en s=; la sondea /?s=amor mostró resultados verdaderos).
// El año de la ficha se busca DESPUÉS del título (kdla pintaba un «2000»
// ajeno) y el aviso vacío de la pantalla ahora enseña el camino: Inicio
// o lupa llenan la memoria.
// v0.3.0 «LA FLECHITA EN EL LIENZO» (22 nov, escuela AniJing screen):
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

// v0.3.6 «EL BOTÓN QUE DA PLAY» (23 nov, log 23:43: capture timeout «nothing playable» — la captura dormida no pesca nada porque el sitio arma el reproductor tras JavaScript; cura: autoplay en la captura + captureAll tras la guardia del contrato). Antes fue v0.3.5 «EL REPRODUCTOR ROBA EL SERVIDOR» (23 nov, capturas 23:28): el
// log dio la victoria del listado («la lista apareció en la búsqueda (?s=)»
// para la luna, la mesa final y más) y quedó UN solo pendiente gordo: el
// reproductor («resolver v0.1», players=0). Los servidores de dlat viajan
// POR JAVASCRIPT (el box_links del HTML crudo trae vacío) — cura:
// resolver() abre la página del episodio con kino.browser.capture (la
// cura del contrato: capture SOLO vive en resolve, la persona ya tocó
// Play) y devuelve media[0].url CON sus headers. Los demás servidores
// que la captura pesque viajan como copias perezosas etiquetadas
// ({ label, ref }) que Kino captura solo si la principal falla (contrato:
// resolve con 75 s, 2-3 servidores, no todos a la vez). kdla/yandi
// honestos con mensaje que guía (el pendiente de kdla viaja por JS; la
// aduana de las flores de yandi quedó en la mesa).

// v0.3.7 «EL MENSAJERO DEL AJAX» (24 nov, cambio de táctica pedido por el
// usuario tras la prueba del 23:57: el botón dio varias tocadas y la
// captura con autoplay siguió sin pescar nada, «nothing playable» SIEMPRE).
// El HTML crudo trae box_links VACÍO: los servidores viajan POR JAVASCRIPT
// y casi seguro el reproductor habla con wp-admin/admin-ajax.php (el patrón
// clásico de los temas dooplay: POST action=candidata&post=<postid>&nume=n
// &sece=s). La 0.3.7: el postid se roba del propio HTML de la página del
// episodio y el teléfono le pregunta SOLO al mensajero (candidatas
// clásicas, sin fuerza bruta); lo que confiese (mp4/m3u8) viaja como
// Stream CON Referer; los iframes que apuntan a reproductores ajenos
// quedan de PISTA en el Registro. Sondea nueva «Sondear el cargador de
// DoramasLatinoX» confiesa TODO (scripts, postid, respuesta letra a letra
// de cada candidata). La captura con autoplay queda de segundo resort.

// v0.3.8 «EL CARGADOR CONFESÓ MÁS» (24 nov 01:09, la sondea v1 corrió en
// el teléfono): doo_player_ajax ES el action del sitio (200 con el JSON
// {"embed_url":"","type":false}; las otras cuatro candidatas, 400), la
// página del episodio confesó postid=6411 por el body class, y el script
// iamcdn.net/players/replace-domain.js revela los reproductores ajens
// (abyssplayer.com / mobomark2021.com sobre las fuentes cortas short.ink /
// short.icu, re-direccionadas al origen vivo). Cura: combinaciones del POST
// (nume relleno con cero, sin sece y con el postid de la SERIE como
// alternativa, porque algunos temas guardan el reproductor en la ficha de
// la serie), lectura del embed confesado (solo mp4/m3u8 vale como media;
// un embed de reproductor ajeno queda de pista en el Registro) y la sondea
// ya no recorta los scripts (los vuelca por bloques) y añade las menciones
// de admin-ajax/doo_player/embed_url del HTML para cazar el cargador.

const VERSION = '0.3.8';

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

/* v0.3.5: la fábrica del Stream desde una captura exitosa. El PRIMER
 * servidor viaja como Stream directo (url CON sus headers: Referer/UA que
 * el navegador mandó — el video los exige); los demás (hasta 3) viajan
 * como copias perezosas etiquetadas { label, ref } que Kino captura solo
 * si la principal falla (contrato:Stream.label ≤ 48, ref ≤ 512;
 * resolve tiene 75 s — 2-3 servidores, NUNCA todos a la vez). */
function streamDeCaptura(id, cap, desdeMemoria) {
  const media = (cap && Array.isArray(cap.media)) ? cap.media : [];
  const subs = (cap && Array.isArray(cap.subs)) ? cap.subs : [];
  const primero = media[0] || {};
  const headers = primero && primero.headers ? Object.assign({}, primero.headers) : undefined;
  const et = String(primero.url || '').replace(/^https?:\/\//, '').split('/')[0];
  const st = {
    url: primero.url,
    mime: primero.mime || 'video/mp4',
    label: ('DoramasLatinoX · ' + (et || 'servidor')).slice(0, 48)
  };
  if (headers && Object.keys(headers).length) st.headers = headers;
  if (subs.length) st.subtitles = subs;
  /* copias perezosas: ref 'dlat2:<id>:<index>' — captura SEPARADA cuando
   * Kino la pida (su propio presupuesto). */
  const alts = [];
  for (let i = 1; i < media.length && alts.length < 3; i++) {
    const mUrl = String(media[i].url || '');
    if (!mUrl || mUrl === primero.url) continue;
    const et2 = mUrl.replace(/^https?:\/\//, '').split('/')[0];
    alts.push({ label: ('Servidor ' + (i + 1) + ' · ' + (et2 || 'extra')).slice(0, 48), ref: 'dlat2:' + id + ':' + i });
  }
  if (alts.length) st.alternatives = alts;
  log('dlat stream ' + id + (desdeMemoria ? ' (memoria)' : '') + ': principal ' + et + (alts.length ? ' +' + alts.length + ' alternativa(s)' : ''));
  return st;
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
  /* v0.3.3 (capturas 19:26): kdla mostraba «2000» — el PRIMER año del HTML
   * puede ser ajeno (scripts de la cabeza). Ahora se busca DESPUÉS del
   * título propio y dentro de la ventana del cuerpo. */
  const posTitulo = (() => {
    const i1 = t.indexOf('<h1');
    const i2 = t.indexOf('og:title');
    const presentes = [i1, i2].filter((x) => x >= 0);
    return presentes.length ? Math.min.apply(null, presentes) : 0;
  })();
  const anhoM = /\b(?:19|20)\d{2}\b/.exec(t.slice(posTitulo, posTitulo + 8000));
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
    throw errorDe('unavailable', 'resolver kdla pendiente', 'Kdramas.lat esconde los servidores detrás de JavaScript (la lista de capítulos también): es el pendiente gordo de la 0.4. Mira este dorama en DoramasLatinoX o en la otra fuente mientras tanto.');
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
    throw errorDe('unavailable', 'resolver yandi pendiente', 'Yandispoiler guarda sus servidores tras una aduana de JavaScript (el juego de las flores): es el otro pendiente de la 0.4. Mira este dorama en DoramasLatinoX mientras tanto.');
  }
});

/* ---------- fuente: doramaslatinox.com ---------- */

/* v0.3.3 (log 19:26 + sondeos): los capítulos de dlat pueden vivir bajo
 * OTRO slug que el de la ficha (when-i-meet-the-moon vs la ficha de la
 * luna — ya lo cantó la 0.2.2), y la propia ficha confiesa su «Nombre
 * inglés:» y «Nombre original:». De ahí salen candidatos slug-izados. */
function slugDeTexto(s) {
  let t = String(s || '').toLowerCase();
  try { t = t.normalize('NFD'); } catch (eN) { /* sin normalize: vale el texto tal cual */ }
  return t.replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function valorDeFichaTras(html, clave) {
  const t = String(html || '');
  const i = t.indexOf(clave);
  if (i < 0) return '';
  const trozo = t.slice(i + clave.length, i + clave.length + 240);
  const m = /(?:<\/[a-z]+>|:)\s*([A-Za-z0-9][^<>{}\n]{1,80})/i.exec(trozo);
  return m ? limpio(m[1]) : '';
}

function nombresDeFicha(html) {
  const t = String(html || '');
  const out = [];
  for (const k of ['Nombre inglés', 'Nombre original']) {
    const v = valorDeFichaTras(t, k);
    if (v && out.indexOf(v) < 0) out.push(v);
  }
  return out;
}

function slugsCandidatosDe(slug, fichaHtml) {
  const out = [String(slug || '')];
  for (const n of nombresDeFicha(fichaHtml)) {
    const cs = slugDeTexto(n);
    if (cs && out.indexOf(cs) < 0) out.push(cs);
  }
  return out.slice(0, 3);
}

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
/* v0.2.4 (Registro VI, log 01:49): la ficha de «cuando-encuentre la luna»
 * traía SU lista bajo el slug del vecino «amor-bajo-la-luz-de la luna» y
 * la cura se cayó al respaldo de búsqueda: la guarda exigía DOS vecinos
 * distintos y solo había UNO. Ahora un único vecino basta SI comparte
 * alguna palabra (≥3 letras) con el slug. Y como la barra lateral puede
 * meter episodios de otros shows, los vecinos se ordenan por palabras
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
    const fichaText = rta1 && rta1.ok && rta1.text ? String(rta1.text) : '';
    let eps = await episodiosDeHuellas([fichaText], slug);
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
    /* v0.3.3 (log 19:26 + sondeos): todo lo de arriba da 404 o vacío con
     * «La emperatriz divorciada» — pero la ficha CONFIESA «Nombre inglés:
     * The Remarried Empress». Candidatos slug-izados: página 1x1 del
     * nombre inglés y búsqueda CON ESPACIOS (WordPress ignora los
     * guiones en el s=; la sondea /?s=amor mostró resultados verdaderos
     * y hasta anclas /episodio/ de vecinos). Cada hallazgo al Registro. */
    if (!eps.length) {
      const candidatos = slugsCandidatosDe(slug, fichaText);
      for (const c of candidatos) {
        if (!c || c === slug) continue;
        const rc = await traerPagina(BASE_DLAT + '/episodio/' + c + '-1x1/', 12000);
        eps = rc && rc.ok ? episodiosDlat(rc.text, c) : [];
        if (eps.length) { log('dlat episodios ' + slug + ': la lista confesó bajo el nombre inglés «' + c + '» (página 1x1)'); return eps; }
      }
      for (const c of candidatos) {
        if (!c || c === slug) continue;
        const rq = await traerPagina(BASE_DLAT + '/?s=' + encodeURIComponent(c.replace(/-/g, ' ')), 10000);
        eps = rq && rq.ok ? await episodiosDeHuellas([rq.text], c) : [];
        if (eps.length) { log('dlat episodios ' + slug + ': la búsqueda con el nombre inglés «' + c + '» trajo la lista'); return eps; }
      }
    }
    if (!eps.length) throw errorDe('unavailable', 'dlat episodios sin patrón', 'DoramasLatinoX no listó capítulos para este título (las fuentes pueden tener catálogos distintos). Busca la serie en el Inicio o en las otras fuentes.');
    return eps;
  },

  /* v0.3.5: la captura viva, separada del Stream (la usa el resolver
   * principal Y las alternativas perezosas 'dlat2:' — memoria salvo
   * fresh). */
  async capturaDeEpisodio(idEp, fresco) {
    const id = String(idEp || '').trim();
    if (!fresco) {
      try {
        const memo = kino.storage && typeof kino.storage.get === 'function' ? kino.storage.get('djResolv:' + id) : null;
        if (memo && memo.media && memo.media.length && Number.isFinite(memo.t) && (Date.now() - memo.t) < 600000) return memo;
      } catch (eM) { /* la memoria nunca rompe */ }
    }
    if (kino.browser && typeof kino.browser.capture === 'function') {
      /* v0.3.6: las OPCIONES de la captura (Kino 0.9.54, contrato:
       * detrás de la guardia captureAll === true; un Kino viejo las
       * ignora y llama igual). autoplay concentra el sonido para que el
       * <video> asome (el log 23:43 cantó «the page showed nothing
       * playable» — el sitio arma el reproductor tras JavaScript y la
       * captura dormida no pesca nada); captureAll pescar TODOS los
       * servidores (el menú «Servidor» gana repuestos). */
      const opts = { timeoutMs: 25000, autoplay: true };
      if (kino.browser.captureAll === true) {
        opts.captureAll = true;
      }
      try {
        const cap = await kino.browser.capture(BASE_DLAT + '/episodio/' + id + '/', opts);
        const media = cap && Array.isArray(cap.media) ? cap.media : [];
        if (media.length) {
          const memo = { t: Date.now(), media: media.slice(0, 4), subs: cap.subtitles || [] };
          try { if (kino.storage && typeof kino.storage.set === 'function') kino.storage.set('djResolv:' + id, memo); } catch (eS) {}
          log('dlat resolver ' + id + ': la captura pescó ' + media.length + ' servidor(es) — ' + media.map(function (m) { return String(m.url || '').split('/')[2] || '?'; }).join(', '));
          return memo;
        }
        log('dlat resolver ' + id + ': la captura no pescó video');
      } catch (eC) {
        const codeC = (eC && eC.code) || '';
        if (codeC !== 'busy' && codeC !== 'blocked' && codeC !== 'not_allowed' && codeC !== 'timeout') log('dlat resolver ' + id + ': la captura falló: ' + ((eC && eC.message) || eC));
        else log('dlat resolver ' + id + ': la captura no pudo (' + codeC + ')');
      }
    } else {
      log('dlat resolver ' + id + ': sin navegador de captura en este Kino');
    }
    return null;
  },

  /* v0.3.5 «EL REPRODUCTOR ROBA EL SERVIDOR»: memoria primero (10 min),
   * captura después, y la fábrica streamDeCaptura arma el Stream con
   * copias perezosas etiquetadas. Sin nada: caída honesta que pide
   * reintentar (la captura a la segunda suele pescar). */
  async resolver(idEp) {
    const id = String(idEp || '').trim();
    if (!/^[a-z0-9-]+\d+x\d+$/i.test(id)) {
      throw errorDe('not_found', 'episodio inválido', 'Ese episodio ya no es válido. Vuelve a la lista de capítulos.');
    }
    /* memoria primero (10 min, lectura directa para poder meter el
     * mensajero de la 0.3.7 ANTES de la captura). */
    let memo = null;
    try {
      const rM = kino.storage && typeof kino.storage.get === 'function' ? kino.storage.get('djResolv:' + id) : null;
      if (rM && rM.media && rM.media.length && Number.isFinite(rM.t) && (Date.now() - rM.t) < 600000) memo = rM;
    } catch (eM) { /* la memoria nunca rompe */ }
    if (memo && memo.media && memo.media.length) {
      return streamDeCaptura(id, memo, true);
    }
    /* v0.3.7 «EL MENSAJERO DEL AJAX»: preguntar primero al admin-ajax
     * (2-5 s, barato); la captura SOLO si el mensajero no confiesa (75 s
     * de resolve alcanzan para ambos). El robo guarda su pesca en la
     * misma memoria 'djResolv:<id>'. */
    const robado = await roboDeCargador(id, false);
    if (robado && robado.media && robado.media.length) {
      return streamDeCaptura(id, robado, false);
    }
    const cap = await this.capturaDeEpisodio(id, true);
    if (cap && cap.media && cap.media.length) {
      return streamDeCaptura(id, cap, false);
    }
    throw errorDe('unavailable', 'resolver dlat sin video', 'El servidor de este episodio usa JavaScript que la captura no pescó esta vez. Reintenta (a la segunda suelen asomarse los enlaces) o mira el título en otra fuente.');
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
  /* v0.3.4: TESORO PARA LA PANTALLA — si una fuente contestó la lupa, su
   * memoria de la pantalla crece con una fila «Tus búsquedas» (la aduana
   * de la memoria fusiona; cualquier título hallado llena el bloque de
   * esa fuente en el lienzo propio, yandispoiler incluida: la lupa SÍ
   * puede usar el navegador oculto). */
  for (let iFu = 0; iFu < fuentes.length; iFu++) {
    const itemsLupa = (respuestas[iFu] && respuestas[iFu].items) || [];
    if (!itemsLupa.length) continue;
    const filaLupa = { id: 'lupa-' + fuentes[iFu].id, title: 'Tus búsquedas · ' + ((fuentes[iFu] && fuentes[iFu].etiqueta) || fuentes[iFu].id), ref: '', items: itemsLupa.slice(0, 20) };
    try { pantallaMemoriaSet(fuentes[iFu].id, [filaLupa]); } catch (eM) { /* la memoria nunca rompe la lupa */ }
  }
  if (!salida.length) log('search «' + q + '»: 0 resultados en las 3 fuentes (normal en la lupa: el sondeo contará cómo busca cada sitio)');
  return salida.slice(0, MAX_ITEMS);
}

/* La aduana del Inicio (escuela de la armadura 0.4.72): si una fuente
 * no trae nada, la fila avisa; el home NUNCA revienta entero. */
async function home() {
  const fuentes = fuentesActivas();
  const rtas = await Promise.all(fuentes.map(async (f) => {
    try {
      const filas = await f.portada(true);
      pantallaMemoriaSet(f.id, filas || []); /* v0.3.2: aliméntale la memoria a la pantalla */
      return filas;
    } catch (e) {
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
  /* v0.3.5: las copias perezosas del reproductor viajan con ref
   * 'dlat2:<id>:<index>' (captura SEPARADA del mismo episodio — el
   * contrato: cada ref de alternativa llama resolve(ref) entero cuando
   * Kino la necesita). Va ANTES de partirRef (dlat2 no es fuente). */
  const dlat2 = /^dlat2:([a-z0-9-]+\d+x\d+):(\d+)$/i.exec(String(ref || ''));
  if (dlat2) {
    return resolverAlternoDlat(dlat2[1], parseInt(dlat2[2], 10));
  }
  const p = partirRef(ref);
  if (!p || !FUENTES[p.fuente]) {
    throw kino.error('not_found', 'ref inválida', {
      userMessage: 'Ese título ya no es válido. Búscalo de nuevo.'
    });
  }
  if (!p.partes[0]) {
    throw kino.error('not_found', 'ref inválida', {
      userMessage: 'Ese título ya no es válido. Búscalo de nuevo.'
    });
  }
  return FUENTES[p.fuente].resolver(p.partes[0], 1, null);
}

/* v0.3.5: el ref perezoso 'dlat2:id:idx' — captura FRESCA (la memoria del
 * resolver devuelve SIEMPRE el principal; la alternativa necesita el
 * servidor idx) y se sirve media[idx] con la misma fábrica (que a su vez
 * etiqueta a los demás). */
async function resolverAlternoDlat(idEp, idx) {
  const f = FUENTES['dlat'];
  if (!f || typeof f.capturaDeEpisodio !== 'function') {
    throw errorDe('unavailable', 'alternativa no disponible', 'Ese servidor no está disponible ahora. Reintenta la reproducción.');
  }
  const cap = await f.capturaDeEpisodio(idEp, true);
  const media = (cap && Array.isArray(cap.media)) ? cap.media : [];
  const elegido = media[idx] || {};
  if (!elegido.url) throw errorDe('unavailable', 'alternativa no disponible', 'Ese servidor ya no sirve. Reintenta la reproducción.');
  const et2 = String(elegido.url).replace(/^https?:\/\//, '').split('/')[0];
  const st = { url: elegido.url, mime: elegido.mime || 'video/mp4', label: ('Servidor ' + (idx + 1) + ' · ' + (et2 || 'extra')).slice(0, 48) };
  if (elegido.headers && Object.keys(elegido.headers).length) st.headers = Object.assign({}, elegido.headers);
  if (cap && Array.isArray(cap.subs) && cap.subs.length) st.subtitles = cap.subs;
  log('dlat stream alterno ' + idEp + '#' + idx + ': ' + et2);
  return st;
}

// ---------- v0.3.7: EL MENSAJERO DEL AJAX ----------

/* v0.3.8: UNA sola candidata — la sondea v1 (teléfono, 01:09) cantó que
 * doo_player_ajax ES el action (status 200 con el JSON
 * {"embed_url":"","type":false}) y las cuatro variantes contestaron 400.
 * La puerta es esa; las llaves (combinaciones nume/sece/post) se prueban
 * dentro de roboDeCargador. */
const ACT_DLAT = 'doo_player_ajax';

/* El postid del episodio vive en el body class (single-post postid-NNNN)
 * o en un id="post-NNNN" asomando; helper tolerante. */
function pidDePagina(html) {
  const t = String(html || '');
  const m = /postid-(\d+)/i.exec(t) || /id=["']post-(\d+)["']/i.exec(t);
  return m ? parseInt(m[1], 10) : null;
}

/* Todo lo reproducible del HTML del mensajero (mp4/m3u8 directos) y las
 * pistas de los iframes que solo apuntan a reproductores ajenos (los
 * guardamos SOLO en el Registro: servir un iframe como Stream truena en
 * el reproductor de Kino; servimos lo que se pueda reproducir de verdad). */
function mediaDeCargador(txt) {
  const t = String(txt || '');
  const media = [];
  const reM = /https?:\/\/[^"'\s<>\\]+?\.(?:mp4|m3u8)(?:\?[^"'\s<>\\]*)?/gi;
  let mi;
  while ((mi = reM.exec(t)) !== null && media.length < 8) {
    const u = mi[0];
    let ya = false;
    for (const x of media) { if (x.url === u) { ya = true; break; } }
    if (!ya) media.push({ url: u, mime: /\.m3u8/i.test(u) ? 'application/x-mpegURL' : 'video/mp4', headers: { Referer: BASE_DLAT + '/' } });
  }
  const iframes = [];
  const reI = /<iframe[^>]+src=["']([^"']+)["']/gi;
  let ii;
  while ((ii = reI.exec(t)) !== null && iframes.length < 6) {
    const h = String(ii[1]).replace(/^https?:\/\//, '').split('/')[0];
    if (h && iframes.indexOf(h) < 0) iframes.push(h);
  }
  return { media: media, iframes: iframes };
}

/* La táctica de la 0.3.7: la página del episodio confiesa su postid, el
 * teléfono pregunta al mensajero (admin-ajax por POST, candidatas
 * clásicas) y lo que confiese viaja como Stream con Referer. La pesca
 * queda en la MISMA memoria 'djResolv:<id>' de la captura (10 min).
 * modoSonda=true escribe TODO en el Registro (scripts del tema, postid,
 * respuesta letra a letra de cada candidata): es la sondea nueva.
 * Sin postid o sin media: null limpio (la captura sigue de segundo resort). */
async function roboDeCargador(idEp, modoSonda) {
  const id = String(idEp || '').trim();
  const mx = /^([a-z0-9-]+?)(\d+)x(\d+)$/i.exec(id);
  if (!mx) return null;
  const sece = mx[2].replace(/^0+/, '') || '1';
  const nume = mx[3].replace(/^0+/, '') || '1';
  let html = '';
  try {
    const pagina = await traerEnCrudo(BASE_DLAT + '/episodio/' + id + '/', { escalera: false, timeoutMs: 12000 });
    html = pagina && pagina.text ? await pagina.text() : '';
  } catch (eP) {
    if (modoSonda) log('sonda cargador dlat: la página del episodio falló: ' + ((eP && eP.message) || eP));
    return null;
  }
  const pid = pidDePagina(html);
  if (modoSonda) {
    /* v0.3.8: la sondea ya NO recorta los scripts (la v1 dejó el cargador
     * fuera de la foto recortando en 500 chars): lista completa por
     * bloques + body íntegro + menciones de admin-ajax/doo_player/embed_url
     * del HTML con su contexto. */
    const srcs = (html.match(/src=["'][^"']+\.js[^"']*/gi) || []);
    const bodyTag = (/<body[^>]*>/.exec(html) || [''])[0];
    log('sonda cargador dlat ' + id + ': página ' + html.length + ' letras, postid=' + (pid || 'NINGUNO') + ', scripts TOTAL ' + srcs.length + ', body=' + bodyTag.slice(0, 400));
    for (let s0 = 0; s0 < srcs.length && s0 < 24; s0 += 6) {
      log('sonda cargador dlat scripts ' + (s0 + 1) + '-' + Math.min(s0 + 6, srcs.length) + ': ' + srcs.slice(s0, s0 + 6).join(' | ').slice(0, 900));
    }
    const oc = [];
    const reOc = /admin-ajax|doo_player|embed_url|box_links/gi;
    let mo;
    while ((mo = reOc.exec(html)) !== null && oc.length < 6) {
      oc.push(mo[0] + ' @' + mo.index + ': ' + html.slice(Math.max(0, mo.index - 80), mo.index + 140).replace(/\s+/g, ' '));
    }
    log('sonda cargador dlat menciones (' + oc.length + '): ' + (oc.length ? oc.join(' ;; ') : 'NINGUNA'));
  }
  if (!pid) return null;
  /* v0.3.8: COMBINACIONES del mensajero — la primera sondea (teléfono
   * 01:09) cantó que doo_player_ajax ES la puerta (200, JSON
   * {"embed_url":"","type":false}) pero con postid=6411&nume=6&sece=1 el
   * embed vino vacío. Probar: nume relleno, sin sece, y el postid de la
   * SERIE (algunos temas guardan el reproductor en la ficha de la serie,
   * no en el episodio; el postid de la serie se roba de su propia página
   * SOLO en modo sondea para no gastar fetch en cada play). */
  let pidSerie = null;
  if (modoSonda) {
    try {
      const serieEnlace = (html.match(/https?:\/\/[^"'\s]+\/series\/[a-z0-9-]+\//i) || [])[0];
      if (serieEnlace) {
        const pgS = await traerEnCrudo(serieEnlace.replace(/[>"']*$/, ''), { escalera: false, timeoutMs: 12000 });
        const hS = pgS && pgS.text ? await pgS.text() : '';
        pidSerie = pidDePagina(hS);
        log('sonda cargador dlat: la SERIE ' + serieEnlace.replace(/^https?:\/\//, '') + ' confiesa postid=' + (pidSerie || 'NINGUNO'));
      }
    } catch (eSR) { log('sonda cargador dlat: la página de la serie falló: ' + ((eSR && eSR.message) || eSR)); }
  }
  const numePad = (nume.length < 2 ? '0' + nume : nume);
  const combos = [
    { post: pid, nume: nume, sece: sece },
    { post: pid, nume: nume },
    { post: pid, nume: numePad, sece: sece }
  ];
  if (pidSerie) combos.push({ post: pidSerie, nume: nume, sece: sece });
  const poses = [];
  for (let ci = 0; ci < combos.length; ci++) {
    const combo = combos[ci];
    const cuerpo = 'action=' + ACT_DLAT + '&post=' + combo.post + '&nume=' + combo.nume + (combo.sece ? '&sece=' + combo.sece : '');
    let txt = '';
    let st = 0;
    try {
      const r = await kino.fetch(BASE_DLAT + '/wp-admin/admin-ajax.php', {
        method: 'POST',
        headers: { Accept: '*/*', 'content-type': 'application/x-www-form-urlencoded', Referer: BASE_DLAT + '/episodio/' + id + '/' },
        body: cuerpo,
        timeoutMs: 12000
      });
      st = (r && r.status) || 0;
      txt = r && r.text ? await r.text() : '';
    } catch (eA) {
      if (modoSonda) log('sonda cargador dlat: ' + cuerpo + ' FALLÓ: ' + ((eA && eA.message) || eA));
      continue;
    }
    /* v0.3.8: el mensajero puede confesar un embed directo ({"embed_url":
     * "https://short.ink/…", "type": …}) — mp4/m3u8 SÍ vale como media;
     * un embed de reproductor ajeno (abyssplayer/short.ink según el
     * replace-domain.js) queda SOLO de pista: servirlo como Stream truena
     * en el reproductor de Kino. */
    let embedConfesado = null;
    const t2 = String(txt || '').trim();
    if (t2.charAt(0) === '{') {
      try {
        const j = JSON.parse(t2);
        if (j && typeof j.embed_url === 'string' && j.embed_url) embedConfesado = j.embed_url;
      } catch (eJ) { /* no era json */ }
    }
    const mH = mediaDeCargador(txt);
    if (embedConfesado && /\.(mp4|m3u8)/i.test(embedConfesado) && mH.media.length === 0) {
      mH.media.push({ url: embedConfesado, mime: /\.m3u8/i.test(embedConfesado) ? 'application/x-mpegURL' : 'video/mp4', headers: { Referer: BASE_DLAT + '/' } });
    }
    if (modoSonda) log('sonda cargador dlat: ' + cuerpo + ' → status ' + st + ', ' + txt.length + ' letras, media=' + mH.media.length + (embedConfesado ? ', embed: ' + embedConfesado : '') + (mH.iframes.length ? ', iframes: ' + mH.iframes.join(', ') : '') + ' · ' + t2.slice(0, 160).replace(/\s+/g, ' '));
    poses.push(cuerpo);
    if (mH.media.length) {
      const memo = { t: Date.now(), media: mH.media, subs: [], via: 'ajax' };
      try { if (kino.storage && typeof kino.storage.set === 'function') kino.storage.set('djResolv:' + id, memo); } catch (eS) { /* la memoria nunca rompe */ }
      log('dlat robo ' + id + ': el mensajero confesó ' + memo.media.length + ' enlace(s) (' + cuerpo.slice(0, 60) + ')');
      return memo;
    }
  }
  if (modoSonda) log('sonda cargador dlat: ninguna combinación entregó media (' + poses.join(' | ') + ')');
  return null;
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
  if (key === 'sondaDlatAjax') {
    /* v0.3.7 «EL MENSAJERO DEL AJAX»: la sondea del cargador — el teléfono
     * corre la táctica del ajax en modo diagnosticador (sin navegar, sin
     * captura) y TODO confesión queda en el Registro. */
    try {
      const res = await roboDeCargador('erase-un-amor-rural-1x6', true);
      return { message: res ? 'La sondea del cargador PESCÓ: hay media en el Registro. Mándame el Registro (Ajustes ▸ Registro de DoramasJing) y afino el robo final.' : 'La sondea del cargador terminó sin pesca: TODO lo que confesó (o negó) quedó en el Registro. Mándame el Registro (Ajustes ▸ Registro de DoramasJing) y afino la táctica.' };
    } catch (eS) {
      return { message: 'La sondea del cargador falló: ' + ((eS && eS.message) || eS) + '. Mándame el Registro igual.' };
    }
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
/* La memoria de la pantalla: filas recortadas con marca de tiempo. La
 * pantalla NO puede usar el navegador oculto (la plataforma lo niega fuera
 * de search/home/browse/episodes/details/section/resolve), así que las
 * fuentes que dependen de él (yandi) se sirven de lo guardado en
 * cualquier flujo en que el teléfono sí pudo (escuela AniJing, memoria
 * de secciones). */
function pantallaMemoriaSet(fid, filas) {
  try {
    if (!kino.storage || typeof kino.storage.set !== 'function' || !Array.isArray(filas) || !filas.length) return;
    const delgadas = filas.slice(0, 4).map(function (fila) {
      return { id: fila.id, title: fila.title, ref: fila.ref, items: (fila.items || []).slice(0, 20) };
    });
    if (!delgadas.length) return;
    /* v0.3.4: la memoria se engorda con cariño — la fila de la lupa se
     * SUMA sin pisar las de la portada (fuera duplicados por id, tope
     * de 6 filas por fuente). */
    const prev = pantallaMemoriaGet(fid);
    let fin = delgadas;
    if (prev && Array.isArray(prev.filas) && prev.filas.length) {
      const viejas = prev.filas.filter(function (x) {
        return x && x.id && delgadas.every(function (d) { return d.id !== x.id; });
      });
      fin = delgadas.concat(viejas).slice(0, 6);
    }
    kino.storage.set('djMemoria:' + fid, { t: Date.now(), filas: fin });
  } catch (e) { /* la memoria falla sin miedo */ }
}

function pantallaMemoriaGet(fid) {
  try {
    const raw = (kino.storage && typeof kino.storage.get === 'function') ? kino.storage.get('djMemoria:' + fid) : null;
    if (!raw || typeof raw !== 'object' || !Array.isArray(raw.filas) || !raw.filas.length) return null;
    return raw;
  } catch (e) { return null; }
}

function pantallaEdad(t) {
  const mins = Number.isFinite(t) ? Math.round((Date.now() - t) / 60000) : -1;
  if (mins < 0) return 'edad desconocida';
  if (mins < 60) return 'de hace ' + mins + ' min';
  return 'de hace ' + Math.round(mins / 60) + ' h';
}

async function pantallaCargar(fuente) {
  const elegida = fuenteValidaPantalla(fuente) || 'todas';
  const fuentes = (elegida !== 'todas' && FUENTES[elegida]) ? [FUENTES[elegida]] : Object.values(FUENTES);
  const rtas = await Promise.all(fuentes.map(async (f) => {
    let filas = null;
    try {
      filas = await f.portada(true);
      for (const fila of filas || []) fila.fuente = f.id;
    } catch (e) {
      log('portada falló en ' + f.id + ' (pantalla)', (e && e.message) || String(e));
    }
    /* v0.3.2: la memoria pesca EN LOS DOS CASOS — la fuente que TIRA y
     * la fuente que se traga su error y devuelve vacía (la casita
     * de yandi devolvía [] sin vomitar jamás). */
    if (filas && filas.length) {
      pantallaMemoriaSet(f.id, filas);
      return filas;
    }
    const mem = pantallaMemoriaGet(f.id);
    if (mem) {
      log('la pantalla usó la memoria de ' + f.id + ' (' + pantallaEdad(mem.t) + ')');
      for (const fila of mem.filas) fila.fuente = f.id;
      return mem.filas;
    }
    return [];
  }));
  const filas = [];
  for (let i = 0; i < fuentes.length; i++) {
    const nom = (fuentes[i] && fuentes[i].etiqueta) || 'la fuente';
    if (rtas[i] && rtas[i].length) for (const fila of rtas[i]) filas.push(fila);
    /* v0.3.3 (capturas 19:26): «sin datos por ahora» no decía CÓMO salir
     * del hoyo. El aviso ahora manda al Inicio o a la lupa: ese camino sí
     * puede usar el navegador oculto y llena la memoria de la pantalla. */
    else filas.push({ id: 'aviso-' + (fuentes[i] ? fuentes[i].id : 'x'), fuente: fuentes[i] ? fuentes[i].id : 'x', title: nom + ': sin datos por ahora — pasa por el Inicio o busca un título de esta fuente y regresa (eso llena la memoria)', ref: '', items: [] });
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
