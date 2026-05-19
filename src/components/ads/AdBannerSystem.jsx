// src/components/ads/AdBannerSystem.jsx
import React, { useState, useEffect, useRef } from "react";
import "./AdBannerSystem.css";

export function AdBannerSystem() {
  const [showAd, setShowAd] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [isAdLoading, setIsAdLoading] = useState(true);

  const countdownIntervalRef = useRef(null);
  const bannerRef = useRef(null);
  const interstitialRef = useRef(null);

  useEffect(() => {
    // 1. El banner inferior se activa a los 10 segundos
    const adTimer = setTimeout(() => {
      setShowAd(true);
    }, 10000);

    // 2. El modal publicitario salta cada 5 minutos
    const FIVE_MINUTES = 5 * 60 * 1000;
    const noticeTimer = setInterval(() => {
      setAdCountdown(5);
      setIsAdLoading(true);
      setShowNotice(true);
    }, FIVE_MINUTES);

    return () => {
      clearTimeout(adTimer);
      clearInterval(noticeTimer);
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
    };
  }, []);

  // 🌟 INYECCIÓN REAL DE MONETAG: Banner Inferior
  useEffect(() => {
    if (showAd && bannerRef.current) {
      // Limpiamos por si acaso el contenedor antes de inyectar
      bannerRef.current.innerHTML = "";

      const script = document.createElement("script");
      script.setAttribute("data-cfasync", "false");
      // CAMBIA ESTE ID por el Zone ID que te dé Monetag para el Banner:
      script.src = "//thubanoa.com/1v?z=1234567";

      bannerRef.current.appendChild(script);
    }
  }, [showAd]);

  // 🌟 INYECCIÓN REAL DE MONETAG: Anuncio Interstitial en el Modal
  useEffect(() => {
    if (showNotice && isAdLoading && interstitialRef.current) {
      interstitialRef.current.innerHTML = "";

      const script = document.createElement("script");
      script.setAttribute("data-cfasync", "false");
      // CAMBIA ESTE ID por el Zone ID que te dé Monetag para el Interstitial:
      script.src = "//thubanoa.com/1v?z=7654321";

      interstitialRef.current.appendChild(script);
    }
  }, [showNotice, isAdLoading]);

  // Lógica de la cuenta regresiva de 5 segundos
  useEffect(() => {
    if (showNotice && isAdLoading) {
      countdownIntervalRef.current = setInterval(() => {
        setAdCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            setIsAdLoading(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
    };
  }, [showNotice, isAdLoading]);

  return (
    <>
      {/* BANNER INFERIOR REAL */}
      <footer className="catsino-ad-wrapper">
        <div className="catsino-ad-container" ref={bannerRef}>
          {!showAd && (
            <div className="catsino-ad-loading">
              ESPACIO PUBLICITARIO DEL CASINO
            </div>
          )}
        </div>
      </footer>

      {/* MODAL INTERSTITIAL REAL */}
      {showNotice && (
        <div className="ad-notice-overlay">
          <div className="ad-notice-content">
            {isAdLoading ? (
              <div className="premium-ad-space">
                <span className="ad-tag-modal">PREMIUM ADVERTISEMENT</span>

                {/* Contenedor dinámico donde Monetag pintará el anuncio */}
                <div
                  className="premium-ad-graphic"
                  ref={interstitialRef}
                  style={{ border: "none", background: "transparent" }}
                >
                  {/* Aquí adentro Monetag inyectará el spot publicitario real */}
                </div>

                <div className="ad-countdown-badge">
                  El juego se reanudará en: {adCountdown}s
                </div>
              </div>
            ) : (
              <div className="ad-notice-thanks-view">
                <h3>¡Anuncio Completado! 🎉</h3>
                <p>
                  Los anuncios de formato largo que aparecen cada 5 minutos nos
                  permiten financiar el desarrollo de Catsino, mantener la
                  infraestructura web activa y asegurar que la travesía de
                  Gatoberto siga siendo 100% gratuita.
                </p>
                <p className="ad-notice-highlight">
                  ¡Agradecemos enormemente tu paciencia y apoyo al proyecto! ❤️
                </p>
                <button
                  className="ad-notice-btn"
                  onClick={() => setShowNotice(false)}
                >
                  Volver a las Apuestas 😼
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
