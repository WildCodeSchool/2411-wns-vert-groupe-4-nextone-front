import { useState, useEffect } from "react";
import { useLazyQuery, useSubscription } from "@apollo/client";
import { useParams } from "react-router-dom";
import { TICKETS_FOR_TV_DISPLAY } from "../requests/queries/ticket.query";
import { TICKETS_CHANGED } from "../requests/subscriptions/ticket.subscription";
import TvHeader from "@/components/tv/HeaderTv";
import TvFooter from "@/components/tv/TvFooter";
import CurrentTicket from "@/components/tv/CurrentTicket";
import TicketIsCalled from "@/components/tv/TicketIsCalled";
import TicketInProgressList from "@/components/tv/TicketInProgressList";

export type Ticket = {
  code: string;
  email: string;
  createdAt: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string;
  status: string;
  updatedAt: string;
  service: {
    id: string;
    name: string;
  };
};

export default function TvPage() {
  const [dateTime, setDateTime] = useState(new Date());
  const { key, serviceId } = useParams();
  const [waitingTickets, setWaitingTickets] = useState<Ticket[]>([]);
  const [calledTickets, setCalledTickets] = useState<Ticket[]>([]);
  const [lastCalledTickets, setLastCalledTickets] = useState<Ticket[]>([]);

  const [getWaitingTickets, { data, loading, error }] = useLazyQuery(
    TICKETS_FOR_TV_DISPLAY,
    {
      variables: { data: { key, serviceId } },
    }
  );

  useEffect(() => {
    if (waitingTickets.length) return;
    getWaitingTickets();
  }, []);

  useEffect(() => {
    if (waitingTickets.length) return;
    console.log("Initial tickets for TV display:", data);
    setWaitingTickets((data?.ticketsForTVDisplay as unknown as Ticket[]) || []);
  }, [data]);

  useSubscription(TICKETS_CHANGED, {
    onData: ({ data }) => {
      const updatedTicket = data.data.ticketsChanged;
      console.log("Received ticket update via subscription:", updatedTicket);
      if (updatedTicket.service.id !== serviceId) {
        return;
      }

      //IN PROGRESS => les tickets qui sont appelés
      if (updatedTicket.status === "INPROGRESS") {
        console.log(
          "is in list",
          waitingTickets.find((ticket) => ticket.id === updatedTicket.id)
        );
        setWaitingTickets((prevTickets) =>
          prevTickets.filter((ticket) => ticket.id !== updatedTicket.id)
        );
        setTimeout(() => {
          setCalledTickets((prevTickets) =>
            prevTickets.filter((ticket) => ticket.id !== updatedTicket.id)
          );
          setLastCalledTickets((prevTickets) => {
            const newLastCalled = [updatedTicket, ...prevTickets];
            return newLastCalled.slice(0, 3);
          });
        }, 3000);
        setCalledTickets((prevTickets) => [...prevTickets, updatedTicket]);
        return;
      }

      //PENDING => les tickets qui sont affichés dans la TV
      if (updatedTicket.status === "PENDING") {
        const ticketLogsWithoutUpdatedStatus = updatedTicket.ticketLogs.filter(
          (log: any) => log.status !== "UPDATED"
        );
        const lastStatus =
          ticketLogsWithoutUpdatedStatus[updatedTicket.ticketLogs.length - 2]
            ?.status;
        if (lastStatus === "INPROGRESS" || lastStatus === "CANCELED") {
          setWaitingTickets((prevTickets) =>
            [...prevTickets, updatedTicket].sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
          );
          setCalledTickets((prevTickets) =>
            prevTickets.filter((ticket) => ticket.id !== updatedTicket.id)
          );
          setLastCalledTickets((prevTickets) =>
            prevTickets.filter((ticket) => ticket.id !== updatedTicket.id)
          );
          return;
        }
        setWaitingTickets((prevTickets) => [...prevTickets, updatedTicket]);
        return;
      }
      if (updatedTicket.status === "CANCELED") {
        setWaitingTickets((prevTickets) => [...prevTickets, updatedTicket]);
        setCalledTickets((prevTickets) =>
          prevTickets.filter((ticket) => ticket.id !== updatedTicket.id)
        );
        setLastCalledTickets((prevTickets) =>
          prevTickets.filter((ticket) => ticket.id !== updatedTicket.id)
        );
        return;
      }
    },
  });

  if (loading) return <p>Chargement des tickets...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div className="h-screen w-screen bg-gray-50 flex justify-center items-center">
      <div className="flex flex-1 h-full w-full shadow-lg overflow-hidden">
        <div className="flex-1 bg-[#F0F0EE] flex flex-col justify-between text-white">
          <TvHeader dateTime={dateTime} tvKey={key}></TvHeader>
          <CurrentTicket tickets={calledTickets}></CurrentTicket>
          <TicketIsCalled data={lastCalledTickets}></TicketIsCalled>
          <TvFooter></TvFooter>
        </div>
        <TicketInProgressList
          tickets={Array.from(waitingTickets)}
        ></TicketInProgressList>
      </div>
    </div>
  );
}
