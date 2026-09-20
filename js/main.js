/* ==========================================================================
   LUCAS IBARRA - main.js
   --------------------------------------------------------------------------
   Este archivo hace dos cosas chicas:
     1. Mostrar el reproductor de Spotify del single.
     2. Poner el año actual en el pie de página.

   Los videos NO pasan por acá: son un iframe de YouTube escrito directo en
   index.html, que se actualiza solo. Si querés cambiar el canal, editá ese
   iframe y listo.
   ========================================================================== */

'use strict';

const CONFIG = {

  /* ----------------------------------------------------------------------
     SPOTIFY
     ----------------------------------------------------------------------
     tipo: 'track' (una canción), 'album' o 'artist'
     id:   el código que aparece en el link de Spotify. Se saca con
           "Compartir > Copiar enlace" desde la app.

           https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
                                          ^^^^^^^^^^^^^^^^^^^^^^ este pedazo

     Mientras id esté vacío, en la tarjeta aparece un cartel avisando que
     el reproductor todavía no está configurado.

     Se usa el reproductor oficial de Spotify, que no necesita ninguna clave
     ni cuenta de desarrollador. (Ver la nota del final del archivo.)
     ---------------------------------------------------------------------- */
  spotify:{
    tipo:'track',
    id:''
  }
};


/* ==========================================================================
   SPOTIFY
   ========================================================================== */

function iniciarSpotify(){
  const contenedor = document.querySelector('#spotify');
  if(!contenedor) return;

  const {tipo,id} = CONFIG.spotify;

  // Sin ID todavía: se muestra un aviso en vez de un hueco vacío.
  if(!id){
    const caja = document.createElement('div');
    caja.className = 'notice';
    caja.textContent = 'El reproductor aparece cuando se publique el single.';
    contenedor.replaceChildren(caja);
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.src = `https://open.spotify.com/embed/${tipo}/${id}?theme=0`;
  iframe.title = 'Reproductor de Spotify';
  iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  iframe.loading = 'lazy';
  contenedor.replaceChildren(iframe);
}


/* ==========================================================================
   VIDEO DESTACADO
   --------------------------------------------------------------------------
   La miniatura es una imagen comun, asi que se ve siempre. Recien cuando
   alguien la toca se crea el iframe de YouTube. De paso, la pagina no carga
   los scripts de YouTube hasta que hagan falta.
   ========================================================================== */

function iniciarVideoDestacado(){
  const caja = document.querySelector('.video-feature');
  if(!caja) return;

  const boton = caja.querySelector('.video-feature__btn');
  const videoId = caja.dataset.video;
  if(!boton || !videoId) return;

  boton.addEventListener('click',() => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.title = 'Reproductor de YouTube';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    caja.replaceChildren(iframe);
  });
}


/* ==========================================================================
   ARRANQUE
   ========================================================================== */

document.addEventListener('DOMContentLoaded',() => {
  iniciarSpotify();
  iniciarVideoDestacado();

  // Año del pie de página, para no tener que actualizarlo a mano cada enero
  const anio = document.querySelector('#anio');
  if(anio) anio.textContent = String(new Date().getFullYear());
});


/* ==========================================================================
   NOTA SOBRE LA WEB API DE SPOTIFY
   --------------------------------------------------------------------------
   La Web API de Spotify (la que devuelve JSON con las canciones) necesita un
   Client Secret para pedir un token, y ese secreto NO se puede poner en un
   sitio estático como este: cualquiera que abra el código de la página lo ve.
   Spotify lo prohíbe expresamente. Para usarla haría falta un servidor propio
   que lo guarde.

   Por eso acá se usa el reproductor oficial (embed), que es la forma que
   Spotify ofrece justamente para sitios estáticos: no lleva credenciales,
   se actualiza solo y muestra portada, nombre y botón de play.
   ========================================================================== */
