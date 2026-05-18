import { useState, useCallback } from 'react';
import { useCasinoStore } from '../store/useCasinoStore';
import { generateSpinPositions, getResultMatrix, evaluateMatrix } from '../engine/slotEngine';

export const useSlotMachine = () => {
  const { 
    balance, 
    adjustBalance, 
    turboMode, 
    addHistoryRecord,
    freeSpinsLeft = 0,       
    adjustFreeSpins          
  } = useCasinoStore();
  
  const [betPerLine, setBetPerLine] = useState(1);
  const [activeLines, setActiveLines] = useState(20); // 🌟 Actualizado por defecto a las 20 nuevas líneas
  const [spinning, setSpinning] = useState([false, false, false, false, false]);
  const [currentPositions, setCurrentPositions] = useState([0, 0, 0, 0, 0]);
  const [winData, setWinData] = useState(null);
  
  // Inicializamos la matriz visual en formato 5x5
  const [displayMatrix, setDisplayMatrix] = useState(() => getResultMatrix([0,0,0,0,0]));

  const totalBet = betPerLine * activeLines;

  const spin = useCallback(async () => {
    const isFreeSpin = freeSpinsLeft > 0;
    if (spinning.some(r => r) || (!isFreeSpin && balance < totalBet)) return false;

    if (isFreeSpin) {
      if (adjustFreeSpins) adjustFreeSpins(-1);
    } else {
      adjustBalance(-totalBet);
    }

    setWinData(null);
    
    const targetPositions = generateSpinPositions();
    const targetMatrix = getResultMatrix(targetPositions);
    const evaluation = evaluateMatrix(targetMatrix, activeLines, betPerLine);

    const startDelay = turboMode ? 50 : 200;
    const stopInterval = turboMode ? 60 : 300;

    setSpinning([true, true, true, true, true]);

    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, startDelay + (i * stopInterval)));
      
      setCurrentPositions(prev => {
        const next = [...prev];
        next[i] = targetPositions[i];
        return next;
      });

      // 🌟 SOLUCIÓN EN CALIENTE: Sincroniza las 5 filas verticales de la columna al detenerse
      setDisplayMatrix(prevMatrix => {
        const nextMatrix = prevMatrix.map(row => [...row]);
        for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
          nextMatrix[rowIndex][i] = targetMatrix[rowIndex][i];
        }
        return nextMatrix;
      });

      setSpinning(prev => {
        const next = [...prev];
        next[i] = false;
        return next;
      });
    }
    
    if (evaluation.totalPayout > 0 || evaluation.freeSpinsWon > 0) {
      setWinData(evaluation);
    }

    if (evaluation.totalPayout > 0) {
      adjustBalance(evaluation.totalPayout);
    }

    if (evaluation.freeSpinsWon > 0 && adjustFreeSpins) {
      adjustFreeSpins(evaluation.freeSpinsWon);
    }

    addHistoryRecord({
      bet: isFreeSpin ? 0 : totalBet,
      payout: evaluation.totalPayout,
      win: evaluation.totalPayout > 0
    });

    return true;
  }, [spinning, balance, totalBet, activeLines, betPerLine, turboMode, adjustBalance, addHistoryRecord, freeSpinsLeft, adjustFreeSpins]);

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
    freeSpinsLeft,
    isAnyReelSpinning: spinning.some(r => r)
  };
};