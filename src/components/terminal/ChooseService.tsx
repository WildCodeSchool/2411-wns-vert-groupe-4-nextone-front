import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketInfo, useTicket } from "@/context/useContextTicket";
import NavigationActions from "../../common/terminal/NavigationActions";
import CompanyIllustration from "../../common/terminal/CompanyIllustration";
import Stepper from "../../common/terminal/Stepper";
import { useQuery } from "@apollo/client";
import { GET_SERVICES } from "@/requests/queries/service.query";
import { Service, ChooseServiceProps } from "@/types/terminal";
import { LoadingSpinner, Message } from "@/utils/message";

function ChooseService({ onBack, onNext, onCancel }: ChooseServiceProps) {
  const { ticket, setTicket } = useTicket();
  const [selectedService, setSelectedService] = useState<{ id: string; name: string } | undefined>(
    ticket.serviceId ? { id: ticket.serviceId, name: ticket.serviceName || "" } : undefined
  );

  const [errorMessage, setErrorMessage] = useState<string>("");

  const { data, loading, error } = useQuery(GET_SERVICES);

  const activeServices: Service[] = (data?.services as Service[] ?? []).filter(
    (service) => service.isGloballyActive
  );

  const updateSelectedService = (service: Service) => {
    const serviceObj = { id: service.id, name: service.name };
    setSelectedService(serviceObj);
    setTicket({ ...ticket, serviceId: serviceObj.id, serviceName: serviceObj.name });
    setErrorMessage("");
  };

  const handleSelectService = (id: string) => {
    const service = activeServices.find((s) => s.id === id);
    if (!service) return;
    updateSelectedService(service);
  };

  function updateTicketService(ticket: TicketInfo, selectedService: { id: string; name: string } | undefined, setTicket: (ticket: TicketInfo) => void) {
    if (!selectedService) return;
    setTicket({ ...ticket, serviceId: selectedService.id, serviceName: selectedService.name });
  }

  function setTicketForGenerate () {
    if (!selectedService) {
      setErrorMessage("Vous devez sélectionner un service avant de continuer.");
      return;
    }
    updateTicketService(ticket, selectedService, setTicket);
    onNext?.();
  }

  const tabClass = "w-full text-[20px] text-primary py-6 rounded-md border border-primary text-center data-[state=active]:bg-primary data-[state=active]:text-white";

  if (loading) return <LoadingSpinner />;
  if (error) return <Message text="Erreur lors du chargement des services" colorClass="text-red-500" />;
  if (activeServices.length === 0) return <Message text="Aucun service actif disponible." />;

  return (
    <div className="flex flex-col md:flex-row h-screen w-full font-sans bg-white">
      <div className="w-full md:w-1/2 h-screen flex flex-col p-4 md:p-8">
        <div className="sticky top-0 bg-white z-10 pb-6">
          <Stepper currentStep={1}/>
        </div>
         <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-[22px] mb-8 text-left">
            Quel service souhaitez-vous visiter ?
          </h2>
          {activeServices.length > 4 ? (
            <div className="mb-4">
              <select className="w-full border border-primary rounded-md p-3 text-lg" value={selectedService?.id || ""} onChange={(e) => handleSelectService(e.target.value)}>
                <option value="">-- Sélectionnez un service --</option>
                {activeServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <Tabs value={selectedService?.id || ""} onValueChange={handleSelectService} className="w-full mb-4">
              <TabsList className="grid grid-cols-2 gap-4 w-full">
                {activeServices.map((service) => (
                  <TabsTrigger key={service.id} value={service.id} className={tabClass}>
                    {service.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
          {errorMessage && (
            <p className="text-red-600 mt-2 text-sm">{errorMessage}</p>
          )}
          <NavigationActions onBack={onBack} onNext={setTicketForGenerate} onCancel={onCancel} updateTicket={() =>updateTicketService(ticket, selectedService, setTicket)}/>
        </div>
      </div>
      <CompanyIllustration />
    </div>
);

}

export default ChooseService;
