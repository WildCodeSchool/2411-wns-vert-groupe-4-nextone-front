import { CurrentTicketProps } from "@/types/tv.types";

function CurrentTicket({tickets}: CurrentTicketProps) {
    const currentTicket = tickets[0];
    
    return (
        <>
            {currentTicket ? (
                <div className="bg-foreground text-white text-center py-12 w-full max-w-sm mx-auto mb-8 rounded-2xl shadow-lg">
                    <h1 className="text-8xl font-medium">{currentTicket.code}</h1>
                    <p className="text-4xl mt-4 text-lime-500">
                        <span className="font-bold">Service {currentTicket.service.name}</span>
                    </p>
                </div>
            ) : (
                <p className="text-center text-black">
                    Aucun ticket en cours pour ce service.
                </p>
            )}
        </>
    )
}

export default CurrentTicket;


// import { useEffect, useState, useRef } from "react";
// import { CurrentTicketProps } from "@/types/tv.types";


// interface CurrentTicketWithProgressProps extends CurrentTicketProps {
//   progressList?: CurrentTicketProps['tickets']; 
// }


// function CurrentTicketWithProgress({ tickets, progressList = [] }: CurrentTicketWithProgressProps) {
//   const [history, setHistory] = useState<typeof tickets>([]);
//   const prevTicketsRef = useRef<(typeof tickets[0] | null)[]>([]);

//   const currentTicket = tickets[0];

//   useEffect(() => {
//     const prevTickets = prevTicketsRef.current;

//     const allTickets = [currentTicket, ...progressList];

//     allTickets.forEach((ticket, index) => {
//       const prevTicket = prevTickets[index];

//       if (ticket && prevTicket && prevTicket.code !== ticket.code) {
//         setHistory(prev => {
//           const newHistory = [...prev, prevTicket];
//           if (newHistory.length > 3) {
//             newHistory.shift();
//           }
//           return newHistory;
//         });
//       }
//     });

//     prevTicketsRef.current = allTickets;
//   }, [currentTicket, progressList]);

//   return (
//     <>
//       {currentTicket ? (
//         <div className="bg-foreground text-white text-center py-12 w-full max-w-sm mx-auto mb-8 rounded-2xl shadow-lg">
//           <h1 className="text-8xl font-medium">{currentTicket.code}</h1>
//           <p className="text-4xl mt-4 text-lime-500">
//             <span className="font-bold">Service {currentTicket.service.name}</span>
//           </p>
//         </div>
//       ) : (
//         <p className="text-center text-black">
//           Aucun ticket en cours pour ce service.
//         </p>
//       )}

//       <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
//         {history.map((ticket, index) => (
//           <div
//             key={index}
//             className="bg-gray-200 text-center py-6 rounded-xl shadow-md"
//           >
//             <h2 className="text-3xl font-bold">{ticket.code}</h2>
//             <p className="text-lg mt-2">{ticket.service.name}</p>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }

// export default CurrentTicketWithProgress;

