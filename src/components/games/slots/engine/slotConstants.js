// src/components/games/slots/engine/slotConstants.js
import bmoImage from '../../../../assets/bmo.jpg';

// 1. CONFIGURACIÓN DE LOS SÍMBOLOS PERSONALIZADOS
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
  
  // Símbolos Multiplicadores Físicos Autónomos
  MULT_X2:     { id: 'mult_x2',     name: 'Multiplicador x2',  label: 'https://media1.tenor.com/m/N-InoeUpTFcAAAAd/ok-thumbs-up-ok-cat-thumbs-up.gif', value: 2, type: 'MULTIPLIER' },
  MULT_X3:     { id: 'mult_x3',     name: 'Multiplicador x3',  label: 'https://media.tenor.com/Y345Q722ysMAAAAi/elgatitolover-elgatitoloves.gif', value: 3, type: 'MULTIPLIER' },
  MULT_X5:     { id: 'mult_x5',     name: 'Multiplicador x5',  label: 'https://media1.tenor.com/m/sLJImEhibAQAAAAd/cat-reaction.gif', value: 5, type: 'MULTIPLIER' },
  MULT_X10:    { id: 'mult_x10',    name: 'Multiplicador x10', label: 'https://media1.tenor.com/m/BTnzQZ61KfUAAAAC/popcat-pop.gif', value: 10, type: 'MULTIPLIER' }
};

export const ARRAY_SYMBOLS = Object.values(SYMBOLS);

// 2. TABLA DE PAGOS ASOCIADA A LOS ID (Multiplicadores de apuesta por línea)
// Modifica solo esto en tu src/components/games/slots/engine/slotConstants.js
export const PAYTABLE = {
  meme_cat_9:  { 3: 0.5, 4: 1.5,  5: 5 },   // Bajado (Antes 2, 5, 15)
  meme_cat_8:  { 3: 1,   4: 2.5,  5: 8 },   // Bajado (Antes 3, 8, 25)
  meme_cat_7:  { 3: 1.5, 4: 4,    5: 12 },  // Bajado (Antes 5, 12, 40)
  meme_cat_6:  { 3: 2,   4: 6,    5: 20 },  // Bajado
  bmo:         { 3: 3,   4: 10,   5: 40 },  // Bajado
  meme_cat_5:  { 3: 5,   4: 15,   5: 75 },  // Ajustado
  meme_cat_4:  { 3: 10,  4: 30,   5: 150 }, // Los gatos gordos mantienen 
  meme_cat_3:  { 3: 20,  4: 75,   5: 350 }, // premios decentes para dar
  meme_cat_2:  { 3: 40,  4: 150,  5: 800 }, // esa sensación de "gran golpe"
  meme_cat_1:  { 3: 80,  4: 500,  5: 2500 }
};

// 3. LAS 20 LÍNEAS DE PAGO GEOMÉTRICAS DEFINIDAS EN LA MATRIZ DE 5x5
export const PAYLINES = [
  { id: 1,  coords: [[2,0], [2,1], [2,2], [2,3], [2,4]], color: '#ff4d4d' }, 
  { id: 2,  coords: [[1,0], [1,1], [1,2], [1,3], [1,4]], color: '#4da6ff' }, 
  { id: 3,  coords: [[3,0], [3,1], [3,2], [3,3], [3,4]], color: '#5cd65c' }, 
  { id: 4,  coords: [[0,0], [0,1], [0,2], [0,3], [0,4]], color: '#ffb366' }, 
  { id: 5,  coords: [[4,0], [4,1], [4,2], [4,3], [4,4]], color: '#b366ff' }, 
  { id: 6,  coords: [[0,0], [1,1], [2,2], [3,3], [4,4]], color: '#ff66cc' }, 
  { id: 7,  coords: [[4,0], [3,1], [2,2], [1,3], [0,4]], color: '#66ffff' }, 
  { id: 8,  coords: [[2,0], [1,1], [0,2], [1,3], [2,4]], color: '#ffff66' }, 
  { id: 9,  coords: [[2,0], [3,1], [4,2], [3,3], [2,4]], color: '#ffffff' }, 
  { id: 10, coords: [[0,0], [1,1], [0,2], [1,3], [0,4]], color: '#e67e22' }, 
  { id: 11, coords: [[4,0], [3,1], [4,2], [3,3], [4,4]], color: '#2ecc71' }, 
  { id: 12, coords: [[1,0], [2,1], [3,2], [2,3], [1,4]], color: '#9b59b6' }, 
  { id: 13, coords: [[3,0], [2,1], [1,2], [2,3], [3,4]], color: '#f1c40f' }, 
  { id: 14, coords: [[0,0], [2,1], [4,2], [2,3], [0,4]], color: '#34495e' }, 
  { id: 15, coords: [[4,0], [2,1], [0,2], [2,3], [4,4]], color: '#1abc9c' }, 
  { id: 16, coords: [[1,0], [0,1], [1,2], [2,3], [3,4]], color: '#d35400' }, 
  { id: 17, coords: [[3,0], [4,1], [3,2], [2,3], [1,4]], color: '#2980b9' }, 
  { id: 18, coords: [[2,0], [2,1], [1,2], [0,3], [1,4]], color: '#27ae60' }, 
  { id: 19, coords: [[2,0], [2,1], [3,2], [4,3], [3,4]], color: '#8e44ad' }, 
  { id: 20, coords: [[0,0], [4,1], [0,2], [4,3], [0,4]], color: '#c0392b' }, 
];

