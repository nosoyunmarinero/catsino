import React from 'react';
import '../../../styles/animations.css';

export const ReelStrip = ({ symbolsColumn, isSpinning, colIndex, winningCoords }) => {
  // Al girar clonamos el bloque completo para simular la cinta cíclica infinita
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
          // Evalúa el resalte ganando basándose en la matriz visible [fila, columna]
          const isWinningSymbol = !isSpinning && winningCoords && winningCoords.some(
            coord => Array.isArray(coord) && coord[0] === rowIndex && coord[1] === colIndex
          );

          // VALIDADOR CLAVE: Comprueba si la propiedad 'label' es una URL directa
          const isImageUrl = typeof symbol?.label === 'string' && (symbol.label.startsWith('http://') || symbol.label.startsWith('https://'));

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
                borderRadius: '8px',
                flexShrink: 0,
                background: isWinningSymbol ? 'rgba(255, 215, 0, 0.25)' : 'rgba(255,255,255,0.02)',
                border: isWinningSymbol ? '2px solid var(--gold)' : '2px solid transparent',
                boxShadow: isWinningSymbol ? '0 0 12px var(--gold), inset 0 0 8px rgba(255,215,0,0.3)' : 'none',
                transform: isWinningSymbol ? 'scale(1.03)' : 'scale(1)',
                transition: 'all 0.2s ease-in-out',
                overflow: 'hidden',
                padding: '4px'
              }}
            >
              {/* Contenedor adaptativo del Símbolo/Meme */}
              <div style={{ 
                width: '100%', 
                height: '55px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                {isImageUrl ? (
                  <img 
                    src={symbol.label} 
                    alt={symbol?.name || 'Meme Cat'} 
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain', // Ajusta el meme sin estirarlo feo
                      borderRadius: '6px'
                    }}
                  />
                ) : (
                  // Fallback por si acaso algún string plano se cuela
                  <span style={{ fontSize: '2rem' }}>{symbol?.label || '🐱'}</span>
                )}
              </div>

              {/* Nombre descriptivo del Gato */}
              <div style={{ fontSize: '0.55rem', color: 'var(--cream)', opacity: 0.5, fontFamily: 'var(--font-ui)', marginTop: '2px' }}>
                {!isSpinning && symbol?.name ? symbol.name : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};