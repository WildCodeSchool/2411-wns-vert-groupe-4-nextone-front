import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import DashboardServiceCard from "../components/dashboard/DashboardServiceCard";
import { GET_SERVICES } from "@/requests/services.requests";
import { GET_TICKETS } from "@/requests/tickets.requests"; 

type ServiceTicket = {
  id: string;
  ticket: string;
  lastname?: string;
  name?: string;
  status: "En cours de traitement" | "En attente";
  waitTime?: string;
};

type DashboardService = {
  id: string;
  name: string;
  status: "Fluide" | "En attente" | "En cours";
  tickets: ServiceTicket[];
};

// calcul temps d’attente (différence entre now et createdAt)
function calculateWaitTime(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return "< 1 min";
  if (diffMinutes === 1) return "1 minute";
  return `${diffMinutes} minutes`;
}


// API
type GetServicesResult = {
  services: { id: string; name: string; isGloballyActive: boolean }[];
};

type GetTicketsResult = {
  tickets: Array<{
    id: string;
    code: string;
    firstName?: string | null;
    lastName?: string | null;
    status: string; // IN_PROGRESS | PENDING | ...
    createdAt: string;
    updatedAt: string;
    service?: { id: string; name: string } | null;
  }>;
};

export default function DashboardServicesPage() {

  const [openCardId, setOpenCardId] = useState<string>("1"); // gère l'état de la card ouverte

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
    setOpenCardId((prev) => (prev === id ? "" : id)); // ferme si on reclique dessus
  };

    // 2) Grouper les tickets par service.id
  const ticketsByServiceId = useMemo(() => {
    const map = new Map<string, ServiceTicket[]>();
    const all = ticketsData?.tickets ?? [];

    for (const t of all) {
      const serviceId = t.service?.id;
      if (!serviceId) continue;

      // mapping Ticket API -> Ticket UI
      const uiTicket: ServiceTicket = {
        id: t.id,
        ticket: t.code,
        lastname: t.lastName ?? undefined,
        name: t.firstName ?? undefined,
        status: t.status === "IN_PROGRESS" ? "En cours de traitement" : "En attente",
        waitTime: calculateWaitTime(t.createdAt),
      };

      if (!map.has(serviceId)) map.set(serviceId, []);
      map.get(serviceId)!.push(uiTicket);
    }
    return map;
  }, [ticketsData]);

  // 3) Mapping Services API -> UI + injection des tickets groupés
  const mappedServices: DashboardService[] = useMemo(() => {
    const apiServices = servicesData?.services ?? [];
    return apiServices.map((s) => {
      // Règle temporaire : actif -> "Fluide", sinon "En attente"
      const status: DashboardService["status"] = s.isGloballyActive ? "Fluide" : "En attente";
      const tickets = ticketsByServiceId.get(s.id) ?? [];
      return { id: s.id, name: s.name, status, tickets };
    });
  }, [servicesData, ticketsByServiceId]);

  // 4) États UI
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


  // const services: DashboardService[] = [
  //   {
  //     id: "1",
  //     name: "Cardiologie",
  //     status: "Fluide",
  //     tickets: [
  //       {
  //         id: "1",
  //         ticket: "CA304",
  //         lastname: "Croisière",
  //         name: "Thomas",
  //         status: "En cours de traitement",
  //         waitTime: "10 minutes",
  //       },
  //       {
  //         id: "2", 
  //         ticket: "CA305",
  //         lastname: "Mas",
  //         name: "Jeanne",
  //         status: "En attente",
  //         waitTime: "5 minutes",
  //       },
  //       {
  //         id: "3", 
  //         ticket: "CA306",
  //         lastname: "Bon",
  //         name: "Jean",
  //         status: "En attente",
  //         waitTime: "15 minutes",
  //       },
  //       {
  //         id: "4", 
  //         ticket: "CA307",
  //         lastname: "Pelle",
  //         name: "Sarah",
  //         status: "En attente",
  //         waitTime: "25 minutes",
  //       },
  //       {
  //         id: "5", 
  //         ticket: "CA308",
  //         lastname: "Benitez",
  //         name: "Benito",
  //         status: "En attente",
  //         waitTime: "35 minutes",
  //       },
  //          {
  //         id: "3", 
  //         ticket: "CA306",
  //         lastname: "Bon",
  //         name: "Jean",
  //         status: "En attente",
  //         waitTime: "15 minutes",
  //       },
  //       {
  //         id: "4", 
  //         ticket: "CA307",
  //         lastname: "Pelle",
  //         name: "Sarah",
  //         status: "En attente",
  //         waitTime: "25 minutes",
  //       },
  //       {
  //         id: "5", 
  //         ticket: "CA308",
  //         lastname: "Benitez",
  //         name: "Benito",
  //         status: "En attente",
  //         waitTime: "35 minutes",
  //       },
  //     ],
  //   },
  //   {
  //     id: "2",
  //     name: "Ophtalmologie",
  //     status: "Fluide",
  //     tickets: [
  //        {
  //         id: "1",
  //         ticket: "CA304",
  //         lastname: "Croisière",
  //         name: "Thomas",
  //         status: "En cours de traitement",
  //         waitTime: "10 minutes",
  //       },
  //       {
  //         id: "2", 
  //         ticket: "CA305",
  //         lastname: "Mas",
  //         name: "Jeanne",
  //         status: "En attente",
  //         waitTime: "5 minutes",
  //       },
  //       {
  //         id: "3", 
  //         ticket: "CA306",
  //         lastname: "Bon",
  //         name: "Jean",
  //         status: "En attente",
  //         waitTime: "15 minutes",
  //       },
  //       {
  //         id: "4", 
  //         ticket: "CA307",
  //         lastname: "Pelle",
  //         name: "Sarah",
  //         status: "En attente",
  //         waitTime: "25 minutes",
  //       },
  //       {
  //         id: "5", 
  //         ticket: "CA308",
  //         lastname: "Benitez",
  //         name: "Benito",
  //         status: "En attente",
  //         waitTime: "35 minutes",
  //       },
  //          {
  //         id: "3", 
  //         ticket: "CA306",
  //         lastname: "Bon",
  //         name: "Jean",
  //         status: "En attente",
  //         waitTime: "15 minutes",
  //       },
  //       {
  //         id: "4", 
  //         ticket: "CA307",
  //         lastname: "Pelle",
  //         name: "Sarah",
  //         status: "En attente",
  //         waitTime: "25 minutes",
  //       },
  //       {
  //         id: "5", 
  //         ticket: "CA308",
  //         lastname: "Benitez",
  //         name: "Benito",
  //         status: "En attente",
  //         waitTime: "35 minutes",
  //       },
  //     ],
  //   },
  //     {
  //     id: "3",
  //     name: "Dermatologie",
  //     status: "Fluide",
  //     tickets: [
  //        {
  //         id: "1",
  //         ticket: "CA304",
  //         lastname: "Croisière",
  //         name: "Thomas",
  //         status: "En cours de traitement",
  //         waitTime: "10 minutes",
  //       },
  //       {
  //         id: "2", 
  //         ticket: "CA305",
  //         lastname: "Mas",
  //         name: "Jeanne",
  //         status: "En attente",
  //         waitTime: "5 minutes",
  //       },
  //       {
  //         id: "3", 
  //         ticket: "CA306",
  //         lastname: "Bon",
  //         name: "Jean",
  //         status: "En attente",
  //         waitTime: "15 minutes",
  //       },
  //       {
  //         id: "4", 
  //         ticket: "CA307",
  //         lastname: "Pelle",
  //         name: "Sarah",
  //         status: "En attente",
  //         waitTime: "25 minutes",
  //       },
  //       {
  //         id: "5", 
  //         ticket: "CA308",
  //         lastname: "Benitez",
  //         name: "Benito",
  //         status: "En attente",
  //         waitTime: "35 minutes",
  //       },
  //          {
  //         id: "3", 
  //         ticket: "CA306",
  //         lastname: "Bon",
  //         name: "Jean",
  //         status: "En attente",
  //         waitTime: "15 minutes",
  //       },
  //       {
  //         id: "4", 
  //         ticket: "CA307",
  //         lastname: "Pelle",
  //         name: "Sarah",
  //         status: "En attente",
  //         waitTime: "25 minutes",
  //       },
  //       {
  //         id: "5", 
  //         ticket: "CA308",
  //         lastname: "Benitez",
  //         name: "Benito",
  //         status: "En attente",
  //         waitTime: "35 minutes",
  //       },
  //     ],
  //   },
  // ];

//   return (
//     <>
//       <div className="flex items-center justify-between w-full mb-8">
//         <h1 className="scroll-m-20 text-4xl font-light tracking-tight text-balance">
//           Services
//         </h1>
//         <img
//           src="/src/assets/images/icon_img.jpg"
//           alt="Logo"
//           className="w-40 h-16 object-contain rounded-full bg-white shadow-md"
//         />
//       </div>

//       <div className="flex flex-col gap-6 w-full">
//         {services.map((service) => (
//           <DashboardServiceCard
//             key={service.id}
//             service={service}
//             isOpen={openCardId === service.id}          // passe l’état ouvert à la card
//             onToggle={() => handleToggle(service.id)}  // gère le clic sur l’accordéon
//           />
//         ))}
//       </div>
//     </>
//   );
// }