
import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

/**
 * Nutzt ausschließlich den referrer-beschränkten Frontend-Key!
 */
interface RestaurantMapProps {
  center: { lat: number; lng: number };
  markers: { id: string; position: { lat: number; lng: number }; title: string }[];
}

export function RestaurantMap({ center, markers }: RestaurantMapProps) {
  const [consent, setConsent] = useState(false);

  // LocalStorage-Änderungen sofort erkennen, damit Consent "live" ist:
  useEffect(() => {
    function updateConsent() {
      const c = localStorage.getItem("matbakh_consent_thirdparty");
      setConsent(c === "true");
    }
    updateConsent(); // initial prüfen
    // Listener auf Speicheränderungen (auch im gleichen Tab)
    window.addEventListener("storage", updateConsent);
    // Auch manuelle Änderungen im gleichen Tab: auf klicks im Cookie-Banner reagieren:
    const interval = setInterval(updateConsent, 500); // kleine Hilfslösung bei Banner (CookieConsent setzt localStorage NUR im eigenen Tab, "storage" feuert nur in anderen Tabs)
    return () => {
      window.removeEventListener("storage", updateConsent);
      clearInterval(interval);
    };
  }, []);

  if (!consent) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-800 rounded text-center">
        Bitte akzeptiere das Laden von Google Maps im Cookie-Banner, um die interaktive Karte sehen zu können.
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        center={center}
        zoom={13}
      >
        {markers.map((m) => (
          <Marker key={m.id} position={m.position} title={m.title} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
