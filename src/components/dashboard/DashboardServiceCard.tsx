import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
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
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { useMemo } from "react";

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

export default function DashboardServiceCard({
  service,
}: {
  readonly service: DashboardService;
}) {
  const columns = useMemo<ColumnDef<ServiceTicket>[]>(() => [
    {
      header: "TICKET",
      accessorKey: "ticket",
      cell: (info) => info.getValue(),
    },
    {
      header: "NOM",
      accessorKey: "lastname",
      cell: (info) => info.getValue() || "-",
    },
    {
      header: "PRENOM",
      accessorKey: "name",
      cell: (info) => info.getValue() || "-",
    },
    {
      header: "STATUT",
      accessorKey: "status",
      cell: ({ row }) => (
        <StatusCell status={row.original.status} />
      ),
    },
    {
      header: "TEMPS D’ATTENTE",
      accessorKey: "waitTime",
      cell: (info) => (
      <span className="pl-2">
        {String(info.getValue() ?? "-")}
      </span>
      ),
     
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
  });

  return (
    <Card className="w-full border border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 pt-6">
        <CardTitle className="text-lg font-medium text-gray-900">
          {service.name}
        </CardTitle>
        <StatusBadge label={service.status} />
      </CardHeader>

      <CardContent className="px-6 pb-6">

        {/* en-tête hors scroll */}
        <Table className="table-fixed">
          <TableHeader className="bg-[#F8FAFB]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-left text-[#6D6D6D]"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
        </Table>

  
        <div className="max-h-[300px] overflow-y-auto">
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
    </Card>
  );
}
