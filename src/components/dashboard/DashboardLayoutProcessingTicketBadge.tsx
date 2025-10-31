import { useOperator } from "@/context/OperatorContext";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { IoIosMore } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Check, Delete, Hourglass } from "lucide-react";

dayjs.extend(duration);

export default function DashboardLayoutProcessingTicketBadge() {
  const {
    processingTicket,
    elapsedTimeInSeconds,
    setTicketAsProcessed,
    setTicketAsCanceled,
    setTicketAsPending,
  } = useOperator();

  if (!processingTicket) {
    return null;
  }

  const formatElapsedTime = (totalSeconds: number) => {
    const dur = dayjs.duration(totalSeconds, "seconds");
    const hours = Math.floor(dur.asHours()).toString().padStart(2, "0");
    const minutes = dur.minutes().toString().padStart(2, "0");
    const seconds = dur.seconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="fixed bottom-6 right-6 bg-white text-black pr-4 pl-2 py-2 rounded-full shadow-lg flex items-center z-50 text-xl gap-6">
      <div className="font-bold bg-primary px-4 py-2 rounded-full text-white">
        {processingTicket.code}
      </div>
      <div>{formatElapsedTime(elapsedTimeInSeconds)}</div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <IoIosMore size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="z-50 p-2 bg-card mb-3"
          side="top"
          align="end"
        >
          <DropdownMenuItem
            onClick={async () => {
              await setTicketAsProcessed();
            }}
          >
            <Check className="w-4 h-4 mr-2" />
            Marquer le ticket comme traité
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await setTicketAsPending();
            }}
          >
            <Hourglass className="w-4 h-4 mr-2" />
            Remettre le ticket en attente
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await setTicketAsCanceled();
            }}
          >
            <Delete className="w-4 h-4 mr-2" />
            Annuler le ticket
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
