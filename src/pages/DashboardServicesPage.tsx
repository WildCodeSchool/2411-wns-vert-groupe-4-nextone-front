import DashboardServiceCard from "../components/dashboard/DashboardServiceCard";

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

export default function DashboardServicesPage() {
  const services: DashboardService[] = [
    {
      id: "1",
      name: "Cardiologie",
      status: "Fluide",
      tickets: [
        {
          id: "1",
          ticket: "CA304",
          lastname: "Croisière",
          name: "Thomas",
          status: "En cours de traitement",
          waitTime: "10 minutes",
        },
        {
          id: "2", 
          ticket: "CA305",
          lastname: "Schultz",
          name: "Patrick",
          status: "En attente",
          waitTime: "5 minutes",
        },
      ],
    },
    {
      id: "2",
      name: "Ophtalmologie",
      status: "Fluide",
      tickets: [
        {
          id: "3",
          ticket: "OP301",
          lastname: "Croisière",
          name: "Thomas",
          status: "En cours de traitement",
          waitTime: "10 minutes",
        },
        {
          id: "4",
          ticket: "OP302",
          lastname: "Schultz",
          name: "Patrick",
          status: "En attente",
          waitTime: "5 minutes",
        },
      ],
    },
  ];

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
        {services.map((service) => (
          <DashboardServiceCard key={service.id} service={service} />
        ))}
      </div>
    </>
  );
}