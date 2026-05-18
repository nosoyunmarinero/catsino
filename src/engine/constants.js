import bmoImage from '../assets/bmo.jpg';

// 1. CONFIGURACIÓN DE LOS SÍMBOLOS PERSONALIZADOS CON TUS LINKS
export const SYMBOLS = {
  meme_cat_1:  { id: 'meme_cat_1',  name: 'Nyan Surf',    label: 'https://media1.tenor.com/m/XOSOCjqXcNIAAAAC/surfing-nyan-cat.gif' },
  meme_cat_2:  { id: 'meme_cat_2',  name: 'Gato Hard',    label: 'https://static.boredpanda.com/blog/wp-content/uploads/2025/10/funny-cat-memes-go-hard-cover_675.jpg' },
  meme_cat_3:  { id: 'meme_cat_3',  name: 'Gato Salto',   label: 'https://media.tenor.com/gjTjxUCoP3sAAAAj/jumping-gatito.gif' },
  meme_cat_4:  { id: 'meme_cat_4',  name: 'Gato Clásico', label: 'https://media1.tenor.com/m/YR1hxyktKYYAAAAC/cat.gif' },
  meme_cat_5:  { id: 'meme_cat_5',  name: 'Gato Spin',    label: 'https://media.tenor.com/Fl86HERrwRoAAAAi/oiiai-cat-spinning-cat.gif' },
  bmo:         { id: 'bmo',         name: 'BMO',          label: bmoImage },
  meme_cat_6:  { id: 'meme_cat_6',  name: 'Gato Dance',   label: 'https://media.tenor.com/s7DaT_WpYA0AAAA1/gato-bailando.webp' },
  meme_cat_7:  { id: 'meme_cat_7',  name: 'Gato Alien',   label: 'https://media.tenor.com/-TO4hXAw_MQAAAAj/alien-alien-cat.gif' },
  meme_cat_8:  { id: 'meme_cat_8',  name: 'Gato Tongue',  label: 'https://media.tenor.com/WlJsOVX2lysAAAAi/cat-tongue-cat.gif' },
  meme_cat_9:  { id: 'meme_cat_9',  name: 'Gato Wtf',     label: 'https://pbs.twimg.com/media/FkjOQe5UUAAfOb_.jpg' },
  WILD:        { id: 'WILD',        name: 'Gato Comodín', label: 'https://i.pinimg.com/474x/a3/2d/f1/a32df1f5ede2a24a864472b553a43f06.jpg' },
  SCATTER:     { id: 'SCATTER',     name: 'Gato Bonus',   label: 'https://preview.redd.it/random-question-but-does-anyone-have-versions-of-this-cat-v0-ya8qikz9kn0f1.png?auto=webp&s=c2fdba9a3904ab3bec9e7367e380f66343c2929a' },
  
  // Símbolos Multiplicadores Físicos Autónomos[cite: 1]
  MULT_X2:     { id: 'mult_x2',     name: 'Multiplicador x2',  label: 'https://media1.tenor.com/m/N-InoeUpTFcAAAAd/ok-thumbs-up-ok-cat-thumbs-up.gif', value: 2, type: 'MULTIPLIER' },
  MULT_X3:     { id: 'mult_x3',     name: 'Multiplicador x3',  label: 'https://media.tenor.com/Y345Q722ysMAAAAi/elgatitolover-elgatitoloves.gif', value: 3, type: 'MULTIPLIER' },
  MULT_X5:     { id: 'mult_x5',     name: 'Multiplicador x5',  label: 'https://media1.tenor.com/m/sLJImEhibAQAAAAd/cat-reaction.gif', value: 5, type: 'MULTIPLIER' },
  MULT_X10:    { id: 'mult_x10',    name: 'Multiplicador x10', label: 'https://media1.tenor.com/m/BTnzQZ61KfUAAAAC/popcat-pop.gif', value: 10, type: 'MULTIPLIER' }
};

export const ARRAY_SYMBOLS = Object.values(SYMBOLS);

