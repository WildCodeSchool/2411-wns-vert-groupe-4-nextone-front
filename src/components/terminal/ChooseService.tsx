import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useTicket } from "@/context/useContextTicket";
import NavigationActions from "./NavigationActions";
import CompanyIllustration from "./CompanyIllustration";
import Stepper from "./Stepper";
import { useQuery } from "@apollo/client";
import { GET_SERVICES } from "@/requests/queries/service.query";
import { Service, ChooseServiceProps } from "@/types/terminal";
import { LoadingSpinner, Message } from "@/utils/message";

function ChooseService({ onBack, onNext, onCancel }: ChooseServiceProps) {
  const { ticket, setTicket } = useTicket();
  const [selectedService, setSelectedService] = useState<string | undefined>(ticket.service || undefined);
  const { data, loading, error } = useQuery(GET_SERVICES);

  const activeServices = (data?.services as Service[] ?? [])
    .filter((service: Service) => service.isGloballyActive)
    .map((service: Service) => service.name);

  useEffect(() => {
    if (!selectedService && activeServices.length > 0) {
      const defaultService = activeServices[0];
      setSelectedService(defaultService);
      setTicket({ ...ticket, service: defaultService });
    }
  }, [activeServices, selectedService, ticket, setTicket]);

  if (loading) return <LoadingSpinner />;
  if (error) return <Message text="Erreur lors du chargement des services" colorClass="text-red-500" />;
  if (activeServices.length === 0) return <Message text="Aucun service actif disponible." />;

  return (
    <div className="flex flex-col md:flex-row h-screen w-full font-sans bg-white">
      <div className="w-full md:w-1/2 flex flex-col p-4 md:pl-8 overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 pb-4">
          <Stepper currentStep={1} onCancel={onCancel}/>
        </div>
        <h2 className="text-[22px] text-left mb-4">
          Quel service souhaitez-vous visiter ?
        </h2>
        <Tabs
          value={selectedService}
          onValueChange={(value) => {
            setSelectedService(value);
            setTicket({ ...ticket, service: value });
          }} className="w-full mb-6">
          <TabsList className="grid grid-cols-2 gap-4 w-full">
            {activeServices.map((service) => (
              <TabsTrigger key={service} value={service}
                className={cn(
                  "w-full text-[20px] text-primary py-6 rounded-md border border-primary text-center",
                  "data-[state=active]:bg-primary data-[state=active]:text-white")}>
                {service}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <NavigationActions onBack={onBack} onNext={onNext} />
      </div>
      <CompanyIllustration />
    </div>
  );
}

export default ChooseService;
