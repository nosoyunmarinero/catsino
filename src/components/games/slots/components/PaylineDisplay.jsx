// src/components/games/slots/components/PaylineDisplay.jsx
import React from 'react';
import { PAYLINES } from '../engine/slotConstants';

export const PaylineDisplay = ({ activeLinesCount }) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 2
    }}>
      {/* Marcadores visuales laterales informales de líneas */}
      {PAYLINES.slice(0, activeLinesCount).map((line) => (
        <div 
          key={line.id}
          style={{
            position: 'absolute',
            left: '-15px',
            top: `${35 + (line.id * 22) % 240}px`,
            background: line.color,
            color: '#000',
            fontSize: '0.65rem',
            fontWeight: 'bold',
            padding: '2px 5px',
            borderRadius: '4px'
          }}
        >
          {line.id}
        </div>
      ))}
    </div>
  );
};
