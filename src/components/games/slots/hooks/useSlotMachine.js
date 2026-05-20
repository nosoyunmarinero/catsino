import { useState, useCallback, useEffect, useRef } from "react";
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
  const [currentBonusWin, setCurrentBonusWin] = useState(0);
  const [showBonusAnim, setShowBonusAnim] = useState(false);

  // Refs para evitar stale closures en el useCallback
  const betPerLineRef = useRef(betPerLine);
  const activeLinesRef = useRef(activeLines);
  const frozenBetRef = useRef(null);
  const frozenLinesRef = useRef(null);

  useEffect(() => {
    betPerLineRef.current = betPerLine;
  }, [betPerLine]);
  useEffect(() => {
    activeLinesRef.current = activeLines;
  }, [activeLines]);

  const totalBet = betPerLine * activeLines;

  useEffect(() => {
    if (freeSpinsLeft === 0) {
      setCurrentBonusWin(0);
      frozenBetRef.current = null;
      frozenLinesRef.current = null;
    }
  }, [freeSpinsLeft]);

  const applyCascadeGravity = (currentMatrix, explodedPairs) => {
    const nextMatrix = currentMatrix.map((row) => [...row]);

    for (let col = 0; col < 5; col++) {
      const survivingSymbols = [];
      for (let row = 4; row >= 0; row--) {
        const isExploded = explodedPairs.some(
          ([r, c]) => r === row && c === col
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
            chosenSymbol = SYMBOLS.WILD;
          } else if (dice >= 0.02 && dice < 0.04) {
            chosenSymbol = SYMBOLS.MULT_X2;
          } else {
            const normalKeys = Object.keys(SYMBOLS).filter(
              (k) => k !== "WILD" && k !== "SCATTER" && !k.startsWith("MULT_")
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

    // Usar valores congelados durante free spins, frescos en spins normales
    const currentBetPerLine =
      isFreeSpin && frozenBetRef.current
        ? frozenBetRef.current
        : betPerLineRef.current;
    const currentActiveLines =
      isFreeSpin && frozenLinesRef.current
        ? frozenLinesRef.current
        : activeLinesRef.current;
    const currentTotalBet = currentBetPerLine * currentActiveLines;

    if (spinning.some((r) => r) || (!isFreeSpin && balance < currentTotalBet))
      return false;

    if (isFreeSpin) {
      if (adjustFreeSpins) adjustFreeSpins(-1);
    } else {
      adjustBalance(-currentTotalBet);
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

    let cascadeStep = 0;
    let keepCascading = true;
    let accumulatedPayout = 0;
    let accumulatedFreeSpins = 0;
    let bonusTriggeredInThisSpin = false;

    while (keepCascading && cascadeStep < 4) {
      const evaluation = evaluateMatrix(
        currentTempMatrix,
        currentActiveLines,
        currentBetPerLine
      );

      if (bonusTriggeredInThisSpin) {
        evaluation.freeSpinsWon = 0;
        evaluation.triggerBonus = false;
      }

      if (evaluation.totalPayout > 0 || evaluation.freeSpinsWon > 0) {
        cascadeStep++;
        accumulatedPayout += evaluation.totalPayout;

        if (evaluation.freeSpinsWon > 0) {
          accumulatedFreeSpins += evaluation.freeSpinsWon;
          bonusTriggeredInThisSpin = true;
        }

        const coordsToExplode = [];

        evaluation.winningLines.forEach((line) => {
          line.coords.forEach(([r, c]) => {
            if (!coordsToExplode.some(([er, ec]) => er === r && ec === c)) {
              coordsToExplode.push([r, c]);
            }
          });
        });

        if (evaluation.freeSpinsWon > 0) {
          evaluation.winningLines.forEach((line) => {
            if (line.lineId === "SCATTER") {
              line.coords.forEach(([r, c]) => {
                if (!coordsToExplode.some(([er, ec]) => er === r && ec === c)) {
                  coordsToExplode.push([r, c]);
                }
              });
            }
          });
        }

        if (coordsToExplode.length === 0) {
          keepCascading = false;
          break;
        }

        setExplodingCoords(coordsToExplode);

        const tempSafePayout =
          accumulatedPayout > 0 && accumulatedPayout < 0.1
            ? 0.1
            : Math.round(accumulatedPayout * 10) / 10;

        setWinData({
          ...evaluation,
          totalPayout: tempSafePayout,
          freeSpinsWon: accumulatedFreeSpins,
        });

        await new Promise((resolve) =>
          setTimeout(resolve, turboMode ? 450 : 600)
        );

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

        setExplodingCoords([]);
        await new Promise((resolve) =>
          setTimeout(resolve, turboMode ? 60 : 150)
        );

        const updatedMatrix = applyCascadeGravity(
          currentTempMatrix,
          coordsToExplode
        );
        setWinData((prev) => (prev ? { ...prev, winningLines: [] } : null));
        setDisplayMatrix(updatedMatrix);
        currentTempMatrix = updatedMatrix;

        await new Promise((resolve) =>
          setTimeout(resolve, turboMode ? 650 : 1200)
        );
      } else {
        keepCascading = false;
      }
    }

    setWinData((prev) => (prev ? { ...prev, winningLines: [] } : null));

    if (accumulatedFreeSpins > 0) {
      if (adjustFreeSpins) adjustFreeSpins(accumulatedFreeSpins);
      // Congela la apuesta del momento en que se ganaron los free spins
      frozenBetRef.current = currentBetPerLine;
      frozenLinesRef.current = currentActiveLines;
      setShowBonusAnim(true);
      setTimeout(() => setShowBonusAnim(false), 2000);
    }

    if (accumulatedPayout > 0) {
      accumulatedPayout = Math.round(accumulatedPayout * 10) / 10;
      adjustBalance(accumulatedPayout);
    }

    if (isFreeSpin || freeSpinsLeft > 0) {
      setCurrentBonusWin(
        (prev) => Math.round((prev + accumulatedPayout) * 10) / 10
      );
    }

    addHistoryRecord({
      bet: isFreeSpin ? 0 : currentTotalBet,
      payout: accumulatedPayout,
      win: accumulatedPayout > 0,
    });

    return true;
  }, [
    spinning,
    balance,
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
    showBonusAnim,
    isAnyReelSpinning: spinning.some((r) => r),
  };
};
