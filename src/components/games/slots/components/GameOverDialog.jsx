// src/components/games/slots/components/GameOverDialog.jsx
import React from 'react';

export const GameOverDialog = ({ isOpen, onReset }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* 🐾 CORREGIDO: Dejado como texto plano directo dentro de <pre> sin llaves de JS para evitar conflictos de caracteres invisibles */}
        <pre style={styles.catArt}>
{`   /\_/\  
  ( o.o ) 
   > ^ <  
  /     \ 
 (       )`}
        </pre>
        <h2 style={styles.title}>GAME OVER</h2>
        <p style={styles.message}>Gatoberto esta en la quiebra</p>
        
        <button onClick={onReset} style={styles.button}>
          Pedir prestamo al banco
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    backgroundColor: '#1a1a24',
    border: '2px solid #a855f7',
    borderRadius: '16px',
    padding: '32px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 0 25px rgba(168, 85, 247, 0.4)',
  },
  catArt: {
    fontFamily: 'monospace',
    fontSize: '20px',
    color: '#9ca3af',
    lineHeight: '1.2',
    margin: '0 auto 16px auto',
    whiteSpace: 'pre',
  },
  title: {
    color: '#ef4444',
    fontSize: '28px',
    margin: '0 0 8px 0',
    fontWeight: 'bold',
    letterSpacing: '2px',
  },
  message: {
    color: '#e5e7eb',
    fontSize: '16px',
    margin: '0 0 24px 0',
  },
  button: {
    backgroundColor: '#a855f7',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
  }
};