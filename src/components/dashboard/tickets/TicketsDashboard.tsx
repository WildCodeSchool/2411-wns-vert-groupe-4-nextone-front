import { GET_TICKETS } from "@/requests/tickets.requests";
import { useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ticket } from "./TicketPage";

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
      <div></div>
      <div className="mt-8 bg-card p-4 rounded-lg w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.tickets.map((ticket: Ticket) => (
              <TableRow
                key={ticket.id}
                className="cursor-pointer"
                onClick={() => navigate(`/dashboard/tickets/${ticket.id}`)}
              >
                <TableCell className="text-left">{ticket.code}</TableCell>
                <TableCell className="text-left">{ticket.lastName}</TableCell>
                <TableCell className="text-left">{ticket.firstName}</TableCell>
                <TableCell className="text-left">{ticket.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
