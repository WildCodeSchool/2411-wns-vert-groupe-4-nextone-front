import { GET_SERVICES } from "@/requests/queries/service.query";
import { SERVICE_TOGGLED_SUBSCRIPTION } from "@/requests/subscriptions/service.subscription";
import { useQuery, useSubscription } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";
import { FormStepProps } from "@/types/terminal";

export default function ServiceStep({ formMethods }: FormStepProps) {
  const [services, setServices] = useState<
    Array<{ id: string; name: string; isGloballyActive: boolean }>
  >([]);

  const activeServices = useMemo(
    () => services.filter((service) => service.isGloballyActive),
    [services]
  );

  const { data } = useQuery(GET_SERVICES);

  useSubscription(SERVICE_TOGGLED_SUBSCRIPTION, {
    onData: ({ data: subscriptionData }) => {
      if (subscriptionData.data?.serviceToggled) {
        const toggledService = subscriptionData.data.serviceToggled;
        const toggleServiceExists = services.find(
          (service) => service.id === toggledService.id
        );

        if (toggleServiceExists) {
          setServices((prevServices) =>
            prevServices.map((service) =>
              service.id === toggledService.id
                ? {
                    ...service,
                    isGloballyActive: toggledService.isGloballyActive,
                  }
                : service
            )
          );
        }
      }
    },
  });

  useEffect(() => {
    if (data?.services) {
      setServices(
        data.services.map(
          (service: {
            id: string;
            name: string;
            isGloballyActive: boolean;
          }) => ({
            id: service.id,
            name: service.name,
            isGloballyActive: service.isGloballyActive,
          })
        )
      );
    }
  }, [data]);

  useEffect(() => {
    const currentServiceId = formMethods.getValues("serviceId");
    const firstActiveServiceId = activeServices[0]?.id;

    if (!currentServiceId && firstActiveServiceId) {
      formMethods.setValue("serviceId", firstActiveServiceId);
    }
  }, [activeServices[0]?.id, formMethods]);

  const selectedServiceId = formMethods.watch("serviceId");

  return (
    <div className="flex flex-col justify-center">
      <h2 className="text-[22px] mb-8 text-left">
        Quel service souhaitez-vous visiter ?
      </h2>
      {activeServices.length > 4 ? (
        <div className="mb-4">
          <select
            className="w-full border border-primary rounded-md p-3 text-lg"
            {...formMethods.register("serviceId")}
          >
            {activeServices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 w-full">
          {activeServices.map((service) => (
            <div
              key={service.id}
              className={`cursor-pointer border aspect-[16/5] rounded-md text-center flex items-center justify-center text-lg font-medium ${
                selectedServiceId === service.id
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300 bg-white text-gray-800 hover:border-primary"
              }`}
              data-testid={`service-card-${service.id}`}
              onClick={() => formMethods.setValue("serviceId", service.id)}
            >
              {service.name}
            </div>
          ))}
        </div>
      )}
      {formMethods.formState.errors.serviceId && (
        <p className="text-red-600 mt-2 text-sm">
          {formMethods.formState.errors.serviceId.message}
        </p>
      )}
    </div>
  );
}
