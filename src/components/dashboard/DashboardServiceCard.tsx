import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaCircle } from "react-icons/fa6";
import { MoreHorizontal } from "lucide-react";

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

const getStatusColor = (status: "Fluide" | "En attente" | "En cours") => {
  switch (status) {
    case "Fluide":
      return "text-green-700 bg-green-100";
    case "En attente":
      return "text-orange-600 bg-orange-100";
    case "En cours":
      return "text-blue-600 bg-blue-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

const getTicketStatusColor = (status: string) => {
  switch (status) {
    case "En cours de traitement":
      return "text-black";
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

export default function DashboardServiceCard({ service }: { readonly service: DashboardService }) {
  return (
    <Card className="w-full border border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 pt-6">
        <CardTitle className="text-lg font-medium text-gray-900">{service.name}</CardTitle>
        <span className={`text-sm py-1 px-3 rounded-full flex items-center gap-2 ${getStatusColor(service.status)}`}>
          <FaCircle size={6} />
          {service.status}
        </span>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-500 px-4 py-2 bg-gray-50 rounded-t-lg">
            <span>TICKET</span>
            <span>NOM</span>
            <span>PRENOM</span>
            <span>STATUT</span>
            <span>TEMPS D’ATTENTE</span>
            <span></span>
          </div>
          <div className="border border-gray-200 rounded-b-lg overflow-hidden">
            {service.tickets.map((ticket) => (
              <div key={ticket.id} className="grid grid-cols-6 gap-4 items-center px-4 py-4 bg-white hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900">{ticket.ticket}</span>
                <span className="text-gray-700">{ticket.name || "-"}</span>
                <span className="text-gray-700">{ticket.lastname || "-"}</span>
                <span 
                  className={`px-2 py-1 rounded text-xs font-medium w-fit ${getTicketStatusColor(ticket.status)}`}
                  style={getTicketStatusBackgroundColor(ticket.status)}
                >
                  {ticket.status}
                </span>
                <span className="text-gray-600 text-sm">{ticket.waitTime || "-"}</span>
                <div className="flex items-center gap-2 justify-end">
                  {ticket.status === "En attente" && (
                    <Button className="bg-[#1f2511] hover:bg-[#2a3217] text-white">
                      Prendre le ticket
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}