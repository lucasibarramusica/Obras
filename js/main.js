/* ==========================================================================
   LUCAS IBARRA - main.js
   --------------------------------------------------------------------------
   Este archivo NO tiene contenido: solo comportamiento.
   El contenido (videos, canciones, obras, links) esta en js/datos.js.

   Lo que hace:
     1. Header: al scrollear se transforma en un menu hamburguesa discreto.
     2. Menu: pantalla completa, se cierra con Esc, click afuera o la X.
     3. Arma las listas de videos / shorts / canciones / obras leyendo DATOS.
     4. Carruseles con flechas, arrastre y deslizamiento en telefono.
     5. Reproductores: YouTube se carga recien al tocar la miniatura
        (la pagina arranca liviana) y Spotify se inserta si hay id cargado.
     6. Animacion suave de aparicion al scrollear.

   Todo respeta "prefiero menos animacion" del sistema operativo.
   ========================================================================== */

'use strict';

/* ==========================================================================
   NAVEGACION: una sola lista, usada por el header y por el menu
   ========================================================================== */

const PAGINAS = [
  { id: 'inicio',    texto: 'Inicio',    url: 'index.html'     },
  { id: 'canciones', texto: 'Canciones', url: 'canciones.html' },
  { id: 'videos',    texto: 'Videos',    url: 'videos.html'    },
  { id: 'obras',     texto: 'Obras',     url: 'obras.html'     },
  { id: 'estudio',   texto: 'Estudio',   url: 'estudio.html'   }
];


/* ==========================================================================
   AYUDANTES CHICOS
   ========================================================================== */

const $  = (sel, raiz = document) => raiz.querySelector(sel);
const $$ = (sel, raiz = document) => Array.from(raiz.querySelectorAll(sel));

