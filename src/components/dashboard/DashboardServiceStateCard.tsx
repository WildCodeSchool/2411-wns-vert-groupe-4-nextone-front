import { Button } from "../ui/button";
import { Service } from "./HomeDashboard";
import { FaCircle } from "react-icons/fa6";

export default function DashboardStatCard({ service }: { service: Service }) {
  return (
    <div className="bg-card p-8 rounded-lg flex flex-col items-start justify-start gap-8">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-xl font-light flex flex-col items-start justify-start">
          {service.name}
        </h3>
        <span className="text-sm py-2 px-4 bg-chart-1 flex items-center justify-start gap-2 rounded-full">
          <FaCircle className="text-chart-2" size={9} />
          {service.state}
        </span>
      </div>
      <div className="w-full bg-popover rounded-md flex flex-col items-start justify-start p-6">
        {service.tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="w-full not-last:border-b not-last:border-b-border flex items-center justify-between first:pb-4 last:pt-4 not-first:not-last:py-4"
          >
            <h4 className="font-medium">{ticket.code}</h4>
            <Button>Traiter le ticket</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
