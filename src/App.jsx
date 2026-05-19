// src/App.jsx
import React, { useState, useEffect } from "react";
import { Header } from "./components/layout/Header";
import { GameSelector } from "./components/layout/GameSelector";
import { SlotMachine } from "./components/games/slots/components/SlotMachine";
import { Support } from "./components/ui/Support/Support";
import { AdBannerSystem } from "./components/ads/AdBannerSystem"; // 🌟 1. Importamos el sistema de Ads
import { useCasinoStore } from "./store/useCasinoStore";
import "./styles/globals.css";

function App() {
  const [currentGame, setCurrentGame] = useState(null); // 'slots', 'blackjack', 'roulette'
  const [showIntro, setShowIntro] = useState(true);
  const { balance } = useCasinoStore();

  const handleSelectGame = (gameId) => {
    setCurrentGame(gameId);
  };

  const handleBackToMenu = () => {
    setCurrentGame(null);
  };

  if (showIntro) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-casino)",
          padding: "20px",
        }}
      >
        {/* ... El cartel introductorio de Gatoberto se queda exactamente igual ... */}
        <div
          style={{
            maxWidth: "600px",
            width: "95%",
            background: "#1a3a2a",
            padding: "30px",
            borderRadius: "24px",
            border: "4px solid var(--gold)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "clamp(3rem, 15vw, 5rem)" }}>🐈💼</span>
          <h1
            style={{
              color: "var(--gold)",
              marginTop: "15px",
              fontSize: "clamp(1.5rem, 8vw, 2.5rem)",
            }}
          >
            catzzino
          </h1>

          <div
            style={{
              background: "rgba(0,0,0,0.4)",
              padding: "20px",
              borderRadius: "16px",
              margin: "25px 0",
              lineHeight: "1.6",
              textAlign: "justify",
              color: "var(--cream)",
              borderLeft: "4px solid var(--salmon)",
              fontSize: "1rem",
            }}
          >
            <p style={{ marginBottom: "12px" }}>
              <strong>Gatoberto</strong> era un felino promedio de oficina,
              atrapado persiguiendo el puntero láser corporativo de 9 a 5. Sin
              embargo, tras una mala racha comprando cajas de cartón
              sobrevaloradas y acciones de arena para baño premium, su cuenta
              quedó en la ruina.
            </p>
            <p>
              Hoy, con el agua al cuello y el tazón vacío, solo le quedan sus
              últimas <strong>1,000 monedas de pescado</strong>. Como todo un
              felino maduro, consciente y extremadamente responsable, ha
              decidido que la única forma lógica de estabilizar su futuro
              financiero es... <strong>¡Apostarlo todo en el catzzino!</strong>{" "}
              🐾🎰
            </p>
          </div>

          <button
            style={{
              width: "100%",
              padding: "15px",
              fontSize: "1.2rem",
              background: "var(--gold)",
              border: "none",
              borderRadius: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 0 #b8860b",
            }}
            onClick={() => {
              if (balance <= 0) useCasinoStore.setState({ balance: 1000 });
              setShowIntro(false);
            }}
          >
            😼 Entrar al Casino
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Header />

      <main
        style={{
          flex: 1,
          padding: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!currentGame ? (
          <GameSelector onSelectGame={handleSelectGame} />
        ) : (
          currentGame === "slots" && <SlotMachine onBack={handleBackToMenu} />
        )}
      </main>

      {/* 🌟 2. Sistema de Banners abajo fijado de forma general */}
      <AdBannerSystem />

      {/* Soporte flotante */}
      <Support />
    </div>
  );
}

export default App;
