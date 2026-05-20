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
    /* ====================================================================
       🔥 TIMERS DE PRODUCCIÓN EN CATZZINO.COM
       ==================================================================== */

    // El banner inferior se activa sutilmente a los 10 segundos
    const adTimer = setTimeout(() => {
      setShowAd(true);
    }, 10000);

    // El modal publicitario salta en ciclos cada 5 minutos
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

  // 🌟 MONETAG: Banner Inferior (Formato In-Page Push Nativo y No Invasivo)
  useEffect(() => {
    if (showAd && bannerRef.current) {
      bannerRef.current.innerHTML = "";

      const script = document.createElement("script");
      script.dataset.zone = "11030474"; // 🔑 Tu Zone ID Real de In-Page Push
      script.src = "https://nap5k.com/tag.min.js";
      script.async = true;

      bannerRef.current.appendChild(script);
    }
  }, [showAd]);

  // 🌟 MONETAG: Interstitial en el Modal
  // (Nota: Usamos el mismo ID de formato banner para mantener la estética limpia dentro del popup)
  useEffect(() => {
    if (showNotice && isAdLoading && interstitialRef.current) {
      interstitialRef.current.innerHTML = "";

      const script = document.createElement("script");
      script.dataset.zone = "11030474"; // 🔑 Tu Zone ID Real
      script.src = "https://nap5k.com/tag.min.js";
      script.async = true;

      interstitialRef.current.appendChild(script);
    }
  }, [showNotice, isAdLoading]);

  // Lógica de la cuenta regresiva del modal de 5 minutos
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
      {/* BANNER INFERIOR DEL CASINO */}
      <footer className="catzzino-ad-wrapper">
        <div className="catzzino-ad-container" ref={bannerRef}>
          {!showAd && (
            <div className="catzzino-ad-loading">
              ESPACIO PUBLICITARIO DEL CASINO
            </div>
          )}
        </div>
      </footer>

      {/* MODAL INTERSTITIAL CONTROLADO */}
      {showNotice && (
        <div className="ad-notice-overlay">
          <div className="ad-notice-content">
            {isAdLoading ? (
              <div className="premium-ad-space">
                <span className="ad-tag-modal">PREMIUM ADVERTISEMENT</span>

                {/* Contenedor controlado por ref para inyectar el banner estático */}
                <div
                  className="premium-ad-graphic"
                  ref={interstitialRef}
                  style={{ border: "none", background: "transparent" }}
                />

                <div className="ad-countdown-badge">
                  El juego se reanudará en: {adCountdown}s
                </div>
              </div>
            ) : (
              <div className="ad-notice-thanks-view">
                <h3>¡Anuncio Completado! 🎉</h3>
                <p>
                  Los anuncios de formato largo que aparecen cada 5 minutos nos
                  permiten financiar el desarrollo de catzzino, mantener la
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
