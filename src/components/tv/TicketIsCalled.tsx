function TicketIsCalled({ data }: { data: any }) {

    if (data.length === 0) return (<div className="text-black">Aucun ticket en cours d'appel</div>);
    return (
        <div className="grid grid-cols-3 gap-4 p-4 border-2 border-red-500">
            {data.map((ticket: any) => (
                <div
                    key={ticket.id}
                    className="bg-white text-black rounded-lg shadow p-4 flex flex-col items-center justify-center"
                >
                    <span className="text-2xl font-bold">{ticket.code}</span>
                    <span className="text-sm">{ticket.service.name}</span>
                </div>
            ))}
        </div>
    );
}

export default TicketIsCalled;