import React from 'react';
import '../../../styles/animations.css';

export const ReelStrip = ({ symbolsColumn, isSpinning, colIndex, winningCoords }) => {
  // SOLUCIÓN AL BUG HIGH: Para que no haya saltos ni cambien los símbolos al frenar,
  // la cinta visual se genera SIEMPRE combinando los símbolos de destino.
  // Al mantener la misma estructura base durante el giro y el frenado, los iconos no cambian.
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
          // Detectar si este símbolo específico (mapeado al índice real 0-2) es parte de una línea ganadora
          const isWinningSymbol = !isSpinning && winningCoords?.some(
            coord => coord.row === (rowIndex % 3) && coord.col === colIndex
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
                background: isWinningSymbol ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255,255,255,0.02)',
                border: isWinningSymbol ? '2px solid var(--gold)' : 'none',
                boxShadow: isWinningSymbol ? '0 0 10px var(--gold)' : 'none',
                transition: 'all 0.2s ease'
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