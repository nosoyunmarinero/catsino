import React from 'react';
import { PAYTABLE, SYMBOLS, PAYLINES } from '../../../engine/constants';
import { Button } from '../../ui/Button';

export const PaytableModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ color: 'var(--gold)', textAlign: 'center', marginBottom: '15px' }}>🐾 Manual del Catsino</h2>
        
        <h3 style={{ color: 'var(--salmon)', marginBottom: '10px' }}>Premios (Combo de 3 a 5 iguales):</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          {Object.keys(PAYTABLE).map((key) => {
            const sym = SYMBOLS[key];
            return (
              <div key={key} style={{ background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '8px', fontSize: '0.85rem' }}>
                <strong>{sym.label} {sym.name.split(' ')[1]}:</strong> 
                <span style={{ color: 'var(--gold)' }}> x{PAYTABLE[key][3]}</span> | 
                <span style={{ color: 'var(--gold)' }}> x{PAYTABLE[key][5]} (Max)</span>
              </div>
            );
          })}
        </div>

        <h3 style={{ color: 'var(--salmon)', marginBottom: '10px' }}>Símbolos Especiales:</h3>
        <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>⭐ <strong>WILD:</strong> Sustituye a cualquier gato en las líneas de pago para completar combinaciones.</p>
        <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>🎰 <strong>SCATTER:</strong> Obtén 3 o más en cualquier posición de la pantalla para multiplicar tu apuesta total.</p>

        <h3 style={{ color: 'var(--salmon)', marginBottom: '10px' }}>Reglas del Juego:</h3>
        <ul style={{ fontSize: '0.85rem', paddingLeft: '15px', lineHeight: '1.5', marginBottom: '20px' }}>
          <li>Los premios de línea pagan consecutivamente de <strong>izquierda a derecha</strong> comenzando por el primer rodillo.</li>
          <li>Solo paga la ganancia más alta por línea de pago activa.</li>
          <li>Tu apuesta total equivale a: (Líneas Activas) × (Apuesta por Línea).</li>
        </ul>

        <Button variant="primary" onClick={onClose} style={{ width: '100%' }}>¡Entendido, a ganar!</Button>
      </div>
    </div>
  );
};