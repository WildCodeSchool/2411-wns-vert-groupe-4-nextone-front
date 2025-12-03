import { useState, useEffect } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import { useParams } from "react-router-dom";
import { TICKETS_FOR_TV_DISPLAY } from "../requests/queries/ticket.query";
import { TICKETS_CHANGED } from "../requests/subscriptions/ticket.subscription";
import TvHeader from "@/components/tv/HeaderTv";
import TvFooter from "@/components/tv/TvFooter";
import CurrentTicket from "@/components/tv/CurrentTicket";
import TicketInProgressList from "@/components/tv/TicketInProgressList";

export default function TvPage () {
    const [dateTime, setDateTime] = useState(new Date());
    const { serviceId } = useParams();

    const { data, loading, error, refetch } = useQuery(TICKETS_FOR_TV_DISPLAY, {
        variables: { serviceId },
    });

    const { data: ticketEvents } = useSubscription(TICKETS_CHANGED);

    useEffect(() => {
        if (ticketEvents) {
            refetch();
        }
    }, [ticketEvents, refetch]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <p>Chargement des tickets...</p>;
    if (error) return <p>Erreur : {error.message}</p>;

    const tickets = data?.ticketsForTVDisplay || [];

    return (
        <div className="h-screen w-screen bg-gray-50 flex justify-center items-center">
            <div className="flex flex-1 h-full w-full shadow-lg overflow-hidden">
                <div className="flex-1 bg-[#F0F0EE] flex flex-col justify-between text-white">
                    <TvHeader dateTime={dateTime}></TvHeader>
                    <CurrentTicket tickets={tickets}></CurrentTicket>
                    <TvFooter></TvFooter>
                </div>
                <TicketInProgressList tickets={tickets}></TicketInProgressList>
            </div>
        </div>
    );
};
