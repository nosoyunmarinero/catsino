import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

export const WinOverlay = ({ winData }) => {
  if (!winData || winData.totalPayout === 0) return null;

  const isBigWin = winData.totalPayout >= 100;

  useEffect(() => {
    if (isBigWin) {
      // Disparar confeti si el minino gana en grande
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [winData, isBigWin]);

  return (
    <div 
      className={isBigWin ? "big-win-shake" : ""}
      style={{
        textAlign: 'center',
        margin: '15px 0',
        padding: '12px',
        background: 'rgba(0,0,0,0.75)',
        borderRadius: '12px',
        border: '2px dashed var(--gold)'
      }}
    >
      <h2 style={{ color: 'var(--gold)', fontSize: isBigWin ? '2rem' : '1.3rem' }}>
        {isBigWin ? '😻 ¡MIAU-GIGA GANANCIA! 😻' : '🐾 ¡Buen provecho! 🐾'}
      </h2>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
        +{winData.totalPayout} Monedas
      </p>
      <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
        Líneas completadas: {winData.winningLines.length}
      </span>
    </div>
  );
};