/* Escapa texto antes de meterlo en HTML. */
function esc(valor) {
  return String(valor ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* "2026-03-14" -> "14 mar 2026" */
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun',
               'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function fechaCorta(iso) {
  if (!iso) return '';
  const p = String(iso).split('-');
  if (p.length < 3) return iso;
  return `${Number(p[2])} ${MESES[Number(p[1]) - 1]} ${p[0]}`;
}

/* Numero de orden: 1 -> "01" */
const indice = (n) => String(n + 1).padStart(2, '0');

/* Miniatura de YouTube. Los shorts tienen su propia version vertical. */
function miniatura(id, vertical) {
  return vertical
    ? `https://i.ytimg.com/vi/${id}/oardefault.jpg`
    : `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}
const miniaturaRespaldo = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/* ¿El sistema pidio menos animacion? (con red de seguridad por si el
   navegador no tiene matchMedia) */
const menosMovimiento = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Icono de play, reutilizado en todos los reproductores. */
const ICONO_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';


/* ==========================================================================
   1. HEADER
   --------------------------------------------------------------------------
   Arriba de todo el header se ve entero. Apenas se scrollea se encoge y se
   convierte en dos pastillas con fondo difuminado: la marca a la izquierda y
   la hamburguesa a la derecha. Se ve, pero no tapa nada.
   ========================================================================== */

function iniciarHeader() {
  const header = $('.encabezado');
  if (!header) return;

  let compacto = false;
  const UMBRAL = 40;   // pixeles de scroll antes de encogerse

  function alScrollear() {
    const debeCompactar = window.scrollY > UMBRAL;
    if (debeCompactar === compacto) return;      // evita tocar el DOM de mas
    compacto = debeCompactar;
    header.classList.toggle('esta-compacto', compacto);
  }

  alScrollear();
  window.addEventListener('scroll', alScrollear, { passive: true });
}


/* ==========================================================================
   2. MENU HAMBURGUESA
   --------------------------------------------------------------------------
   El panel se arma aca (y no en cada .html) para que las cinco paginas
   tengan siempre el mismo menu sin tener que copiar y pegar nada.
   ========================================================================== */

function iniciarMenu() {
  const boton = $('.hamburguesa');
  if (!boton) return;

  const actual = document.body.dataset.pagina || '';
  const enlaces = DATOS.artista.enlaces || {};

  /* ---- Panel ---- */
  const panel = document.createElement('div');
  panel.className = 'menu';
  panel.id = 'menu-principal';
  panel.hidden = true;

  const externos = [
    ['YouTube',   enlaces.youtube],
    ['Spotify',   enlaces.spotify],
    ['Instagram', enlaces.instagram],
    ['WhatsApp',  enlaces.whatsapp ? `https://wa.me/${enlaces.whatsapp}` : ''],
    ['Email',     enlaces.email ? `mailto:${enlaces.email}` : '']
  ].filter(([, url]) => url);

  panel.innerHTML = `
    <div class="menu__fondo" data-cerrar></div>
    <nav class="menu__panel" aria-label="Menú principal">
      <div class="menu__encabezado">
        <span class="micro">${esc(DATOS.artista.lugar)}</span>
        <button class="menu__cerrar" type="button" data-cerrar aria-label="Cerrar menú">
          <span></span><span></span>
        </button>
      </div>

      <ul class="menu__lista">
        ${PAGINAS.map((p, i) => `
          <li class="menu__item" style="--i:${i}">
            <a href="${p.url}"${p.id === actual ? ' aria-current="page"' : ''}>
              <span class="menu__num">${indice(i)}</span>
              <span class="menu__texto">${esc(p.texto)}</span>
            </a>
          </li>`).join('')}
      </ul>

      <div class="menu__pie">
        <p class="micro menu__pie-titulo">Escuchar y seguir</p>
        <div class="menu__externos">
          ${externos.map(([nombre, url]) => `
            <a href="${esc(url)}" target="_blank" rel="noopener">${esc(nombre)} <i>&#8599;</i></a>
          `).join('')}
        </div>
      </div>
    </nav>`;

  document.body.appendChild(panel);

  /* ---- Abrir y cerrar ---- */
  let ultimoFoco = null;

  function abrir() {
    ultimoFoco = document.activeElement;
    panel.hidden = false;
    // Un cuadro de espera para que la animacion de entrada se vea.
    requestAnimationFrame(() => panel.classList.add('esta-abierto'));
    document.body.classList.add('sin-scroll');
    boton.setAttribute('aria-expanded', 'true');
    const primero = $('.menu__lista a', panel);
    if (primero) primero.focus();
  }

  function cerrar() {
    panel.classList.remove('esta-abierto');
    document.body.classList.remove('sin-scroll');
    boton.setAttribute('aria-expanded', 'false');

    const ocultar = () => { panel.hidden = true; };
    if (menosMovimiento()) ocultar();
    else setTimeout(ocultar, 350);   // igual a la transicion del CSS

    if (ultimoFoco) ultimoFoco.focus();
  }

  boton.addEventListener('click', () => {
    panel.hidden ? abrir() : cerrar();
  });

  panel.addEventListener('click', (e) => {
    if (e.target.closest('[data-cerrar]') || e.target.closest('.menu__lista a')) cerrar();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) cerrar();
  });

  /* El foco no se escapa del menu mientras esta abierto. */
  panel.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focos = $$('a, button', panel).filter((n) => n.offsetParent !== null);
    if (!focos.length) return;
    const primero = focos[0];
    const ultimo  = focos[focos.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
}


/* ==========================================================================
   3. REPRODUCTORES
   ========================================================================== */

/* ---- YouTube: miniatura primero, iframe recien al tocarla -------------- */

function plantillaReproductorYT(video, opciones = {}) {
  const { id, titulo = '', duracion = '' } = video;
  const vertical = !!video.vertical;
  const grande   = !!opciones.grande;

  return `
    <div class="reproductor ${vertical ? 'reproductor--vertical' : ''} ${grande ? 'reproductor--grande' : ''}" data-video="${esc(id)}">
      <button class="reproductor__boton" type="button" aria-label="Reproducir: ${esc(titulo)}">
        <img class="reproductor__img"
             src="${miniatura(id, vertical)}"
             data-respaldo="${miniaturaRespaldo(id)}"
             alt=""
             ${grande ? 'fetchpriority="high"' : 'loading="lazy"'}
             decoding="async"/>
        <span class="reproductor__velo"></span>
        <span class="reproductor__play">${ICONO_PLAY}</span>
        ${duracion ? `<span class="reproductor__duracion">${esc(duracion)}</span>` : ''}
      </button>
    </div>`;
}

/* Cambia la miniatura por el iframe real de YouTube. */
function reproducir(caja) {
  const id = caja.dataset.video;
  if (!id || caja.dataset.reproduciendo === '1') return;
  caja.dataset.reproduciendo = '1';

  const iframe = document.createElement('iframe');
  // youtube-nocookie: el modo de privacidad reforzada del propio YouTube.
  iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
  iframe.title = 'Reproductor de YouTube';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  caja.replaceChildren(iframe);
}

