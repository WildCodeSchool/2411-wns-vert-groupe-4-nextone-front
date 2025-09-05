import { createContext, useContext, useState, ReactNode } from "react";

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

type TicketContextType = {
  ticket: TicketInfo;
  setTicket: (ticket: TicketInfo) => void;
};

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const [ticket, setTicket] = useState<TicketInfo>({
    serviceId: "",
    serviceName: "",
    name: "",
    firstName: "",
    email: "",
    phone: "",
    code: "",
    rgpdAccepted: false,
  });

  return (
    <TicketContext.Provider value={{ ticket, setTicket }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTicket = () => {
  const context = useContext(TicketContext);
  if (!context) throw new Error("useTicket must be used within TicketProvider");
  return context;
};
