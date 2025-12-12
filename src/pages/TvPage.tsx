// import { useState, useEffect } from "react";
// import { useQuery, useSubscription } from "@apollo/client";
// import { useParams } from "react-router-dom";
// import { TICKETS_FOR_TV_DISPLAY } from "../requests/queries/ticket.query";
// import { TICKETS_CHANGED } from "../requests/subscriptions/ticket.subscription";
// import TvHeader from "@/components/tv/HeaderTv";
// import TvFooter from "@/components/tv/TvFooter";
// import CurrentTicket from "@/components/tv/CurrentTicket";
// import TicketInProgressList from "@/components/tv/TicketInProgressList";
// import TicketIsCalled from "@/components/tv/TicketIsCalled";

// export default function TvPage () {
//     const [dateTime, setDateTime] = useState(new Date());
//     const { key, serviceId  } = useParams();

//     const { data, loading, error, refetch } = useQuery(TICKETS_FOR_TV_DISPLAY, {
//         variables: { data: { key, serviceId } },
//     });
//     const { data: ticketEvents } = useSubscription(TICKETS_CHANGED);

//     useEffect(() => {
//         if (ticketEvents) {
//             refetch();
//         }
//     }, [ticketEvents, refetch]);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setDateTime(new Date());
//         }, 1000);
//         return () => clearInterval(interval);
//     }, []);

//     if (loading) return <p>Chargement des tickets...</p>;
//     if (error) return <p>Erreur : {error.message}</p>;

//     const tickets = data?.ticketsForTVDisplay || [];

//     return (
//         <div className="h-screen w-screen bg-gray-50 flex justify-center items-center">
//             <div className="flex flex-1 h-full w-full shadow-lg overflow-hidden">
//                 <div className="flex-1 bg-[#F0F0EE] flex flex-col justify-between text-white">
//                     <TvHeader dateTime={dateTime} tvKey={key}></TvHeader>
//                     <CurrentTicket tickets={tickets}></CurrentTicket>
//                     <TicketIsCalled serviceId={serviceId} data={data} refetch={refetch}></TicketIsCalled>
//                     <TvFooter></TvFooter>
//                 </div>
//                 <TicketInProgressList tickets={tickets}></TicketInProgressList>
//             </div>
//         </div>
//     );
// };



// import { useState, useEffect } from "react";
// import { useLazyQuery, useSubscription } from "@apollo/client";
// import { useParams } from "react-router-dom";
// import { TICKETS_FOR_TV_DISPLAY } from "../requests/queries/ticket.query";
// import { TICKETS_CHANGED } from "../requests/subscriptions/ticket.subscription";
// import TvHeader from "@/components/tv/HeaderTv";
// import TvFooter from "@/components/tv/TvFooter";
// import CurrentTicket from "@/components/tv/CurrentTicket";
// import TicketInProgressList from "@/components/tv/TicketInProgressList";
// import TicketIsCalled from "@/components/tv/TicketIsCalled";

// export type Ticket = {
//     code: string;
//     email: string;
//     createdAt: string;
//     firstName: string;
//     id: string;
//     lastName: string;
//     phone: string;
//     status: string;
//     updatedAt: string;
//     service: {
//         id: string;
//         name: string;
//     };
// };

// export default function TvPage () {
//     const [dateTime, setDateTime] = useState(new Date());
//     const { key, serviceId  } = useParams();
//     const [waitingTickets, setWaitingTickets] = useState<Ticket[]>([]);
//     const [calledTickets, setCalledTickets] = useState<Ticket[]>([]);
//     const [lastCalledTickets, setLastCalledTickets] = useState<Ticket[]>([]);

//     const [getWaitingTickets, { data, loading, error, refetch }] = useLazyQuery(TICKETS_FOR_TV_DISPLAY, {
//         variables: { data: { key, serviceId } },
//     });

//     useEffect(() => {
//         getWaitingTickets();
//     }, []);

//     useEffect(() => {
//         console.log("Initial tickets for TV display:", data);
//         setWaitingTickets((data?.ticketsForTVDisplay as unknown as Ticket[]) || []);
//     }, [data]);

