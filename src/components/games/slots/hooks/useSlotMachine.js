// src/components/games/slots/hooks/useSlotMachine.js
import { useState, useCallback, useEffect } from "react";
import { useCasinoStore } from "../../../../store/useCasinoStore";
import {
  generateSpinPositions,
  getResultMatrix,
  evaluateMatrix,
} from "../engine/slotEngine";
import { SYMBOLS } from "../engine/slotConstants";

export const useSlotMachine = () => {
  const {
    balance,
    adjustBalance,
    turboMode,
    addHistoryRecord,
    freeSpinsLeft = 0,
    adjustFreeSpins,
  } = useCasinoStore();

  const [betPerLine, setBetPerLine] = useState(1);
  const [activeLines, setActiveLines] = useState(20);
  const [spinning, setSpinning] = useState([false, false, false, false, false]);
  const [currentPositions, setCurrentPositions] = useState([0, 0, 0, 0, 0]);
  const [winData, setWinData] = useState(null);
  const [displayMatrix, setDisplayMatrix] = useState(() =>
    getResultMatrix([0, 0, 0, 0, 0]),
  );
  const [explodingCoords, setExplodingCoords] = useState([]);

  // 🌟 ESTADOS NUEVOS: Controladores del acumulador de bonus y disparador visual
  const [currentBonusWin, setCurrentBonusWin] = useState(0);
  const [justTriggeredBonus, setJustTriggeredBonus] = useState(false);

  const totalBet = betPerLine * activeLines;

  // Resetear la alcancía global de giros gratis automáticamente si el contador de FS llega a 0
  useEffect(() => {
    if (freeSpinsLeft === 0) {
      setCurrentBonusWin(0);
    }
  }, [freeSpinsLeft]);

  // 🛠️ Aplicar gravedad real: Vacía las celdas explotadas y desliza los iconos de arriba hacia abajo
  const applyCascadeGravity = (currentMatrix, explodedPairs) => {
    const nextMatrix = currentMatrix.map((row) => [...row]);

    for (let col = 0; col < 5; col++) {
      const survivingSymbols = [];
      // Filtrar los que NO explotaron en esta columna (de abajo hacia arriba)
      for (let row = 4; row >= 0; row--) {
        const isExploded = explodedPairs.some(
          ([r, c]) => r === row && c === col,
        );
        if (!isExploded) {
          survivingSymbols.push(nextMatrix[row][col]);
        }
      }

      // Rellenar desde abajo con los sobrevivientes, y los huecos de arriba con nuevos michis
      let entryIndex = 0;
      for (let row = 4; row >= 0; row--) {
        if (entryIndex < survivingSymbols.length) {
          nextMatrix[row][col] = survivingSymbols[entryIndex];
          entryIndex++;
        } else {
          const allSymbolKeys = Object.keys(SYMBOLS).filter(
            (k) => k !== "WILD" && k !== "SCATTER" && !k.startsWith("MULT_"),
          );
          const randomKey =
            allSymbolKeys[Math.floor(Math.random() * allSymbolKeys.length)];
          nextMatrix[row][col] = SYMBOLS[randomKey];
        }
      }
    }
    return nextMatrix;
  };

  const spin = useCallback(async () => {
    const isFreeSpin = freeSpinsLeft > 0;
    if (spinning.some((r) => r) || (!isFreeSpin && balance < totalBet))
      return false;

    if (isFreeSpin) {
      if (adjustFreeSpins) adjustFreeSpins(-1);
    } else {
      adjustBalance(-totalBet);
    }

    // Reset total al iniciar un tiro nuevo
    setWinData(null);
    setExplodingCoords([]);

    const targetPositions = generateSpinPositions();
    let currentTempMatrix = getResultMatrix(targetPositions);

    const startDelay = turboMode ? 100 : 200;
    const stopInterval = turboMode ? 150 : 300;

    setSpinning([true, true, true, true, true]);

    // Frenado de rodillos
    for (let i = 0; i < 5; i++) {
      await new Promise((resolve) =>
        setTimeout(resolve, startDelay + i * stopInterval),
      );

      setCurrentPositions((prev) => {
        const next = [...prev];
        next[i] = targetPositions[i];
        return next;
      });

      setDisplayMatrix((prevMatrix) => {
        const nextMatrix = prevMatrix.map((row) => [...row]);
        for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
          nextMatrix[rowIndex][i] = currentTempMatrix[rowIndex][i];
        }
        return nextMatrix;
      });

      setSpinning((prev) => {
        const next = [...prev];
        next[i] = false;
        return next;
      });
    }

    // --- PROCESAMIENTO CONTROLADO DE CASCADA ---
    let cascadeStep = 0;
    let keepCascading = true;
    let accumulatedPayout = 0;
    let accumulatedFreeSpins = 0;

    while (keepCascading && cascadeStep < 3) {
      const evaluation = evaluateMatrix(
        currentTempMatrix,
        activeLines,
        betPerLine,
      );

      if (evaluation.totalPayout > 0 || evaluation.freeSpinsWon > 0) {
        cascadeStep++;

        accumulatedPayout += evaluation.totalPayout;
        accumulatedFreeSpins += evaluation.freeSpinsWon;

        // Extraemos TODAS las coordenadas que deben detonar de manera unificada.
        const coordsToExplode = [];
        evaluation.winningLines.forEach((line) => {
          line.coords.forEach(([r, c]) => {
            if (!coordsToExplode.some(([er, ec]) => er === r && ec === c)) {
              coordsToExplode.push([r, c]);
            }
          });
        });

        if (coordsToExplode.length === 0) {
          keepCascading = false;
          break;
        }

        // 1. DISPARAR EXPLOSIÓN VISUAL Y SETEAR LÍNEAS GANADORAS
        setExplodingCoords(coordsToExplode);
        setWinData({
          ...evaluation,
          totalPayout: accumulatedPayout, 
          freeSpinsWon: accumulatedFreeSpins,
        });

        // ⏱️ TIEMPO DE EXPLOSIÓN
        await new Promise((resolve) =>
          setTimeout(resolve, turboMode ? 450 : 600),
        );

        // 2. DESAPARECER SÍMBOLOS: Vaciar estrictamente las celdas premiadas.
        setDisplayMatrix((prevMatrix) =>
          prevMatrix.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const wasExploded = coordsToExplode.some(
                ([er, ec]) => er === rIdx && ec === cIdx,
              );
              return wasExploded
                ? { label: "", name: "empty", id: `empty-${rIdx}-${cIdx}` }
                : cell;
            }),
          ),
        );

        setExplodingCoords([]);

        await new Promise((resolve) =>
          setTimeout(resolve, turboMode ? 60 : 150),
        );

        // 3. PROCESAR GRAVEDAD: Caída de símbolos superiores
        const updatedMatrix = applyCascadeGravity(
          currentTempMatrix,
          coordsToExplode,
        );
        
        setWinData((prev) => (prev ? { ...prev, winningLines: [] } : null));

        setDisplayMatrix(updatedMatrix);
        currentTempMatrix = updatedMatrix;

        // ⏱️ TIEMPO DE CAÍDA
        await new Promise((resolve) =>
          setTimeout(resolve, turboMode ? 650 : 1200),
        );
      } else {
        keepCascading = false;
      }
    }

    // Asegurar limpieza final al terminar todas las cascadas
    setWinData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        winningLines: [],
      };
    });

    // 🌟 EVALUAR ACUMULADOS DE FREE SPINS Y DISPARADOR VISUAL
    if (accumulatedFreeSpins > 0) {
      setJustTriggeredBonus(true); // Enciende la bandera para gatillar la interfaz de festejo
      if (adjustFreeSpins) {
        adjustFreeSpins(accumulatedFreeSpins);
      }
    }

    if (isFreeSpin || freeSpinsLeft > 0) {
      // Si estamos consumiendo tiros gratis, acumulamos el pago total obtenido en las cascadas
      setCurrentBonusWin((prev) => prev + accumulatedPayout);
    }

    // --- PAGO FINAL UNIFICADO ---
    if (accumulatedPayout > 0) {
      adjustBalance(accumulatedPayout);
    }

    addHistoryRecord({
      bet: isFreeSpin ? 0 : totalBet,
      payout: accumulatedPayout,
      win: accumulatedPayout > 0,
    });

    return true;
  }, [
    spinning,
    balance,
    totalBet,
    activeLines,
    betPerLine,
    turboMode,
    adjustBalance,
    addHistoryRecord,
    freeSpinsLeft,
    adjustFreeSpins,
  ]);

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
    explodingCoords,
    currentBonusWin,        // 🌟 Expuesto para pintar en la barra de bonus acumulada
    justTriggeredBonus,     // 🌟 Expuesto para disparar el Overlay negro de festejo
    setJustTriggeredBonus,  // 🌟 Expuesto para apagar el festejo tras consumirse
    isAnyReelSpinning: spinning.some((r) => r),
  };
};