import React from 'react';
import { Header } from './components/layout/Header';
import { SlotMachine } from './components/games/slots/SlotMachine';
import './styles/globals.css';

function App() {
  return (
    <div>
      <Header />
      <main style={{ padding: '20px' }}>
        <SlotMachine />
      </main>
    </div>
  );
}

export default App;