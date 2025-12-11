import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@apollo/client/react";
import { UPDATE_TICKET } from "@/requests/mutations/ticket.mutation";
import InputWithLabel from "../../InputWithLabel";

export default function TicketUpdateDialog({
  ticketInfos,
  refetchTicket,
  open,
  setOpen,
}: {
  ticketInfos: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: string;
  };
  refetchTicket: () => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { toastSuccess, toastError } = useToast();

  const defaultValues = {
    firstName: ticketInfos.firstName,
    lastName: ticketInfos.lastName,
    email: ticketInfos.email,
    phone: ticketInfos.phone,
  };

  const [updateTicket] = useMutation(UPDATE_TICKET, {
    onCompleted: () => {
      toastSuccess("Le ticket a bien été mis à jour.");
      setOpen(false);
      refetchTicket();
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du ticket", error);
      toastError("Erreur lors de la mise à jour du ticket");
    },
  });

  const ticketUpdateFormSchema = yup.object({
    firstName: yup.string().required("Le prénom est requis"),
    lastName: yup.string().required("Le nom est requis"),
    email: yup.string().email("Email invalide").required("L'email est requis"),
    phone: yup.string().required("Le téléphone est requis"),
  });

  type TicketUpdateFormData = yup.InferType<typeof ticketUpdateFormSchema>;

  const {
    control,
    formState: { isValid, isDirty, errors },
    handleSubmit,
    reset,
  } = useForm<TicketUpdateFormData>({
    resolver: yupResolver(ticketUpdateFormSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpen(false);
  };

  const onSubmit = async (data: TicketUpdateFormData) => {
    await updateTicket({
      variables: {
        updateTicketData: {
          id: ticketInfos.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
        },
      },
    });
    reset(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="font-archivo bg-card p-8">
        <DialogHeader className="mb-2">
          <DialogTitle>Mettre à jour le ticket</DialogTitle>
          <DialogDescription>
            Modifiez les informations du ticket.
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-4 w-full flex flex-col gap-6"
            >
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <InputWithLabel
                    label="Prénom"
                    placeholder="Entrez le prénom"
                    error={errors.firstName?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <InputWithLabel
                    label="Nom"
                    placeholder="Entrez le nom"
                    error={errors.lastName?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <InputWithLabel
                    label="Email"
                    placeholder="Entrez l'email"
                    error={errors.email?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <InputWithLabel
                    label="Téléphone"
                    placeholder="Entrez le téléphone"
                    error={errors.phone?.message}
                    {...field}
                  />
                )}
              />
              <div className="flex justify-start items-center gap-6">
                <Button
                  className="mt-6"
                  onClick={handleCancel}
                  variant="destructive"
                >
                  Annuler
                </Button>
                <Button
                  className="mt-6"
                  disabled={!isDirty || !isValid}
                  type="submit"
                >
                  Mettre à jour le ticket
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
