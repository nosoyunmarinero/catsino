export const SYMBOLS = {
  SARDINE: { id: 'SARDINE', name: '🐟 Sardina', value: 1, label: '🐟' },
  PAW: { id: 'PAW', name: '🐾 Huella', value: 2, label: '🐾' },
  YARN: { id: 'YARN', name: '🧶 Estambre', value: 3, label: '🧶' },
  MILK: { id: 'MILK', name: '🥛 Leche', value: 5, label: '🥛' },
  CAT_NORMAL: { id: 'CAT_NORMAL', name: '😺 Gato', value: 8, label: '😺' },
  CAT_HAPPY: { id: 'CAT_HAPPY', name: '😸 Feliz', value: 12, label: '😸' },
  CAT_LOVE: { id: 'CAT_LOVE', name: '😻 Amor', value: 20, label: '😻' },
  CAT_KING: { id: 'CAT_KING', name: '👑 Rey', value: 50, label: '👑' },
  CAT_NINJA: { id: 'CAT_NINJA', name: '🐱‍👤 Ninja', value: 200, label: '🐱‍👤' },
  WILD: { id: 'WILD', name: '⭐ WILD', value: 0, label: '⭐' },
  SCATTER: { id: 'SCATTER', name: '🎰 SCATTER', value: 0, label: '🎰' }
};

// Multiplicadores por cantidad de símbolos seguidos en una línea (3, 4 o 5 idénticos)
// Al ser una matriz de 5x3 (5 columnas, 3 filas visibles), evaluamos combos de hasta 5.
export const PAYTABLE = {
  SARDINE:   { 3: 2,  4: 5,   5: 15 },
  PAW:       { 3: 3,  4: 8,   5: 25 },
  YARN:      { 3: 5,  4: 12,  5: 40 },
  MILK:      { 3: 8,  4: 20,  5: 75 },
  CAT_NORMAL:{ 3: 12, 4: 35,  5: 150 },
  CAT_HAPPY: { 3: 20, 4: 60,  5: 300 },
  CAT_LOVE:  { 3: 35, 4: 100, 5: 600 },
  CAT_KING:  { 3: 50, 4: 250, 5: 1500 },
  CAT_NINJA: { 3: 100,4: 1000,5: 5000 }
};

// Configuración de las 9 Paylines (Coordenadas [fila, columna] para las 5 columnas)
export const PAYLINES = [
  { id: 1, coords: [[1,0], [1,1], [1,2], [1,3], [1,4]], color: '#ff4d4d' }, // Línea Central
  { id: 2, coords: [[0,0], [0,1], [0,2], [0,3], [0,4]], color: '#4da6ff' }, // Línea Superior
  { id: 3, coords: [[2,0], [2,1], [2,2], [2,3], [2,4]], color: '#5cd65c' }, // Línea Inferior
  { id: 4, coords: [[0,0], [1,1], [2,2], [1,3], [0,4]], color: '#ffb366' }, // Diagonal V
  { id: 5, coords: [[2,0], [1,1], [0,2], [1,3], [2,4]], color: '#b366ff' }, // Diagonal V invertida
  { id: 6, coords: [[0,0], [0,1], [1,2], [2,3], [2,4]], color: '#ff66cc' }, // Escalón bajando
  { id: 7, coords: [[2,0], [2,1], [1,2], [0,3], [0,4]], color: '#66ffff' }, // Escalón subiendo
  { id: 8, coords: [[1,0], [0,1], [1,2], [2,3], [1,4]], color: '#ffff66' }, // Zig-zag corto
  { id: 9, coords: [[1,0], [2,1], [1,2], [0,3], [1,4]], color: '#ffffff' }  // Zig-zag corto inv
];

// REEL STRIPS (Las cintas virtuales físicas con pesos balanceados)
// Cada array representa la secuencia cíclica de la cinta de ese reel específico.
const S = SYMBOLS;
export const REEL_STRIPS = [
  // Reel 1
  [S.SARDINE, S.PAW, S.SARDINE, S.YARN, S.PAW, S.MILK, S.SARDINE, S.CAT_NORMAL, S.YARN, S.SCATTER, S.PAW, S.MILK, S.CAT_HAPPY, S.SARDINE, S.CAT_LOVE, S.YARN, S.CAT_KING, S.WILD, S.SARDINE, S.PAW, S.MILK, S.CAT_NINJA, S.SARDINE, S.YARN, S.PAW],
  // Reel 2
  [S.PAW, S.SARDINE, S.YARN, S.PAW, S.SARDINE, S.MILK, S.YARN, S.CAT_NORMAL, S.PAW, S.SCATTER, S.MILK, S.SARDINE, S.CAT_HAPPY, S.YARN, S.CAT_LOVE, S.PAW, S.CAT_KING, S.WILD, S.SARDINE, S.MILK, S.YARN, S.PAW, S.SARDINE, S.CAT_NORMAL],
  // Reel 3
  [S.YARN, S.SARDINE, S.PAW, S.YARN, S.SARDINE, S.MILK, S.PAW, S.CAT_NORMAL, S.YARN, S.SCATTER, S.MILK, S.PAW, S.CAT_HAPPY, S.SARDINE, S.CAT_LOVE, S.YARN, S.WILD, S.CAT_KING, S.SARDINE, S.PAW, S.MILK, S.YARN, S.CAT_NORMAL],
  // Reel 4
  [S.SARDINE, S.PAW, S.YARN, S.SARDINE, S.PAW, S.MILK, S.CAT_NORMAL, S.PAW, S.SCATTER, S.YARN, S.CAT_HAPPY, S.SARDINE, S.CAT_LOVE, S.WILD, S.PAW, S.CAT_KING, S.SARDINE, S.MILK, S.YARN, S.PAW],
  // Reel 5
  [S.PAW, S.SARDINE, S.YARN, S.PAW, S.MILK, S.SARDINE, S.CAT_NORMAL, S.YARN, S.SCATTER, S.PAW, S.CAT_HAPPY, S.WILD, S.CAT_LOVE, S.SARDINE, S.CAT_KING, S.PAW, S.MILK, S.YARN, S.SARDINE]
];

export const PRESET_BETS = [1, 5, 10, 25, 50, 100];