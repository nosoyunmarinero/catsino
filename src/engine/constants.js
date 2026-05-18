// 1. CONFIGURACIÓN DE LOS 11 SÍMBOLOS PERSONALIZADOS CON TUS LINKS
export const SYMBOLS = {
  meme_cat_1:  { id: 'meme_cat_1',  name: 'Nyan Surf',    label: 'https://media1.tenor.com/m/XOSOCjqXcNIAAAAC/surfing-nyan-cat.gif' },
  meme_cat_2:  { id: 'meme_cat_2',  name: 'Gato Hard',    label: 'https://static.boredpanda.com/blog/wp-content/uploads/2025/10/funny-cat-memes-go-hard-cover_675.jpg' },
  meme_cat_3:  { id: 'meme_cat_3',  name: 'Gato Salto',   label: 'https://media.tenor.com/gjTjxUCoP3sAAAAj/jumping-gatito.gif' },
  meme_cat_4:  { id: 'meme_cat_4',  name: 'Gato Clásico', label: 'https://media1.tenor.com/m/YR1hxyktKYYAAAAC/cat.gif' },
  meme_cat_5:  { id: 'meme_cat_5',  name: 'Gato Spin',    label: 'https://media.tenor.com/Fl86HERrwRoAAAAi/oiiai-cat-spinning-cat.gif' },
  meme_cat_6:  { id: 'meme_cat_6',  name: 'Gato Dance',   label: 'https://media.tenor.com/s7DaT_WpYA0AAAA1/gato-bailando.webp' },
  meme_cat_7:  { id: 'meme_cat_7',  name: 'Gato Alien',   label: 'https://media.tenor.com/-TO4hXAw_MQAAAAj/alien-alien-cat.gif' },
  meme_cat_8:  { id: 'meme_cat_8',  name: 'Gato Tongue',  label: 'https://media.tenor.com/WlJsOVX2lysAAAAi/cat-tongue-cat.gif' },
  meme_cat_9:  { id: 'meme_cat_9',  name: 'Gato Wtf',     label: 'https://pbs.twimg.com/media/FkjOQe5UUAAfOb_.jpg' },
  WILD:        { id: 'WILD',        name: 'Gato Comodín', label: 'https://i.pinimg.com/474x/a3/2d/f1/a32df1f5ede2a24a864472b553a43f06.jpg' },
  SCATTER:     { id: 'SCATTER',     name: 'Gato Bonus',   label: 'https://preview.redd.it/random-question-but-does-anyone-have-versions-of-this-cat-v0-ya8qikz9kn0f1.png?auto=webp&s=c2fdba9a3904ab3bec9e7367e380f66343c2929a' }
};

// Utilidad para componentes de UI que necesiten recorrer los símbolos como Array
export const ARRAY_SYMBOLS = Object.values(SYMBOLS);

// 2. TABLA DE PAGOS ASOCIADA A LOS ID DE LOS SÍMBOLOS
export const PAYTABLE = {
  meme_cat_9:  { 3: 2,   4: 5,    5: 15 },
  meme_cat_8:  { 3: 3,   4: 8,    5: 25 },
  meme_cat_7:  { 3: 5,   4: 12,   5: 40 },
  meme_cat_6:  { 3: 8,   4: 20,   5: 75 },
  meme_cat_5:  { 3: 12,  4: 35,   5: 150 },
  meme_cat_4:  { 3: 20,  4: 60,   5: 300 },
  meme_cat_3:  { 3: 35,  4: 100,  5: 600 },
  meme_cat_2:  { 3: 50,  4: 250,  5: 1500 },
  meme_cat_1:  { 3: 100, 4: 1000, 5: 5000 }
};

