import React from "react";
import "../../../styles/animations.css";

export const ReelStrip = ({
  symbolsColumn,
  isSpinning,
  colIndex,
  winningCoords,
  explodingCoords = [],
}) => {
  const visualStrip = isSpinning
    ? [...symbolsColumn, ...symbolsColumn, ...symbolsColumn]
    : symbolsColumn;

  return (
    <div
      className="reel-box"
      style={{
        width: "19.5%",
        height: "var(--reel-height)",
        background: "rgba(0, 0, 0, 0.9)",
        borderRadius: "12px",
        padding: "4px 2px",
        overflow: "hidden",
        position: "relative",
        border: "2px solid rgba(255, 215, 0, 0.3)",
        boxShadow: "inset 0 0 20px rgba(0,0,0,1)",
        boxSizing: "border-box",
      }}
    >
      <div
        className={
          isSpinning ? "reel-rolling-container blur-motion" : "reel-bounce"
        }
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          height: isSpinning ? "auto" : "100%",
          justifyContent: isSpinning ? "flex-start" : "space-between",
        }}
      >
        {visualStrip.map((symbol, rowIndex) => {
          // Detectar si pertenece a una línea ganadora activa
          const isWinningSymbol =
            !isSpinning &&
            winningCoords &&
            winningCoords.some(
              (coord) =>
                Array.isArray(coord) &&
                coord[0] === rowIndex &&
                coord[1] === colIndex
            );

          // Detectar si está en proceso de explotación
          const isThisExploding =
            !isSpinning &&
            explodingCoords.some(
              (coord) =>
                Array.isArray(coord) &&
                coord[0] === rowIndex &&
                coord[1] === colIndex
            );

          const isImageUrl =
            typeof symbol?.label === "string" &&
            (symbol.label.startsWith("http://") ||
              symbol.label.startsWith("https://") ||
              symbol.label.startsWith("/") ||
              symbol.label.startsWith("data:image/"));

          // 🌟 CLAVE DEL FIX: Generamos un identificador único que cambia cuando cae un nuevo símbolo.
          // Esto obliga a CSS a ejecutar la animación de deslizamiento (cascade-fall).
          const cellKey = isSpinning
            ? `spinning-${rowIndex}`
            : `cell-${rowIndex}-${colIndex}-${
                symbol?.id || symbol?.name || "empty"
              }`;

          return (
            <div
              key={cellKey}
              // Inyectamos las clases CSS de las animaciones correspondientes
              className={`symbol-card ${
                isThisExploding
                  ? "cell-exploding"
                  : isSpinning
                  ? ""
                  : "cell-cascading"
              }`}
              style={{
                width: "100%",
                height: "var(--symbol-height)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                flexShrink: 0,
                background: isWinningSymbol
                  ? "rgba(255, 215, 0, 0.35)"
                  : "rgba(255,255,255,0.01)",
                border: isWinningSymbol
                  ? "2.5px solid var(--gold)"
                  : "1px solid rgba(255,255,255,0.04)",
                boxShadow: isWinningSymbol
                  ? "0 0 15px var(--gold), inset 0 0 10px rgba(255,215,0,0.4)"
                  : "none",
                transition: "background 0.2s ease, border 0.2s ease",
                overflow: "hidden",
                position: "relative",
                boxSizing: "border-box",
                padding: "4px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {isImageUrl ? (
                  <img
                    src={symbol.label}
                    alt={symbol?.name || "Meme Cat"}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: "6px",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: "clamp(1rem, 5vw, 2rem)" }}>
                    {symbol?.label || "🐱"}
                  </span>
                )}
              </div>

              {!isSpinning && symbol?.name && !isThisExploding && (
                <div
                  className="mobile-hide"
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "var(--cream)",
                    fontSize: "0.48rem",
                    fontFamily: "var(--font-ui)",
                    padding: "1px 5px",
                    borderRadius: "4px",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    zIndex: 2,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {symbol.name}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
