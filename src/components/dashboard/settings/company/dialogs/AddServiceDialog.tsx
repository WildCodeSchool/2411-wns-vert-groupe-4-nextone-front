import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddAndUpdateServiceForm from "../../services/forms/AddAndUpdateServiceForm";
import { useState } from "react";

export default function AddServiceDialog({ refetch }: { refetch: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Ajouter un service</Button>
      </DialogTrigger>
      <DialogContent className="font-archivo bg-card p-8">
        <DialogHeader className="mb-2">
          <DialogTitle>Ajouter un service</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour ajouter un nouveau
            service.
          </DialogDescription>
        </DialogHeader>
        <AddAndUpdateServiceForm
          refetch={refetch}
          serviceData={null}
          handleClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
