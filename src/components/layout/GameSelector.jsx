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
      margin: '20px auto',
      textAlign: 'center',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <h1 style={{ color: 'var(--gold)', marginBottom: '30px', fontSize: 'var(--font-size-h1)' }}>
        🎮 Selecciona tu Juego 🎮
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        padding: '10px'
      }}>
        {games.map((game) => (
          <div 
            key={game.id}
            onClick={() => game.available && onSelectGame(game.id)}
            style={{
              background: '#1a3a2a',
              borderRadius: '24px',
              border: `4px solid ${game.available ? 'var(--gold)' : '#333'}`,
              padding: '25px',
              cursor: game.available ? 'pointer' : 'not-allowed',
              opacity: game.available ? 1 : 0.7,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              if (game.available) {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '15px' }}>{game.icon}</span>
            <h2 style={{ color: 'var(--gold)', marginBottom: '10px' }}>{game.name}</h2>
            <p style={{ color: 'var(--cream)', fontSize: '0.9rem', opacity: 0.8 }}>{game.description}</p>
            
            {!game.available && (
              <div style={{
                marginTop: '15px',
                background: 'rgba(0,0,0,0.5)',
                padding: '5px 10px',
                borderRadius: '8px',
                fontSize: '0.8rem',
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
