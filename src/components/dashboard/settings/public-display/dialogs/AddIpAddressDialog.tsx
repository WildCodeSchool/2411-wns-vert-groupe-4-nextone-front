import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@apollo/client/react";
import { ADD_IP_ADDRESS } from "@/requests/queries/settings.query";

export default function AddIpAddressDialog({
  ipAddresses,
  refetchIps,
}: {
  ipAddresses: { id: string; ipAddress: string }[];
  refetchIps: () => void;
}) {
  const [open, setOpen] = useState(false);

  const { toastSuccess, toastError } = useToast();

  const { user } = useAuth();

  const [createIpAddress] = useMutation(ADD_IP_ADDRESS, {
    onCompleted: () => {
      toastSuccess("L'adresse IP a bien été ajoutée.");
      setOpen(false);
      refetchIps();
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout de l'adresse IP", error);
      toastError("Erreur lors de l'ajout de l'adresse IP");
    },
  });

  const addIpAddressFormSchema = yup.object({
    ipAddress: yup
      .string()
      .required("L'adresse IP est requise")
      .test(
        "unique",
        "Il existe déjà une adresse IP avec cette adresse IP",
        (value) =>
          ipAddresses ? !ipAddresses.find((ip) => ip.ipAddress === value) : true
      ),
  });

  type AddIpAddressFormData = yup.InferType<typeof addIpAddressFormSchema>;

  const {
    control,
    formState: { isValid, isDirty },
    handleSubmit,
  } = useForm<AddIpAddressFormData>({
    resolver: yupResolver(addIpAddressFormSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: AddIpAddressFormData) => {
    await createIpAddress({
      variables: {
        data: {
          ipAddress: data.ipAddress,
          companyId: user?.companyId || "",
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Ajouter une adresse IP</Button>
      </DialogTrigger>
      <DialogContent className="font-archivo bg-card p-8">
        <DialogHeader className="mb-2">
          <DialogTitle>Ajouter une nouvelle adresse IP</DialogTitle>
          <DialogDescription>
            Renseignez une adresse IP à ajouter.
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 w-full">
              <Controller
                name="ipAddress"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Entrez l'adresse IP à ajouter"
                    {...field}
                  />
                )}
              />
              <Button
                className="mt-6"
                disabled={!isDirty || !isValid}
                type="submit"
              >
                Ajouter l'adresse IP
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
