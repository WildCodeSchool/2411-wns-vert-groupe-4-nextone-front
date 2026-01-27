// import { CurrentTicketProps, TvTicket } from "@/types/tv.types";
// import { useEffect, useState } from "react";

// function TicketInProgressList({ tickets }: CurrentTicketProps) {
//   const [ticketsInProgressList, setTicketsInProgressList] = useState<
//     TvTicket[]
//   >([]);

//   useEffect(() => {
//     console.log("tickets in progress:", tickets);
//     setTicketsInProgressList(tickets);
//   }, [tickets]);

//   return (
//     <div className="w-1/3 bg-foreground text-white p-10 flex flex-col gap-12">
//       <div className="flex justify-center">
//         <h2 className="text-4xl font-semibold text-white inline-block pb-2 w-fit">
//           Tickets en attente
//         </h2>
//       </div>
//       <ul className="flex flex-col items-center h-full justify-start space-y-16">
//         {ticketsInProgressList.slice(0, 5).map((ticket: any) => (
//           <li key={ticket.id} className="text-center">
//             <p className="text-5xl pb-2">{ticket.code}</p>
//             <p className="text-2xl text-secondary">
//               Service {ticket.service.name}
//             </p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default TicketInProgressList;


import { CurrentTicketProps, TvTicket } from "@/types/tv.types";
import { useEffect, useState } from "react";

function TicketInProgressList({tickets}: CurrentTicketProps) {
    const [ticketsInProgressList, setTicketsInProgressList] = useState<TvTicket[]>([]);

    useEffect(() => {   
        console.log("tickets in progress:", tickets);        
        setTicketsInProgressList(tickets.slice(1, 6))
    }, [tickets]);

    return(
        <div className="w-1/3 bg-foreground text-white p-6 flex flex-col">
            <div className="flex justify-center">
                <h2 className="text-3xl font-semibold text-white border-b-[2px] border-gray-700 inline-block pb-2 w-fit">
                    Tickets en cours
                </h2>
            </div>
            <ul className="flex flex-col items-center h-full p-12 gap-6">
                {ticketsInProgressList.map((ticket: any) => (
                    <li key={ticket.id} className="text-center">
                        <p className="text-4xl">{ticket.code}</p>
                        <p className="text-xl text-secondary">Service {ticket.service.name}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TicketInProgressList