// 2. TABLA DE PAGOS ASOCIADA A LOS ID
export const PAYTABLE = {
  meme_cat_9:  { 3: 2,   4: 5,    5: 15 },
  meme_cat_8:  { 3: 3,   4: 8,    5: 25 },
  meme_cat_7:  { 3: 5,   4: 12,   5: 40 },
  meme_cat_6:  { 3: 8,   4: 20,   5: 75 },
  bmo:         { 3: 10,  4: 28,   5: 110 },
  meme_cat_5:  { 3: 12,  4: 35,   5: 150 },
  meme_cat_4:  { 3: 20,  4: 60,   5: 300 },
  meme_cat_3:  { 3: 35,  4: 100,  5: 600 },
  meme_cat_2:  { 3: 50,  4: 250,  5: 1500 },
  meme_cat_1:  { 3: 100, 4: 1000, 5: 5000 }
};

// 3. NUEVAS 20 LÍNEAS DE PAGO REDISEÑADAS PARA MATRIZ DE 5x5
export const PAYLINES = [
  { id: 1,  coords: [[2,0], [2,1], [2,2], [2,3], [2,4]], color: '#ff4d4d' }, // Línea Central Horizontal
  { id: 2,  coords: [[1,0], [1,1], [1,2], [1,3], [1,4]], color: '#4da6ff' }, // Línea Horizontal Superior Media
  { id: 3,  coords: [[3,0], [3,1], [3,2], [3,3], [3,4]], color: '#5cd65c' }, // Línea Horizontal Inferior Media
  { id: 4,  coords: [[0,0], [0,1], [0,2], [0,3], [0,4]], color: '#ffb366' }, // Línea Horizontal Superior Total
  { id: 5,  coords: [[4,0], [4,1], [4,2], [4,3], [4,4]], color: '#b366ff' }, // Línea Horizontal Inferior Total
  // Diagonales Grandes
  { id: 6,  coords: [[0,0], [1,1], [2,2], [3,3], [4,4]], color: '#ff66cc' }, // Diagonal Descendente
  { id: 7,  coords: [[4,0], [3,1], [2,2], [1,3], [0,4]], color: '#66ffff' }, // Diagonal Ascendente
  // Ondas Grandes y Zig-Zags
  { id: 8,  coords: [[2,0], [1,1], [0,2], [1,3], [2,4]], color: '#ffff66' }, // Onda Hacia Arriba desde el centro
  { id: 9,  coords: [[2,0], [3,1], [4,2], [3,3], [2,4]], color: '#ffffff' }, // Onda Hacia Abajo desde el centro
  { id: 10, coords: [[0,0], [1,1], [0,2], [1,3], [0,4]], color: '#e67e22' }, // Sierra Superior
  { id: 11, coords: [[4,0], [3,1], [4,2], [3,3], [4,4]], color: '#2ecc71' }, // Sierra Inferior
  { id: 12, coords: [[1,0], [2,1], [3,2], [2,3], [1,4]], color: '#9b59b6' }, // V Media Centrada
  { id: 13, coords: [[3,0], [2,1], [1,2], [2,3], [3,4]], color: '#f1c40f' }, // V Invertida Media Centrada
  { id: 14, coords: [[0,0], [2,1], [4,2], [2,3], [0,4]], color: '#34495e' }, // Gran V Extrema
  { id: 15, coords: [[4,0], [2,1], [0,2], [2,3], [4,4]], color: '#1abc9c' }, // Gran V Extrema Invertida
  { id: 16, coords: [[1,0], [0,1], [1,2], [2,3], [3,4]], color: '#d35400' }, // Escalón Descendente Alto
  { id: 17, coords: [[3,0], [4,1], [3,2], [2,3], [1,4]], color: '#2980b9' }, // Escalón Ascendente Bajo
  { id: 18, coords: [[2,0], [2,1], [1,2], [0,3], [1,4]], color: '#27ae60' }, // Desvío Superior al final
  { id: 19, coords: [[2,0], [2,1], [3,2], [4,3], [3,4]], color: '#8e44ad' }, // Desvío Inferior al final
  { id: 20, coords: [[0,0], [4,1], [0,2], [4,3], [0,4]], color: '#c0392b' }, // Patrón en X alternado
];

