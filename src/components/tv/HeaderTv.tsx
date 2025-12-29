import { formattedTime } from "@/utils/formattedTime";
import { formattedDate } from "@/utils/formattedDate";
import { ArrowLeft, Clock } from "lucide-react";
import { TvHeaderProps } from "@/types/tv.types";
import { useWeather } from "@/hooks/useWeather";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getWeatherIcon } from "@/utils/weatherIcons";

function TvHeader({ dateTime, tvKey }: TvHeaderProps) {
  const { latitude, longitude, isLoading: geoLoading } = useGeolocation();

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
      <div className="flex items-center gap-8">
        <button
          onClick={() => (window.location.href = `/tv/${tvKey}`)}
          className="text-black/30 hover:text-black/60 text-xs transition"
        >
          <ArrowLeft className="cursor-pointer" />
        </button>

        {isLoading ? (
          <span className="text-black/50 text-2xl">Chargement...</span>
        ) : error ? (
          <span className="text-black/50 text-2xl">☀️ --°C</span>
        ) : (
          <span className="text-black text-2xl">
            {getWeatherIcon(weatherCode)} {temperature}°C
          </span>
        )}
        <span className="capitalize text-2xl">{formattedDate(dateTime)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock size={24} />
        <span className="text-2xl">{formattedTime(dateTime)}</span>
      </div>
    </div>
  );
}

export default TvHeader;
