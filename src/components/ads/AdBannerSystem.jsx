// src/components/ads/AdBannerSystem.jsx
import React, { useState, useEffect, useRef } from "react";
import "./AdBannerSystem.css";

export function AdBannerSystem() {
  const [showAd, setShowAd] = useState(false);
  const bannerRef = useRef(null);

  useEffect(() => {
    /* ====================================================================
       🔥 TIMERS DE PRODUCCIÓN EN CATZZINO.COM
       ==================================================================== */

    // 1. El banner inferior (In-Page Push) se activa sutilmente a los 10 segundos
    const adTimer = setTimeout(() => {
      setShowAd(true);
    }, 10000);

    // 2. Disparador del Interstitial (Vignette) cada 5 minutos
    const SEVEN_MINUTES = 7 * 60 * 1000; // ⏱️ 420,000 milisegundos
    const triggerVignette = () => {
      // Eliminamos cualquier script de Vignette viejo para forzar la recarga del anuncio
      const oldScript = document.getElementById("monetag-vignette-script");
      if (oldScript) oldScript.remove();

      const script = document.createElement("script");
      script.id = "monetag-vignette-script";
      script.dataset.zone = "11030497"; // 🔑 ID exclusivo para Vignette Banner
      script.src = "https://nap5k.com/tag.min.js";
      script.async = true;

      // Se inyecta directo en el body de la página para que Monetag despliegue su overlay global
      document.body.appendChild(script);
    };

    // Primer disparo de Vignette opcional a los 30 segundos (o coméntalo si solo quieres estricto cada 5 min)
    const initialVignetteTimer = setTimeout(triggerVignette, 3 * 60 * 1000);

    // Ciclo repetitivo de 5 minutos
    const vignetteInterval = setInterval(triggerVignette, SEVEN_MINUTES);

    return () => {
      clearTimeout(adTimer);
      clearTimeout(initialVignetteTimer);
      clearInterval(vignetteInterval);
      const oldScript = document.getElementById("monetag-vignette-script");
      if (oldScript) oldScript.remove();
    };
  }, []);

  // 🌟 MONETAG: Renderizado del Banner Inferior (In-Page Push)
  useEffect(() => {
    if (showAd && bannerRef.current) {
      // Limpiamos cualquier rastro previo
      bannerRef.current.innerHTML = "";

      const script = document.createElement("script");
      script.type = "text/javascript"; // Importante para navegadores
      script.dataset.zone = "11030474";
      script.src = "https://nap5k.com/tag.min.js";
      script.async = true;

      // Manejador de errores por si el script falla en cargar
      script.onerror = (err) => console.error("Error cargando Monetag:", err);

      bannerRef.current.appendChild(script);
    }
  }, [showAd]);

  return (
    <>
      {/* BANNER INFERIOR DEL CASINO (In-Page Push contenido limpiamente) */}
      <footer className="catzzino-ad-wrapper">
        <div className="catzzino-ad-container" ref={bannerRef}>
          {!showAd && (
            <div className="catzzino-ad-loading">
              ESPACIO PUBLICITARIO DEL CASINO
            </div>
          )}
        </div>
      </footer>
    </>
  );
}