/* Un solo escuchador para toda la pagina, aunque las tarjetas se creen despues. */
function iniciarReproductores() {
  document.addEventListener('click', (e) => {
    const boton = e.target.closest('.reproductor__boton');
    if (boton) reproducir(boton.closest('.reproductor'));
  });

  /* Si una miniatura no existe (pasa con videos viejos), se usa la de respaldo.
     Ojo: cuando falta la version grande, YouTube NO devuelve un error: manda
     una imagen gris de 120x90. Por eso no alcanza con escuchar 'error' y hay
     que mirar tambien el tamaño real de lo que llego. */
  const arreglar = (img) => {
    if (!img.dataset.respaldo || img.dataset.arreglada === '1') return;
    img.dataset.arreglada = '1';
    img.src = img.dataset.respaldo;
  };

  const comprobar = (img) => {
    if (img.naturalWidth === 0 || img.naturalWidth <= 120) arreglar(img);
  };

  const revisar = () => $$('.reproductor__img[data-respaldo]').forEach((img) => {
    if (img.dataset.ligada === '1') return;
    img.dataset.ligada = '1';
    img.addEventListener('error', () => arreglar(img));
    img.addEventListener('load', () => comprobar(img));
    if (img.complete) comprobar(img);
  });

  revisar();
  // Las tarjetas se arman con JS, asi que se revisa de nuevo al terminar.
  document.addEventListener('contenido-listo', revisar);
}


/* ---- Spotify ---------------------------------------------------------- */

function plantillaSpotify(spotify) {
  if (!spotify || !spotify.id) return '';
  const tipo = spotify.tipo || 'track';
  const alto = tipo === 'track' ? 152 : 352;
  return `
    <iframe class="spotify ${tipo === 'track' ? 'spotify--simple' : ''}"
            style="height:${alto}px"
            src="https://open.spotify.com/embed/${esc(tipo)}/${esc(spotify.id)}?theme=0"
            title="Reproductor de Spotify"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"></iframe>`;
}