//     useSubscription(TICKETS_CHANGED, {
//         onData: ({ data }) => {
//             const updatedTicket = data.data.ticketsChanged;
//             console.log("Received ticket update via subscription:", updatedTicket);
//             if(updatedTicket.service.id !== serviceId) {
//                 return;
//             }

//             //IN PROGRESS => les tickets qui sont appelés
//             if(updatedTicket.status === "INPROGRESS" ) {
//                 console.log("is in list", waitingTickets.find((ticket) => ticket.id === updatedTicket.id));
//                 setWaitingTickets((prevTickets) =>
//                     prevTickets.filter((ticket) => ticket.id !== updatedTicket.id
//                 ));
//                 setTimeout(() => {
//                     setCalledTickets((prevTickets) =>
//                         prevTickets.filter((ticket) => ticket.id !== updatedTicket.id
//                     ));
//                     setLastCalledTickets((prevTickets) => {
//                         const newLastCalled = [updatedTicket, ...prevTickets];
//                         return newLastCalled.slice(0, 3);
//                     }); 
//                 }, 3000);
//                 setCalledTickets((prevTickets) => [...prevTickets, updatedTicket]);
//                 return;
//             }

//             //PENDING => les tickets qui sont affichés dans la TV
//             if(updatedTicket.status === "PENDING" ) {
//                 const ticketLogsWithoutUpdatedStatus = updatedTicket.ticketLogs.filter((log: any) => log.status !== 'UPDATED');
//                 const lastStatus = ticketLogsWithoutUpdatedStatus[updatedTicket.ticketLogs.length - 2]?.status;
//                 if(lastStatus === "INPROGRESS"|| lastStatus === "CANCELED") {
//                     setWaitingTickets((prevTickets) => [...prevTickets, updatedTicket].sort((a, b) =>
//                         new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//                     ));
//                     setCalledTickets((prevTickets) =>
//                         prevTickets.filter((ticket) => ticket.id !== updatedTicket.id
//                     ));
//                     setLastCalledTickets((prevTickets) =>
//                         prevTickets.filter((ticket) => ticket.id !== updatedTicket.id
//                     ));
//                     return;
//                 }
//                 setWaitingTickets((prevTickets) => [...prevTickets, updatedTicket]);
//                 return;
//             }
//             if(updatedTicket.status === "CANCELED" ) {
//                 setWaitingTickets((prevTickets) => [...prevTickets, updatedTicket]);
//                 setCalledTickets((prevTickets) =>
//                     prevTickets.filter((ticket) => ticket.id !== updatedTicket.id
//                 ));
//                 setLastCalledTickets((prevTickets) =>
//                     prevTickets.filter((ticket) => ticket.id !== updatedTicket.id
//                 ));
//                 return;
//             }
//         },
//     });

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setDateTime(new Date());
//         }, 1000);
//         return () => clearInterval(interval);
//     }, []);

//     if (loading) return <p>Chargement des tickets...</p>;
//     if (error) return <p>Erreur : {error.message}</p>;

//     const tickets = data?.ticketsForTVDisplay || [];

//     return (
//         <div className="h-screen w-screen bg-gray-50 flex justify-center items-center">
//             <div className="flex flex-1 h-full w-full shadow-lg overflow-hidden">
//                 <div className="flex-1 bg-[#F0F0EE] flex flex-col justify-between text-white">
//                     <TvHeader dateTime={dateTime} tvKey={key}></TvHeader>
//                     <CurrentTicket tickets={calledTickets}></CurrentTicket>
//                     <TicketIsCalled serviceId={serviceId} data={lastCalledTickets} refetch={refetch}></TicketIsCalled>
//                     <TvFooter></TvFooter>
//                 </div>
//                 <TicketInProgressList tickets={waitingTickets}></TicketInProgressList>
//             </div>
//         </div>
//     );
// };













import { useState, useEffect } from "react";
import { useLazyQuery, useSubscription } from "@apollo/client";
import { useParams } from "react-router-dom";
import { TICKETS_FOR_TV_DISPLAY } from "../requests/queries/ticket.query";
import { TICKETS_CHANGED } from "../requests/subscriptions/ticket.subscription";
import TvHeader from "@/components/tv/HeaderTv";
import TvFooter from "@/components/tv/TvFooter";
import CurrentTicket from "@/components/tv/CurrentTicket";
import TicketInProgressList from "@/components/tv/TicketInProgressList";
import TicketIsCalled from "@/components/tv/TicketIsCalled";

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

