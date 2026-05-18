// src/components/games/slots/hooks/useSlotMachine.js
import { useState, useCallback } from "react";
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
    getResultMatrix([0, 0, 0, 0, 0])
  );
  const [explodingCoords, setExplodingCoords] = useState([]);

  const totalBet = betPerLine * activeLines;

  // 🛠️ Aplicar gravedad real: Vacía las celdas explotadas y desliza los iconos de arriba hacia abajo
  const applyCascadeGravity = (currentMatrix, explodedPairs) => {
    const nextMatrix = currentMatrix.map((row) => [...row]);

    for (let col = 0; col < 5; col++) {
      const survivingSymbols = [];
      // Filtrar los que NO explotaron en esta columna (de abajo hacia arriba)
      for (let row = 4; row >= 0; row--) {
        const isExploded = explodedPairs.some(
          ([r, c]) => r === row && c === col
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
            (k) => k !== "WILD" && k !== "SCATTER"
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
        setTimeout(resolve, startDelay + i * stopInterval)
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
        betPerLine
      );

      if (evaluation.totalPayout > 0 || evaluation.freeSpinsWon > 0) {
        cascadeStep++;
        accumulatedPayout += evaluation.totalPayout;
        accumulatedFreeSpins += evaluation.freeSpinsWon;

        // Extraer coordenadas ganadoras
        const coordsToExplode = [];
        evaluation.winningLines.forEach((line) => {
          line.coords.forEach(([r, c]) => {
            if (!coordsToExplode.some(([er, ec]) => er === r && ec === c)) {
              coordsToExplode.push([r, c]);
            }
          });
        });

        // 1. DISPARAR EXPLOSIÓN VISUAL Y SETEAR LÍNEAS GANADORAS (HIGHLIGHT)
        setExplodingCoords(coordsToExplode);
        setWinData({
          ...evaluation,
          totalPayout: accumulatedPayout,
          freeSpinsWon: accumulatedFreeSpins,
        });

        // ⏱️ TIEMPO DE EXPLOSIÓN: Esperamos a que la animación '.cell-exploding' (0.5s) se complete en el DOM
        await new Promise((resolve) =>
          setTimeout(resolve, turboMode ? 450 : 600)
        );

        // 2. DESAPARECER SÍMBOLOS: Forzamos un render intermedio vaciando las celdas afectadas
        // Esto evita que un icono nuevo solape bruscamente al anterior en pleno estallido
        setDisplayMatrix((prevMatrix) =>
          prevMatrix.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const wasExploded = coordsToExplode.some(
                ([er, ec]) => er === rIdx && ec === cIdx
              );
              return wasExploded
                ? { label: "", name: "empty", id: `empty-${rIdx}-${cIdx}` }
                : cell;
            })
          )
        );

        // Apagamos las coordenadas de explosión para limpiar las clases CSS reactivas
        setExplodingCoords([]);

        // Pequeño respiro visual con el tablero vacío en las zonas premiadas antes de que la gravedad tire todo
        await new Promise((resolve) =>
          setTimeout(resolve, turboMode ? 60 : 150)
        );

        // 3. PROCESAR GRAVEDAD: Calculamos el corrimiento real de los rodillos
        const updatedMatrix = applyCascadeGravity(
          currentTempMatrix,
          coordsToExplode
        );

        // Apagamos los marcos dorados de las líneas ganadoras al momento del desplome
        setWinData((prev) => (prev ? { ...prev, winningLines: [] } : null));

        // Inyectamos la matriz con los nuevos elementos (Activa la animación '.cell-cascading')
        setDisplayMatrix(updatedMatrix);
        currentTempMatrix = updatedMatrix;

        // ⏱️ TIEMPO DE CAÍDA: Esperamos a que termine de ejecutarse '.cascade-fall' junto con sus rebotes
        await new Promise((resolve) =>
          setTimeout(resolve, turboMode ? 650 : 1200)
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

    // --- PAGO FINAL UNIFICADO ---
    if (accumulatedPayout > 0) {
      adjustBalance(accumulatedPayout);
    }

    if (accumulatedFreeSpins > 0 && adjustFreeSpins) {
      adjustFreeSpins(accumulatedFreeSpins);
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
    isAnyReelSpinning: spinning.some((r) => r),
  };
};