import { useState, useEffect } from "react";
import { DEFAULT_LOCATION } from "@/config/locations";

interface GeolocationResult {
  latitude: number;
  longitude: number;
  isLoading: boolean;
  error: string | null;
}

export function useGeolocation(): GeolocationResult {
  const [state, setState] = useState<GeolocationResult>({
    latitude: DEFAULT_LOCATION.latitude,
    longitude: DEFAULT_LOCATION.longitude,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.warn("⚠️ Géolocalisation non supportée par ce navigateur");
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    console.log("📍 Demande de géolocalisation en cours...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("✅ Position GPS détectée:", {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy + "m",
        });

        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          isLoading: false,
          error: null,
        });
      },
      (error) => {
        console.warn("⚠️ Géolocalisation échouée:", error.message);
        console.log("→ Utilisation de la position par défaut (Bordeaux)");

        let errorMessage = "Erreur de géolocalisation";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permission refusée par l'utilisateur";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Position indisponible";
            break;
          case error.TIMEOUT:
            errorMessage = "Délai de géolocalisation dépassé";
            break;
        }

        // Fallback if fail (Bordeaux)
        setState({
          latitude: DEFAULT_LOCATION.latitude,
          longitude: DEFAULT_LOCATION.longitude,
          isLoading: false,
          error: errorMessage,
        });
      },
      // Geolocalisation options
      {
        enableHighAccuracy: false,
        timeout: 10000, // 10s max
        maximumAge: 24 * 60 * 60 * 1000, // Hidden position for 24h
      }
    );
  }, []);

  return state;
}
