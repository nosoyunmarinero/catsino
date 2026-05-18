// src/components/ui/CoinDisplay.jsx
import React from 'react';

export const CoinDisplay = ({ value, label = "🐟 Créditos" }) => {
  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.4)',
      padding: '8px 16px',
      borderRadius: '20px',
      border: '2px solid var(--gold)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontFamily: 'var(--font-display)',
      minWidth: '140px',
      justifyContent: 'center'
    }}>
      <span style={{color: 'var(--gold)'}}>{label}:</span>
      <span style={{color: '#fff', letterSpacing: '1px'}}>{value.toLocaleString()}</span>
    </div>
  );
};
