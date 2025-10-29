import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import DashboardServiceCard from "../components/dashboard/DashboardServiceCard";
import { GET_SERVICES } from "../requests/queries/service.query";

type DashboardService = {
  id: string;
  name: string;
  status: "Fluide" | "En attente" | "En cours";
};

type GetServicesResult = {
  services: { id: string; name: string; isGloballyActive: boolean }[];
};

export default function DashboardServicesPage() {
  const [openCardId, setOpenCardId] = useState<string>("");

  const {
    data: servicesData,
    loading: loadingServices,
    error: errorServices,
    refetch: refetchServices,
  } = useQuery<GetServicesResult>(GET_SERVICES, { fetchPolicy: "cache-and-network" });


  const loading = loadingServices; 
  const error = errorServices;     

  const handleToggle = (id: string) => {
    setOpenCardId((prev) => (prev === id ? "" : id));
  };

  const mappedServices: DashboardService[] = (servicesData?.services ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    status: s.isGloballyActive ? "Fluide" : "En attente",
  }));

  useEffect(() => {
    if (mappedServices.length > 0) {
      setOpenCardId((prev) => (prev === "" ? mappedServices[0].id : prev));
    }
  }, [mappedServices]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <p className="text-muted-foreground">Chargement des services…</p> 
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
              onClick={() => { refetchServices(); }} 
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
