import { useState, useEffect } from "react";

interface WeatherData {
  temperature: number;
  weatherCode: number;
  isLoading: boolean;
  error: string | null;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

export function useWeather(coordinates: Coordinates): WeatherData {
  const [temperature, setTemperature] = useState<number>(0);
  const [weatherCode, setWeatherCode] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("🌤️ Récupération météo pour:", {
          lat: coordinates.latitude,
          lng: coordinates.longitude,
        });

        // API Open-Meteo
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current=temperature_2m,weather_code&timezone=Europe/Paris`
        );

        if (!response.ok) {
          throw new Error("Erreur API Open-Meteo");
        }

        const data = await response.json();

        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;

        console.log("✅ Météo récupérée:", {
          température: temp + "°C",
          code: code,
        });

        setTemperature(temp);
        setWeatherCode(code);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Erreur inconnue";
        setError(errorMsg);
        console.error("❌ Erreur récupération météo:", errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();

    const interval = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [coordinates.latitude, coordinates.longitude]);

  return { temperature, weatherCode, isLoading, error };
}
