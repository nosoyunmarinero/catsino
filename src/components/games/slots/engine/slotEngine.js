// src/components/games/slots/engine/slotEngine.js
import { REEL_STRIPS, PAYLINES, PAYTABLE, SLOT_BALANCE_CONFIG, SYMBOLS } from './slotConstants.js';

/**
 * Genera posiciones aleatorias de parada para cada uno de los 5 rodillos virtuales.
 */
export const generateSpinPositions = () => {
  return REEL_STRIPS.map(strip => Math.floor(Math.random() * strip.length));
};

/**
 * Mapea las posiciones físicas a una matriz visible de 5 columnas x 5 filas
 */
export const getResultMatrix = (positions) => {
  const matrix = [[], [], [], [], []]; 
  
  for (let col = 0; col < 5; col++) {
    const strip = REEL_STRIPS[col];
    const pos = positions[col];
    
    for (let row = 0; row < 5; row++) {
      const targetIndex = (pos + row) % strip.length;
      matrix[row][col] = strip[targetIndex];
    }
  }
  return matrix;
};

/**
 * Evalúa los aciertos basándose en las líneas de pago activas seleccionadas por el jugador.
 * Aplica el sistema matemático balanceado para asegurar la ventaja de la casa a largo plazo.
 */
export const evaluateMatrix = (matrix, activeLinesCount, betPerLine) => {
  let totalPayout = 0;
  const winningLines = [];

  const getCleanId = (symbol) => {
    if (!symbol || !symbol.id) return null;
    if (typeof symbol.id === 'string' && symbol.id.includes('-')) {
      return symbol.id.split('-')[0];
    }
    return symbol.id;
  };

  // ==========================================================================
  // A. EVALUACIÓN DE LÍNEAS DE PAGO (SISTEMA BOTH WAYS CONTROLADO)
  // ==========================================================================
  const linesToEvaluate = PAYLINES.slice(0, activeLinesCount);

  linesToEvaluate.forEach((line) => {
    const currentLineCoords = line.coords;
    const lineSymbols = currentLineCoords.map(([r, c]) => matrix[r][c]);

    // 1. ESCANEO DE IZQUIERDA A DERECHA (Rodillo 1 al 5)
    let matchLeft = 0;
    let targetLeftId = null;
    for (let i = 0; i < 5; i++) {
      const symbol = lineSymbols[i];
      if (!symbol || symbol.name === "empty" || symbol.type === 'MULTIPLIER' || symbol.id === SYMBOLS.SCATTER.id) break;
      const cleanId = getCleanId(symbol);
      const isWild = cleanId === 'WILD';

      if (i === 0) {
        targetLeftId = isWild ? null : cleanId;
        matchLeft = 1;
        continue;
      }
      if (!targetLeftId && !isWild) targetLeftId = cleanId;
      if (isWild || cleanId === targetLeftId || targetLeftId === null) matchLeft++;
      else break;
    }

    // 2. ESCANEO DE DERECHA A IZQUIERDA (Rodillo 5 al 1)
    let matchRight = 0;
    let targetRightId = null;
    for (let i = 4; i >= 0; i--) {
      const symbol = lineSymbols[i];
      if (!symbol || symbol.name === "empty" || symbol.type === 'MULTIPLIER' || symbol.id === SYMBOLS.SCATTER.id) break;
      const cleanId = getCleanId(symbol);
      const isWild = cleanId === 'WILD';

      if (i === 4) {
        targetRightId = isWild ? null : cleanId;
        matchRight = 1;
        continue;
      }
      if (!targetRightId && !isWild) targetRightId = cleanId;
      if (isWild || cleanId === targetRightId || targetRightId === null) matchRight++;
      else break;
    }

    // 3. SELECCIÓN DE PREMIOS CON MATEMÁTICA DE RETENCIÓN REAL
    // De izquierda a derecha paga lo clásico (mínimo 3 aciertos)
    const leftWin = matchLeft >= 3 ? (PAYTABLE[targetLeftId || 'meme_cat_1']?.[matchLeft] || 0) : 0;
    
    // 🔥 FRENO DE MANO: De derecha a izquierda solo paga si es una racha larga (4 o 5 aciertos)
    // Esto evita que las combinaciones micro de 3 destruyan la ventaja matemática de la casa
    const rightWin = matchRight >= 4 ? (PAYTABLE[targetRightId || 'meme_cat_1']?.[matchRight] || 0) : 0;

    if (leftWin > 0 || rightWin > 0) {
      const isLeftHigher = leftWin >= rightWin;
      const finalWin = isLeftHigher ? leftWin : rightWin;
      const finalMatchCount = isLeftHigher ? matchLeft : matchRight;
      const finalSymbolId = isLeftHigher ? (targetLeftId || 'meme_cat_1') : (targetRightId || 'meme_cat_1');
      const winCoords = isLeftHigher ? currentLineCoords.slice(0, matchLeft) : currentLineCoords.slice(5 - matchRight);

      const lineWin = finalWin * betPerLine;
      totalPayout += lineWin;

      winningLines.push({
        lineId: `LINE_${line.id}_${finalSymbolId}_${finalMatchCount}X_${isLeftHigher ? 'L' : 'R'}`,
        matchCount: finalMatchCount,
        payout: lineWin,
        coords: winCoords
      });
    }
  });

  // ==========================================================================
  // B. CONTEO DE SCATTERS (Premios por dispersión en toda la pantalla de 5x5)
  // ==========================================================================
  let scatterCount = 0;
  const scatterCoords = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const symbol = matrix[r][c];
      if (symbol && getCleanId(symbol) === 'SCATTER') {
        scatterCount++;
        scatterCoords.push([r, c]);
      }
    }
  }

  let scatterPayout = 0;
  let triggerBonus = false;
  let freeSpinsWon = 0;

  if (scatterCount >= SLOT_BALANCE_CONFIG.scatter.triggerCount) {
    const rewardKey = scatterCount >= 5 ? 5 : scatterCount;
    const reward = SLOT_BALANCE_CONFIG.scatter.rewards[rewardKey];

    if (reward) {
      scatterPayout = betPerLine * activeLinesCount * reward.payoutMultiplier;
      totalPayout += scatterPayout;
      triggerBonus = true;
      freeSpinsWon = reward.freeSpins;

      winningLines.push({
        lineId: 'SCATTER',
        matchCount: scatterCount,
        payout: scatterPayout,
        coords: scatterCoords
      });
    }
  }

  // ==========================================================================
  // C. MECÁNICA DE MULTIPLICADORES FÍSICOS (DETONACIÓN EN CASCADA)
  // ==========================================================================
  const multiplierValues = [];
  const multiplierCoords = [];

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const symbol = matrix[r][c];
      if (symbol && (symbol.type === 'MULTIPLIER' || (symbol.id && typeof symbol.id === 'string' && symbol.id.toLowerCase().includes('mult')))) {
        const val = Number(symbol.value) || 0;
        if (val > 0) multiplierValues.push(val);
        multiplierCoords.push([r, c]);
      }
    }
  }

  const activeMultiplier = multiplierValues.length > 0 ? Math.max(...multiplierValues) : 1;

  if (totalPayout > 0) {
    if (activeMultiplier > 1) {
      const originalPayout = totalPayout;
      totalPayout = originalPayout * activeMultiplier;
      
      winningLines.push({
        lineId: 'MULTIPLIER_SYMBOL',
        matchCount: multiplierCoords.length,
        payout: totalPayout - originalPayout, 
        coords: multiplierCoords,
        multiplierValue: activeMultiplier 
      });
    } else if (multiplierCoords.length > 0) {
      winningLines.push({
        lineId: 'MULTIPLIER_PURGE',
        matchCount: multiplierCoords.length,
        payout: 0,
        coords: multiplierCoords
      });
    }
  }

  return {
    totalPayout,
    winningLines,
    triggerBonus,
    freeSpinsWon,      
    activeMultiplier: activeMultiplier 
  };
};