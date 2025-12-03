import { CurrentTicketProps } from "@/types/tv.types";

function TicketInProgressList({tickets}: CurrentTicketProps) {
    const ticketsInProgress = tickets.slice(1, 6);

    return(
        <div className="w-1/3 bg-foreground text-white p-6 flex flex-col">
            <div className="flex justify-center">
                <h2 className="text-3xl font-semibold text-white border-b-[2px] border-gray-700 inline-block pb-2 w-fit">
                    Tickets en cours
                </h2>
            </div>
            <ul className="flex flex-col items-center h-full p-12 gap-6">
                {ticketsInProgress.map((ticket: any) => (
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