export const SLOT_BALANCE_CONFIG = {
  scatter: {
    triggerCount: 4,
    rewards: {
      4: { payoutMultiplier: 10, freeSpins: 8 },
      5: { payoutMultiplier: 40, freeSpins: 12 }
    }
  },
  multipliers: {
    strategy: 'highest_visible',
    availableValues: [2, 5]
  }
};

// 4. CINTAS VIRTUALES (REEL STRIPS) - Optimizadas para 5 símbolos visibles por columna
const S = SYMBOLS;
export const REEL_STRIPS = [
  [S.meme_cat_9, S.meme_cat_8, S.meme_cat_7, S.meme_cat_9, S.bmo, S.meme_cat_8, S.meme_cat_6, S.meme_cat_9, S.meme_cat_5, S.meme_cat_7, S.SCATTER, S.meme_cat_8, S.meme_cat_6, S.meme_cat_4, S.meme_cat_9, S.meme_cat_3, S.meme_cat_7, S.meme_cat_2, S.WILD, S.meme_cat_9, S.meme_cat_8, S.meme_cat_6, S.meme_cat_1, S.meme_cat_9, S.meme_cat_7, S.bmo],
  
  [S.meme_cat_8, S.meme_cat_9, S.meme_cat_7, S.bmo, S.meme_cat_9, S.meme_cat_6, S.meme_cat_7, S.meme_cat_5, S.meme_cat_5, S.meme_cat_8, S.SCATTER, S.meme_cat_6, S.meme_cat_9, S.meme_cat_4, S.meme_cat_7, S.meme_cat_3, S.bmo, S.meme_cat_2, S.WILD, S.meme_cat_9, S.meme_cat_6, S.meme_cat_7, S.meme_cat_8, S.meme_cat_1, S.meme_cat_9, S.meme_cat_5],
  
  [S.meme_cat_7, S.meme_cat_9, S.meme_cat_8, S.meme_cat_7, S.bmo, S.meme_cat_6, S.meme_cat_8, S.meme_cat_5, S.meme_cat_1, S.meme_cat_7, S.SCATTER, S.meme_cat_6, S.MULT_X5, S.meme_cat_8, S.meme_cat_4, S.meme_cat_9, S.meme_cat_3, S.bmo, S.WILD, S.meme_cat_2, S.meme_cat_9, S.meme_cat_8, S.meme_cat_6, S.meme_cat_7, S.meme_cat_5],
  
  [S.meme_cat_9, S.meme_cat_8, S.meme_cat_7, S.meme_cat_9, S.meme_cat_8, S.bmo, S.meme_cat_5, S.meme_cat_8, S.SCATTER, S.meme_cat_7, S.meme_cat_4, S.meme_cat_9, S.meme_cat_1, S.meme_cat_3, S.WILD, S.meme_cat_8, S.bmo, S.meme_cat_2, S.meme_cat_9, S.meme_cat_6, S.meme_cat_7, S.meme_cat_8, S.meme_cat_9],
  
  [S.meme_cat_8, S.meme_cat_9, S.meme_cat_7, S.bmo, S.meme_cat_6, S.meme_cat_9, S.meme_cat_5, S.meme_cat_7, S.SCATTER, S.meme_cat_8, S.meme_cat_4, S.WILD, S.meme_cat_3, S.meme_cat_9, S.meme_cat_2, S.MULT_X2, S.bmo, S.meme_cat_1, S.meme_cat_6, S.meme_cat_7, S.meme_cat_9, S.meme_cat_8]
];

// Subimos las apuestas por defecto al expandir las líneas a 20 por tiro
export const PRESET_BETS = [1, 2, 5, 10, 20, 50, 100];
