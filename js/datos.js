/* ==========================================================================
   LUCAS IBARRA - datos.js
   --------------------------------------------------------------------------
   ESTE ES EL UNICO ARCHIVO QUE HAY QUE TOCAR PARA ACTUALIZAR EL SITIO.

   Todo lo que cambia seguido (videos nuevos, canciones, obras, links) vive
   aca adentro. Las paginas se arman solas leyendo estos datos: si agregas un
   video en la lista, aparece automaticamente en el inicio Y en videos.html.

   REGLA DE ORO: el primero de cada lista es el mas nuevo.
   Lo mas nuevo siempre se muestra mas grande y primero.

   Es un archivo de datos con forma de JSON, pero guardado como .js a
   proposito: asi el sitio tambien funciona abriendo index.html con doble
   click, sin servidor. (Un .json de verdad lo bloquea el navegador por
   seguridad cuando no hay un servidor detras.)

   COMO SACAR EL ID DE UN VIDEO DE YOUTUBE
     https://www.youtube.com/watch?v=HTCWQuHNZcc
                                     ^^^^^^^^^^^ esto es el id
     https://www.youtube.com/shorts/_gNz4Fpdqtc
                                    ^^^^^^^^^^^ tambien

   COMO SACAR EL ID DE SPOTIFY
     Compartir > Copiar enlace, y quedarse con el pedazo final:
     https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
                                    ^^^^^^^^^^^^^^^^^^^^^^
   ========================================================================== */

'use strict';

