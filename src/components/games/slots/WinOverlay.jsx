import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

export const WinOverlay = ({ winData }) => {
  if (!winData) return null;

  const { totalPayout, freeSpinsWon, activeMultiplier, winningLines } = winData;
  const isBigWin = totalPayout >= 100;
  const hasMultiplier = activeMultiplier > 1;
  const hasFreeSpins = freeSpinsWon > 0;

  useEffect(() => {
    if (isBigWin || hasFreeSpins) {
      // Disparar confeti si el minino gana en grande o gana free spins
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [winData, isBigWin, hasFreeSpins]);

  if (totalPayout === 0 && freeSpinsWon === 0) return null;

  return (
    <div 
      className={isBigWin ? "big-win-shake" : ""}
      style={{
        textAlign: 'center',
        margin: '15px 0',
        padding: '12px',
        background: 'rgba(0,0,0,0.75)',
        borderRadius: '12px',
        border: '2px dashed var(--gold)',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <h2 style={{ color: 'var(--gold)', fontSize: isBigWin ? '2rem' : '1.3rem', margin: '5px 0' }}>
        {isBigWin ? '😻 ¡MIAU-GIGA GANANCIA! 😻' : hasFreeSpins ? '🎰 ¡BONUS DE GIROS! 🎰' : '🐾 ¡Buen provecho! 🐾'}
      </h2>

      {totalPayout > 0 && (
        <div style={{ margin: '10px 0' }}>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>
            +{totalPayout.toLocaleString()} Monedas
          </p>
          {hasMultiplier && (
            <span style={{ 
              background: 'var(--salmon)', 
              color: '#000', 
              padding: '2px 8px', 
              borderRadius: '4px',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              ¡MULTIPLICADOR x{activeMultiplier} APLICADO!
            </span>
          )}
        </div>
      )}

      {hasFreeSpins && (
        <div style={{ 
          background: 'rgba(255, 215, 0, 0.2)', 
          padding: '10px', 
          borderRadius: '8px',
          border: '1px solid var(--gold)',
          marginTop: '10px'
        }}>
          <p style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '1.2rem', margin: 0 }}>
            ✨ ¡GANASTE {freeSpinsWon} GIROS GRATIS! ✨
          </p>
        </div>
      )}

      <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '8px' }}>
        {winningLines.length > 0 && `Líneas completadas: ${winningLines.length}`}
      </div>
    </div>
  );
};
