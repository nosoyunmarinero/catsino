// src/components/layout/Header.jsx
import React from "react";
import { useCasinoStore } from "../../store/useCasinoStore";
import { CoinDisplay } from "../ui/CoinDisplay";

export const Header = () => {
  const { balance } = useCasinoStore();

  return (
    <header
      style={{
        background: "rgba(17, 17, 17, 0.95)",
        padding: "10px 15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "3px solid var(--gold)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        gap: "10px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "clamp(1.2rem, 5vw, 1.8rem)" }}>🐈</span>
        <h2
          className="mobile-hide"
          style={{
            color: "var(--gold)",
            fontSize: "1.2rem",
            margin: 0,
            letterSpacing: "1px",
          }}
        >
          catzzino
        </h2>
      </div>

      <div style={{ transform: "scale(0.9)", transformOrigin: "right center" }}>
        <CoinDisplay value={balance} />
      </div>
    </header>
  );
};
