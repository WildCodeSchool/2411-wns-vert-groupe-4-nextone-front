import { MoreHorizontal, Pencil, RefreshCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type TicketActionMenuProps = {
  onEdit: () => void;           
  onDelete: () => void;          
  onResetStatus: () => void;     
};

export function TicketActionMenu({
  onEdit,
  onDelete,
  onResetStatus,
}: TicketActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="w-4 h-4 mr-2" />
          Modifier
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onResetStatus}>
          <RefreshCcw className="w-4 h-4 mr-2" />
          Remettre en attente
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onDelete}>
          <Trash2 className="w-4 h-4 mr-2 text-red-500" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