// 3. CONFIGURACIÓN DE LAS 9 LÍNEAS DE PAGO (PAYLINES)
export const PAYLINES = [
  { id: 1, coords: [[1,0], [1,1], [1,2], [1,3], [1,4]], color: '#ff4d4d' },
  { id: 2, coords: [[0,0], [0,1], [0,2], [0,3], [0,4]], color: '#4da6ff' },
  { id: 3, coords: [[2,0], [2,1], [2,2], [2,3], [2,4]], color: '#5cd65c' },
  { id: 4, coords: [[0,0], [1,1], [2,2], [1,3], [0,4]], color: '#ffb366' },
  { id: 5, coords: [[2,0], [1,1], [0,2], [1,3], [2,4]], color: '#b366ff' },
  { id: 6, coords: [[0,0], [0,1], [1,2], [2,3], [2,4]], color: '#ff66cc' },
  { id: 7, coords: [[2,0], [2,1], [1,2], [0,3], [0,4]], color: '#66ffff' },
  { id: 8, coords: [[1,0], [0,1], [1,2], [2,3], [1,4]], color: '#ffff66' },
  { id: 9, coords: [[1,0], [2,1], [1,2], [0,3], [1,4]], color: '#ffffff' }
];

// 4. CINTAS VIRTUALES (REEL STRIPS)
const S = SYMBOLS;
export const REEL_STRIPS = [
  [S.meme_cat_9, S.meme_cat_8, S.meme_cat_9, S.meme_cat_7, S.meme_cat_8, S.meme_cat_6, S.meme_cat_9, S.meme_cat_5, S.meme_cat_7, S.SCATTER, S.meme_cat_8, S.meme_cat_6, S.meme_cat_4, S.meme_cat_9, S.meme_cat_3, S.meme_cat_7, S.meme_cat_2, S.WILD, S.meme_cat_9, S.meme_cat_8, S.meme_cat_6, S.meme_cat_1, S.meme_cat_9, S.meme_cat_7, S.meme_cat_8],
  [S.meme_cat_8, S.meme_cat_9, S.meme_cat_7, S.meme_cat_8, S.meme_cat_9, S.meme_cat_6, S.meme_cat_7, S.meme_cat_5, S.meme_cat_8, S.SCATTER, S.meme_cat_6, S.meme_cat_9, S.meme_cat_4, S.meme_cat_7, S.meme_cat_3, S.meme_cat_8, S.meme_cat_2, S.WILD, S.meme_cat_9, S.meme_cat_6, S.meme_cat_7, S.meme_cat_8, S.meme_cat_9, S.meme_cat_5],
  [S.meme_cat_7, S.meme_cat_9, S.meme_cat_8, S.meme_cat_7, S.meme_cat_9, S.meme_cat_6, S.meme_cat_8, S.meme_cat_5, S.meme_cat_7, S.SCATTER, S.meme_cat_6, S.meme_cat_8, S.meme_cat_4, S.meme_cat_9, S.meme_cat_3, S.meme_cat_7, S.WILD, S.meme_cat_2, S.meme_cat_9, S.meme_cat_8, S.meme_cat_6, S.meme_cat_7, S.meme_cat_5],
  [S.meme_cat_9, S.meme_cat_8, S.meme_cat_7, S.meme_cat_9, S.meme_cat_8, S.meme_cat_6, S.meme_cat_5, S.meme_cat_8, S.SCATTER, S.meme_cat_7, S.meme_cat_4, S.meme_cat_9, S.meme_cat_3, S.WILD, S.meme_cat_8, S.meme_cat_2, S.meme_cat_9, S.meme_cat_6, S.meme_cat_7, S.meme_cat_8],
  [S.meme_cat_8, S.meme_cat_9, S.meme_cat_7, S.meme_cat_8, S.meme_cat_6, S.meme_cat_9, S.meme_cat_5, S.meme_cat_7, S.SCATTER, S.meme_cat_8, S.meme_cat_4, S.WILD, S.meme_cat_3, S.meme_cat_9, S.meme_cat_2, S.meme_cat_8, S.meme_cat_6, S.meme_cat_7, S.meme_cat_9]
];

export const PRESET_BETS = [1, 5, 10, 25, 50, 100];