// Configuración de retención modificada (3 Scatters gatillan el bonus)
export const SLOT_BALANCE_CONFIG = {
  scatter: {
    triggerCount: 3, 
    rewards: {
      3: { payoutMultiplier: 2, freeSpins: 5 },  
      4: { payoutMultiplier: 10, freeSpins: 8 },
      5: { payoutMultiplier: 40, freeSpins: 12 }
    }
  },
  multipliers: {
    strategy: 'highest_visible',
    availableValues: [2, 3, 5, 10]
  }
};

// 4. CINTAS VIRTUALES (REEL STRIPS)
const S = SYMBOLS;
export const REEL_STRIPS = [
  [S.meme_cat_9, S.meme_cat_8, S.meme_cat_7, S.meme_cat_9, S.bmo, S.meme_cat_8, S.meme_cat_6, S.meme_cat_9, S.meme_cat_5, S.meme_cat_7, S.SCATTER, S.meme_cat_8, S.meme_cat_6, S.meme_cat_4, S.meme_cat_9, S.meme_cat_3, S.meme_cat_7, S.meme_cat_2, S.WILD, S.meme_cat_9, S.meme_cat_8, S.meme_cat_6, S.meme_cat_1, S.meme_cat_9, S.meme_cat_7, S.bmo],
  [S.meme_cat_8, S.meme_cat_9, S.meme_cat_7, S.bmo, S.meme_cat_9, S.meme_cat_6, S.meme_cat_7, S.meme_cat_5, S.meme_cat_5, S.meme_cat_8, S.SCATTER, S.meme_cat_6, S.meme_cat_9, S.meme_cat_4, S.meme_cat_7, S.meme_cat_3, S.bmo, S.meme_cat_2, S.WILD, S.meme_cat_9, S.meme_cat_6, S.meme_cat_7, S.meme_cat_8, S.meme_cat_1, S.meme_cat_9, S.meme_cat_5],
  [S.meme_cat_7, S.meme_cat_9, S.meme_cat_8, S.meme_cat_7, S.bmo, S.meme_cat_6, S.meme_cat_8, S.meme_cat_5, S.meme_cat_1, S.meme_cat_7, S.SCATTER, S.meme_cat_6, S.MULT_X5, S.meme_cat_8, S.meme_cat_4, S.meme_cat_9, S.meme_cat_3, S.bmo, S.WILD, S.meme_cat_2, S.meme_cat_9, S.meme_cat_8, S.meme_cat_6, S.meme_cat_7, S.meme_cat_5],
  [S.meme_cat_9, S.meme_cat_8, S.meme_cat_7, S.meme_cat_9, S.meme_cat_8, S.bmo, S.meme_cat_5, S.meme_cat_8, S.SCATTER, S.meme_cat_7, S.meme_cat_4, S.meme_cat_9, S.meme_cat_1, S.meme_cat_3, S.WILD, S.meme_cat_8, S.bmo, S.meme_cat_2, S.meme_cat_9, S.meme_cat_6, S.meme_cat_7, S.meme_cat_8, S.meme_cat_9],
  [S.meme_cat_8, S.meme_cat_9, S.meme_cat_7, S.bmo, S.meme_cat_6, S.meme_cat_9, S.meme_cat_5, S.meme_cat_7, S.SCATTER, S.meme_cat_8, S.meme_cat_4, S.WILD, S.meme_cat_3, S.meme_cat_9, S.meme_cat_2, S.MULT_X2, S.bmo, S.meme_cat_1, S.meme_cat_6, S.meme_cat_7, S.meme_cat_9, S.meme_cat_8]
];

export const PRESET_BETS = [1, 2, 5, 10, 20, 50, 100];