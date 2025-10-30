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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { Manager } from "../../services/forms/AddAndUpdateServiceForm";
import { Invitation } from "../../services/forms/ManagersManagementForm";
import { useMutation } from "@apollo/client";
import { CREATE_INVITATION } from "@/requests/queries/settings.query";
import { useToast } from "@/hooks/use-toast";

export default function InvitUserDialog({
  managers,
  invitations,
  refetchInvitations,
}: {
  managers?: Manager[];
  invitations?: Invitation[];
  refetchInvitations: () => void;
}) {
  const [open, setOpen] = useState(false);

  const { toastSuccess, toastError } = useToast();

  const [createInvitation] = useMutation(CREATE_INVITATION, {
    onCompleted: () => {
      toastSuccess("L'invitation a bien été envoyée.");
      setOpen(false);
      refetchInvitations();
    },
    onError: (error) => {
      console.error("Erreur lors de l'envoi de l'invitation", error);
      toastError("Erreur lors de l'envoi de l'invitation");
    },
  });

  const invitUserFormSchema = yup.object({
    email: yup
      .string()
      .email("L'adresse e-mail doit être valide")
      .required("L'adresse e-mail est requise")
      .test(
        "unique",
        "Il existe déjà un utilisateur avec cette adresse e-mail",
        (value) =>
          managers ? !managers.find((manager) => manager.email === value) : true
      )
      .test(
        "unique",
        "Il existe déjà une invitation avec cette adresse e-mail",
        (value) =>
          invitations
            ? !invitations.find((invitation) => invitation.email === value)
            : true
      ),
    role: yup.string().oneOf(["ADMIN", "OPERATOR"]).required(),
  });

  type InvitUserFormData = yup.InferType<typeof invitUserFormSchema>;

  const {
    control,
    formState: { isValid, isDirty },
    handleSubmit,
  } = useForm<InvitUserFormData>({
    resolver: yupResolver(invitUserFormSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: InvitUserFormData) => {
    await createInvitation({
      variables: {
        args: {
          email: data.email,
          role: data.role,
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Inviter un nouvel utilisateur</Button>
      </DialogTrigger>
      <DialogContent className="font-archivo bg-card p-8">
        <DialogHeader className="mb-2">
          <DialogTitle>
            Inviter un utilisateur à rejoindre l'entreprise
          </DialogTitle>
          <DialogDescription>
            Renseignez une adresse e-mail pour inviter un nouvel utilisateur à
            rejoindre l'entreprise.
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-4 flex gap-4">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Entrez l'adresse e-mail de l'utilisateur à inviter"
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Administrateur</SelectItem>
                        <SelectItem value="OPERATOR">Opérateur</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="flex justify-end"></div>
              <Button
                className="mt-6"
                disabled={!isDirty || !isValid}
                type="submit"
              >
                Envoyer l'invitation
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
