// src/components/games/slots/engine/slotEngine.js
import { REEL_STRIPS, PAYLINES, PAYTABLE, SLOT_BALANCE_CONFIG, SYMBOLS } from './slotConstants.js';

export const generateSpinPositions = () => {
  return REEL_STRIPS.map(strip => Math.floor(Math.random() * strip.length));
};

/**
 * Mapea las posiciones físicas a una matriz visible EXPANDIDA de 5 columnas x 5 filas
 */
export const getResultMatrix = (positions) => {
  // Inicializamos 5 filas vacías
  const matrix = [[], [], [], [], []]; 
  
  for (let col = 0; col < 5; col++) {
    const strip = REEL_STRIPS[col];
    const pos = positions[col];
    
    // Iteramos por las 5 posiciones verticales visibles de la columna
    for (let row = 0; row < 5; row++) {
      const targetIndex = (pos + row) % strip.length;
      matrix[row][col] = strip[targetIndex];
    }
  }
  return matrix;
};

/**
 * Evalúa los aciertos en la matriz de 5x5, calcula ganancias, Free Spins y Multiplicadores por Símbolo.
 */
export const evaluateMatrix = (matrix, activeLinesCount, betPerLine) => {
  let totalPayout = 0;
  const winningLines = [];
  const linesToEvaluate = PAYLINES.slice(0, activeLinesCount);

  // 1. Evaluar líneas de pago tradicionales
  linesToEvaluate.forEach(line => {
    const symbolsInLine = line.coords.map(([row, col]) => matrix[row][col]);
    
    let firstNonWild = symbolsInLine.find(s => s.id !== SYMBOLS.WILD.id);
    if (!firstNonWild) firstNonWild = SYMBOLS.meme_cat_1;
    
    if (firstNonWild.id === SYMBOLS.SCATTER.id || firstNonWild.type === 'MULTIPLIER') return;

    let matchCount = 0;
    for (let i = 0; i < symbolsInLine.length; i++) {
      const current = symbolsInLine[i];
      if (current.id === firstNonWild.id || current.id === SYMBOLS.WILD.id) {
        matchCount++;
      } else {
        break; 
      }
    }

    if (matchCount >= 3) {
      const multiplier = PAYTABLE[firstNonWild.id]?.[matchCount] || 0;
      if (multiplier > 0) {
        const lineWin = multiplier * betPerLine;
        totalPayout += lineWin;
        winningLines.push({
          lineId: line.id,
          matchCount,
          payout: lineWin,
          coords: line.coords.slice(0, matchCount) 
        });
      }
    }
  });

  // 2. Conteo de Scatters extendido a toda la matriz de 5x5
  let scatterCount = 0;
  const scatterCoords = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (matrix[r][c].id === SYMBOLS.SCATTER.id) {
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

  // 3. Mecánica de Símbolos Multiplicadores Físicos en la pantalla de 5x5
  const multiplierValues = [];
  const multiplierCoords = [];

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const symbol = matrix[r][c];
      if (symbol && symbol.type === 'MULTIPLIER') {
        const val = Number(symbol.value) || 0;
        if (val > 0) multiplierValues.push(val);
        multiplierCoords.push([r, c]);
      }
    }
  }

  // En producción aplicamos solo el multiplicador visible más alto para evitar picos de pago.
  const activeMultiplier = multiplierValues.length > 0 ? Math.max(...multiplierValues) : 1;
  const finalMultiplierDisplay = activeMultiplier;

  // El multiplicador físico aplica solo si anotaste ganancias válidas en el tiro
  if (totalPayout > 0 && activeMultiplier > 1) {
    const originalPayout = totalPayout;
    totalPayout = originalPayout * activeMultiplier;
    
    // 🌟 CORREGIDO: Ahora le pasamos el payout real extra generado, o el multiplicador real 
    // para que la interfaz no flashee números locos ni calcule un x4.
    winningLines.push({
      lineId: 'MULTIPLIER_SYMBOL',
      matchCount: multiplierCoords.length,
      payout: totalPayout - originalPayout, // El valor neto ganado gracias al multiplicador
      coords: multiplierCoords,
      multiplierValue: finalMultiplierDisplay // Mandamos el "5" real para que el front diga x5 sin dudar
    });
  }

  return {
    totalPayout,
    winningLines,
    triggerBonus,
    freeSpinsWon,       
    activeMultiplier: finalMultiplierDisplay // Devolvemos el valor real acumulado de la jugada
  };
};
