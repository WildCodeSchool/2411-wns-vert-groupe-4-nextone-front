/**
 * Convert codes weather Open-Meteo to emojis
 * Doc: https://open-meteo.com/en/docs
 */
export function getWeatherIcon(weatherCode: number): string {
  const weatherIcons: Record<number, string> = {
    0: "☀️", // Ciel dégagé
    1: "🌤️", // Principalement dégagé
    2: "⛅", // Partiellement nuageux
    3: "☁️", // Couvert
    45: "🌫️", // Brouillard
    48: "🌫️", // Brouillard givrant
    51: "🌦️", // Bruine légère
    53: "🌦️", // Bruine modérée
    55: "🌧️", // Bruine dense
    61: "🌧️", // Pluie faible
    63: "🌧️", // Pluie modérée
    65: "🌧️", // Pluie forte
    71: "🌨️", // Neige faible
    73: "🌨️", // Neige modérée
    75: "🌨️", // Neige forte
    77: "❄️", // Grains de neige
    80: "🌦️", // Averses faibles
    81: "🌧️", // Averses modérées
    82: "⛈️", // Averses violentes
    85: "🌨️", // Averses de neige faibles
    86: "🌨️", // Averses de neige fortes
    95: "⛈️", // Orage
    96: "⛈️", // Orage avec grêle légère
    99: "⛈️", // Orage avec grêle forte
  };

  return weatherIcons[weatherCode] || "☀️";
}
