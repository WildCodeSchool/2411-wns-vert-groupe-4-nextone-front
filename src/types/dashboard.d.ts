export type DashboardTicket = {
  id: string;
  code: string;
  status: string;
};

export type DashboardService = {
  id: string;
  name: string;
  isGloballyActive: boolean;
  tickets: DashboardTicket[];
};

export type ServiceWithState = {
  id: string;
  name: string;
  state: "Fluide" | "En attente" | "En cours" | "Surchargé";
  tickets: DashboardTicket[];
};

export type GetEmployeeAuthorizationsResult = {
  authorizations: Array<{
    service: DashboardService;
    manager: {
      firstName: string;
      lastName: string;
      id: string;
    };
    isAdministrator: boolean;
  }>;
};
