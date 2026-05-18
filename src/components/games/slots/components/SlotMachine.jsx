// src/components/games/slots/components/SlotMachine.jsx
import React, { useState, useEffect } from "react";
import { useSlotMachine } from "../hooks/useSlotMachine";
import { useAutobet } from "../hooks/useAutobet";
import { useCasinoStore } from "../../../../store/useCasinoStore";
import { ReelStrip } from "./ReelStrip";
import { PaylineDisplay } from "./PaylineDisplay";
import { WinOverlay } from "./WinOverlay";
import { PaytableModal } from "./PaytableModal";
import { Button } from "../../../ui/Button";
import { PRESET_BETS } from "../engine/slotConstants";

export const SlotMachine = ({ onBack }) => {
  const { balance, turboMode, setTurboMode, claimFreeCoins, freeSpinsLeft } =
    useCasinoStore();
  const [modalOpen, setModalOpen] = useState(false);

  // 🌟 Estado local para controlar el retraso del Win Overlay
  const [showOverlay, setShowOverlay] = useState(false);

  const {
    betPerLine,
    setBetPerLine,
    activeLines,
    setActiveLines,
    totalBet,
    spinning,
    displayMatrix,
    winData,
    spin,
    isAnyReelSpinning,
    explodingCoords,
  } = useSlotMachine();

  const { isAutoActive, remainingSpins, startAuto, stopAuto } = useAutobet(
    spin,
    isAnyReelSpinning,
    balance,
    totalBet
  );

  // 🌟 Efecto para retrasar la aparición del overlay tras la última explosión
  useEffect(() => {
    // Si los rodillos están girando o hay iconos explotando, ocultamos el overlay de inmediato
    if (
      isAnyReelSpinning ||
      explodingCoords.length > 0 ||
      !winData ||
      winData.totalPayout === 0
    ) {
      setShowOverlay(false);
      return;
    }

    // Si el tablero ya entró en calma y hay un premio, esperamos 1.2 segundos para mostrarlo
    const timer = setTimeout(() => {
      setShowOverlay(true);
    }, 600);

    return () => clearTimeout(timer);
  }, [isAnyReelSpinning, explodingCoords, winData]);

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
      <div
        className="mobile-hide"
        style={{
          position: "absolute",
          top: "-25px",
          left: "40px",
          width: "0",
          height: "0",
          borderLeft: "25px solid transparent",
          borderRight: "25px solid transparent",
          borderBottom: "26px solid var(--gold)",
        }}
      />
      <div
        className="mobile-hide"
        style={{
          position: "absolute",
          top: "-25px",
          right: "40px",
          width: "0",
          height: "0",
          borderLeft: "25px solid transparent",
          borderRight: "25px solid transparent",
          borderBottom: "26px solid var(--gold)",
        }}
      />

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
        🎰 CATSINO 🎰
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

      {/* 🌟 Renderizado condicionado al estado temporizado */}
      {showOverlay && <WinOverlay winData={winData} />}

      {freeSpinsLeft > 0 && (
        <div
          style={{
            background: "var(--gold)",
            color: "#000",
            padding: "8px",
            borderRadius: "10px",
            textAlign: "center",
            fontWeight: "bold",
            margin: "10px 0",
            fontSize: "0.9rem",
            boxShadow: "0 0 15px rgba(255, 215, 0, 0.5)",
            animation: "pulse 1.5s infinite",
          }}
        >
          🎰 GIROS GRATIS: {freeSpinsLeft} 🎰
        </div>
      )}

      <div
        style={{
          marginTop: "15px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "10px",
          background: "rgba(0,0,0,0.3)",
          padding: "12px",
          borderRadius: "12px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.75rem",
              marginBottom: "5px",
              color: "var(--gold)",
            }}
          >
            Bet/Line:
          </label>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {PRESET_BETS.map((amt) => (
              <button
                key={amt}
                disabled={isAnyReelSpinning || isAutoActive}
                onClick={() => setBetPerLine(amt)}
                style={{
                  flex: "1 0 30%",
                  padding: "6px 2px",
                  borderRadius: "6px",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  border: "none",
                  background: betPerLine === amt ? "var(--gold)" : "#1a110a",
                  color: betPerLine === amt ? "#000" : "var(--cream)",
                }}
              >
                {amt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.75rem",
              marginBottom: "5px",
              color: "var(--gold)",
            }}
          >
            Líneas: <strong>{activeLines}</strong>
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={activeLines}
            disabled={isAnyReelSpinning || isAutoActive}
            onChange={(e) => setActiveLines(parseInt(e.target.value))}
            style={{
              width: "100%",
              accentColor: "var(--gold)",
              cursor: "pointer",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            justifyContent: "center",
          }}
        >
          <Button
            variant={turboMode ? "primary" : "dark"}
            onClick={() => setTurboMode(!turboMode)}
            style={{ fontSize: "0.8rem", padding: "8px" }}
          >
            ⚡ {turboMode ? "TURBO" : "NORMAL"}
          </Button>

          {balance <= 0 && (
            <Button
              variant="danger"
              onClick={claimFreeCoins}
              style={{ fontSize: "0.7rem", padding: "8px" }}
            >
              🐟 Auxilio: +1000
            </Button>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "15px",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>Total Bet:</span>
          <h3
            style={{
              color: "var(--salmon)",
              fontFamily: "var(--font-display)",
              margin: 0,
              fontSize: "1.1rem",
            }}
          >
            🐾 {totalBet.toLocaleString()}
          </h3>
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            flex: "1",
            justifyContent: "flex-end",
          }}
        >
          {isAutoActive ? (
            <Button
              variant="danger"
              onClick={stopAuto}
              style={{ flex: 1, padding: "10px" }}
            >
              🛑 Stop ({remainingSpins})
            </Button>
          ) : (
            <Button
              variant="dark"
              disabled={
                isAnyReelSpinning || (balance < totalBet && freeSpinsLeft === 0)
              }
              onClick={() => startAuto(25)}
              style={{ padding: "10px" }}
            >
              🔄 Auto
            </Button>
          )}

          <Button
            variant="primary"
            disabled={
              isAnyReelSpinning ||
              isAutoActive ||
              (balance < totalBet && freeSpinsLeft === 0)
            }
            onClick={spin}
            style={{ padding: "12px 25px", fontSize: "1.2rem", flex: "2" }}
          >
            {isAnyReelSpinning
              ? "..."
              : freeSpinsLeft > 0
              ? "🎰 FS"
              : "🐾 PLAY"}
          </Button>
        </div>
      </div>

      <PaytableModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};
