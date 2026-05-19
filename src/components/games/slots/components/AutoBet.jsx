// src/components/games/slots/components/AutoBet.jsx

import React, { useState } from 'react';
import { Button } from '../../../ui/Button';

export const AutoBet = ({
  isAutoActive,
  remainingSpins,
  startAuto,
  stopAuto,
  isAnyReelSpinning,
  balance,
  totalBet,
  freeSpinsLeft
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const autoOptions = [10, 25, 50, 100, Infinity];

  const handleSelectSpins = (amount) => {
    setShowOptions(false);
    startAuto(amount);
  };

  const renderLabel = (val) => {
    return val === Infinity ? '∞' : val;
  };

  return (
    <div style={{ position: 'relative', display: 'flex', flex: '1', maxWidth: '120px' }}>
      {isAutoActive ? (
        <Button
          variant="danger"
          onClick={stopAuto}
          style={{ width: '100%', padding: '10px' }}
        >
          🛑 Stop ({renderLabel(remainingSpins)})
        </Button>
      ) : (
        <>
          <Button
            variant="dark"
            disabled={isAnyReelSpinning || (balance < totalBet && freeSpinsLeft === 0)}
            onClick={() => setShowOptions(!showOptions)}
            style={{ width: '100%', padding: '10px' }}
          >
            🔄 Auto
          </Button>

          {showOptions && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: '0',
                width: '100%',
                background: '#1a110a',
                border: '2px solid var(--gold)',
                borderRadius: '8px',
                boxShadow: '0 -4px 10px rgba(0,0,0,0.5)',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                padding: '4px',
                boxSizing: 'border-box'
              }}
            >
              {autoOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelectSpins(opt)}
                  style={{
                    background: 'transparent',
                    color: 'var(--cream)',
                    border: 'none',
                    padding: '6px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.9rem',
                    borderRadius: '4px',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255,215,0,0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  {renderLabel(opt)}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};