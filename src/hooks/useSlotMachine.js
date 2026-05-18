import { useState, useEffect, useCallback } from 'react';
import { useCasinoStore } from '../store/useCasinoStore';
import { generateSpinPositions, getResultMatrix, evaluateMatrix } from '../engine/slotEngine';
import { REEL_STRIPS } from '../engine/constants';

export const useSlotMachine = () => {
  const { balance, adjustBalance, turboMode, addHistoryRecord } = useCasinoStore();
  
  const [betPerLine, setBetPerLine] = useState(1);
  const [activeLines, setActiveLines] = useState(9);
  const [spinning, setSpinning] = useState([false, false, false, false, false]);
  const [currentPositions, setCurrentPositions] = useState([0, 0, 0, 0, 0]);
  const [winData, setWinData] = useState(null);
  const [displayMatrix, setDisplayMatrix] = useState(() => getResultMatrix([0,0,0,0,0]));

  const totalBet = betPerLine * activeLines;

  const spin = useCallback(async () => {
    if (spinning.some(r => r) || balance < totalBet) return false;

    // Cobrar apuesta
    adjustBalance(-totalBet);
    setWinData(null);
    
    const targetPositions = generateSpinPositions();
    const targetMatrix = getResultMatrix(targetPositions);
    const evaluation = evaluateMatrix(targetMatrix, activeLines, betPerLine);

    // Tiempos según modo Turbo/Normal
    const startDelay = turboMode ? 50 : 200;
    const stopInterval = turboMode ? 60 : 300;

    // Encender animación de giro secuencial
    setSpinning([true, true, true, true, true]);

    // Detener secuencialmente cada columna
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, startDelay + (i * stopInterval)));
      
      setCurrentPositions(prev => {
        const next = [...prev];
        next[i] = targetPositions[i];
        return next;
      });

      // SOLUCIÓN AL BUG HIGH: En el instante exacto en que este rodillo frena,
      // actualizamos su columna correspondiente en la matriz visual para que
      // renderice los nuevos símbolos del RNG sin alterar los rodillos que aún giran.
      setDisplayMatrix(prevMatrix => {
        const nextMatrix = prevMatrix.map(row => [...row]); // Clonar matriz
        for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
          nextMatrix[rowIndex][i] = targetMatrix[rowIndex][i];
        }
        return nextMatrix;
      });

      // Apagar animación de este rodillo en específico
      setSpinning(prev => {
        const next = [...prev];
        next[i] = false;
        return next;
      });
    }
    
    // Aplicar ganancias si existen
    if (evaluation.totalPayout > 0) {
      adjustBalance(evaluation.totalPayout);
      setWinData(evaluation);
    }

    // Registrar en historial
    addHistoryRecord({
      bet: totalBet,
      payout: evaluation.totalPayout,
      win: evaluation.totalPayout > 0
    });

    return true;
  }, [spinning, balance, totalBet, activeLines, betPerLine, turboMode, adjustBalance, addHistoryRecord]);

  return {
    betPerLine,
    setBetPerLine,
    activeLines,
    setActiveLines,
    totalBet,
    spinning,
    displayMatrix,
    winData,
    spin,
    isAnyReelSpinning: spinning.some(r => r)
  };
};