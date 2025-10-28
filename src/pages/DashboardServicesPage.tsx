import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import DashboardServiceCard from "../components/dashboard/DashboardServiceCard";
import { GET_SERVICES } from "../requests/queries/service.query";
import { GET_TICKETS } from "../requests/queries/ticket.query";

import type { TicketStatus } from "@/utils/ticketStatus";

type ServiceTicket = {
  id: string;
  ticket: string;
  lastname?: string;
  name?: string;
  status: TicketStatus; 
  waitTime?: string;
};

type DashboardService = {
  id: string;
  name: string;
  status: "Fluide" | "En attente" | "En cours";
  tickets: ServiceTicket[];
};

function calculateWaitTime(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return "< 1 min";
  if (diffMinutes === 1) return "1 minute";
  return `${diffMinutes} minutes`;
}

// API types
type GetServicesResult = {
  services: { id: string; name: string; isGloballyActive: boolean }[];
};

type GetTicketsResult = {
  tickets: Array<{
    id: string;
    code: string;
    firstName?: string | null;
    lastName?: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    service?: { id: string; name: string } | null;
  }>;
};

export default function DashboardServicesPage() {
  const [openCardId, setOpenCardId] = useState<string>("");

  const {
    data: servicesData,
    loading: loadingServices,
    error: errorServices,
    refetch: refetchServices,
  } = useQuery<GetServicesResult>(GET_SERVICES, { fetchPolicy: "cache-and-network" });

  const {
    data: ticketsData,
    loading: loadingTickets,
    error: errorTickets,
    refetch: refetchTickets,
  } = useQuery<GetTicketsResult>(GET_TICKETS, { fetchPolicy: "cache-and-network" });

  const loading = loadingServices || loadingTickets;
  const error = errorServices || errorTickets;

  const handleToggle = (id: string) => {
    setOpenCardId((prev) => (prev === id ? "" : id));
  };

  const ticketsByServiceId = useMemo(() => {
    const map = new Map<string, ServiceTicket[]>();
    const all = ticketsData?.tickets ?? [];

    for (const t of all) {
      const serviceId = t.service?.id;
      if (!serviceId) continue;

       if (t.status === "ARCHIVED") continue; // Skip archived tickets

      const uiTicket: ServiceTicket = {
        id: t.id,
        ticket: t.code,
        lastname: t.lastName ?? undefined,
        name: t.firstName ?? undefined,
        status: t.status as TicketStatus, 
        waitTime: calculateWaitTime(t.createdAt),
      };

      if (!map.has(serviceId)) map.set(serviceId, []);
      map.get(serviceId)!.push(uiTicket);
    }
    return map;
  }, [ticketsData]);

  const mappedServices: DashboardService[] = useMemo(() => {
    const apiServices = servicesData?.services ?? [];
    return apiServices.map((s) => {
      const status: DashboardService["status"] = s.isGloballyActive ? "Fluide" : "En attente";
      const tickets = ticketsByServiceId.get(s.id) ?? [];
      return { id: s.id, name: s.name, status, tickets };
    });
  }, [servicesData, ticketsByServiceId]);

  useEffect(() => {
    if (mappedServices.length > 0) {
      setOpenCardId((prev) => (prev === "" ? mappedServices[0].id : prev));
    }
  }, [mappedServices]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <p className="text-muted-foreground">Chargement des services et tickets…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="scroll-m-20 text-4xl font-light tracking-tight text-balance">
            Services
          </h1>
          <img
            src="/src/assets/images/icon_img.jpg"
            alt="Logo"
            className="w-40 h-16 object-contain rounded-full bg-white shadow-md"
          />
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-red-600 font-medium">
            Erreur lors du chargement des données.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => { refetchServices(); refetchTickets(); }}
              className="px-3 py-1 rounded-md border hover:bg-muted"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between w-full mb-8">
        <h1 className="scroll-m-20 text-4xl font-light tracking-tight text-balance">
          Services
        </h1>
        <img
          src="/src/assets/images/icon_img.jpg"
          alt="Logo"
          className="w-40 h-16 object-contain rounded-full bg-white shadow-md"
        />
      </div>

      <div className="flex flex-col gap-6 w-full">
        {mappedServices.map((service) => (
          <DashboardServiceCard
            key={service.id}
            service={service}
            isOpen={openCardId === service.id}
            onToggle={() => handleToggle(service.id)}
            onTicketsUpdate={() => { refetchTickets(); }}
          />
        ))}
        {mappedServices.length === 0 && (
          <div className="rounded-lg border p-6 text-center text-muted-foreground">
            Aucun service trouvé.
          </div>
        )}
      </div>
    </>
  );
}
