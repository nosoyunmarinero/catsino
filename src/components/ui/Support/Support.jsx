// src/components/ui/Support.jsx
import React, { useState } from "react";
import "./Support.css";
// 🌟 Ruta corregida según tus assets
import supportImage from "../../../assets/qr.png";

export function Support() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
  className="catzzino-support-btn"
  onClick={() => setShowModal(true)}
  title="Support 💙"
>
  💙
</button>

      {showModal && (
        <div
          className="support-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="support-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="support-modal-close"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            <h2 className="support-modal-title">Support this project :D</h2>
            <p className="support-modal-text">Buy me a Coffee ☕</p>

            <a
              href="https://buymeacoffee.com/nosoyunmarinero"
              target="_blank"
              rel="noopener noreferrer"
              className="support-modal-link"
            >
              buymeacoffee.com/nosoyunmarinero
            </a>

            <img
              src={supportImage}
              alt="Support QR Code"
              className="support-modal-image"
            />

            <p className="support-modal-subtitle">
              Scan the QR code or click the link above
            </p>

            {/* 🌟 Sección del Portafolio Añadida */}
            <div
              style={{
                marginTop: "20px",
                paddingTop: "15px",
                borderTop: "1px solid rgba(255, 215, 0, 0.2)",
              }}
            >
              <p
                style={{
                  fontSize: "0.9rem",
                  marginBottom: "5px",
                  color: "var(--cream)",
                }}
              >
                Check out my other projects:
              </p>
              <a
                href="https://nosoyunmarinero.github.io/francis-portfolio-frontend/"
                target="_blank"
                rel="noopener noreferrer"
                className="support-modal-portfolio-link"
              >
                🌐 View My Portfolio
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
