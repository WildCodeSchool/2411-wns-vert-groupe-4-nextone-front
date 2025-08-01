import DashboardServiceStateCard from "./DashboardServiceStateCard";
import DashboardStatCard from "./DashboardStatCard";

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
  const services: Service[] = [
    {
      id: 1,
      name: "Cardiologie",
      state: "Fluide",
      tickets: [
        { id: 1, code: "CA345", status: "Open" },
        { id: 2, code: "CA346", status: "Open" },
      ],
    },
    {
      id: 2,
      name: "Pédiatrie",
      state: "En attente",
      tickets: [
        { id: 3, code: "PE123", status: "Open" },
        { id: 4, code: "PE124", status: "Open" },
      ],
    },
    {
      id: 3,
      name: "Dermatologie",
      state: "En cours",
      tickets: [
        { id: 5, code: "DE789", status: "Open" },
        { id: 6, code: "DE790", status: "Open" },
      ],
    },
  ];

  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-light tracking-tight text-balance">
        Dashboard
      </h1>
      <div className="flex flex-col items-start justify-start w-full mt-8">
        <h2 className="scroll-m-20 text-xl font-light tracking-tight text-balance text-muted-foreground">
          Statistiques globales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 w-full mb-6">
          <DashboardStatCard title="Tickets traités aujourd'hui" value="150" />
          <DashboardStatCard
            title="Temps de traitement moyen"
            value="9min 23sec"
          />
          <DashboardStatCard title="Tickets en attente" value="7" />
          <DashboardStatCard
            title="Tickets en cours de traitement"
            value="26"
          />
        </div>
        <DashboardStatCard
          title="Courbe habituelle d'affluence"
          value="50"
          fullWidth
        />
      </div>
      <div className="flex flex-col items-start justify-start w-full mt-10">
        <h2 className="scroll-m-20 text-xl font-light tracking-tight text-balance text-muted-foreground">
          État des services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 w-full mb-6">
          {services.map((service) => (
            <DashboardServiceStateCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </>
  );
}
