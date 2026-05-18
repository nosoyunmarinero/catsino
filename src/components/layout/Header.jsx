import React from 'react';
import { useCasinoStore } from '../../store/useCasinoStore';
import { CoinDisplay } from '../ui/CoinDisplay';

export const Header = () => {
  const { balance } = useCasinoStore();

  return (
    <header style={{
      background: 'rgba(17, 17, 17, 0.85)',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '3px solid var(--gold)',
      backdropFilter: 'blur(5px)',
      position: 'sticky',
      top: 0, zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '2rem' }}>🐈</span>
        <h2 style={{ color: 'var(--gold)', margin: 0, letterSpacing: '1px' }}>CATSINO</h2>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <CoinDisplay value={balance} label="🐟 Saldo" />
      </div>
    </header>
  );
};