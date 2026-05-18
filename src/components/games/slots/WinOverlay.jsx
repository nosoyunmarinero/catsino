import React, { useEffect } from "react";
import confetti from "canvas-confetti";

export const WinOverlay = ({ winData }) => {
  // Extraemos datos garantizando valores primitivos por defecto
  const totalPayout = winData?.totalPayout ?? 0;
  const freeSpinsWon = winData?.freeSpinsWon ?? 0;
  const activeMultiplier = winData?.activeMultiplier ?? 1;
  const winningLines = winData?.winningLines ?? [];

  const isBigWin = totalPayout >= 100;
  const hasMultiplier = activeMultiplier > 1;
  const hasFreeSpins = freeSpinsWon > 0;
  const hasAnyPrize = totalPayout > 0 || freeSpinsWon > 0;

  useEffect(() => {
    if (hasAnyPrize && (isBigWin || hasFreeSpins)) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [totalPayout, freeSpinsWon, isBigWin, hasFreeSpins, hasAnyPrize]);

  // 🌟 SOLUCIÓN DEFINITIVA: El componente SIEMPRE devuelve la misma estructura de nodos.
  // Si no hay premio, el contenedor padre simplemente se oculta con CSS (`display: 'none'`).
  return (
    <div
      className={isBigWin ? "big-win-shake" : ""}
      style={{
        display: hasAnyPrize ? "block" : "none", // Control de presencia estático
        textAlign: "center",
        margin: "15px 0",
        padding: "12px",
        background: "rgba(0,0,0,0.85)",
        borderRadius: "12px",
        border: "2px dashed var(--gold)",
        animation: hasAnyPrize ? "fadeIn 0.3s ease-out" : "none",
      }}
    >
      {/* Título condicional en texto, pero el nodo H2 siempre existe */}
      <h2
        style={{
          color: "var(--gold)",
          fontSize: isBigWin ? "2rem" : "1.3rem",
          margin: "5px 0",
        }}
      >
        {isBigWin
          ? "😻 ¡MIAU-GIGA GANANCIA! 😻"
          : hasFreeSpins
          ? "🎰 ¡BONUS DE GIROS! 🎰"
          : "🐾 ¡Buen provecho! 🐾"}
      </h2>

      {/* Bloque de monedas */}
      <div
        style={{
          margin: "10px 0",
          display: totalPayout > 0 ? "block" : "none",
        }}
      >
        <p
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            color: "#fff",
            margin: 0,
          }}
        >
          +{totalPayout.toLocaleString()} Monedas
        </p>

        {/* El contenedor del multiplicador siempre se renderiza, cambia su visibilidad */}
        <span
          style={{
            display: hasMultiplier ? "inline-block" : "none",
            background: "var(--salmon)",
            color: "#000",
            padding: "2px 8px",
            borderRadius: "4px",
            fontWeight: "bold",
            fontSize: "0.9rem",
            marginTop: "5px",
          }}
        >
          ¡MULTIPLICADOR x{activeMultiplier} APLICADO!
        </span>
      </div>

      {/* Bloque de Free Spins */}
      <div
        style={{
          display: hasFreeSpins ? "block" : "none",
          background: "rgba(255, 215, 0, 0.2)",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid var(--gold)",
          marginTop: "10px",
        }}
      >
        <p
          style={{
            color: "var(--gold)",
            fontWeight: "bold",
            fontSize: "1.2rem",
            margin: 0,
          }}
        >
          ✨ ¡GANASTE {freeSpinsWon} GIROS GRATIS! ✨
        </p>
      </div>

      {/* Contador de líneas */}
      <div
        style={{
          display: winningLines.length > 0 ? "block" : "none",
          fontSize: "0.8rem",
          opacity: 0.7,
          marginTop: "8px",
          color: "var(--cream)",
        }}
      >
        Líneas completadas: {winningLines.length}
      </div>
    </div>
  );
};
