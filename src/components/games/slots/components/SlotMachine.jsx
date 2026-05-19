// src/components/games/slots/components/SlotMachine.jsx
import React, { useState, useEffect } from "react";
import { useSlotMachine } from "../hooks/useSlotMachine";
import { useAutobet } from "../hooks/useAutobet";
import { useCasinoStore } from "../../../../store/useCasinoStore";
import { ReelStrip } from "./ReelStrip";
import { PaylineDisplay } from "./PaylineDisplay";
import { WinOverlay } from "./WinOverlay";
import { PaytableModal } from "./PaytableModal";
import { GameOverDialog } from "./GameOverDialog";
import { BetControls } from "./BetControls";

export const SlotMachine = ({ onBack }) => {
  const { balance, turboMode, setTurboMode, adjustBalance, freeSpinsLeft } =
    useCasinoStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);

  // 🌟 NUEVO ESTADO: Protege la pantalla contra disparos prematuros de Game Over mientras el hook asíncrono procesa cascadas
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);

  // Estado local para congelar la pantalla con la animación del aviso de Bonus
  const [showBonusTriggerAnim, setShowBonusTriggerAnim] = useState(false);

  const {
    betPerLine,
    setBetPerLine,
    activeLines,
    setActiveLines,
    totalBet,
    spinning,
    displayMatrix,
    winData,
    spin: originalSpin,
    isAnyReelSpinning,
    explodingCoords,
    currentBonusWin,
    justTriggeredBonus,
    setJustTriggeredBonus,
  } = useSlotMachine();

  // 🌟 INTERCEPTOR DE SPIN: Enciende las alertas de procesamiento de turno
  const handleSpin = async () => {
    setIsProcessingTurn(true);
    const result = await originalSpin();
    // Si el tiro no se ejecutó (ej. falta de saldo), apagamos el candado inmediatamente
    if (result === false) {
      setIsProcessingTurn(false);
    }
    return result;
  };

  // 🌟 Apagar el candado de procesamiento cuando las cascadas terminen y la animación de explosiones muera
  useEffect(() => {
    if (!isAnyReelSpinning && explodingCoords.length === 0) {
      // Dejamos una pequeña tregua de tiempo para que Zustand asiente los balances actualizados
      const treguaTimer = setTimeout(() => {
        setIsProcessingTurn(false);
      }, 150);
      return () => clearTimeout(treguaTimer);
    }
  }, [isAnyReelSpinning, explodingCoords]);

  const { isAutoActive, remainingSpins, startAuto, stopAuto } = useAutobet(
    handleSpin,
    isAnyReelSpinning,
    balance,
    totalBet,
    winData
  );

  // Efecto para capturar el disparo del Bonus y lanzar el festejo visual
  useEffect(() => {
    if (justTriggeredBonus) {
      setShowBonusTriggerAnim(true);
      setJustTriggeredBonus(false);

      const timer = setTimeout(() => {
        setShowBonusTriggerAnim(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [justTriggeredBonus, setJustTriggeredBonus]);

  useEffect(() => {
    if (
      isAnyReelSpinning ||
      explodingCoords.length > 0 ||
      !winData ||
      winData.totalPayout === 0
    ) {
      setShowOverlay(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowOverlay(true);
    }, 600);

    return () => clearTimeout(timer);
  }, [isAnyReelSpinning, explodingCoords, winData]);

  // 🌟 EFECTO DE GAME OVER REESTRUCTURADO Y BLINDADO
  useEffect(() => {
    const isPhysicallySpinning = spinning
      ? spinning.some((s) => s === true)
      : false;

    // Solo podemos evaluar la quiebra si la máquina NO está girando, NO está explotando y NO está procesando turnos internos asíncronos
    if (
      !isAnyReelSpinning &&
      !isPhysicallySpinning &&
      explodingCoords.length === 0 &&
      !isProcessingTurn
    ) {
      // Consultamos directamente el estado fresco del Store de Zustand para evitar retrasos de renderizado de React
      const currentStoreBalance = useCasinoStore.getState().balance;

      if (currentStoreBalance === 0 && freeSpinsLeft === 0) {
        setShowGameOver(true);
        if (isAutoActive) stopAuto();
      } else {
        setShowGameOver(false);
      }
    }
  }, [
    balance,
    freeSpinsLeft,
    isAnyReelSpinning,
    spinning,
    explodingCoords,
    isProcessingTurn,
    isAutoActive,
    stopAuto,
  ]);

  const handleRecargarMonedas = () => {
    adjustBalance(1000);
    setShowGameOver(false);
  };

  const winningCoords = winData
    ? winData.winningLines.flatMap((l) => l.coords)
    : [];

  return (
    <div
      className="slot-cabinet"
      style={{
        maxWidth: "850px",
        width: "100%",
        margin: "10px auto",
        background: "#2c1e14",
        padding: "var(--cabinet-padding)",
        borderRadius: "30px",
        boxShadow: "0 10px 0px #1a110a",
        border: "6px solid var(--gold)",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      {/* PANTALLA EMERGENTE DE CELEBRACIÓN DE GIROS GRATIS */}
      {showBonusTriggerAnim && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.85)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "24px",
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          <h1
            style={{
              color: "var(--gold)",
              fontSize: "3rem",
              margin: 0,
              textAlign: "center",
              textShadow: "0 0 20px #ffcc00",
            }}
          >
            🎉 ¡FREE SPINS GANADOS! 🎉
          </h1>
          <p
            style={{
              color: "var(--cream)",
              fontSize: "1.5rem",
              marginTop: "10px",
            }}
          >
            Prepárate para las grandes ganancias
          </p>
        </div>
      )}

      {/* Botones de navegación superiores */}
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "#333",
          color: "#fff",
          border: "2px solid var(--gold)",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          fontSize: "1rem",
          cursor: "pointer",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Volver al Menú"
      >
        🔙
      </button>

      <button
        onClick={() => setModalOpen(true)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "var(--gold)",
          border: "none",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          fontFamily: "var(--font-display)",
          fontSize: "1rem",
          cursor: "pointer",
          zIndex: 5,
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
        }}
      >
        ℹ️
      </button>

      <h1
        style={{
          textAlign: "center",
          color: "var(--gold)",
          marginBottom: "15px",
          letterSpacing: "2px",
          fontSize: "var(--font-size-h1)",
        }}
      >
        🎰 catzzino 🎰
      </h1>

      <div
        className="reel-container"
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          background: "#15251d",
          padding: "clamp(5px, 2vw, 15px)",
          borderRadius: "15px",
          border: "4px solid #111",
          overflow: "hidden",
        }}
      >
        <PaylineDisplay activeLinesCount={activeLines} />

        {[0, 1, 2, 3, 4].map((colIndex) => (
          <ReelStrip
            key={colIndex}
            colIndex={colIndex}
            symbolsColumn={displayMatrix.map((row) => row[colIndex])}
            isSpinning={spinning[colIndex]}
            winningCoords={winningCoords}
            explodingCoords={explodingCoords}
          />
        ))}
      </div>

      {showOverlay && <WinOverlay winData={winData} />}

      {/* PANEL DE SEGUIMIENTO DE FREE SPINS CON ALCANCÍA ACUMULADA */}
      {freeSpinsLeft > 0 && (
        <div
          style={{
            background: "linear-gradient(90deg, #b38600, #ffcc00, #b38600)",
            color: "#000",
            padding: "12px",
            borderRadius: "12px",
            margin: "12px 0",
            boxShadow: "0 0 20px rgba(255, 215, 0, 0.6)",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          <div style={{ fontSize: "1.1rem" }}>
            🎰 GIROS RESTANTES:{" "}
            <span style={{ fontSize: "1.3rem" }}>{freeSpinsLeft}</span>
          </div>
          <div
            style={{ borderLeft: "2px solid rgba(0,0,0,0.2)", height: "25px" }}
          />
          <div style={{ fontSize: "1.1rem" }}>
            💰 GANANCIA ACUMULADA:{" "}
            <span
              style={{ fontSize: "1.3rem", fontFamily: "var(--font-display)" }}
            >
              🐾 {currentBonusWin.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <BetControls
        betPerLine={betPerLine}
        setBetPerLine={setBetPerLine}
        activeLines={activeLines}
        setActiveLines={setActiveLines}
        turboMode={turboMode}
        setTurboMode={setTurboMode}
        isAnyReelSpinning={isAnyReelSpinning}
        isAutoActive={isAutoActive}
        remainingSpins={remainingSpins}
        startAuto={startAuto}
        stopAuto={stopAuto}
        balance={balance}
        totalBet={totalBet}
        freeSpinsLeft={freeSpinsLeft}
        spin={handleSpin}
      />

      <PaytableModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      <GameOverDialog isOpen={showGameOver} onReset={handleRecargarMonedas} />
    </div>
  );
};