/* Cartel elegante para cuando todavia no hay nada que reproducir. */
function plantillaAviso(texto) {
  const yt = DATOS.artista.enlaces.youtube;
  return `
    <div class="aviso">
      <span class="aviso__punto"></span>
      <p>${esc(texto)}</p>
      ${yt ? `<a class="enlace-ext" href="${esc(yt)}" target="_blank" rel="noopener">Mientras tanto, el canal <i>&#8599;</i></a>` : ''}
    </div>`;
}

/* Elige el reproductor que corresponda: Spotify > YouTube > aviso. */
function plantillaEscucha(item, opciones = {}) {
  if (item.spotify && item.spotify.id) return plantillaSpotify(item.spotify);
  if (item.youtube) return plantillaReproductorYT({ id: item.youtube, titulo: item.titulo, vertical: item.vertical }, opciones);
  return plantillaAviso(opciones.aviso || 'El reproductor aparece apenas se publique.');
}


/* ==========================================================================
   4. TARJETAS
   ========================================================================== */

function tarjetaVideo(video, opciones = {}) {
  const modo = opciones.modo || 'reproducir';   // 'reproducir' o 'enlace'
  const meta = [video.categoria, fechaCorta(video.fecha)].filter(Boolean).join(' · ');

  const interior = `
    <div class="tarjeta__media">
      ${modo === 'reproducir'
        ? plantillaReproductorYT(video)
        : `<img src="${miniatura(video.id, video.vertical)}"
                data-respaldo="${miniaturaRespaldo(video.id)}"
                class="reproductor__img" alt="" loading="lazy" decoding="async"/>
           <span class="tarjeta__play">${ICONO_PLAY}</span>
           ${video.duracion ? `<span class="reproductor__duracion">${esc(video.duracion)}</span>` : ''}`}
    </div>
    <div class="tarjeta__cuerpo">
      ${meta ? `<p class="tarjeta__meta">${esc(meta)}</p>` : ''}
      <h3 class="tarjeta__titulo">${esc(video.titulo)}</h3>
      ${video.autor ? `<p class="tarjeta__autor">${esc(video.autor)}</p>` : ''}
    </div>`;

  if (modo === 'enlace') {
    return `<article class="tarjeta tarjeta--enlace ${video.vertical ? 'tarjeta--vertical' : ''}">
              <a class="tarjeta__capa" href="videos.html">${interior}</a>
            </article>`;
  }
  return `<article class="tarjeta ${video.vertical ? 'tarjeta--vertical' : ''}">${interior}</article>`;
}


/* ==========================================================================
   5. CARRUSEL
   --------------------------------------------------------------------------
   Se apoya en el scroll nativo (asi el deslizamiento en telefono es el del
   sistema, suave y conocido) y le suma flechas, arrastre con el mouse y una
   barrita de progreso.
   ========================================================================== */

function envolverCarrusel(html, opciones = {}) {
  const { vertical = false, etiqueta = 'Carrusel' } = opciones;
  return `
    <div class="carrusel ${vertical ? 'carrusel--vertical' : ''}" data-carrusel>
      <div class="carrusel__pista" data-pista tabindex="0" role="region"
           aria-label="${esc(etiqueta)}">${html}</div>
      <div class="carrusel__controles">
        <div class="carrusel__progreso"><span data-barra></span></div>
        <div class="carrusel__flechas">
          <button class="carrusel__flecha" type="button" data-dir="-1" aria-label="Anterior">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
          </button>
          <button class="carrusel__flecha" type="button" data-dir="1" aria-label="Siguiente">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>`;
}

function iniciarCarrusel(raiz) {
  const pista = $('[data-pista]', raiz);
  const barra = $('[data-barra]', raiz);
  if (!pista) return;

  const flechas = $$('.carrusel__flecha', raiz);

  function paso() {
    const primera = pista.firstElementChild;
    if (!primera) return pista.clientWidth * 0.8;
    const separacion = parseFloat(getComputedStyle(pista).columnGap || '0') || 0;
    return primera.getBoundingClientRect().width + separacion;
  }

  function actualizar() {
    const max = pista.scrollWidth - pista.clientWidth;
    const avance = max > 1 ? pista.scrollLeft / max : 1;
    if (barra) barra.style.transform = `scaleX(${Math.max(0.08, avance || 0.08)})`;

    flechas.forEach((b) => {
      const dir = Number(b.dataset.dir);
      const fin = dir < 0 ? pista.scrollLeft <= 2 : pista.scrollLeft >= max - 2;
      b.disabled = max < 2 || fin;
    });
    raiz.classList.toggle('sin-desborde', max < 2);
  }

  flechas.forEach((b) => b.addEventListener('click', () => {
    pista.scrollBy({ left: Number(b.dataset.dir) * paso(), behavior: menosMovimiento() ? 'auto' : 'smooth' });
  }));

  pista.addEventListener('scroll', actualizar, { passive: true });
  window.addEventListener('resize', actualizar);

  /* Arrastrar con el mouse, como en una galeria de escritorio. */
  let arrastrando = false, inicioX = 0, inicioScroll = 0, movio = false;

  pista.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') return;          // en tactil manda el sistema
    arrastrando = true; movio = false;
    inicioX = e.clientX; inicioScroll = pista.scrollLeft;
    pista.classList.add('esta-arrastrando');
  });

  pista.addEventListener('pointermove', (e) => {
    if (!arrastrando) return;
    const delta = e.clientX - inicioX;
    if (Math.abs(delta) > 4) movio = true;
    pista.scrollLeft = inicioScroll - delta;
  });

  const soltar = () => {
    if (!arrastrando) return;
    arrastrando = false;
    pista.classList.remove('esta-arrastrando');
  };
  pista.addEventListener('pointerup', soltar);
  pista.addEventListener('pointerleave', soltar);
  pista.addEventListener('pointercancel', soltar);

  /* Si el mouse arrastro, no cuenta como click sobre la tarjeta.
     Se escucha en window y en fase de captura para adelantarse a cualquier
     otro manejador (por ejemplo el de la lista de reproduccion). */
  window.addEventListener('click', (e) => {
    if (!movio) return;
    if (!e.target.closest || e.target.closest('[data-pista]') !== pista) return;
    e.preventDefault();
    e.stopPropagation();
    movio = false;
  }, true);

  actualizar();
  // Las miniaturas cambian el ancho al cargar: se recalcula una vez mas.
  setTimeout(actualizar, 400);
}


/* ==========================================================================
   6. BLOQUES QUE SE ARMAN SOLOS
   --------------------------------------------------------------------------
   En el HTML alcanza con poner, por ejemplo:
       <div data-montar="videos-carrusel"></div>
   y aca abajo se define que dibuja cada nombre.
   ========================================================================== */

const BLOQUES = {

  /* ---- Video mas nuevo, grande ---- */
  'video-destacado'(caja) {
    const video = DATOS.videos[0];
    if (!video) return;

    caja.innerHTML = `
      <article class="destacado" data-destacado>
        <div class="destacado__media">
          ${plantillaReproductorYT(video, { grande: true })}
        </div>
        <div class="destacado__info">
          <p class="etiqueta etiqueta--vivo">Último video${video.categoria ? ` · ${esc(video.categoria)}` : ''}</p>
          <h3 class="destacado__titulo" data-destacado-titulo>${esc(video.titulo)}</h3>
          <p class="destacado__texto" data-destacado-texto>${esc(video.descripcion || '')}</p>
          <div class="destacado__pie">
            <span class="micro" data-destacado-fecha>${esc(fechaCorta(video.fecha))}</span>
            <a class="enlace-ext" data-destacado-enlace
               href="https://www.youtube.com/watch?v=${esc(video.id)}"
               target="_blank" rel="noopener">Ver en YouTube <i>&#8599;</i></a>
          </div>
        </div>
      </article>`;
  },

  /* ---- Resto de los videos, en carrusel ---- */
  'videos-carrusel'(caja) {
    const resto = DATOS.videos.slice(1);
    if (!resto.length) return;

    // 'enlace' = la tarjeta lleva a otra pagina.
    // 'reproducir' y 'lista' dibujan igual; la diferencia la hace el JS de
    // videos.html, que manda el video al reproductor grande de arriba.
    const modo = caja.dataset.modo === 'enlace' ? 'enlace' : 'reproducir';
    caja.innerHTML = envolverCarrusel(
      resto.map((v) => tarjetaVideo(v, { modo })).join(''),
      { etiqueta: 'Videos anteriores' }
    );
  },

  /* ---- Shorts verticales ---- */
  'shorts-carrusel'(caja) {
    const shorts = (DATOS.shorts || []).map((s) => ({ ...s, vertical: true }));
    if (!shorts.length) return;

    caja.innerHTML = envolverCarrusel(
      shorts.map((s) => tarjetaVideo(s, { modo: 'reproducir' })).join(''),
      { vertical: true, etiqueta: 'Shorts' }
    );
  },

  /* ---- Lanzamiento destacado del inicio ---- */
  'lanzamiento'(caja) {
    const l = DATOS.lanzamiento;
    if (!l) return;

    caja.innerHTML = `
      <div class="lanzamiento">
        <div class="lanzamiento__portada">
          <img src="${esc(l.portada)}" alt="Portada de ${esc(l.titulo)}" loading="lazy" decoding="async"/>
          <span class="lanzamiento__sello">${esc(l.tipo)} · ${esc(l.anio)}</span>
        </div>
        <div class="lanzamiento__info">
          <p class="etiqueta">Último lanzamiento</p>
          <h3 class="lanzamiento__titulo serif">${esc(l.titulo)}</h3>
          <p class="lanzamiento__autor">${esc(DATOS.artista.nombre)}${l.estado ? ` — ${esc(l.estado)}` : ''}</p>
          <p class="lanzamiento__texto">${esc(l.descripcion || '')}</p>
          <div class="lanzamiento__player">
            ${plantillaEscucha(l, { aviso: 'El reproductor aparece acá apenas se publique el single.' })}
          </div>
        </div>
      </div>`;
  },

  /* ---- Canciones: titulo, descripcion y reproductor abajo ---- */
  'canciones'(caja) {
    const lista = DATOS.canciones || [];
    const limite = Number(caja.dataset.limite) || lista.length;

    caja.innerHTML = lista.slice(0, limite).map((c, i) => `
      <article class="cancion ${c.destacada ? 'cancion--destacada' : ''}" data-revelar>
        <div class="cancion__cabecera">
          <span class="cancion__num">${indice(i)}</span>
          <div class="cancion__titulos">
            <p class="etiqueta">${esc(c.etiqueta || '')}${c.anio ? ` · ${esc(c.anio)}` : ''}</p>
            <h2 class="cancion__titulo">${esc(c.titulo)}</h2>
            ${c.autor ? `<p class="cancion__autor">${esc(c.autor)}</p>` : ''}
          </div>
        </div>
        ${c.descripcion ? `<p class="cancion__texto">${esc(c.descripcion)}</p>` : ''}
        <div class="cancion__player ${c.vertical ? 'cancion__player--vertical' : ''}">
          ${plantillaEscucha(c, { aviso: 'Todavía no está publicada. Muy pronto.' })}
        </div>
      </article>`).join('');
  },

  /* ---- Obras: bloques alternados ---- */
  'obras'(caja) {
    const lista = DATOS.obras || [];
    const limite = Number(caja.dataset.limite) || lista.length;
    const detallado = caja.dataset.detalle === 'si';

    caja.innerHTML = lista.slice(0, limite).map((o, i) => {
      const media = o.youtube
        ? plantillaReproductorYT({ id: o.youtube, titulo: o.titulo, vertical: o.vertical })
        : `<img src="${esc(o.imagen || 'Images/lucas_3.webp')}" alt="${esc(o.titulo)}" loading="lazy" decoding="async"/>`;

      const externo = /^https?:/.test(o.enlace || '');

      return `
        <article class="obra ${o.vertical ? 'obra--vertical' : ''}" data-revelar>
          <div class="obra__media">${media}</div>
          <div class="obra__info">
            <p class="etiqueta">${esc(o.tipo || '')}${o.anio ? ` · ${esc(o.anio)}` : ''}</p>
            <h2 class="obra__titulo">${esc(o.titulo)}</h2>
            ${o.estado ? `<span class="chip chip--rojo">${esc(o.estado)}</span>` : ''}
            <p class="obra__texto">${esc(detallado ? (o.detalle || o.resumen) : o.resumen)}</p>
            ${o.enlace ? `
              <a class="enlace-ext" href="${esc(o.enlace)}"${externo ? ' target="_blank" rel="noopener"' : ''}>
                ${esc(o.textoEnlace || 'Ver más')} <i>&#8599;</i>
              </a>` : ''}
          </div>
          <span class="obra__num">${indice(i)}</span>
        </article>`;
    }).join('');
  },

  /* ---- Formacion del estudio ---- */
  'formacion'(caja) {
    const lista = (DATOS.estudio && DATOS.estudio.formacion) || [];
    caja.innerHTML = lista.map((f) => `
      <li class="hito" data-revelar>
        <span class="hito__anio">${esc(f.anio)}</span>
        <div>
          <h3 class="hito__titulo">${esc(f.titulo)}</h3>
          ${f.lugar ? `<p class="hito__lugar">${esc(f.lugar)}</p>` : ''}
        </div>
      </li>`).join('');
  },

  /* ---- Lo que se puede hacer en el estudio ---- */
  'servicios'(caja) {
    const lista = (DATOS.estudio && DATOS.estudio.servicios) || [];
    caja.innerHTML = lista.map((s, i) => `
      <li class="servicio" data-revelar>
        <span class="servicio__num">${indice(i)}</span>
        <h3 class="servicio__titulo">${esc(s.titulo)}</h3>
        <p class="servicio__texto">${esc(s.texto)}</p>
      </li>`).join('');
  },

  /* ---- Cinta de repertorio ---- */
  'repertorio'(caja) {
    const nombres = DATOS.repertorio || [];
    if (!nombres.length) return;
    // Se repite dos veces para que el bucle no tenga corte visible.
    const tira = nombres.map((n) => `<span>${esc(n)}</span>`).join('<i>&#9679;</i>');
    caja.innerHTML = `
      <div class="cinta" aria-label="Repertorio">
        <div class="cinta__pista" aria-hidden="true">${tira}<i>&#9679;</i>${tira}<i>&#9679;</i></div>
      </div>`;
  },

  /* ---- Botones de escucha y contacto ---- */
  'enlaces'(caja) {
    const e = DATOS.artista.enlaces || {};
    const botones = [
      ['YouTube',   e.youtube,   'principal'],
      ['Spotify',   e.spotify,   'secundario'],
      ['Instagram', e.instagram, 'secundario'],
      ['WhatsApp',  e.whatsapp ? `https://wa.me/${e.whatsapp}` : '', 'secundario'],
      ['Escribir',  e.email ? `mailto:${e.email}` : '', 'secundario']
    ].filter(([, url]) => url);

    caja.innerHTML = botones.map(([nombre, url, estilo]) => `
      <a class="boton boton--${estilo}" href="${esc(url)}"${url.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${esc(nombre)}</a>
    `).join('');
  }
};

