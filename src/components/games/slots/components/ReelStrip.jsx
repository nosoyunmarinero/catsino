// src/components/games/slots/components/ReelStrip.jsx
import React from "react";
import "../../../../styles/animations.css";

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

          // Detectar si está en proceso de explotación (ya sea por línea o por ser multiplicador sumado)
          const isThisExploding =
            !isSpinning &&
            explodingCoords.some(
              (coord) =>
                Array.isArray(coord) &&
                coord[0] === rowIndex &&
                coord[1] === colIndex
            );

          // 🌟 DETECTAR MULTIPLICADOR: Incluso si el motor ya lo limpió a "empty", 
          // usamos el ID único o el rastro del estado para saber que AQUÍ había un multiplicador explotando.
          const isMultiplier = 
            !isSpinning && 
            ((symbol?.name && (symbol.name.toLowerCase().includes("multiplier") || symbol.name.toLowerCase().includes("mult"))) ||
             (isThisExploding && symbol?.id && (symbol.id.toLowerCase().includes("multiplier") || symbol.id.toLowerCase().includes("mult"))));

          const isImageUrl =
            typeof symbol?.label === "string" &&
            (symbol.label.startsWith("http://") ||
              symbol.label.startsWith("https://") ||
              symbol.label.startsWith("/") ||
              symbol.label.startsWith("data:image/"));

          // Identificador único por símbolo
          const cellKey = isSpinning
            ? `spinning-${rowIndex}`
            : `cell-${rowIndex}-${colIndex}-${
                symbol?.id || symbol?.name || "empty"
              }`;

          // Lógica de control para evitar el parpadeo óptico de la cascada
          const isCascadingPhase = !isSpinning && (explodingCoords.length > 0 || winningCoords.length > 0);
          
          let distanceY = "-250px"; 
          let startOpacity = "0";    
          
          if (isCascadingPhase && symbol) {
            const isSurvivor = symbol.id && !symbol.id.includes("empty");
            if (isSurvivor) {
              distanceY = "-140px"; 
              startOpacity = "1";    
            }
          }

          // ASIGNACIÓN DE ESTILOS DE FONDO Y BORDES
          let finalBackground = "rgba(255,255,255,0.01)";
          let finalBorder = "1px solid rgba(255,255,255,0.04)";
          let finalBoxShadow = "none";
          let multiplierClass = "";

          if (isThisExploding) {
            // 🔥 CLAVE: Cuando explota, forzamos desaparecer visualmente para que se ejecuten las partículas o desvanecimiento del CSS
            finalBackground = "transparent";
            finalBorder = "none";
            finalBoxShadow = "none";
          } else if (isWinningSymbol) {
            finalBackground = "rgba(255, 215, 0, 0.35)";
            finalBorder = "2.5px solid var(--gold)";
            finalBoxShadow = "0 0 15px var(--gold), inset 0 0 10px rgba(255,215,0,0.4)";
          } else if (isMultiplier && symbol?.name !== "empty") {
            finalBackground = "radial-gradient(circle, rgba(147,51,234,0.3) 0%, rgba(0,0,0,0.4) 100%)"; 
            finalBorder = "2px solid #a855f7"; 
            finalBoxShadow = "0 0 12px rgba(168, 85, 247, 0.6), inset 0 0 8px rgba(168, 85, 247, 0.3)";
            multiplierClass = " multiplier-pulse"; 
          }

          return (
            <div
              key={cellKey}
              className={`symbol-card ${
                isThisExploding
                  ? "cell-exploding"
                  : isSpinning
                  ? ""
                  : "cell-cascading"
              }${multiplierClass}`}
              style={{
                width: "100%",
                height: "var(--symbol-height)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                flexShrink: 0,
                background: finalBackground,
                border: finalBorder,
                boxShadow: finalBoxShadow,
                transition: "background 0.2s ease, border 0.2s ease, transform 0.2s ease",
                overflow: "hidden",
                position: "relative",
                boxSizing: "border-box",
                padding: "4px",
                animationDelay: isThisExploding ? "0s" : `${(4 - rowIndex) * 0.08}s`,
                transform: isMultiplier && !isThisExploding ? "scale(1.03)" : "scale(1)", 
                zIndex: isMultiplier ? 3 : 1,
                "--cascade-distance": distanceY,
                "--cascade-start-opacity": startOpacity,
              }}
            >
              {/* Shimmer estático para multiplicadores activos */}
              {isMultiplier && !isThisExploding && (
                <div 
                  style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
                    transform: "translateX(-100%)",
                    animation: "shimmer 2.5s infinite",
                    pointerEvents: "none"
                  }}
                />
              )}

              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  filter: isMultiplier && !isThisExploding ? "drop-shadow(0 0 6px rgba(168, 85, 247, 0.8))" : "none"
                }}
              >
                {/* 🌟 AQUÍ: Aunque el backend empiece a limpiar el tablero, permitimos que el multiplicador se vea MIENTRAS esté corriendo la animación de explotar (`isThisExploding`) */}
                {(symbol?.name !== "empty" || isThisExploding) && (
                  isImageUrl ? (
                    <img
                      src={symbol.label}
                      alt={symbol?.name || "Multiplier"}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        borderRadius: "6px",
                      }}
                    />
                  ) : (
                    <span style={{ 
                      fontSize: isMultiplier ? "clamp(1.2rem, 5.5vw, 2.3rem)" : "clamp(1rem, 5vw, 2rem)",
                      fontWeight: isMultiplier ? "bold" : "normal",
                      color: isMultiplier ? "#f3e8ff" : "inherit"
                    }}>
                      {symbol?.label || "🐱"}
                    </span>
                  )
                )}
              </div>

              {!isSpinning && symbol?.name && symbol.name !== "empty" && !isThisExploding && (
                <div
                  className="mobile-hide"
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: isMultiplier ? "rgba(147, 51, 234, 0.9)" : "rgba(0, 0, 0, 0.7)",
                    color: isMultiplier ? "#fff" : "var(--cream)",
                    fontSize: "0.48rem",
                    fontFamily: "var(--font-ui)",
                    padding: "1px 5px",
                    borderRadius: "4px",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    zIndex: 2,
                    border: isMultiplier ? "1px solid #c084fc" : "1px solid rgba(255,255,255,0.1)",
                    fontWeight: isMultiplier ? "bold" : "normal"
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