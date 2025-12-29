function TicketIsCalled({ data }: { data: any }) {
  if (data.length === 0)
    return (
      <div className="text-black text-3xl flex justify-center items-center h-[25vh]">
        <p>Aucun ticket appelé récemment...</p>
      </div>
    );
  return (
    <div className="grid grid-cols-3 gap-4 py-4 px-10 h-[25vh]">
      {data.map((ticket: any) => (
        <div
          key={ticket.id}
          className="bg-white text-black rounded-lg shadow p-4 flex flex-col items-center justify-center"
        >
          <span className="text-4xl font-bold">{ticket.code}</span>
          <span className="text-xl">{ticket.service.name}</span>
        </div>
      ))}
    </div>
  );
}

export default TicketIsCalled;
