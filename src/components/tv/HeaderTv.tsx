import { formattedTime } from "@/utils/formattedTime";
import { formattedDate } from "@/utils/formattedDate";
import { Clock } from "lucide-react";
import { TvHeaderProps } from "@/types/tv.types";
import { useWeather } from "@/hooks/useWeather";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getWeatherIcon } from "@/utils/weatherIcons";

function TvHeader({ dateTime }: TvHeaderProps) {
  const { latitude, longitude, isLoading: geoLoading } = useGeolocation();
  console.log("Localisation météo récupérée :", {
    latitude,
    longitude,
    geoLoading,
  });

  const {
    temperature,
    weatherCode,
    isLoading: weatherLoading,
    error,
  } = useWeather({
    latitude,
    longitude,
  });

  const isLoading = geoLoading || weatherLoading;

  return (
    <div className="flex justify-between items-center p-8 mb-8 text-black text-xl font-medium">
      <div className="flex items-center gap-4">
        <button
          onClick={() => (window.location.href = "/tv")}
          className="text-black/30 hover:text-black/60 text-xs transition"
        >
          Retour
        </button>

        {isLoading ? (
          <span className="text-black/50">Chargement...</span>
        ) : error ? (
          <span className="text-black/50">☀️ --°C</span>
        ) : (
          <span>
            {getWeatherIcon(weatherCode)} {temperature}°C
          </span>
        )}
        <span className="capitalize">{formattedDate(dateTime)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock size={18} />
        <span>{formattedTime(dateTime)}</span>
      </div>
    </div>
  );
}

export default TvHeader;
