import { GET_TICKETS } from "@/requests/tickets.requests";
import { useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";

export default function TicketsDashboard() {
  const { data, loading, error } = useQuery(GET_TICKETS);

  const navigate = useNavigate();

  console.log(data, loading, error);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No tickets found</p>;

  return (
    <>
      <div className="flex flex-row items-center justify-start w-full">
        <h1 className="scroll-m-20 text-4xl font-light tracking-tight text-balance">
          Tickets
        </h1>
        <div className="ml-auto">
          <button className="btn">Créer un ticket</button>
        </div>
      </div>
      <div>
        {data.getTickets.map((ticket: any) => (
          <div
            key={ticket.id}
            className="mt-4 p-4 border-b cursor-pointer"
            onClick={() => navigate(`/dashboard/tickets/${ticket.id}`)}
          >
            <p className="text-lg font-medium text-foreground">
              {ticket.firstName} {ticket.lastName} - {ticket.code}
            </p>
            <p className="text-sm text-muted-foreground">
              Status: {ticket.status}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
