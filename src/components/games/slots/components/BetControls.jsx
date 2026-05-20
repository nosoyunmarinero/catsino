// src/components/games/slots/components/BetControls.jsx
import React, { useEffect, useState } from "react";
import { Button } from "../../../ui/Button";
import { AutoBet } from "./AutoBet";

const VALID_TOTAL_BETS = [
  0.1, 1, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000,
  100000, 200000, 500000,
];
const FIXED_LINES = 20;
const MIN_BET = 0.1;
const MAX_BET = 500000;

export const BetControls = ({
  betPerLine,
  setBetPerLine,
  activeLines,
  setActiveLines,
  turboMode,
  setTurboMode,
  isAnyReelSpinning,
  isAutoActive,
  remainingSpins,
  startAuto,
  stopAuto,
  balance,
  totalBet,
  freeSpinsLeft,
  spin,
}) => {
  const [inputValue, setInputValue] = useState(totalBet.toString());

  useEffect(() => {
    setInputValue(totalBet.toString());
  }, [totalBet]);

  useEffect(() => {
    if (activeLines !== FIXED_LINES || totalBet === 0) {
      setActiveLines(FIXED_LINES);
      setBetPerLine(10 / FIXED_LINES);
    }
  }, []);

  const currentIndex = VALID_TOTAL_BETS.findIndex(
    (bet) => Math.abs(bet - totalBet) < 0.01
  );

  const handleDecrease = () => {
    if (currentIndex > 0) {
      const nextTotal = VALID_TOTAL_BETS[currentIndex - 1];
      setBetPerLine(nextTotal / FIXED_LINES);
    }
  };

  const handleIncrease = () => {
    if (currentIndex < VALID_TOTAL_BETS.length - 1) {
      const nextTotal = VALID_TOTAL_BETS[currentIndex + 1];
      setBetPerLine(nextTotal / FIXED_LINES);
    }
  };

  const handleMaxBet = () => {
    setBetPerLine(MAX_BET / FIXED_LINES);
  };

  const validateAndApplyBet = (rawValue) => {
    let cleanValue = rawValue.replace(/[^0-9.]/g, "");
    let numericValue = parseFloat(cleanValue);

    if (isNaN(numericValue) || numericValue < MIN_BET) {
      numericValue = MIN_BET;
    } else if (numericValue > MAX_BET) {
      numericValue = MAX_BET;
    }

    numericValue = Math.round(numericValue * 10) / 10;

    setBetPerLine(numericValue / FIXED_LINES);
    setInputValue(numericValue.toString());
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  return (
    <div style={{ marginTop: "15px" }}>
      {/* 🌟 CONTAINER OPTIMIZADO: Usa flex-wrap y comportamiento responsivo mediante clases CSS globales o fallback elástico */}
      <div
        className="bet-controls-panel"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          background: "rgba(0,0,0,0.4)",
          padding: "15px",
          borderRadius: "16px",
          border: "1px solid rgba(255,215,0,0.15)",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Sección de la barra de Apuestas */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: "1 1 280px" }}>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--gold)",
              letterSpacing: "1px",
              textAlign: "left"
            }}
          >
            APUESTA POR GIRO (20 LÍNEAS)
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
            <button
              disabled={isAnyReelSpinning || isAutoActive || currentIndex <= 0}
              onClick={handleDecrease}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#1a110a",
                border: "2px solid var(--gold)",
                color: "var(--gold)",
                fontSize: "1.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                opacity: currentIndex <= 0 || isAnyReelSpinning || isAutoActive ? 0.4 : 1,
                transition: "all 0.1s",
              }}
            >
              -
            </button>

            {/* Input contenedor elástico */}
            <div
              style={{
                flex: "1",
                background: "#111",
                border: "2px solid #222",
                borderRadius: "8px",
                padding: "8px 10px",
                textAlign: "center",
                minWidth: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              <span style={{ fontFamily: "var(--font-display)", color: "var(--cream)", fontSize: "1.1rem", fontWeight: "bold" }}>
                🐾
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={inputValue}
                disabled={isAnyReelSpinning || isAutoActive}
                onChange={handleInputChange}
                onBlur={(e) => validateAndApplyBet(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  color: "var(--cream)",
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  textAlign: "left",
                  outline: "none",
                  padding: 0,
                  margin: 0,
                }}
              />
            </div>

            <button
              disabled={isAnyReelSpinning || isAutoActive || currentIndex >= VALID_TOTAL_BETS.length - 1}
              onClick={handleIncrease}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#1a110a",
                border: "2px solid var(--gold)",
                color: "var(--gold)",
                fontSize: "1.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                opacity: currentIndex >= VALID_TOTAL_BETS.length - 1 || isAnyReelSpinning || isAutoActive ? 0.4 : 1,
                transition: "all 0.1s",
              }}
            >
              +
            </button>

            <button
              disabled={isAnyReelSpinning || isAutoActive || totalBet === MAX_BET}
              onClick={handleMaxBet}
              style={{
                padding: "11px 12px",
                borderRadius: "8px",
                background: totalBet === MAX_BET ? "#4a3600" : "linear-gradient(135deg, #ffcc00, #b38600)",
                border: "none",
                color: "#000",
                fontFamily: "var(--font-display)",
                fontWeight: "bold",
                fontSize: "0.75rem",
                cursor: "pointer",
                letterSpacing: "0.5px",
                boxShadow: totalBet === MAX_BET ? "none" : "0 2px 5px rgba(0,0,0,0.3)",
                opacity: isAnyReelSpinning || isAutoActive ? 0.5 : 1,
                flexShrink: 0,
              }}
            >
              MAX
            </button>
          </div>
        </div>

        {/* ⚡ Contenedor del Botón Turbo Reparado */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: "1 1 auto" }}>
          <Button
            variant={turboMode ? "primary" : "dark"}
            onClick={() => setTurboMode(!turboMode)}
            style={{
              fontSize: "0.8rem",
              padding: "10px 15px",
              height: "40px",
              width: "100%", /* Se estira perfectamente ocupando su propia fila en móvil */
              margin: 0,    /* 🌟 Eliminamos el marginTop problemático */
            }}
          >
            ⚡ {turboMode ? "TURBO" : "NORMAL"}
          </Button>
        </div>
      </div>

      {/* Botones de acción inferiores (Autobet y Play) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "15px",
          gap: "10px",
          width: "100%",
        }}
      >
        <AutoBet
          isAutoActive={isAutoActive}
          remainingSpins={remainingSpins}
          startAuto={startAuto}
          stopAuto={stopAuto}
          isAnyReelSpinning={isAnyReelSpinning}
          balance={balance}
          totalBet={totalBet}
          freeSpinsLeft={freeSpinsLeft}
        />

        <Button
          variant="primary"
          disabled={isAnyReelSpinning || isAutoActive || (balance < totalBet && freeSpinsLeft === 0)}
          onClick={spin}
          style={{ 
            padding: "12px 20px", 
            fontSize: "1.1rem", 
            flex: "2",
            whiteSpace: "nowrap"
          }}
        >
          {isAnyReelSpinning ? "..." : freeSpinsLeft > 0 ? "🎰 FS" : "🐾 PLAY"}
        </Button>
      </div>
    </div>
  );
};