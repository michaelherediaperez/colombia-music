/* =====================================================================
   MEDIA — every photo and sound in the deck.
   Drop files into the media/ folder with exactly these names.
   A missing file just shows a placeholder, so you can add them one by one.
   To use another name or format (.png, .webp, .m4a…), change it here.
   ===================================================================== */
window.MEDIA = {
  photo: {
    // slide 2 — Manizales
    manizales1: 'media/manizales-1.jpg', manizales2: 'media/manizales-2.jpg',
    manizales3: 'media/manizales-3.jpg', manizales4: 'media/manizales-4.jpg',
    // slide 7 — postcards
    sierra: 'media/place-sierra-nevada.jpg', ruiz: 'media/place-nevado-del-ruiz.jpg',
    tatacoa: 'media/place-tatacoa.jpg', lajas: 'media/place-las-lajas.jpg',
    pacific: 'media/place-pacific-coast.jpg', cano: 'media/place-cano-cristales.jpg',
    amazon: 'media/place-amazon.jpg', sanandres: 'media/place-san-andres.jpg',
    // slides 9–11 — instruments
    gaita: 'media/inst-gaita.jpg', quena: 'media/inst-quena.jpg', maracas: 'media/inst-maracas.jpg',
    tamboralegre: 'media/inst-tambor-alegre.jpg', cununo: 'media/inst-cununo.jpg', marimba: 'media/inst-marimba.jpg',
    guitar: 'media/inst-guitar.jpg', accordion: 'media/inst-accordion.jpg', clarinet: 'media/inst-clarinet.jpg',
    tiple: 'media/inst-tiple.jpg', guacharaca: 'media/inst-guacharaca.jpg', arpa: 'media/inst-arpa.jpg',
    // region slides — a landscape and a traditional costume for each
    'region-caribe': 'media/region-caribe.jpg', 'dress-caribe': 'media/dress-caribe.jpg',
    'region-pacifico': 'media/region-pacifico.jpg', 'dress-pacifico': 'media/dress-pacifico.jpg',
    'region-andes': 'media/region-andes.jpg', 'dress-andes': 'media/dress-andes.jpg',
    'region-llanos': 'media/region-llanos.jpg', 'dress-llanos': 'media/dress-llanos.jpg',
    'region-amazonia': 'media/region-amazonia.jpg', 'dress-amazonia': 'media/dress-amazonia.jpg',
    'region-islas': 'media/region-islas.jpg', 'dress-islas': 'media/dress-islas.jpg',
  },
  audio: {
    tiple: 'media/sound-tiple.mp3',
    accordion: 'media/sound-accordion.mp3', guacharaca: 'media/sound-guacharaca.mp3',
    marimba: 'media/sound-marimba.mp3', cununo: 'media/sound-cununo.mp3', arpa: 'media/sound-arpa.mp3',
    caribe: 'media/music-caribe.mp3', pacifico: 'media/music-pacifico.mp3', andes: 'media/music-andes.mp3',
    llanos: 'media/music-llanos.mp3', amazonia: 'media/music-amazonia.mp3', islas: 'media/music-islas.mp3',
  },
  // Button labels: [title, subtitle]. Put the song names in the subtitles.
  audioLabel: {
    tiple: ['Listen: the tiple', '[song name]'],
    accordion: ['Listen', ''], guacharaca: ['Listen', ''], marimba: ['Listen', ''], cununo: ['Listen', ''], arpa: ['Listen', ''],
    caribe: ['Listen: cumbia', '[song name]'], pacifico: ['Listen: currulao', '[song name]'], andes: ['Listen: bambuco', '[song name]'],
    llanos: ['Listen: joropo', '[song name]'], amazonia: ['Listen: Amazon', '[song name]'], islas: ['Listen: calypso', '[song name]'],
  },
};
