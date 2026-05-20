// src/components/layout/GameSelector.jsx
import React from 'react';
import { Button } from '../ui/Button';

export const GameSelector = ({ onSelectGame }) => {
  const games = [
    { id: 'slots', name: 'Cat Slots', icon: '🎰', description: 'La única forma lógicamente irresponsable de vaciar tu tazón o multiplicar tus pescados de por vida.', available: true },
    { id: 'blackjack', name: 'Blackjack', icon: '🃏', description: 'Próximamente...', available: false },
    { id: 'roulette', name: 'Ruleta', icon: '🎡', description: 'Próximamente...', available: false },
  ];

  return (
    <div style={{
      maxWidth: '800px',
      width: '95%',
      margin: '0 auto', /* 🌟 CAMBIADO: Eliminamos el margen vertical que causaba el desborde */
      padding: '10px 0',
      textAlign: 'center',
      animation: 'fadeIn 0.5s ease-out',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      {/* Reducción de márgenes y tamaño de fuente adaptable */}
      <h1 style={{ 
        color: 'var(--gold)', 
        marginBottom: '20px', 
        fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', /* No se desborda en pantallas chicas */
        marginTop: '5px'
      }}>
        🎮 Selecciona tu Juego 🎮
      </h1>
      
      <div style={{
        display: 'grid',
        /* 🌟 OPTIMIZADO: Ajustamos el mínimo a 220px para que entren mejor en tablets y laptops medianas */
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '15px',
        padding: '5px',
        maxHeight: '70vh', /* Candado para asegurar que la rejilla no pase del alto disponible */
      }}>
        {games.map((game) => (
          <div 
            key={game.id}
            onClick={() => game.available && onSelectGame(game.id)}
            style={{
              background: '#1a3a2a',
              borderRadius: '20px',
              border: `4px solid ${game.available ? 'var(--gold)' : '#333'}`,
              padding: '20px 15px', /* Un poco más compacto para prevenir desbordes */
              cursor: game.available ? 'pointer' : 'not-allowed',
              opacity: game.available ? 1 : 0.7,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => {
              if (game.available) {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', display: 'block', marginBottom: '10px' }}>{game.icon}</span>
            <h2 style={{ color: 'var(--gold)', marginBottom: '8px', fontSize: 'clamp(1.1rem, 4vw, 1.4rem)' }}>{game.name}</h2>
            <p style={{ color: 'var(--cream)', fontSize: '0.85rem', opacity: 0.8, margin: 0 }}>{game.description}</p>
            
            {!game.available && (
              <div style={{
                marginTop: '12px',
                background: 'rgba(0,0,0,0.5)',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: 'var(--salmon)',
                fontWeight: 'bold'
              }}>
                BAJO CONSTRUCCIÓN 🚧
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};