export default function TvPage () {
    const [dateTime, setDateTime] = useState(new Date());
    const { key, serviceId  } = useParams();
    const [waitingTickets, setWaitingTickets] = useState(new Set<Ticket>());
    const [calledTickets, setCalledTickets] = useState<Ticket[]>([]);
    const [lastCalledTickets, setLastCalledTickets] = useState<Ticket[]>([]);

    const [getWaitingTickets, { data, loading, error }] = useLazyQuery(TICKETS_FOR_TV_DISPLAY, {
        variables: { data: { key, serviceId } },
    });

    useEffect(() => {
        getWaitingTickets();
    }, []);

    useEffect(() => {
        console.log("Initial tickets for TV display:", data);
        setWaitingTickets((data?.ticketsForTVDisplay as unknown as Set<Ticket>) || []);
    }, [data]);

    useSubscription(TICKETS_CHANGED, {
        onData: ({ data }) => {
            const updatedTicket = data.data.ticketsChanged;
            console.log("Received ticket update via subscription:", updatedTicket);
            if(updatedTicket.service.id !== serviceId) {
                return;
            }

            //IN PROGRESS => les tickets qui sont appelés
            if(updatedTicket.status === "INPROGRESS" ) {
                console.log("updatedTickets", updatedTicket)
                setWaitingTickets((prevTickets) => {
                    const newTickets = new Set(prevTickets);
                    newTickets.delete(updatedTicket);
                    console.log("newTickets", newTickets.has(updatedTicket))
                    return newTickets;
                });
                setTimeout(() => {
                    setCalledTickets((prevTickets) =>
                        prevTickets.filter((ticket) => ticket.id !== updatedTicket.id
                    ));
                    setLastCalledTickets((prevTickets) => {
                        const newLastCalled = [updatedTicket, ...prevTickets];
                        return newLastCalled.slice(0, 3);
                    }); 
                }, 3000);
                setCalledTickets((prevTickets) => [...prevTickets, updatedTicket]);
                return;
            }

            //PENDING => les tickets qui sont affichés dans la TV
            if(updatedTicket.status === "PENDING" ) {
                const ticketLogsWithoutUpdatedStatus = updatedTicket.ticketLogs.filter((log: any) => log.status !== 'UPDATED');
                const lastStatus = ticketLogsWithoutUpdatedStatus[updatedTicket.ticketLogs.length - 2]?.status;
                if(lastStatus === "INPROGRESS"|| lastStatus === "CANCELED") {
                    setWaitingTickets((prevTickets) => {
                        const newTickets = new Set(prevTickets);
                        newTickets.delete(updatedTicket);
                        return newTickets;
                    });
                    const sortedTickets = Array.from(waitingTickets).sort((a, b) =>
                        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    );
                    sortedTickets.push(updatedTicket);
                    setWaitingTickets(new Set(sortedTickets));

                    setCalledTickets((prevTickets) =>
                        prevTickets.filter((ticket) => ticket.id !== updatedTicket.id
                    ));
                    setLastCalledTickets((prevTickets) =>
                        prevTickets.filter((ticket) => ticket.id !== updatedTicket.id
                    ));
                    return;
                }
                setWaitingTickets((prevTickets) => prevTickets.add(updatedTicket));
                return;
            }
            if(updatedTicket.status === "CANCELED" ) {
                setWaitingTickets((prevTickets) => prevTickets.add(updatedTicket));
                setCalledTickets((prevTickets) =>
                    prevTickets.filter((ticket) => ticket.id !== updatedTicket.id
                ));
                setLastCalledTickets((prevTickets) =>
                    prevTickets.filter((ticket) => ticket.id !== updatedTicket.id
                ));
                return;
            }
        },
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

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
                <TicketInProgressList tickets={Array.from(waitingTickets)}></TicketInProgressList>
                
            </div>
        </div>
    );
};
