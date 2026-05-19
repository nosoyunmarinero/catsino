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
 * SISTEMA DE ALTA CREDIBILIDAD CORREGIDO: Garantiza capturar cualquier racha de 3+ idénticos en cualquier posición.
 */
export const evaluateMatrix = (matrix, activeLinesCount, betPerLine) => {
  let totalPayout = 0;
  const winningLines = [];

  // Set auxiliar para evitar pagar doble por las mismas coordenadas en el mismo paso de cascada
  const registeredWinningCoords = new Set();

  /**
   * Helper para obtener el ID limpio del símbolo (remueve IDs dinámicos si los hay)
   */
  const getCleanId = (symbol) => {
    if (!symbol || !symbol.id) return null;
    // Si tus IDs dinámicos usan guiones como "meme_cat_1-1715...", extraemos la base
    if (typeof symbol.id === 'string' && symbol.id.includes('-')) {
      return symbol.id.split('-')[0];
    }
    return symbol.id;
  };

  /**
   * Escanea cualquier vector lineal del tablero en busca de rachas consecutivas de 3 o más símbolos iguales
   */
  const checkSequence = (sequenceWithCoords, sourceName) => {
    let currentMatch = [];
    let currentSymbolId = null;

    for (let i = 0; i < sequenceWithCoords.length; i++) {
      const { symbol, coord } = sequenceWithCoords[i];
      
      // 1. Si la celda está vacía o es inválida, se corta la racha actual
      if (!symbol || symbol.name === "empty" || symbol.type === 'MULTIPLIER' || symbol.id === SYMBOLS.SCATTER.id) {
        if (currentMatch.length >= 3) {
          evalCurrentMatch(currentMatch, currentSymbolId, sourceName);
        }
        currentMatch = [];
        currentSymbolId = null;
        continue;
      }

      const cleanId = getCleanId(symbol);
      const isWild = cleanId === getCleanId(SYMBOLS.WILD);

      // 2. Si no hay un símbolo base fijado para la racha y el actual no es Wild, lo fijamos
      if (!currentSymbolId && !isWild) {
        currentSymbolId = cleanId;
      }

      // 3. Evaluar coincidencia
      if (currentSymbolId && (cleanId === currentSymbolId || isWild)) {
        currentMatch.push(coord);
      } else {
        // Se rompió la racha con un símbolo diferente: Evaluamos lo que acumulamos hasta aquí
        if (currentMatch.length >= 3) {
          evalCurrentMatch(currentMatch, currentSymbolId, sourceName);
        }
        
        // 🔥 CORRECCIÓN CRUCIAL: Reiniciamos la racha inmediatamente usando el nuevo símbolo como base
        currentSymbolId = isWild ? null : cleanId;
        currentMatch = [coord];
      }
    }

    // Evaluar la última racha remanente al final del vector
    if (currentMatch.length >= 3) {
      evalCurrentMatch(currentMatch, currentSymbolId, sourceName);
    }
  };

  /**
   * Valida la longitud de la racha contra la Paytable y añade el premio de forma segura
   */
  const evalCurrentMatch = (coordsList, symbolId, sourceName) => {
    if (!symbolId || coordsList.length < 3) return;

    // Generamos una llave única basada en las coordenadas exactas de la racha
    const coordKey = coordsList.map(([r,c]) => `${r},${c}`).join('|');
    if (registeredWinningCoords.has(coordKey)) return;

    const multiplier = PAYTABLE[symbolId]?.[coordsList.length] || 0;
    if (multiplier > 0) {
      const lineWin = multiplier * betPerLine;
      totalPayout += lineWin;
      registeredWinningCoords.add(coordKey);

      winningLines.push({
        lineId: `${sourceName}_${symbolId}_${coordsList.length}X_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        matchCount: coordsList.length,
        payout: lineWin,
        coords: [...coordsList] // Clonamos el arreglo de coordenadas para congelar la línea de explosión
      });
    }
  };

  // A. ESCANEO VISUAL HORIZONTAL: Las 5 filas de la matriz
  for (let r = 0; r < 5; r++) {
    const horizontalLine = [];
    for (let c = 0; c < 5; c++) {
      horizontalLine.push({ symbol: matrix[r][c], coord: [r, c] });
    }
    checkSequence(horizontalLine, `HORIZ_ROW_${r}`);
  }

  // B. ESCANEO VISUAL VERTICAL: Los 5 rodillos verticales
  for (let c = 0; c < 5; c++) {
    const verticalLine = [];
    for (let r = 0; r < 5; r++) {
      verticalLine.push({ symbol: matrix[r][c], coord: [r, c] });
    }
    checkSequence(verticalLine, `VERT_COL_${c}`);
  }

  // C. ESCANEO VISUAL DIAGONAL: Diagonales principales y subdiagonales adyacentes de 4 celdas
  const diagonals = [
    [[0,0], [1,1], [2,2], [3,3], [4,4]], // Principal izquierda a derecha
    [[0,4], [1,3], [2,2], [3,1], [4,0]], // Principal derecha a izquierda
    [[0,1], [1,2], [2,3], [3,4]],         // Paralela superior 1
    [[1,0], [2,1], [3,2], [4,3]],         // Paralela inferior 1
    [[0,3], [1,2], [2,1], [3,0]],         // Paralela superior 2
    [[1,4], [2,3], [3,2], [4,1]]          // Paralela inferior 2
  ];

  diagonals.forEach((diagCoords, idx) => {
    const diagonalLine = diagCoords.map(([r, c]) => ({ symbol: matrix[r][c], coord: [r, c] }));
    checkSequence(diagonalLine, `DIAG_${idx}`);
  });

  // 2. Conteo de Scatters extendido a toda la matriz de 5x5
  let scatterCount = 0;
  const scatterCoords = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const symbol = matrix[r][c];
      if (symbol && getCleanId(symbol) === getCleanId(SYMBOLS.SCATTER)) {
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
      if (symbol && (symbol.type === 'MULTIPLIER' || (symbol.id && typeof symbol.id === 'string' && symbol.id.toLowerCase().includes('mult')))) {
        const val = Number(symbol.value) || 0;
        if (val > 0) multiplierValues.push(val);
        multiplierCoords.push([r, c]);
      }
    }
  }

  const activeMultiplier = multiplierValues.length > 0 ? Math.max(...multiplierValues) : 1;
  const finalMultiplierDisplay = activeMultiplier;

  // Lógica de inyección unificada para detonación visual y física de los multiplicadores
  if (totalPayout > 0) {
    if (activeMultiplier > 1) {
      const originalPayout = totalPayout;
      totalPayout = originalPayout * activeMultiplier;
      
      winningLines.push({
        lineId: 'MULTIPLIER_SYMBOL',
        matchCount: multiplierCoords.length,
        payout: totalPayout - originalPayout, 
        coords: multiplierCoords,
        multiplierValue: finalMultiplierDisplay 
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
    activeMultiplier: finalMultiplierDisplay 
  };
};