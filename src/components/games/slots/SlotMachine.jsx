import React, { useState } from 'react';
import { useSlotMachine } from '../../../hooks/useSlotMachine';
import { useAutobet } from '../../../hooks/useAutobet';
import { useCasinoStore } from '../../../store/useCasinoStore';
import { ReelStrip } from './ReelStrip';
import { PaylineDisplay } from './PaylineDisplay';
import { WinOverlay } from './WinOverlay';
import { PaytableModal } from './PaytableModal';
import { Button } from '../../ui/Button';
import { PRESET_BETS } from '../../../engine/constants';

export const SlotMachine = () => {
  const { balance, turboMode, setTurboMode, claimFreeCoins } = useCasinoStore();
  const [showIntro, setShowIntro] = useState(true); // Control de la pantalla de historia de Gatoberto
  const [modalOpen, setModalOpen] = useState(false); // Estado del modal de reglas

  const {
    betPerLine, setBetPerLine,
    activeLines, setActiveLines,
    totalBet, spinning, displayMatrix,
    winData, spin, isAnyReelSpinning
  } = useSlotMachine();

  const { isAutoActive, remainingSpins, startAuto, stopAuto } = useAutobet(
    spin, isAnyReelSpinning, balance, totalBet
  );

  const winningCoords = winData ? winData.winningLines.flatMap(l => l.coords) : [];

  // PANTALLA DE INICIO (Backstory de Gatoberto)
  if (showIntro) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '50px auto',
        background: '#1a3a2a',
        padding: '40px 30px',
        borderRadius: '24px',
        border: '4px solid var(--gold)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        textAlign: 'center',
        fontFamily: 'var(--font-ui)'
      }}>
        <span style={{ fontSize: '4rem' }}>🐈💼</span>
        <h1 style={{ color: 'var(--gold)', marginTop: '15px', fontSize: '2.2rem' }}>La Odisea de Gatoberto</h1>
        
        <div style={{
          background: 'rgba(0,0,0,0.4)',
          padding: '20px',
          borderRadius: '16px',
          margin: '25px 0',
          lineHeight: '1.6',
          textAlign: 'justify',
          color: 'var(--cream)',
          borderLeft: '4px solid var(--salmon)'
        }}>
          <p style={{ marginBottom: '12px' }}>
            <strong>Gatoberto</strong> era un felino promedio de oficina, atrapado persiguiendo el puntero láser corporativo de 9 a 5. Sin embargo, tras una mala racha comprando cajas de cartón sobrevaloradas y acciones de arena para baño premium, su cuenta quedó en la ruina.
          </p>
          <p>
            Hoy, con el agua al cuello y el tazón vacío, solo le quedan sus últimas <strong>1,000 monedas de pescado</strong>. Como todo un felino maduro, consciente y extremadamente responsable, ha decidido que la única forma lógica de estabilizar su futuro financiero es... <strong>¡Apostarlo todo en el Catsino!</strong> 🐾🎰
          </p>
        </div>

        <Button 
          variant="primary" 
          onClick={() => {
            // Inicializar el saldo a 1000 por la historia si está en bancarrota o por defecto
            if(balance !== 1000) {
              useCasinoStore.setState({ balance: 1000 });
            }
            setShowIntro(false);
          }}
          style={{ padding: '15px 40px', fontSize: '1.2rem', width: '100%' }}
        >
          😼 Ayudar a Gatoberto a apostar responsablemente
        </Button>
      </div>
    );
  }

  // PANTALLA PRINCIPAL DEL JUEGO
  return (
    <div className="slot-cabinet" style={{
      maxWidth: '850px', margin: '30px auto', background: '#2c1e14',
      padding: '25px', borderRadius: '30px', boxShadow: '0 15px 0px #1a110a',
      border: '6px solid var(--gold)', position: 'relative'
    }}>
      {/* Orejas de Gato Decorativas */}
      <div style={{
        position: 'absolute', top: '-25px', left: '40px', width: '0', height: '0',
        borderLeft: '25px solid transparent', borderRight: '25px solid transparent',
        borderBottom: '26px solid var(--gold)'
      }} />
      <div style={{
        position: 'absolute', top: '-25px', right: '40px', width: '0', height: '0',
        borderLeft: '25px solid transparent', borderRight: '25px solid transparent',
        borderBottom: '26px solid var(--gold)'
      }} />

      {/* Botón de información / Info Tab */}
      <button 
        onClick={() => setModalOpen(true)}
        style={{
          position: 'absolute', top: '15px', right: '20px', background: 'var(--gold)',
          border: 'none', borderRadius: '50%', width: '35px', height: '35px',
          fontFamily: 'var(--font-display)', fontSize: '1.2rem', cursor: 'pointer', zIndex: 5,
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
        }}
      >
        ℹ️
      </button>

      <h1 style={{ textAlign: 'center', color: 'var(--gold)', marginBottom: '15px', letterSpacing: '2px' }}>
        🎰 CATSINO SLOTS 🎰
      </h1>

      {/* Pantalla de Rodillos */}
      <div className="reel-container" style={{
        position: 'relative', display: 'flex', justifyContent: 'space-between',
        background: '#15251d', padding: '20px', borderRadius: '15px',
        border: '4px solid #111', overflow: 'hidden'
      }}>
        <PaylineDisplay activeLinesCount={activeLines} />
        
        {[0, 1, 2, 3, 4].map((colIndex) => (
          <ReelStrip
            key={colIndex}
            colIndex={colIndex}
            symbolsColumn={displayMatrix.map(row => row[colIndex])}
            isSpinning={spinning[colIndex]}
            winningCoords={winningCoords}
          />
        ))}
      </div>

      <WinOverlay winData={winData} />

      {/* Panel de Control Interactivo */}
      <div style={{
        marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px', background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '12px'
      }}>
        {/* Modificador Dinámico de Bet */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--gold)' }}>
            Apuesta por Línea:
          </label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {PRESET_BETS.map((amt) => (
              <button
                key={amt}
                disabled={isAnyReelSpinning || isAutoActive}
                onClick={() => setBetPerLine(amt)}
                style={{
                  flex: '1 0 25%',
                  padding: '8px 4px',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  border: 'none',
                  background: betPerLine === amt ? 'var(--gold)' : '#1a110a',
                  color: betPerLine === amt ? '#000' : 'var(--cream)',
                  boxShadow: '0 3px 0 rgba(0,0,0,0.4)',
                  transition: 'transform 0.1s ease'
                }}
              >
                {amt}
              </button>
            ))}
          </div>
        </div>

        {/* Selector de Líneas */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--gold)' }}>
            Líneas de Pago Activas: <strong>{activeLines}</strong>
          </label>
          <input
            type="range" min="1" max="9" value={activeLines}
            disabled={isAnyReelSpinning || isAutoActive}
            onChange={(e) => setActiveLines(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer', marginTop: '10px' }}
          />
        </div>

        {/* Utilidades de Juego */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
          <Button
            variant={turboMode ? 'primary' : 'dark'}
            onClick={() => setTurboMode(!turboMode)}
          >
            ⚡ Turbo: {turboMode ? 'SÚPER MIAU' : 'NORMAL'}
          </Button>
          
          {balance <= 0 && (
            <Button variant="danger" onClick={claimFreeCoins}>
              🐟 Auxilio para Gatoberto: +1000
            </Button>
          )}
        </div>
      </div>

      {/* Botonera de Acción */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: '20px', gap: '15px', flexWrap: 'wrap'
      }}>
        <div style={{ textAlign: 'left' }}>
          <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Apuesta Total (Líneas × Valor):</span>
          <h2 style={{ color: 'var(--salmon)', fontFamily: 'var(--font-display)', margin: 0 }}>
            🐾 {totalBet.toLocaleString()} créditos
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {isAutoActive ? (
            <Button variant="danger" onClick={stopAuto}>
              🛑 Frenar Auto ({remainingSpins})
            </Button>
          ) : (
            <Button
              variant="dark"
              disabled={isAnyReelSpinning || balance < totalBet}
              onClick={() => startAuto(25)}
            >
              🔄 Auto 25
            </Button>
          )}

          <Button
            variant="primary"
            disabled={isAnyReelSpinning || isAutoActive || balance < totalBet}
            onClick={spin}
            style={{ padding: '15px 45px', fontSize: '1.5rem' }}
          >
            {isAnyReelSpinning ? 'Girando...' : '🐾 ¡JUGAR!'}
          </Button>
        </div>
      </div>

      {/* Modal de Reglas y Significado de Símbolos */}
      <PaytableModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};