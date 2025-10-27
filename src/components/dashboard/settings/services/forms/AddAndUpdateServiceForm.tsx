import InputWithLabel from "@/components/dashboard/InputWithLabel";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  ADD_NEW_AUTHORIZATION_TO_SERVICE,
  CREATE_NEW_SERVICE,
  DELETE_AUTHORIZATION_FROM_SERVICE,
} from "@/requests/mutations/settings.mutation";
import { GET_ALL_MANAGERS } from "@/requests/queries/settings.query";
import { useMutation, useQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { MultiSelectPopover } from "@/components/ui/multiselect-popover";
import PersonServiceSelectionList from "../PersonServiceSelectionList";
import { useToast } from "@/hooks/use-toast";

export type Manager = {
  id: string;
  firstName: string;
  lastName: string;
  isGloballyActive: boolean;
  email: string;
};

type GET_ALL_MANAGERS = {
  managers: Manager[];
};

export default function AddAndUpdateServiceForm({
  refetch,
  handleClose,
  serviceData,
}: {
  refetch: () => void;
  handleClose: () => void;
  serviceData?: any;
}) {
  const { data } = useQuery<GET_ALL_MANAGERS>(GET_ALL_MANAGERS);

  const { toastSuccess, toastError } = useToast();

  const options = data?.managers.map((manager) => ({
    value: manager.id,
    label: `${manager.firstName} ${manager.lastName}`,
  }));

  const handleCloseFormAfterSubmit = () => {
    refetch();
    handleClose();
  };

  const serviceFormSchema = yup.object({
    serviceName: yup
      .string()
      .min(2, "Le nom du service doit comporter au moins 2 caractères")
      .required("Le nom du service est requis"),
    administrators: yup
      .array()
      .of(yup.string())
      .required("Les administrateurs sont requis"),
    operators: yup
      .array()
      .of(yup.string())
      .required("Les opérateurs sont requis"),
  });

  type ServiceFormData = yup.InferType<typeof serviceFormSchema>;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { isValid, isDirty, errors },
  } = useForm<ServiceFormData>({
    resolver: yupResolver(serviceFormSchema),
    mode: "onChange",
    defaultValues: {
      serviceName: serviceData ? serviceData.name : "",
      administrators: serviceData
        ? serviceData.administrators.map((admin: Manager) => admin.id)
        : [],
      operators: serviceData
        ? serviceData.members.map((operator: Manager) => operator.id)
        : [],
    },
  });

  const watchedAdministrators = watch("administrators");
  const watchedOperators = watch("operators");

  const administratorOptions = useMemo(
    () => options?.filter((option) => !watchedOperators.includes(option.value)),
    [options, watchedOperators]
  );

  const operatorOptions = useMemo(
    () =>
      options?.filter(
        (option) => !watchedAdministrators.includes(option.value)
      ),
    [options, watchedAdministrators]
  );

  const [createService] = useMutation(CREATE_NEW_SERVICE);

  const [addAuthorization] = useMutation(ADD_NEW_AUTHORIZATION_TO_SERVICE);

  const [deleteAuthorization] = useMutation(DELETE_AUTHORIZATION_FROM_SERVICE);

  const handleFormSubmit = async (data: ServiceFormData) => {
    if (serviceData) {
      const currentAdministrators: string[] = serviceData.administrators.map(
        (admin: Manager) => admin.id
      );
      const currentOperators: string[] = serviceData.operators.map(
        (operator: Manager) => operator.id
      );

      const administratorsToAdd = data.administrators.filter(
        (id: string) => !currentAdministrators.includes(id)
      );
      const administratorsToRemove = currentAdministrators.filter(
        (id: string) => !data.administrators.includes(id)
      );

      const operatorsToAdd = data.operators.filter(
        (id: string) => !currentOperators.includes(id)
      );
      const operatorsToRemove = currentOperators.filter(
        (id: string) => !data.operators.includes(id)
      );

      try {
        for (const adminId of administratorsToAdd) {
          await addAuthorization({
            variables: {
              input: {
                managerId: adminId,
                serviceId: serviceData.id,
                isAdministrator: true,
              },
            },
          });
        }

        for (const adminId of administratorsToRemove) {
          await deleteAuthorization({
            variables: {
              input: { managerId: adminId, serviceId: serviceData.id },
            },
          });
        }

        for (const operatorId of operatorsToAdd) {
          await addAuthorization({
            variables: {
              input: {
                managerId: operatorId,
                serviceId: serviceData.id,
                isAdministrator: false,
              },
            },
          });
        }

        for (const operatorId of operatorsToRemove) {
          await deleteAuthorization({
            variables: {
              input: { managerId: operatorId, serviceId: serviceData.id },
            },
          });
        }

        toastSuccess("Service mis à jour avec succès");

        handleCloseFormAfterSubmit();
      } catch (error) {
        console.error("Erreur lors de la mise à jour du service :", error);
        toastError("Erreur lors de la mise à jour du service");
        return;
      }
    }

    try {
      const result = await createService({
        variables: {
          data: {
            name: data.serviceName,
            companyId: "d2315259-5926-4f5b-8490-f01a983ad33d",
          },
        },
      });

      if (result.data) {
        const newServiceId = result.data.createService.id;

        for (const adminId of data.administrators) {
          await addAuthorization({
            variables: {
              input: {
                managerId: adminId,
                serviceId: newServiceId,
                isAdministrator: true,
              },
            },
          });
        }

        for (const operatorId of data.operators) {
          await addAuthorization({
            variables: {
              input: {
                managerId: operatorId,
                serviceId: newServiceId,
                isAdministrator: false,
              },
            },
          });
        }

        toastSuccess("Service créé avec succès");

        handleCloseFormAfterSubmit();
      }
    } catch (error) {
      console.error("Erreur lors de la création du service :", error);
      toastError("Erreur lors de la création du service");
      return;
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <InputWithLabel
          label="Nom du service"
          placeholder="Entrez le nom du service"
          {...register("serviceName")}
          error={errors.serviceName?.message}
          className="mb-4"
        />
        {data?.managers && (
          <>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-base font-normal text-gray-800">
                Administrateurs
              </Label>
              <Controller
                name="administrators"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <MultiSelectPopover
                    trigger={
                      <Button type="button">Choisir des administrateurs</Button>
                    }
                    options={administratorOptions ?? []}
                    selected={field.value ?? []}
                    onChange={(vals) => {
                      // on met à jour react-hook-form proprement
                      setValue("administrators", vals, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                    placeholder="Sélectionner des administrateurs..."
                    emptyText="Aucun opérateur."
                  />
                )}
              />
            </div>
            <PersonServiceSelectionList
              listToWatch={watch("administrators")}
              setValue={setValue}
              personList={options}
              personType="administrators"
            />

            <div className="flex items-center justify-between mb-2 mt-10">
              <Label className="text-base font-normal text-gray-800">
                Opérateurs
              </Label>
              <Controller
                name="operators"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <MultiSelectPopover
                    trigger={
                      <Button type="button">Choisir des opérateurs</Button>
                    }
                    options={operatorOptions ?? []}
                    selected={field.value ?? []}
                    onChange={(vals) => {
                      // on met à jour react-hook-form proprement
                      setValue("operators", vals, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                    placeholder="Sélectionner des opérateurs..."
                    emptyText="Aucun opérateur."
                  />
                )}
              />
            </div>
            <PersonServiceSelectionList
              listToWatch={watch("operators")}
              setValue={setValue}
              personList={options}
              personType="operators"
            />
          </>
        )}
        <DialogFooter className="mt-8">
          <Button type="submit" disabled={!isValid || !isDirty}>
            {serviceData ? "Modifier le service" : "Ajouter le service"}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </>
  );
}
