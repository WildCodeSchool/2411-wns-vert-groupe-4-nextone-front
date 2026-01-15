import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import DashboardServiceCard from "../components/dashboard/DashboardServiceCard";
import { GET_SERVICES_FOR_OPERATOR } from "../requests/queries/service.query";
import { useAuth } from "@/context/AuthContext";

type DashboardService = {
  id: string;
  name: string;
  authorizations: { createdAt: string }[];
};

// type GetServicesResult = {
//   services: {
//     id: string;
//     name: string;
//     isGloballyActive: boolean;
//     authorizations: { createdAt: string }[];
//   }[];
// };

export default function DashboardServicesPage() {
  const [openCardId, setOpenCardId] = useState<string>("");

  const { user } = useAuth();

  const {
    data: servicesData,
    loading: loadingServices,
    error: errorServices,
    refetch: refetchServices,
  } = useQuery(GET_SERVICES_FOR_OPERATOR, {
    variables: { managerId: user?.id },
    fetchPolicy: "cache-and-network",
  });

  const loading = loadingServices;
  const error = errorServices;

  const handleToggle = (id: string) => {
    setOpenCardId((prev) => (prev === id ? "" : id));
  };

  const mappedServices: DashboardService[] = (
    servicesData?.getEmployeeAuthorizations ?? []
  ).map((s) => ({
    id: s.service.id,
    name: s.service.name,
    authorizations: s.service.authorizations,
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
        <div className="flex items-center justify-between w-full mb-2">
          <h1 className="scroll-m-20 text-4xl font-light tracking-tight text-balance">
            Services
          </h1>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-red-600 font-medium">
            Erreur lors du chargement des données.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => {
                refetchServices();
              }}
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
      <div className="w-full flex items-center justify-between">
        <h1 className="scroll-m-20 text-4xl font-light tracking-tight text-balance">
          Services
        </h1>
      </div>
      <div className="mt-8 flex flex-col gap-6 w-full">
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
