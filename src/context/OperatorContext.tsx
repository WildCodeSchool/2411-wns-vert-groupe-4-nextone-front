import { GET_TICKET_INFOS } from "@/requests/queries/ticket.query";
import { useLazyQuery } from "@apollo/client";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "usehooks-ts";

type Ticket = {
  id: string;
  status: "open" | "in_progress" | "closed";
};

type LocalStorageTicketInfos = {
  processingTicketId: string | null;
  processingBeginsAt: string | null;
};

type OperatorContextType = {
  processingTicket: Ticket | null;
  setProcessingTicket: (ticket: Ticket | null) => void;
  canProcessTicket: boolean;
  processTicket: (ticket: Ticket | null) => void;
  updateProcessingTicket: (ticket: Partial<Ticket> | null) => void;
  elapsedTimeInSeconds: number;
};
const OperatorContext = createContext({} as OperatorContextType);

export const useOperator = () => {
  const context = useContext(OperatorContext);
  return context;
};

function OperatorProvider({ children }: Readonly<PropsWithChildren>) {
  const [getTicketInfos] = useLazyQuery(GET_TICKET_INFOS, {
    fetchPolicy: "no-cache",
  });

  const [
    localStorageTicketInfos,
    setLocalStorageTicketInfos,
    removeLocalStorageTicketInfos,
  ] = useLocalStorage<LocalStorageTicketInfos | null>(
    "processingTicketInfos",
    null
  );

  const [processingTicket, setProcessingTicket] = useState<Ticket | null>(null);

  const canProcessTicket = processingTicket === null;

  const processTicket = (ticket: Ticket | null) => {
    if (ticket === null) {
      removeLocalStorageTicketInfos();
      return;
    }
    setProcessingTicket(ticket);
    setElapsedTimeInSeconds(0);
    setLocalStorageTicketInfos({
      processingTicketId: ticket.id,
      processingBeginsAt: new Date().toISOString(),
    });
  };

  const updateProcessingTicket = (ticket: Partial<Ticket> | null) => {
    setProcessingTicket((prev) => {
      if (!prev) return prev;
      return { ...prev, ...ticket } as Ticket;
    });
  };

  const [elapsedTimeInSeconds, setElapsedTimeInSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (localStorageTicketInfos) {
      interval = setInterval(() => {
        setElapsedTimeInSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [localStorageTicketInfos]);

  useEffect(() => {
    if (localStorageTicketInfos) {
      getTicketInfos({
        variables: { ticketId: localStorageTicketInfos.processingTicketId },
        onCompleted(data) {
          if (data.ticket) {
            setProcessingTicket(data.ticket);
          } else {
            setProcessingTicket(null);
            setLocalStorageTicketInfos(null);
          }
        },
      });
    }
  }, [getTicketInfos, localStorageTicketInfos, setLocalStorageTicketInfos]);

  useEffect(() => {
    if (localStorageTicketInfos?.processingBeginsAt) {
      const beginTime = new Date(localStorageTicketInfos.processingBeginsAt);
      const currentTime = new Date();
      const initialElapsedSeconds = Math.floor(
        (currentTime.getTime() - beginTime.getTime()) / 1000
      );
      setElapsedTimeInSeconds(initialElapsedSeconds);
    } else {
      setElapsedTimeInSeconds(0);
    }
  }, [localStorageTicketInfos, setElapsedTimeInSeconds]);

  const value: OperatorContextType = {
    processingTicket,
    setProcessingTicket,
    canProcessTicket,
    processTicket,
    updateProcessingTicket,
    elapsedTimeInSeconds,
  };

  return (
    <OperatorContext.Provider value={value}>
      {children}
    </OperatorContext.Provider>
  );
}

export default OperatorProvider;
