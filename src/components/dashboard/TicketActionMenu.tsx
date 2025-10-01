import { MoreHorizontal, Pencil, RefreshCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useNavigate } from "react-router-dom";

export type TicketActionMenuProps = {
ticketId: string;           
  onArchive: () => void;          
  onResetStatus: () => void;     
};

export function TicketActionMenu({
  ticketId,
  onArchive,
  onResetStatus,
}: TicketActionMenuProps) {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
         <DropdownMenuItem onClick={() => navigate(`/tickets/${ticketId}/edit`)}>
          {/* redirection to ticketpage edit */}
          <Pencil className="w-4 h-4 mr-2" />
          Modifier
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onResetStatus}>
          <RefreshCcw className="w-4 h-4 mr-2" />
          Remettre en attente
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => {
          onArchive();
        }}>
          <Trash2 className="w-4 h-4 mr-2 text-red-500" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
