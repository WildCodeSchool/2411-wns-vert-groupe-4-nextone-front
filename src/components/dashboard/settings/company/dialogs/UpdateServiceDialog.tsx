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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Pencil } from "lucide-react";
import { FormattedServiceRow } from "../../services/forms/ServicesManagementForm";

export default function UpdateServiceDialog({
  refetch,
  serviceData,
}: {
  refetch: () => void;
  serviceData?: FormattedServiceRow | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Pencil className="w-4 h-4 mr-2" />
          Modifier
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="font-archivo bg-card p-8">
        <DialogHeader className="mb-2">
          <DialogTitle>Mettre à jour un service</DialogTitle>
          <DialogDescription>
            Vous pouvez modifier les informations du service ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <AddAndUpdateServiceForm
          refetch={refetch}
          serviceData={serviceData || null}
          handleClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
