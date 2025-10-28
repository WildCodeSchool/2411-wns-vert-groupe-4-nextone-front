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