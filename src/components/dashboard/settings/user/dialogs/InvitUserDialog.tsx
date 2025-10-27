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

export default function InvitUserDialog({
  managers,
}: {
  managers?: Manager[];
}) {
  const [open, setOpen] = useState(false);

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
      ),
    role: yup.string().oneOf(["ADMIN", "OPERATOR"]).required(),
  });

  type InvitUserFormData = yup.InferType<typeof invitUserFormSchema>;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { isValid, isDirty, errors },
  } = useForm<InvitUserFormData>({
    resolver: yupResolver(invitUserFormSchema),
    mode: "onChange",
  });

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
            <form>
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
              <Button className="mt-6" disabled={!isDirty || !isValid}>
                Envoyer l'invitation
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
