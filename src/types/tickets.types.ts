export type GetTicketsPaginatedResult = {
  ticketsByProperties: {
    items: {
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
    }
    totalCount: number;
  } 
  };

