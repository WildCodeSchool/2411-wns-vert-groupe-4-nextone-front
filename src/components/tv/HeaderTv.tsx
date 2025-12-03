import { formattedTime } from "@/utils/formattedTime";
import { formattedDate } from "@/utils/formattedDate";
import { Clock } from "lucide-react";
import { TvHeaderProps } from "@/types/tv.types";

function TvHeader({dateTime}: TvHeaderProps) {
    return (
        <div className="flex justify-between items-center p-8 mb-8 text-black text-xl font-medium">
            <div className="flex items-center gap-4">
                <button onClick={() => window.location.href = "/tv"} className="text-black/30 hover:text-black/60 text-xs transition">
                    Retour
                </button>
                <span>☀️ 27°C</span>
                <span className="capitalize">{formattedDate(dateTime)}</span>
            </div>
            <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{formattedTime(dateTime)}</span>
            </div>
        </div>
    )
}

export default TvHeader;