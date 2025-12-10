import { Archive, MoreHorizontal, Pencil, RefreshCcw } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

import { useNavigate } from "react-router-dom";

export type TicketActionMenuProps = {
  ticketId: string;
  onArchive: () => void;
  onResetStatus: () => void;
  ticketStatus: string;
  openUpdateDialog?: () => void;
};

export function TicketActionMenu({
  ticketId,
  onArchive,
  onResetStatus,
  ticketStatus,
  openUpdateDialog,
}: TicketActionMenuProps) {
  const navigate = useNavigate();

  const isUpdatable =
    ticketStatus !== "ARCHIVED" &&
    ticketStatus !== "DONE" &&
    ticketStatus !== "CANCELED";

  const handleUpdate = () => {
    if (openUpdateDialog) {
      openUpdateDialog();
    } else {
      navigate(`/dashboard/tickets/${ticketId}?edit=true`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={openUpdateDialog ? "start" : "end"}>
        {isUpdatable && (
          <DropdownMenuItem onClick={handleUpdate}>
            <Pencil className="w-4 h-4 mr-2" />
            Modifier
          </DropdownMenuItem>
        )}
        {ticketStatus !== "PENDING" && (
          <DropdownMenuItem onClick={onResetStatus}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Remettre en attente
          </DropdownMenuItem>
        )}
        {ticketStatus !== "ARCHIVED" && (
          <DropdownMenuItem
            onClick={() => {
              onArchive();
            }}
          >
            <Archive className="w-4 h-4 mr-2 text-red-500" />
            Archiver
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
