import React from 'react';
import { PAYTABLE, SYMBOLS } from '../../../engine/constants';
import { Button } from '../../ui/Button';

export const PaytableModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <h2 style={{ color: 'var(--gold)', textAlign: 'center', marginBottom: '15px' }}>🐾 Manual del Catsino</h2>
        
        {/* TABLA DE PREMIOS CON MEMES RENDERIZADOS */}
        <h3 style={{ color: 'var(--salmon)', marginBottom: '10px', fontSize: '1rem' }}>Premios (Combo de 3 a 5 iguales):</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
          {Object.keys(PAYTABLE).map((key) => {
            const sym = SYMBOLS[key];
            if (!sym) return null;
            return (
              <div key={key} style={{ 
                background: 'rgba(0,0,0,0.3)', 
                padding: '6px 10px', 
                borderRadius: '8px', 
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <img 
                  src={sym.label} 
                  alt={sym.name} 
                  style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '4px' }} 
                />
                <div>
                  <strong>{sym.name}:</strong> <br />
                  <span style={{ color: 'var(--gold)' }}>3x: x{PAYTABLE[key][3]}</span> | 
                  <span style={{ color: 'var(--gold)' }}> 5x: x{PAYTABLE[key][5]}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* SÍMBOLOS ESPECIALES Y NUEVAS MECÁNICAS */}
        <h3 style={{ color: 'var(--salmon)', marginBottom: '10px', fontSize: '1rem' }}>Símbolos Especiales & Bonus:</h3>
        
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
            <img src={SYMBOLS.WILD.label} alt="WILD" style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px' }} />
            <p style={{ fontSize: '0.85rem', margin: 0 }}>
              <strong>WILD (Comodín):</strong> Sustituye a cualquier gato en las líneas para completar combinaciones (excepto Scatters).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
            <img src={SYMBOLS.SCATTER.label} alt="SCATTER" style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px' }} />
            <p style={{ fontSize: '0.85rem', margin: 0 }}>
              <strong>SCATTER (Gato Bonus):</strong> 3 o más en cualquier posición otorgan monedas y activan la ronda de <strong>Giros Gratis</strong> (3 = 10 FS, 4 = 15 FS, 5 = 25 FS).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', marginTop: '8px' }}>
            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>🔥</span>
            <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--gold)' }}>
              <strong>Meme Multiplier:</strong> ¡Cualquier tiro ganador tiene un 25% de probabilidad de activar un multiplicador sorpresa de <strong>x2, x3, x5 o x10</strong> sobre el premio total!
            </p>
          </div>
        </div>

        {/* REGLAS DEL JUEGO */}
        <h3 style={{ color: 'var(--salmon)', marginBottom: '8px', fontSize: '1rem' }}>Reglas del Juego:</h3>
        <ul style={{ fontSize: '0.8rem', paddingLeft: '15px', lineHeight: '1.4', marginBottom: '20px', color: '#ccc' }}>
          <li>Los premios de línea pagan consecutivamente de <strong>izquierda a derecha</strong> comenzando por el primer rodillo.</li>
          <li>Solo paga la ganancia más alta por línea de pago activa.</li>
          <li>Los Giros Gratis se juegan automáticamente con la misma apuesta que los activó y no descuentan de tu balance.</li>
          <li>Tu apuesta total equivale a: (Líneas Activas) × (Apuesta por Línea).</li>
        </ul>

        <Button variant="primary" onClick={onClose} style={{ width: '100%' }}>¡Entendido, a ganar!</Button>
      </div>
    </div>
  );
};