// src/components/games/slots/hooks/useAutobet.js
import { useState, useEffect, useRef } from 'react';

export const useAutobet = (spin, isAnyReelSpinning, balance, totalBet, winData) => {
  const [isAutoActive, setIsAutoActive] = useState(false);
  const [remainingSpins, setRemainingSpins] = useState(0);
  
  // Guardamos referencias actualizadas para evitar re-ejecuciones molestas de los useEffect
  const spinRef = useRef(spin);
  const balanceRef = useRef(balance);
  const totalBetRef = useRef(totalBet);
  const winDataRef = useRef(winData);

  useEffect(() => {
    spinRef.current = spin;
    balanceRef.current = balance;
    totalBetRef.current = totalBet;
    winDataRef.current = winData;
  }, [spin, balance, totalBet, winData]);

  const startAuto = (spinsCount) => {
    if (balance < totalBet) return;
    setRemainingSpins(spinsCount);
    setIsAutoActive(true);
  };

  const stopAuto = () => {
    setIsAutoActive(false);
    setRemainingSpins(0);
  };

  // Efecto principal: Se dispara CADA VEZ que los rodillos cambian de estado (Giran o Paran)
  useEffect(() => {
    // Si el autobet no está encendido, o los rodillos se están moviendo físicamente, no hacemos nada.
    if (!isAutoActive || isAnyReelSpinning) return;

    // Control de paradas obligatorias por falta de giros disponibles
    if (remainingSpins !== Infinity && remainingSpins <= 0) {
      stopAuto();
      return;
    }

    // Calcular el retraso según el resultado del tiro actual
    let delay = 400; // 0.4 segundos si no se ganó nada (giro rápido)

    // Si winData existe y el pago total acumulado de las cascadas es mayor a cero
    if (winDataRef.current && winDataRef.current.totalPayout > 0) {
      delay = 2800; // 2.8 segundos de pausa para que el jugador celebre y vea el cartel de WinOverlay
    }

    // Programar el siguiente tiro automático con el retraso calculado
    const timer = setTimeout(async () => {
      // Validar saldo antes de gatillar
      if (balanceRef.current < totalBetRef.current) {
        stopAuto();
        return;
      }

      // Restar un giro del contador (excepto si seleccionó infinitos)
      if (remainingSpins !== Infinity) {
        setRemainingSpins((prev) => prev - 1);
      }

      // Ejecutar el giro físico en los rodillos
      const success = await spinRef.current();
      if (!success) {
        stopAuto();
      }
    }, delay);

    return () => clearTimeout(timer);

    // Muy importante: Escuchamos el cambio de 'isAnyReelSpinning' para saber cuándo terminó la cascada
  }, [isAutoActive, isAnyReelSpinning, remainingSpins]);

  return {
    isAutoActive,
    remainingSpins,
    startAuto,
    stopAuto,
  };
};