function montarBloques() {
  $$('[data-montar]').forEach((caja) => {
    const fn = BLOQUES[caja.dataset.montar];
    if (fn) {
      try { fn(caja); }
      catch (err) { console.error('No se pudo armar el bloque', caja.dataset.montar, err); }
    }
  });

  $$('[data-carrusel]').forEach(iniciarCarrusel);
  document.dispatchEvent(new CustomEvent('contenido-listo'));
}


/* ==========================================================================
   7. MODO LISTA DE REPRODUCCION (solo videos.html)
   --------------------------------------------------------------------------
   Al tocar una tarjeta del carrusel, ese video pasa al reproductor grande de
   arriba en vez de abrirse chiquito abajo.
   ========================================================================== */

function iniciarListaReproduccion() {
  const destacado = $('[data-destacado]');
  const carrusel  = $('[data-montar="videos-carrusel"][data-modo="lista"]');
  if (!destacado || !carrusel) return;

  carrusel.addEventListener('click', (e) => {
    const boton = e.target.closest('.reproductor__boton');
    if (!boton) return;

    const id = boton.closest('.reproductor').dataset.video;
    const video = DATOS.videos.find((v) => v.id === id);
    if (!video) return;

    e.preventDefault();
    e.stopPropagation();

    // Se reemplaza el reproductor grande por el video elegido, ya sonando.
    const media = $('.destacado__media', destacado);
    media.innerHTML = plantillaReproductorYT(video, { grande: true });
    reproducir($('.reproductor', media));

    const set = (sel, valor) => { const n = $(sel, destacado); if (n) n.textContent = valor; };
    set('[data-destacado-titulo]', video.titulo);
    set('[data-destacado-texto]',  video.descripcion || '');
    set('[data-destacado-fecha]',  fechaCorta(video.fecha));

    const etiqueta = $('.etiqueta', destacado);
    if (etiqueta) etiqueta.textContent = video.categoria || 'Video';

    const enlace = $('[data-destacado-enlace]', destacado);
    if (enlace) enlace.href = `https://www.youtube.com/watch?v=${video.id}`;

    destacado.scrollIntoView({ behavior: menosMovimiento() ? 'auto' : 'smooth', block: 'center' });
  }, true);
}