const DATOS = {

  /* ======================================================================
     1. DATOS DEL ARTISTA Y ENLACES
     ====================================================================== */
  artista: {
    nombre: 'Lucas Ibarra',
    rol:    'Guitarra clásica · Composición',
    lugar:  'Colón, Buenos Aires',
    marca:  'LI',                       // iniciales del logo chico del header

    // Enlaces externos. Si alguno queda vacio, su boton no se muestra.
    enlaces: {
      youtube:   'https://www.youtube.com/@lucasibarramusica',
      instagram: 'https://instagram.com/lucasibarramusica',
      spotify:   '',   // perfil de artista, cuando exista
      whatsapp:  '',   // solo numeros: 549 + area sin 0 + numero sin 15
      email:     ''
    },

    canalId: 'UCympEg9UWCa3Oi2reaGrNDg'
  },


  /* ======================================================================
     2. LANZAMIENTO DESTACADO
     ----------------------------------------------------------------------
     Lo que ocupa el hero de la portada. Es lo que mas atencion se lleva.

     spotify.id vacio   -> aparece un cartel de "proximamente".
     spotify.id cargado -> aparece el reproductor real de Spotify.
     ====================================================================== */
  lanzamiento: {
    titulo:      'Un latido',
    tipo:        'Single',
    anio:        '2026',
    estado:      'Disponible próximamente',
    portada:     'Images/lucas_3.webp',
    descripcion: 'Balada instrumental grabada en Colón, Buenos Aires.',
    spotify:     { tipo: 'track', id: '' },
    youtube:     ''
  },


  /* ======================================================================
     3. CANCIONES
     ----------------------------------------------------------------------
     Alimenta canciones.html (una ficha por cancion: titulo, descripcion y
     reproductor abajo) y el bloque de escucha del inicio.

     Cada cancion usa el reproductor que tenga cargado:
       - si tiene spotify.id     -> reproductor de Spotify
       - si no, y tiene youtube  -> reproductor de YouTube
       - si no tiene ninguno     -> cartel de "proximamente"

     Para agregar una cancion: copia un bloque { ... } entero, pegalo arriba
     de todo y cambiale los textos.
     ====================================================================== */
  canciones: [
    {
      titulo:      'Un latido',
      autor:       'Lucas Ibarra',
      anio:        '2026',
      etiqueta:    'Single',
      destacada:   true,
      descripcion: 'Una balada instrumental hecha a mano. Nació como una canción sin palabras y se grabó íntegramente en Colón, con una Strandberg Boden roja. Sin apuro: música para escuchar con calma.',
      portada:     'Images/lucas_3.webp',
      spotify:     { tipo: 'track', id: '' },
      youtube:     ''
    },
    {
      titulo:      'El sendero perdido, op. 1',
      autor:       'Lucas Ibarra',
      anio:        '2024',
      etiqueta:    'Composición propia',
      descripcion: 'Obra sinfónica programática, compuesta como trabajo integrador de la cátedra "Elementos técnicos III" del profesorado de música. La producción llevó dos años, entre 2021 y 2022.',
      spotify:     { tipo: 'track', id: '' },
      youtube:     'B32bcOtf704'
    },
    {
      titulo:      'Épico (Power Tango)',
      autor:       'Lucas Ibarra',
      anio:        '2023',
      etiqueta:    'Composición propia',
      descripcion: 'Composición propia en estética de power tango: el nervio del 2x4 llevado al filo, con la guitarra empujando desde adelante.',
      spotify:     { tipo: 'track', id: '' },
      youtube:     'DbXdJUojdHM'
    },
    {
      titulo:      'Naranjo en flor',
      autor:       'Homero y Virgilio Expósito — arreglo de Lucas Ibarra',
      anio:        '2025',
      etiqueta:    'Arreglo propio',
      descripcion: 'Un arreglo propio sobre uno de los tangos fundamentales del repertorio argentino.',
      spotify:     { tipo: 'track', id: '' },
      youtube:     'eF370NX7DqQ',
      vertical:    true
    },
    {
      titulo:      'Milonga',
      autor:       'Jorge Cardoso',
      anio:        '2025',
      etiqueta:    'Repertorio',
      descripcion: 'Pieza original para guitarra, de las "24 piezas sudamericanas" del compositor argentino Jorge Cardoso.',
      spotify:     { tipo: 'track', id: '' },
      youtube:     'ekryOqJA5fI'
    },
    {
      titulo:      'Premiere Serenade',
      autor:       'Joseph Küffner — con Lucas Dorelo en piano',
      anio:        '2024',
      etiqueta:    'Dúo en vivo',
      descripcion: 'Andante poco adagio y Rondó, en vivo en el Conservatorio de Música "Juan Carlos Paz". Guitarra y piano, a dos Lucas.',
      spotify:     { tipo: 'track', id: '' },
      youtube:     'Wk9zDwvcAzs'
    },
    {
      titulo:      'Gato y Malambo',
      autor:       'Héctor Ayala',
      anio:        '2024',
      etiqueta:    'Repertorio',
      descripcion: 'Dos danzas criollas de la "Serie americana" de Héctor Ayala, una de las obras centrales de la guitarra argentina.',
      spotify:     { tipo: 'track', id: '' },
      youtube:     'b72xQo7kSfM'
    },
    {
      titulo:      'Les Cloches',
      autor:       'Napoléon Coste',
      anio:        '2023',
      etiqueta:    'Repertorio',
      descripcion: 'Las campanas del romanticismo francés para guitarra, del compositor Napoléon Coste.',
      spotify:     { tipo: 'track', id: '' },
      youtube:     'NJEnaGb5v4I'
    },
    {
      titulo:      'Murmullos misioneros',
      autor:       'Eduardo Falú',
      anio:        '2023',
      etiqueta:    'Repertorio',
      descripcion: 'Un aire de galopa de 1983 del maestro Eduardo Falú. También conocida como "Whisper in the wind".',
      spotify:     { tipo: 'track', id: '' },
      youtube:     'Ct06EezNJ0o'
    },
    {
      titulo:      'La Estancia Vieja',
      autor:       'Atahualpa Yupanqui',
      anio:        '2023',
      etiqueta:    'Repertorio',
      descripcion: 'Del cancionero de Atahualpa Yupanqui: campo, silencio y una guitarra que cuenta sin hablar.',
      spotify:     { tipo: 'track', id: '' },
      youtube:     '5EjyQCdoZik'
    },
    {
      titulo:      'La Trampera',
      autor:       'Aníbal Troilo — arreglo de Cacho Tirao',
      anio:        '2022',
      etiqueta:    'Repertorio',
      descripcion: 'Milonga de Aníbal "Pichuco" Troilo (1950) en la transcripción para guitarra de Oscar Emilio "Cacho" Tirao. Registrada como trabajo audiovisual de la materia Medios Electroacústicos.',
      spotify:     { tipo: 'track', id: '' },
      youtube:     'Z-XPx8tnME0'
    }
  ],


  /* ======================================================================
     4. VIDEOS (horizontales, del canal de YouTube)
     ----------------------------------------------------------------------
     El PRIMERO de la lista es el que se ve grande arriba de todo.
     El resto arma el carrusel de abajo.
     ====================================================================== */
  videos: [
    {
      id:          'HTCWQuHNZcc',
      titulo:      '"Patitos en el río" — recital completo',
      autor:       'Presentación del poemario de Miguel Ángel Ostoich',
      fecha:       '2026-03-14',
      duracion:    '21:13',
      categoria:   'En vivo',
      descripcion: 'Recital completo en la presentación del poemario "Patitos en el río", de Miguel Ángel Ostoich, en la Biblioteca Popular Mariano Moreno de Colón. Programa con obras de Héctor Ayala, Agustín Barrios Mangoré y Astor Piazzolla.'
    },
    {
      id:          'ekryOqJA5fI',
      titulo:      '"Milonga" (Jorge Cardoso)',
      autor:       'Jorge Cardoso',
      fecha:       '2025-11-24',
      duracion:    '4:20',
      categoria:   'Guitarra clásica',
      descripcion: 'Pieza original para guitarra de las "24 piezas sudamericanas".'
    },
    {
      id:          'b72xQo7kSfM',
      titulo:      '"Gato y Malambo" (Héctor Ayala)',
      autor:       'Héctor Ayala',
      fecha:       '2024-06-03',
      duracion:    '2:41',
      categoria:   'Guitarra clásica',
      descripcion: 'Dos danzas criollas de la "Serie americana".'
    },
    {
      id:          'Wk9zDwvcAzs',
      titulo:      '"Premiere Serenade" (Joseph Küffner)',
      autor:       'Con Lucas Dorelo en piano',
      fecha:       '2024-02-27',
      duracion:    '13:08',
      categoria:   'Dúo en vivo',
      descripcion: 'En vivo en el Conservatorio de Música "Juan Carlos Paz".'
    },
    {
      id:          'B32bcOtf704',
      titulo:      '"El sendero perdido" op. 1',
      autor:       'Lucas Ibarra',
      fecha:       '2024-01-09',
      duracion:    '5:42',
      categoria:   'Composición propia',
      descripcion: 'Obra sinfónica programática compuesta entre 2021 y 2022.'
    },
    {
      id:          'NJEnaGb5v4I',
      titulo:      '"Les Cloches" (Napoléon Coste)',
      autor:       'Napoléon Coste',
      fecha:       '2023-11-11',
      duracion:    '6:27',
      categoria:   'Guitarra clásica',
      descripcion: 'Romanticismo francés para guitarra sola.'
    },
    {
      id:          'Ct06EezNJ0o',
      titulo:      '"Murmullos misioneros" (Eduardo Falú)',
      autor:       'Eduardo Falú',
      fecha:       '2023-10-19',
      duracion:    '4:02',
      categoria:   'Folklore',
      descripcion: 'Aire de galopa de 1983, también conocido como "Whisper in the wind".'
    },
    {
      id:          '5EjyQCdoZik',
      titulo:      '"La Estancia Vieja" (Atahualpa Yupanqui)',
      autor:       'Atahualpa Yupanqui',
      fecha:       '2023-01-31',
      duracion:    '4:11',
      categoria:   'Folklore',
      descripcion: 'Del cancionero de Yupanqui.'
    },
    {
      id:          'DbXdJUojdHM',
      titulo:      '"Épico" (Power Tango)',
      autor:       'Lucas Ibarra',
      fecha:       '2023-01-03',
      duracion:    '4:31',
      categoria:   'Composición propia',
      descripcion: 'Composición propia en estética de power tango.'
    },
    {
      id:          'Z-XPx8tnME0',
      titulo:      '"La Trampera" (Aníbal Troilo)',
      autor:       'Arreglo de Cacho Tirao',
      fecha:       '2022-11-16',
      duracion:    '2:49',
      categoria:   'Tango',
      descripcion: 'Trabajo audiovisual de la materia Medios Electroacústicos, Conservatorio "Juan Carlos Paz".'
    }
  ],


  /* ======================================================================
     5. SHORTS (verticales)
     ----------------------------------------------------------------------
     Van en su propio carrusel vertical para que no se vean recortados.
     ====================================================================== */
  shorts: [
    { id: '_gNz4Fpdqtc', titulo: 'Buscando nuevas melodías', autor: 'Guitarra eléctrica',            fecha: '2026-08-27' },
    { id: 'bUgWI42OhWM', titulo: '"Los Dinosaurios"',        autor: 'Charly García — arreglo propio', fecha: '2026-03-24' },
    { id: 'hb8FCsjAdQ4', titulo: '"Oblivion"',               autor: 'Astor Piazzolla',               fecha: '2026-03-21' },
    { id: '1H0xyL22pxU', titulo: '"Tango Final"',            autor: 'Astor Piazzolla',               fecha: '2026-03-18' },
    { id: 'WI4iPHivuBM', titulo: '"Julia Florida"',          autor: 'Agustín Barrios Mangoré',       fecha: '2026-03-17' },
    { id: '0iCiwOU1im4', titulo: '"Guarania"',               autor: 'Héctor Ayala',                  fecha: '2026-03-12' },
    { id: 'UEbaK1owQ9E', titulo: '"Por una cabeza"',         autor: 'Gardel / Le Pera',              fecha: '2026-02-26' },
    { id: 'qF-aZ3ijcVc', titulo: '"Volver"',                 autor: 'Carlos Gardel',                 fecha: '2026-02-22' },
    { id: 'skzLD7f2kmw', titulo: '"Te vas milonga"',         autor: 'Abel Fleury',                   fecha: '2026-02-19' },
    { id: '-kxnOeN_iXg', titulo: '"Milongueo del ayer"',     autor: 'Abel Fleury',                   fecha: '2026-02-17' },
    { id: 'V4KUhxIBxlc', titulo: '"Rasguido doble"',         autor: 'Jorge Cardoso',                 fecha: '2026-02-14' },
    { id: 'eF370NX7DqQ', titulo: '"Naranjo en flor"',        autor: 'Arreglo propio',                fecha: '2025-10-25' },
    { id: 'yRswCpIufpg', titulo: 'Capricho n.º 6',           autor: 'Luigi Legnani',                 fecha: '2025-02-21' },
    { id: 'HYAjp278aZ0', titulo: '"Alma Guaraní"',           autor: 'Arreglo de Ernesto Méndez',     fecha: '2024-12-27' }
  ],


  /* ======================================================================
     6. OBRAS
     ----------------------------------------------------------------------
     Composiciones, arreglos y proyectos propios. Alimenta obras.html y el
     adelanto del inicio.
     ====================================================================== */
  obras: [
    {
      titulo:      'Un latido',
      anio:        '2026',
      tipo:        'Single instrumental',
      imagen:      'Images/lucas_3.webp',
      estado:      'Próximamente',
      resumen:     'Balada instrumental grabada en Colón. Guitarra, silencio y tiempo detenido.',
      detalle:     'Nació como una canción sin palabras. Se grabó íntegramente en Colón con una Strandberg Boden roja, el color que atraviesa el lenguaje visual de este sitio. El video se filmó en una mansión de la ciudad: luz natural, madera y tiempo detenido. Quería que la imagen respirara igual que la música.',
      enlace:      'canciones.html',
      textoEnlace: 'Escuchar'
    },
    {
      titulo:      'El sendero perdido, op. 1',
      anio:        '2021 — 2024',
      tipo:        'Obra sinfónica programática',
      youtube:     'B32bcOtf704',
      resumen:     'Obra sinfónica programática compuesta como trabajo integrador del profesorado de música.',
      detalle:     'Compuesta para la cátedra "Elementos técnicos III" del profesorado de música. La producción se extendió durante 2021 y 2022, y se publicó en 2024. Es la primera obra con número de opus del catálogo.',
      enlace:      'https://www.youtube.com/watch?v=B32bcOtf704',
      textoEnlace: 'Ver la obra'
    },
    {
      titulo:      'Épico (Power Tango)',
      anio:        '2023',
      tipo:        'Composición propia',
      youtube:     'DbXdJUojdHM',
      resumen:     'El nervio del 2x4 llevado al filo, con la guitarra empujando desde adelante.',
      detalle:     'Composición propia en estética de power tango: tensión rítmica, distorsión controlada y el fraseo del tango como eje.',
      enlace:      'https://www.youtube.com/watch?v=DbXdJUojdHM',
      textoEnlace: 'Ver la obra'
    },
    {
      titulo:      'Recital "Patitos en el río"',
      anio:        '2026',
      tipo:        'Concierto en vivo',
      youtube:     'HTCWQuHNZcc',
      resumen:     'Recital completo en la presentación del poemario de Miguel Ángel Ostoich, en Colón.',
      detalle:     'Biblioteca Popular Mariano Moreno, 13 de marzo de 2026. Programa con obras de Héctor Ayala, Agustín Barrios Mangoré y Astor Piazzolla, junto a la lectura del poemario.',
      enlace:      'videos.html',
      textoEnlace: 'Ver el recital'
    },
    {
      titulo:      'Naranjo en flor',
      anio:        '2025',
      tipo:        'Arreglo propio',
      youtube:     'eF370NX7DqQ',
      vertical:    true,
      resumen:     'Arreglo propio sobre uno de los tangos fundamentales del repertorio argentino.',
      detalle:     'Una lectura personal del clásico de los hermanos Expósito, pensada para guitarra sola.',
      enlace:      'https://www.youtube.com/shorts/eF370NX7DqQ',
      textoEnlace: 'Escuchar'
    },
    {
      titulo:      'La Trampera — trabajo audiovisual',
      anio:        '2022',
      tipo:        'Registro audiovisual',
      youtube:     'Z-XPx8tnME0',
      resumen:     'Milonga de Troilo en el arreglo de Cacho Tirao, registrada para Medios Electroacústicos.',
      detalle:     'Realizado en el marco de la materia "Medios Electroacústicos" del Profesorado de Instrumento, Conservatorio "Juan Carlos Paz" (Pergamino, BA).',
      enlace:      'https://www.youtube.com/watch?v=Z-XPx8tnME0',
      textoEnlace: 'Ver el registro'
    }
  ],


  /* ======================================================================
     7. ESTUDIO
     ====================================================================== */
  estudio: {
    titulo: 'El estudio',
    lugar:  'Colón, Buenos Aires',
    imagen: 'Images/lucas_1.webp',
    lead:   'Un espacio abierto para trabajar, grabar y colaborar. Sin apuro, sin vidriera.',
    parrafos: [
      'Acá hay instrumentos reales: guitarras, bajo, equipos, computadoras y cosas con historia. No es un local comercial; es un lugar donde la música pasa primero.',
      'El enfoque es simple: hacer sonar bien lo que haya para decir. Si tenés una canción, una idea o ganas de venir a tocar, charlamos.'
    ],

    // Formacion. Para agregar una linea: copia un bloque { ... }.
    formacion: [
      {
        anio:   'Conservatorio',
        titulo: 'Profesorado de Instrumento — Guitarra',
        lugar:  'Conservatorio de Música "Juan Carlos Paz", Pergamino, BA'
      },
      {
        anio:   'Cátedra',
        titulo: 'Elementos técnicos III — composición y producción',
        lugar:  'Profesorado de música'
      },
      {
        anio:   'En vivo',
        titulo: 'Recitales y presentaciones',
        lugar:  'Biblioteca Popular Mariano Moreno y salas de la zona'
      }
    ],

    servicios: [
      { titulo: 'Grabación',    texto: 'Guitarra, bajo y voces. Toma directa o por capas, con tiempo para probar.' },
      { titulo: 'Arreglos',     texto: 'Armado de arreglos para guitarra sola, dúo o formación completa.' },
      { titulo: 'Clases',       texto: 'Guitarra clásica y popular, para quien empieza y para quien vuelve.' },
      { titulo: 'Colaboración', texto: 'Si tenés una idea dando vueltas, se puede empezar a probar acá.' }
    ],

    nota: 'Colón, Buenos Aires · Visitas con cita previa'
  },


  /* ======================================================================
     8. REPERTORIO
     ----------------------------------------------------------------------
     Nombres que pasan en la cinta del inicio. Puro texto.
     ====================================================================== */
  repertorio: [
    'Astor Piazzolla', 'Agustín Barrios Mangoré', 'Atahualpa Yupanqui',
    'Eduardo Falú', 'Jorge Cardoso', 'Héctor Ayala', 'Abel Fleury',
    'Carlos Gardel', 'Napoléon Coste', 'Aníbal Troilo', 'Luigi Legnani',
    'Charly García'
  ]
};
