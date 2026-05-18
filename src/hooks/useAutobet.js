import { useState, useEffect, useRef } from 'react';

export const useAutobet = (spinFunction, isSpinning, balance, totalBet) => {
  const [isAutoActive, setIsAutoActive] = useState(false);
  const [remainingSpins, setRemainingSpins] = useState(0);
  const [stopOnBigWin, setStopOnBigWin] = useState(false);
  
  const isSpinningRef = useRef(isSpinning);
  isSpinningRef.current = isSpinning;

  const startAuto = (spins) => {
    setRemainingSpins(spins);
    setIsAutoActive(true);
  };

  const stopAuto = () => {
    setRemainingSpins(0);
    setIsAutoActive(false);
  };

  useEffect(() => {
    if (!isAutoActive || remainingSpins <= 0 || balance < totalBet) {
      if (isAutoActive) stopAuto();
      return;
    }

    // Esperar a que el reel se detenga antes de mandar el siguiente gatillazo
    if (!isSpinningRef.current) {
      const timer = setTimeout(() => {
        spinFunction().then(success => {
          if (success) {
            setRemainingSpins(prev => prev - 1);
          } else {
            stopAuto();
          }
        });
      }, 600); // Pequeña pausa dramática entre spins automáticos

      return () => clearTimeout(timer);
    }
  }, [isAutoActive, remainingSpins, isSpinning, balance, totalBet, spinFunction]);

  return {
    isAutoActive,
    remainingSpins,
    startAuto,
    stopAuto
  };
};