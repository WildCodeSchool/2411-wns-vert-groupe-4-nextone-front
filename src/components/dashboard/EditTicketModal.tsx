import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TICKET_INFOS, UPDATE_TICKET } from "@/requests/tickets.requests";
import { useToast } from "@/hooks/use-toast";
import { TICKET_STATUS_OPTIONS } from "@/utils/ticketStatus";

export default function EditTicketModal({ ticketId, onClose }: { ticketId: string; onClose: () => void }) {
  const { toastSuccess, toastError } = useToast();

  const { data, loading, error } = useQuery(GET_TICKET_INFOS, {
    variables: { ticketId },
    skip: !ticketId,
  });

  const [updateTicket] = useMutation(UPDATE_TICKET);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "PENDING",
  });


  const handleClose = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      status: "PENDING",
    });
    onClose();
  };

  useEffect(() => {
    if (data?.ticket) {
      const t = data.ticket;
      setForm({
        firstName: t.firstName ?? "",
        lastName: t.lastName ?? "",
        email: t.email ?? "",
        phone: t.phone ?? "",
        status: t.status ?? "PENDING",
      });
    }
  }, [data]);

  const handleSubmit = async () => {
    try {
      await updateTicket({
        variables: {
          updateTicketData: {
            id: ticketId,
            ...form,
            status: form.status,
          },
        },
      });
      toastSuccess("Ticket mis à jour !");
      handleClose();
    } catch (err) {
      console.error(err);
      toastError("Erreur lors de la mise à jour");
    }
  };

  return (
<AlertDialog open={!!ticketId} onOpenChange={handleClose}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Modifier le ticket</AlertDialogTitle>
    </AlertDialogHeader>

        {loading ? (
          <p>Chargement…</p>
        ) : error ? (
          <p className="text-red-500">Erreur lors du chargement</p>
        ) : (
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Prénom"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            <Input
              placeholder="Nom"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              placeholder="Téléphone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              className="border p-2 rounded"
            >
              {TICKET_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

    <AlertDialogFooter>
      <Button variant="outline" onClick={handleClose}>Annuler</Button>
      <Button onClick={handleSubmit}>Enregistrer</Button>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  );
}
