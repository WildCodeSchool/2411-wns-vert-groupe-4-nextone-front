export type TicketInfo = {
  id?: string,
  serviceId: string;  
  serviceName?: string;    
  name: string;
  firstName: string;
  email: string;
  phone: string;
  code?: string,
  rgpdAccepted: boolean;
};

export type TicketContextType = {
  ticket: TicketInfo;
  setTicket: (ticket: TicketInfo) => void;
};

export type GetTicketsPaginatedResult = {
  ticketsByProperties: {
    items: Array<{
      id: string;
      firstName?: string;
      lastName?: string;
      code: string;
      createdAt: string;
      email: string;
      phone: string;
      status: string;
      updatedAt: string;
      service?: {
        id: string;
        name: string;
      };
    }>;
    totalCount: number;
  };
};

export type GetTicketsResult = {
  tickets: Array<{
    id: string;
    code: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    service?: {
      id: string;
      name: string;
    };
  }>;
};
