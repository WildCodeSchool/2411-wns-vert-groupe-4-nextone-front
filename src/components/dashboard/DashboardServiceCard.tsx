import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import { useMemo, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { TicketActionMenu } from "./TicketActionMenu";
import { useMutation } from "@apollo/client";
import {
  UPDATE_TICKET_STATUS,
} from "@/requests/tickets.requests";
import { useToast } from "@/hooks/use-toast";
import {
  TICKET_STATUS_OPTIONS,
  STATUS_LABEL_TO_ENUM,
  TICKET_STATUS_LABELS, 
} from "@/utils/ticketStatus";
import EditTicketModal from "./EditTicketModal";
import { RiArrowUpDownLine } from "react-icons/ri";



type ServiceTicket = {
  id: string;
  ticket: string;
  lastname?: string;
  name?: string;
  status: keyof typeof TICKET_STATUS_LABELS; 
  waitTime?: string;
};

type DashboardService = {
  id: string;
  name: string;
  status: "Fluide" | "En attente" | "En cours";
  tickets: ServiceTicket[];
};

export default function DashboardServiceCard({
  service,
  isOpen,
  onToggle,
  onTicketsUpdate,
}: {
  readonly service: DashboardService;
  readonly isOpen: boolean;
  readonly onToggle: () => void;
  readonly onTicketsUpdate?: () => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

 
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);

  
  const handleEdit = (ticketId: string) => {
    setEditingTicketId(ticketId); 
  };

  const { toastSuccess, toastError } = useToast();
  const [updateTicketStatus] = useMutation(UPDATE_TICKET_STATUS);

  const handleArchive = async (ticketId: string) => {
  try {
    const archivedStatus = STATUS_LABEL_TO_ENUM["Archivé"]; 
    await updateTicketStatus({
      variables: {
        updateTicketStatusData: {
          id: ticketId,
          status: archivedStatus,
        },
      },
    });
    toastSuccess("Ticket archivé avec succès");
    onTicketsUpdate?.(); 
  } catch (error) {
    toastError("Erreur lors de l’archivage du ticket");
    console.error(error);
  }
};


  const handleResetStatus = async (ticketId: string) => {
    try {
      const newStatus = STATUS_LABEL_TO_ENUM["En attente"];
      await updateTicketStatus({
        variables: {
          updateTicketStatusData: {
            id: ticketId,
            status: newStatus,
          },
        },
      });
      onTicketsUpdate?.();
      toastSuccess("Statut remis à 'En attente'");
    } catch (error) {
      toastError("Erreur lors du changement de statut");
      console.error(error);
    }
  };

  const handleFilterChange = (statusValue: string) => {
    const current = table.getColumn("status")?.getFilterValue() as string[] | undefined;
    const next = current?.includes(statusValue)
      ? current.filter((v) => v !== statusValue)
      : [...(current || []), statusValue];

    table.getColumn("status")?.setFilterValue(next);
  };

  const columns = useMemo<ColumnDef<ServiceTicket>[]>(() => [
    {
      header: "TICKET",
      accessorKey: "ticket",
    },
    {
       accessorKey: "lastname",
       header: ({ column }) => (
    <div
      className="flex items-center gap-2 cursor-pointer select-none"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      NOM
      <RiArrowUpDownLine />
    </div>
  ),
    },
    {
      header: "PRENOM",
      accessorKey: "name",
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          STATUT
          <RiArrowUpDownLine />
        </div>
      ),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
      cell: ({ row }) => <StatusCell status={row.original.status} />,
    },

    {
      accessorKey: "waitTime",
      header: ({ column }) => (
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          TEMPS D’ATTENTE
          <RiArrowUpDownLine />
        </div>
      ),
      cell: (info) => (
        <span className="pl-2">{String(info.getValue() ?? "-")}</span>
      ),
    },

    {
      header: "",
      id: "actions",
      cell: ({ row }) => {
        const ticket = row.original;
        return (
          <div className="flex justify-end items-center gap-2">
            {ticket.status === "PENDING" && (
              <Button className="bg-[#1f2511] hover:bg-[#2a3217] text-white">
                Prendre le ticket
              </Button>
            )}
            <TicketActionMenu
              onEdit={() => handleEdit(ticket.id)} 
              onArchive={() => handleArchive(ticket.id)}
              onResetStatus={() => handleResetStatus(ticket.id)}
            />
          </div>
        );
      },
    },
  ], []);

  const table = useReactTable({
    data: service.tickets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
  <>
    <Card className="w-full border border-gray-200 shadow-sm">
      <CardHeader className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-light flex flex-col items-start justify-start">
            {service.name}
          </CardTitle>
          <button
            onClick={onToggle}
            className="transition-transform duration-300"
          >
            <ChevronDown
              className={`w-5 h-5 ml-2 transition-transform ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </div>
        <StatusBadge label={service.status} />
      </CardHeader>

      {isOpen && (
        <CardContent className="px-[30px] pb-[32px]">
         
          <div className="flex items-center justify-between px-[24px] mb-4">
            <Input
              placeholder="Rechercher par nom..."
              className="w-1/2"
              value={
                (table.getColumn("lastname")?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table.getColumn("lastname")?.setFilterValue(e.target.value)
              }
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="mr-4">
                  <Filter className="mr-2 w-4 h-4" /> Filtres
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <p className="font-light text-sm mb-2">Statut</p>
                {TICKET_STATUS_OPTIONS.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2 py-1">
                    <Checkbox
                      id={opt.value}
                      checked={
                        (table.getColumn("status")?.getFilterValue() as string[])?.includes(opt.value) ?? false
                      }
                      onCheckedChange={() => handleFilterChange(opt.value)}
                    />
                    <label htmlFor={opt.value} className="text-sm cursor-pointer">
                      {opt.label}
                    </label>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
            {columnFilters.length > 0 && (
              <Button
                variant="outline"
                className="[&&]:bg-red-600 text-white hover:bg-red-700 hover:text-white mr-4"
                onClick={() => setColumnFilters([])}
              >
                Réinitialiser les filtres
              </Button>
            )}
          </div>

          <div className="px-[24px] pr-[40px]">
            <Table className="table-fixed">
              <TableHeader className="bg-[#F8FAFB]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-left text-[#6D6D6D] cursor-pointer"
                        onClick={
                          header.column.getCanSort()
                            ? () => header.column.toggleSorting()
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
            </Table>
          </div>

          <div className="px-[24px] max-h-[300px] min-h-[300px] overflow-y-scroll">
            <Table className="table-fixed">
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="bg-[#F8FAFB]">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-left">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      )}
    </Card>
    {editingTicketId && (
      <EditTicketModal
        ticketId={editingTicketId}
        onClose={() => setEditingTicketId(null)}
      />
    )}
  </>
);
}

function StatusCell({ status }: { status: ServiceTicket["status"] }) {
  const label = TICKET_STATUS_LABELS[status] ?? status;
  const bgColor =
    label === "En cours de traitement" ? "#EAF6EB" : "#FFFAE7";

  return (
    <span
      className="px-4 py-2 rounded text-xs w-fit text-black"
      style={{ backgroundColor: bgColor }}
    >
      {label}
    </span>
  );
}
