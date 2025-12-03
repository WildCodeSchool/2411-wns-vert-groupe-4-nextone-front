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