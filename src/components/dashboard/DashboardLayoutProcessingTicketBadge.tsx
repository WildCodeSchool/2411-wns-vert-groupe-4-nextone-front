import { useOperator } from "@/context/OperatorContext";

export default function DashboardLayoutProcessingTicketBadge() {
  const { processingTicket, elapsedTimeInSeconds } = useOperator();

  console.log("Rendering ProcessingTicketBadge", {
    processingTicket,
    elapsedTimeInSeconds,
  });

  if (!processingTicket) {
    return null;
  }

  const formatElapsedTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded shadow-lg flex items-center space-x-3 z-50">
      <div>
        <strong>Processing Ticket:</strong> {processingTicket.id}
      </div>
      <div className="ml-4">
        <strong>Elapsed Time:</strong> {formatElapsedTime(elapsedTimeInSeconds)}
      </div>
    </div>
  );
}
