import React from 'react';
import '../../../styles/animations.css';

export const ReelStrip = ({ symbolsColumn, isSpinning, colIndex, winningCoords }) => {
  // Mantenemos la cinta visual idéntica para evitar saltos gráficos
  const visualStrip = isSpinning
    ? [...symbolsColumn, ...symbolsColumn, ...symbolsColumn, ...symbolsColumn]
    : symbolsColumn;

  return (
    <div className="reel-box" style={{
      width: '19%',
      height: '280px',
      background: 'rgba(0, 0, 0, 0.75)',
      borderRadius: '12px',
      padding: '4px',
      overflow: 'hidden',
      position: 'relative',
      border: '2px solid rgba(255, 215, 0, 0.25)',
      boxShadow: 'inset 0 0 15px rgba(0,0,0,0.9)'
    }}>
      <div 
        className={isSpinning ? "reel-rolling-container blur-motion" : "reel-bounce"}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          transform: 'translateY(0)'
        }}
      >
        {visualStrip.map((symbol, rowIndex) => {
          // SOLUCIÓN AL HIGHLIGHT:
          // Las coordenadas de slotEngine.js vienen como [fila, columna] (un array de números).
          // coord[0] es la fila (row) y coord[1] es la columna (col).
          const isWinningSymbol = !isSpinning && winningCoords && winningCoords.some(
            coord => Array.isArray(coord) && coord[0] === rowIndex && coord[1] === colIndex
          );

          return (
            <div
              key={rowIndex}
              className="symbol-card"
              style={{
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.3rem',
                borderRadius: '8px',
                flexShrink: 0,
                background: isWinningSymbol ? 'rgba(255, 215, 0, 0.25)' : 'rgba(255,255,255,0.02)',
                border: isWinningSymbol ? '2px solid var(--gold)' : '2px solid transparent',
                boxShadow: isWinningSymbol ? '0 0 12px var(--gold), inset 0 0 8px rgba(255,215,0,0.3)' : 'none',
                transform: isWinningSymbol ? 'scale(1.03)' : 'scale(1)',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <div>{symbol?.label || '🐟'}</div>
              <div style={{ fontSize: '0.55rem', color: 'var(--cream)', opacity: 0.5, fontFamily: 'var(--font-ui)' }}>
                {!isSpinning && symbol?.name ? symbol.name.split(' ')[1] : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};