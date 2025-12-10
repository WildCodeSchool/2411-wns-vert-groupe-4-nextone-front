import DashboardServiceStateCard from "./DashboardServiceStateCard";
import DashboardStatCard from "./DashboardStatCard";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useDashboardServices } from "@/hooks/useDashboardServices";
import { useOperator } from "@/context/OperatorContext";
import { useEffect } from "react";

export type Ticket = {
  id: number;
  code: string;
  status: string;
};

export type Service = {
  id: number;
  name: string;
  state: string;
  tickets: Ticket[];
};

export default function HomeDashboard() {
  const {
    processedTicketsCount,
    pendingTicketsCount,
    inProgressTicketsCount,
    averageProcessingTime,
  } = useDashboardStats();

  useEffect(() => {}, [inProgressTicketsCount]);

  const { services } = useDashboardServices();
  const { canProcessTicket } = useOperator();

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <h1 className="scroll-m-20 text-4xl font-light tracking-tight text-balance">
          Dashboard
        </h1>
      </div>
      <div className="flex flex-col items-start justify-start w-full mt-8">
        <h2 className="scroll-m-20 text-xl font-light tracking-tight text-balance text-muted-foreground">
          Statistiques globales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 w-full mb-6">
          <DashboardStatCard
            title="Tickets traités aujourd'hui"
            value={processedTicketsCount.toString()}
          />
          <DashboardStatCard
            title="Temps de traitement moyen"
            value={averageProcessingTime?.formatted || "N/A"}
          />
          <DashboardStatCard
            title="Tickets en attente"
            value={pendingTicketsCount.toString()}
          />
          <DashboardStatCard
            title="Tickets en cours de traitement"
            value={inProgressTicketsCount.toString()}
          />
        </div>
      </div>
      <div className="flex flex-col items-start justify-start w-full mt-10">
        <h2 className="scroll-m-20 text-xl font-light tracking-tight text-balance text-muted-foreground">
          État des services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 w-full mb-6">
          {services.map((service) => (
            <DashboardServiceStateCard
              key={service.id}
              service={service}
              canProcessTicket={canProcessTicket}
            />
          ))}
        </div>
      </div>
    </>
  );
}
