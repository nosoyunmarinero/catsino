import { REEL_STRIPS, PAYLINES, PAYTABLE, SYMBOLS } from './constants';

/**
 * Genera índices aleatorios para el inicio de ventana de cada reel
 */
export const generateSpinPositions = () => {
  return REEL_STRIPS.map(strip => Math.floor(Math.random() * strip.length));
};

/**
 * Mapea las posiciones físicas a una matriz visible de 5 columnas x 3 filas
 */
export const getResultMatrix = (positions) => {
  const matrix = [[], [], []]; // 3 filas
  
  for (let col = 0; col < 5; col++) {
    const strip = REEL_STRIPS[col];
    const pos = positions[col];
    
    for (let row = 0; row < 3; row++) {
      const targetIndex = (pos + row) % strip.length;
      matrix[row][col] = strip[targetIndex];
    }
  }
  return matrix;
};

/**
 * Evalúa los aciertos basados en las paylines activas y calcula ganancias
 */
export const evaluateMatrix = (matrix, activeLinesCount, betPerLine) => {
  let totalPayout = 0;
  const winningLines = [];

  // Filtrar solo las líneas de pago que el usuario activó
  const linesToEvaluate = PAYLINES.slice(0, activeLinesCount);

  linesToEvaluate.forEach(line => {
    const symbolsInLine = line.coords.map(([row, col]) => matrix[row][col]);
    
    // Identificar el símbolo base de la línea (omitiendo WILDs iniciales)
    let firstNonWild = symbolsInLine.find(s => s.id !== SYMBOLS.WILD.id);
    
    // Si toda la línea es WILD, paga como el símbolo más alto disponible en la tabla
    if (!firstNonWild) firstNonWild = SYMBOLS.CAT_NINJA;
    
    // El Scatter no da premios de línea tradicionales en este modelo comercial básico
    if (firstNonWild.id === SYMBOLS.SCATTER.id) return;

    let matchCount = 0;
    for (let i = 0; i < symbolsInLine.length; i++) {
      const current = symbolsInLine[i];
      if (current.id === firstNonWild.id || current.id === SYMBOLS.WILD.id) {
        matchCount++;
      } else {
        break; // Detener conteo si se rompe la racha de izquierda a derecha
      }
    }

    // Calcular si hay pago para este matchCount según la tabla de pagos
    if (matchCount >= 3) {
      const multiplier = PAYTABLE[firstNonWild.id]?.[matchCount] || 0;
      if (multiplier > 0) {
        const lineWin = multiplier * betPerLine;
        totalPayout += lineWin;
        winningLines.push({
          lineId: line.id,
          matchCount,
          payout: lineWin,
          coords: line.coords.slice(0, matchCount) // Guardar coordenadas ganadoras para iluminar en UI
        });
      }
    }
  });

  // Conteo especial de Scatters (da igual donde caigan en la matriz)
  let scatterCount = 0;
  const scatterCoords = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 5; c++) {
      if (matrix[r][c].id === SYMBOLS.SCATTER.id) {
        scatterCount++;
        scatterCoords.push([r, c]);
      }
    }
  }

  let scatterPayout = 0;
  let triggerBonus = false;
  if (scatterCount >= 3) {
    scatterPayout = betPerLine * activeLinesCount * (scatterCount === 3 ? 5 : scatterCount === 4 ? 20 : 100);
    totalPayout += scatterPayout;
    triggerBonus = true;
    winningLines.push({
      lineId: 'SCATTER',
      matchCount: scatterCount,
      payout: scatterPayout,
      coords: scatterCoords
    });
  }

  return {
    totalPayout,
    winningLines,
    triggerBonus
  };
};