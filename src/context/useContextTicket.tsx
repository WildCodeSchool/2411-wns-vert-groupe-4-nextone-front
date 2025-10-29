import { createContext, useContext, useState, ReactNode } from "react";
import { TicketInfo, TicketContextType } from "../types/ticket";

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
