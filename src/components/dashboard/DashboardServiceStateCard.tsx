import { Button } from "../ui/button";
import { ServiceWithState } from "@/types/dashboard";
import { FaCircle } from "react-icons/fa6";
import { useOperator } from "@/context/OperatorContext";
import { useMutation } from "@apollo/client";
import { UPDATE_TICKET_STATUS } from "@/requests/queries/ticket.query";

export default function DashboardServiceStateCard({
  service,
  canProcessTicket,
}: {
  service: ServiceWithState;
  canProcessTicket: boolean;
}) {
  const { processTicket } = useOperator();

  const [updateTicketStatus] = useMutation(UPDATE_TICKET_STATUS);

  const handleProcessTicket = async (ticket: {
    id: string;
    code: string;
    status: string;
  }) => {
    try {
      await updateTicketStatus({
        variables: {
          updateTicketStatusData: {
            id: ticket.id,
            status: "INPROGRESS",
          },
        },
      });

      processTicket({
        id: ticket.id,
        code: ticket.code,
        status: "INPROGRESS",
      });
      console.log("✅ Ticket mis à INPROGRESS:", ticket.code);
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du ticket:", error);
    }
  };

  return (
    <div className="bg-card p-8 rounded-lg flex flex-col items-start justify-start gap-8">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-xl font-light flex flex-col items-start justify-start">
          {service.name}
        </h3>
        <span className="text-sm py-2 px-4 bg-chart-1 flex items-center justify-start gap-2 rounded-full">
          <FaCircle className="text-chart-2" size={9} />
          {service.state}
        </span>
      </div>
      <div className="w-full bg-popover rounded-md flex flex-col items-start justify-start p-6">
        {service.tickets.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            Aucun ticket en attente
          </p>
        ) : (
          service.tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="w-full not-last:border-b not-last:border-b-border flex items-center justify-between first:pb-4 last:pt-4 not-first:not-last:py-4"
            >
              <h4 className="font-medium">{ticket.code}</h4>
              <Button
                onClick={() => handleProcessTicket(ticket)}
                disabled={!canProcessTicket}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Traiter le ticket
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
