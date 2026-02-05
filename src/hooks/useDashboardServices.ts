import { useQuery, useSubscription } from "@apollo/client";
import { GET_EMPLOYEE_AUTHORIZATIONS } from "@/requests/queries/authorization.query";
import { GET_SERVICES } from "@/requests/queries/service.query";
import { TICKETS_CHANGED_SUBSCRIPTION } from "@/requests/subscriptions/ticket.subscription";
import { SERVICE_TOGGLED_SUBSCRIPTION } from "@/requests/subscriptions/service.subscription";
import { useAuth } from "@/context/AuthContext";
import { useMemo } from "react";
import { ServiceWithState, DashboardService } from "@/types/dashboard";

export const useDashboardServices = () => {
  const { user } = useAuth(); // retrieves the connected operator

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  // Query: retrieves ONLY the services authorized for this operator
  const { data, loading, error, refetch } = useQuery(
    isSuperAdmin ? GET_SERVICES : GET_EMPLOYEE_AUTHORIZATIONS,
    {
      variables: isSuperAdmin ? undefined : { managerId: user?.id },
      skip: !user?.id,
      fetchPolicy: "cache-and-network",
    }
  );

  // WebSocket : Refetch when one ticket change
  useSubscription(TICKETS_CHANGED_SUBSCRIPTION, {
    onData: () => {
      refetch();
    },
  });

  // WebSocket : Refetch when service is toggled
  useSubscription(SERVICE_TOGGLED_SUBSCRIPTION, {
    onData: () => {
      refetch();
    },
  });

  const servicesWithState: ServiceWithState[] = useMemo(() => {
    let services: DashboardService[] = [];

    if (isSuperAdmin) {
      services = data?.services || [];
    } else {
      if (!data || !("authorizations" in data)) return [];
      services = data.authorizations
        .map((auth: { service: DashboardService }) => auth.service)
        .filter(
          (service: DashboardService): service is DashboardService =>
            service !== undefined && service !== null
        );
    }

    console.log("Fetched services:", services);

    return services
      .filter((service) => service && service.isGloballyActive)
      .map((service: DashboardService): ServiceWithState => {
        const pendingTickets = (service.tickets || []).filter(
          (t) => t.status === "PENDING"
        );
        const inProgressTickets = (service.tickets || []).filter(
          (t) => t.status === "INPROGRESS"
        );

        const totalWaiting = pendingTickets.length;

        let state: "Fluide" | "En attente" | "En cours";

        if (inProgressTickets.length > 0) {
          state = "En cours";
        } else if (totalWaiting === 0 || totalWaiting <= 2) {
          state = "Fluide";
        } else if (totalWaiting <= 5) {
          state = "En attente";
        } else {
          state = "En attente";
        }

        return {
          id: service.id,
          name: service.name,
          state,
          tickets: pendingTickets.concat(inProgressTickets).slice(0, 2),
        };
      });
  }, [data, isSuperAdmin]);

  return { services: servicesWithState, loading, error };
};
