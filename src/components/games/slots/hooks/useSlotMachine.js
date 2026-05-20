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
  const [currentBonusWin, setCurrentBonusWin] = useState(0);
  const [justTriggeredBonus, setJustTriggeredBonus] = useState(false);

  const totalBet = betPerLine * activeLines;

  useEffect(() => {
    if (freeSpinsLeft === 0) {
      setCurrentBonusWin(0);
    }
  }, [freeSpinsLeft]);

  // Gravedad con inyección aleatoria de Wilds y multiplicadores (Efecto Adrenalina)
  const applyCascadeGravity = (currentMatrix, explodedPairs) => {
    const nextMatrix = currentMatrix.map((row) => [...row]);

    for (let col = 0; col < 5; col++) {
      const survivingSymbols = [];
      for (let row = 4; row >= 0; row--) {
        const isExploded = explodedPairs.some(
          ([r, c]) => r === row && c === col,
        );
        if (!isExploded) {
          survivingSymbols.push(nextMatrix[row][col]);
        }
      }

      let entryIndex = 0;
      for (let row = 4; row >= 0; row--) {
        if (entryIndex < survivingSymbols.length) {
          nextMatrix[row][col] = survivingSymbols[entryIndex];
          entryIndex++;
        } else {
          const dice = Math.random();
          let chosenSymbol;

          if (dice < 0.02) {
            chosenSymbol = SYMBOLS.WILD; // Bajado de 8% a 2% (Un comodín del cielo ahora es raro y valioso)
          } else if (dice >= 0.02 && dice < 0.04) {
            chosenSymbol = SYMBOLS.MULT_X2; // Bajado de 4% a 2%
          } else {
            // El 96% restante serán gatos normales que cortarán las rachas infinitas
            const normalKeys = Object.keys(SYMBOLS).filter(
              (k) => k !== "WILD" && k !== "SCATTER" && !k.startsWith("MULT_"),
            );
            const randomKey =
              normalKeys[Math.floor(Math.random() * normalKeys.length)];
            chosenSymbol = SYMBOLS[randomKey];
          }
          nextMatrix[row][col] = chosenSymbol;
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

    setWinData(null);
    setExplodingCoords([]);

    const targetPositions = generateSpinPositions();
    let currentTempMatrix = getResultMatrix(targetPositions);

    const startDelay = turboMode ? 100 : 200;
    const stopInterval = turboMode ? 150 : 300;

    setSpinning([true, true, true, true, true]);

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

   // ==========================================================================
    // BUCLE DE CASCADAS CORREGIDO (PREVIENE BUCLE INFINITO DE SCATTERS)
    // ==========================================================================
    let cascadeStep = 0;
    let keepCascading = true;
    let accumulatedPayout = 0;
    let accumulatedFreeSpins = 0;
    let bonusTriggeredInThisSpin = false; // Evita re-entrada infinita al bonus

    while (keepCascading && cascadeStep < 4) {
      const evaluation = evaluateMatrix(currentTempMatrix, activeLines, betPerLine);

      // Si ya procesamos un bonus en este tiro, forzamos que no se vuelva a contar
      if (bonusTriggeredInThisSpin) {
        evaluation.freeSpinsWon = 0;
        evaluation.triggerBonus = false;
      }

      if (evaluation.totalPayout > 0 || evaluation.freeSpinsWon > 0) {
        cascadeStep++;
        accumulatedPayout += evaluation.totalPayout;
        
        if (evaluation.freeSpinsWon > 0) {
          accumulatedFreeSpins += evaluation.freeSpinsWon;
          bonusTriggeredInThisSpin = true; // Bloqueo de seguridad activado
        }

        // Recolectamos TODAS las coordenadas que deben detonar
        const coordsToExplode = [];

        // 1. Añadir coordenadas de líneas normales
        evaluation.winningLines.forEach((line) => {
          line.coords.forEach(([r, c]) => {
            if (!coordsToExplode.some(([er, ec]) => er === r && ec === c)) {
              coordsToExplode.push([r, c]);
            }
          });
        });

        // 2. 🔥 SOLUCIÓN AL BUG: Forzar la explosión de los Scatters para que la gravedad los borre de la pantalla
        if (evaluation.freeSpinsWon > 0) {
          evaluation.winningLines.forEach((line) => {
            if (line.lineId === 'SCATTER') {
              line.coords.forEach(([r, c]) => {
                if (!coordsToExplode.some(([er, ec]) => er === r && ec === c)) {
                  coordsToExplode.push([r, c]);
                }
              });
            }
          });
        }

        // Si por alguna razón matemática extraña no hay coordenadas que explotar, salimos para evitar congelamiento
        if (coordsToExplode.length === 0) {
          keepCascading = false;
          break;
        }

        setExplodingCoords(coordsToExplode);

        const tempSafePayout = accumulatedPayout > 0 && accumulatedPayout < 0.1
          ? 0.1
          : Math.round(accumulatedPayout * 10) / 10;

        setWinData({
          ...evaluation,
          totalPayout: tempSafePayout,
          freeSpinsWon: accumulatedFreeSpins,
        });

        // Espera de animación de explosión
        await new Promise((resolve) => setTimeout(resolve, turboMode ? 450 : 600));

        // Vaciar celdas explotadas
        setDisplayMatrix((prevMatrix) =>
          prevMatrix.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const wasExploded = coordsToExplode.some(([er, ec]) => er === rIdx && ec === cIdx);
              return wasExploded ? { label: "", name: "empty", id: `empty-${rIdx}-${cIdx}` } : cell;
            })
          )
        );

        setExplodingCoords([]);
        await new Promise((resolve) => setTimeout(resolve, turboMode ? 60 : 150));

        // Aplicar gravedad con la tómbola regulada y actualizar la matriz de control interno
        const updatedMatrix = applyCascadeGravity(currentTempMatrix, coordsToExplode);
        setWinData((prev) => (prev ? { ...prev, winningLines: [] } : null));
        setDisplayMatrix(updatedMatrix);
        currentTempMatrix = updatedMatrix;

        // Esperar a que caigan los nuevos símbolos antes de la siguiente evaluación
        await new Promise((resolve) => setTimeout(resolve, turboMode ? 650 : 1200));
      } else {
        keepCascading = false;
      }
    }

    setWinData((prev) => (prev ? { ...prev, winningLines: [] } : null));

    if (accumulatedFreeSpins > 0) {
      setJustTriggeredBonus(true);
      if (adjustFreeSpins) adjustFreeSpins(accumulatedFreeSpins);
    }

    if (accumulatedPayout > 0) {
      accumulatedPayout = Math.round(accumulatedPayout * 10) / 10;
      adjustBalance(accumulatedPayout);
    }

    if (isFreeSpin || freeSpinsLeft > 0) {
      setCurrentBonusWin(
        (prev) => Math.round((prev + accumulatedPayout) * 10) / 10,
      );
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
    currentBonusWin,
    justTriggeredBonus,
    setJustTriggeredBonus,
    isAnyReelSpinning: spinning.some((r) => r),
  };
};
