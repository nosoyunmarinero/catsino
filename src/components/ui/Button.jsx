import React from 'react';

export const Button = ({ children, onClick, disabled, variant = 'primary', className = '' }) => {
  const baseStyle = {
    padding: '10px 20px',
    borderRadius: '12px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'var(--font-display)',
    fontSize: '1rem',
    transition: 'all 0.1s ease',
    transform: 'scale(1)',
    opacity: disabled ? 0.5 : 1,
    boxShadow: '0 4px 0px rgba(0,0,0,0.3)'
  };

  const themes = {
    primary: { bg: 'var(--gold)', color: 'var(--dark)' },
    danger: { bg: 'var(--salmon)', color: 'var(--dark)' },
    dark: { bg: 'var(--bg-casino)', color: 'var(--cream)', border: '2px solid var(--gold)' }
  };

  const theme = themes[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        ...baseStyle,
        backgroundColor: theme.bg,
        color: theme.color,
        border: theme.border || 'none'
      }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = 'translateY(3px)')}
      onMouseUp={(e) => !disabled && (e.currentTarget.style.transform = 'translateY(0px)')}
      onMouseLeave={(e) => !disabled && (e.currentTarget.style.transform = 'translateY(0px)')}
    >
      {children}
    </button>
  );
};