/* ==========================================================================
   8. APARICION AL SCROLLEAR
   ========================================================================== */

function iniciarRevelado() {
  const objetivos = $$('[data-revelar]');
  if (!objetivos.length) return;

  if (menosMovimiento() || !('IntersectionObserver' in window)) {
    objetivos.forEach((n) => n.classList.add('esta-visible'));
    return;
  }

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('esta-visible');
      observador.unobserve(entrada.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  objetivos.forEach((n) => observador.observe(n));
}


/* ==========================================================================
   9. ARRANQUE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  iniciarHeader();
  iniciarMenu();
  iniciarReproductores();
  montarBloques();
  iniciarListaReproduccion();
  iniciarRevelado();

  // Año del pie, para no actualizarlo a mano cada enero.
  $$('[data-anio]').forEach((n) => { n.textContent = String(new Date().getFullYear()); });
});


/* ==========================================================================
   NOTA SOBRE LA WEB API DE SPOTIFY
   --------------------------------------------------------------------------
   La Web API de Spotify (la que devuelve JSON con las canciones) necesita un
   Client Secret para pedir un token, y ese secreto NO se puede poner en un
   sitio estatico como este: cualquiera que abra el codigo de la pagina lo ve.
   Spotify lo prohibe expresamente. Para usarla haria falta un servidor propio
   que lo guarde.

   Por eso aca se usa el reproductor oficial (embed), que es la forma que
   Spotify ofrece justamente para sitios estaticos: no lleva credenciales, se
   actualiza solo y muestra portada, nombre y boton de play.

   Con YouTube pasa parecido: en lugar de la API con clave, se usan las
   miniaturas publicas de i.ytimg.com y el reproductor incrustado. Por eso el
   sitio funciona incluso abriendo index.html con doble click.
   ========================================================================== */
