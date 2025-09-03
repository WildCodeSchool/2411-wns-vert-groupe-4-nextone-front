import { createContext, useContext, useState, ReactNode } from "react";

type TicketInfo = {
  service: string;
  name: string;
  firstName: string;
  email: string;
  phone: string;
};

type TicketContextType = {
  ticket: TicketInfo;
  setTicket: (ticket: TicketInfo) => void;
};

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const [ticket, setTicket] = useState<TicketInfo>({
    service: "",
    name: "",
    firstName: "",
    email: "",
    phone: "",
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
