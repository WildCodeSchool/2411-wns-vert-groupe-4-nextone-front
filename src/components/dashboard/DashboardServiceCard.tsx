import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import StatusBadge from "./StatusBadge";

type ServiceTicket = {
  id: string;
  ticket: string;
  name?: string;
  lastname?: string;
  status: "En cours de traitement" | "En attente";
  waitTime?: string;
};

type DashboardService = {
  id: string;
  name: string;
  status: "Fluide" | "En attente" | "En cours";
  tickets: ServiceTicket[];
};

const getTicketStatusColor = (status: string) => {
  switch (status) {
    case "En cours de traitement":
    case "En attente":
      return "text-black";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getTicketStatusBackgroundColor = (status: string) => {
  switch (status) {
    case "En cours de traitement":
      return { backgroundColor: "#EAF6EB" };
    case "En attente":
      return { backgroundColor: "#FFFAE7" };
    default:
      return {};
  }
};

export default function DashboardServiceCard({
  service,
}: {
  readonly service: DashboardService;
}) {
  return (
    <Card className="w-full border border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 pt-6">
        <CardTitle className="text-lg font-medium text-gray-900">
          {service.name}
        </CardTitle>
        <StatusBadge label={service.status} />
      </CardHeader>

      <CardContent className="px-6 pb-6 overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#F8FAFB]">
            <TableRow>
              <TableHead style={{ color: "#6D6D6D" }} className="w-[10%] text-left">
                TICKET
              </TableHead>
              <TableHead style={{ color: "#6D6D6D" }} className="w-[15%] text-left">
                NOM
              </TableHead>
              <TableHead style={{ color: "#6D6D6D" }} className="w-[15%] text-left">
                PRENOM
              </TableHead>
              <TableHead style={{ color: "#6D6D6D" }} className="w-[25%] text-left">
                STATUT
              </TableHead>
              <TableHead style={{ color: "#6D6D6D" }} className="w-[20%] text-left">
                TEMPS D’ATTENTE
              </TableHead>
              <TableHead className="w-[15%] text-left"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {service.tickets.map((ticket) => (
              <TableRow key={ticket.id} className="bg-[#F8FAFB]">
                <TableCell className="w-[5%] text-left">{ticket.ticket}</TableCell>
                <TableCell className="w-[15%] text-left">{ticket.name || "-"}</TableCell>
                <TableCell className="w-[15%] text-left">{ticket.lastname || "-"}</TableCell>
                <TableCell className="w-[25%] text-left">
                  <span
                    className={`px-4 py-2 rounded text-xs w-fit ${getTicketStatusColor(
                      ticket.status
                    )}`}
                    style={getTicketStatusBackgroundColor(ticket.status)}
                  >
                    {ticket.status}
                  </span>
                </TableCell>
                <TableCell className="w-[20%] text-left">
                  {ticket.waitTime || "-"}
                </TableCell>
                <TableCell className="w-[15%] texl-left">
                  <div className="flex justify-end items-center gap-2">
                    {ticket.status === "En attente" && (
                      <Button className="bg-[#1f2511] hover:bg-[#2a3217] text-white">
                        Prendre le ticket
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

