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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, ChevronDown, Filter } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import { useMemo, useState } from "react"; 
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";


const statusOptions = [
  "En cours de traitement",
  "En attente",
];

type ServiceTicket = {
  id: string;
  ticket: string;
  lastname?: string;
  name?: string;
  status: "En cours de traitement" | "En attente";
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
}: {
  readonly service: DashboardService;
  readonly isOpen: boolean;
  readonly onToggle: () => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([]); 
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]); 

  const columns = useMemo<ColumnDef<ServiceTicket>[]>(() => [
    {
      header: "TICKET",
      accessorKey: "ticket",
    },
    {
      header: "NOM",
      accessorKey: "lastname",
    },
    {
      header: "PRENOM",
      accessorKey: "name",
    },
    {
      header: "STATUT",
      accessorKey: "status",
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
      cell: ({ row }) => <StatusCell status={row.original.status} />,
    },
    {
      header: "TEMPS D’ATTENTE",
      accessorKey: "waitTime",
      cell: (info) => <span className="pl-2">{String(info.getValue() ?? "-")}</span>,
    },
    {
      header: "",
      id: "actions",
      cell: ({ row }) => {
        const ticket = row.original;
        return (
          <div className="flex justify-end items-center gap-2">
            {ticket.status === "En attente" && (
              <Button className="bg-[#1f2511] hover:bg-[#2a3217] text-white">
                Prendre le ticket
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
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

  const handleFilterChange = (value: string) => {
    const current = table.getColumn("status")?.getFilterValue() as string[];
    const next = current?.includes(value)
      ? current.filter((v) => v !== value)
      : [...(current || []), value];
    table.getColumn("status")?.setFilterValue(next);
  };

  return (
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
              className={`w-5 h-5 ml-2 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
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
              value={(table.getColumn("lastname")?.getFilterValue() as string) ?? ""}
              onChange={(e) => table.getColumn("lastname")?.setFilterValue(e.target.value)}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 w-4 h-4" /> Filtres
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <p className="font-light text-sm mb-2">Statut</p>
                {statusOptions.map((status) => (
                  <div key={status} className="flex items-center gap-2 py-1">
                    <Checkbox
                      id={status}
                      checked={(table.getColumn("status")?.getFilterValue() as string[] | undefined)?.includes(status) ?? false}
                      onCheckedChange={() => handleFilterChange(status)}
                    />
                    <label htmlFor={status} className="text-sm cursor-pointer">
                      {status}
                    </label>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
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
                        onClick={header.column.getCanSort() ? () => header.column.toggleSorting() : undefined}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
            </Table>
          </div>

          <div className="px-[24px] max-h-[300px] overflow-y-auto">
            <Table className="table-fixed">
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="bg-[#F8FAFB]">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-left">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
  );
}

function StatusCell({ status }: { status: ServiceTicket["status"] }) {
  const bgColor =
    status === "En cours de traitement" ? "#EAF6EB" : "#FFFAE7";
  return (
    <span
      className="px-4 py-2 rounded text-xs w-fit text-black"
      style={{ backgroundColor: bgColor }}
    >
      {status}
    </span>
  );
}
