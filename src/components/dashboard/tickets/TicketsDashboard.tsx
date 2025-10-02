import { UPDATE_TICKET_STATUS } from "@/requests/mutations/ticket.mutation";
import { GET_TICKETS } from "@/requests/queries/ticket.query";
import { useMutation, useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Ticket } from "./TicketPage";
import { useState } from "react";
import { RiArrowUpDownLine } from "react-icons/ri";
import { Input } from "@/components/ui/input";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RiFilterLine } from "react-icons/ri";
import { Badge } from "@/components/ui/badge";
import { IoIosMore } from "react-icons/io";
import { Checkbox } from "@/components/ui/checkbox";
import { FaRegTrashAlt } from "react-icons/fa";
import { statusOptions } from "@/lib/ticketUtils";
import { ScrollArea } from "@/components/ui/scroll-area";

dayjs.extend(relativeTime);

export default function TicketsDashboard() {
  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: "code",
      header: "Code",
    },
    {
      accessorKey: "lastName",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row items-center cursor-pointer select-none gap-4"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nom
            <RiArrowUpDownLine />
          </div>
        );
      },
    },
    {
      accessorKey: "firstName",
      header: "Prénom",
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row items-center cursor-pointer select-none gap-4"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Statut
            <RiArrowUpDownLine />
          </div>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
      cell: ({ getValue }) => {
        const status = getValue<string>();
        const statusOption = statusOptions.find(
          (option) => option.value === status
        );
        const label = statusOption ? statusOption.label : status;

        return (
          <Badge className={`${statusOption?.badgeStyle} font-light px-4 py-2`}>
            {label}
          </Badge>
        );
      },
    },
    {
      id: "service.name",
      accessorFn: (row) => row.service?.name ?? "",
      header: "Service",
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
      cell: ({ getValue }) => {
        return (
          <Badge className="px-3 py-1 rounded-4xl border-1 border-primary/10 bg-primary/5 text-primary font-light">
            {getValue<string>()}
          </Badge>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row items-center cursor-pointer select-none gap-4"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Dernière modification
            <RiArrowUpDownLine />
          </div>
        );
      },
      cell: ({ getValue }) => {
        const date = dayjs(getValue<string>());
        return date.locale("fr").fromNow();
      },
    },
    {
      accessorKey: "options",
      header: "",
      cell: ({ row }) => {
        return (
          <div className="flex flex-row items-center justify-end gap-6">
            {(row.getValue("status") === "PENDING" ||
              row.getValue("status") === "CREATED") && (
              <Button
                className="cursor-pointer"
                onClick={(event) => {
                  event.stopPropagation();
                  handleUpdateTicketToInProgress(row.original.id);
                }}
              >
                Prendre le ticket
              </Button>
            )}
            <IoIosMore size={20} className="cursor-pointer" />
          </div>
        );
      },
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: "status",
      value: ["CREATED", "PENDING", "INPROGRESS"],
    },
  ]);

  const { data, loading, error } = useQuery(GET_TICKETS);

  const [updateTicketStatus] = useMutation(UPDATE_TICKET_STATUS);

  const handleUpdateTicketToInProgress = (ticketId: string) => {
    updateTicketStatus({
      variables: {
        updateTicketStatusData: {
          id: ticketId,
          status: "INPROGRESS",
        },
      },
      refetchQueries: [{ query: GET_TICKETS }],
    });
  };

  const tickets = data?.tickets ?? [];

  const table = useReactTable({
    data: tickets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const navigate = useNavigate();

  const servicesNames: string[] = Array.from(
    new Set(
      tickets.map((ticket: Ticket) => ticket.service?.name).filter(Boolean)
    )
  );

  const handleFilterChange = (columnName: string, value: string) => {
    const filterValues = table
      .getColumn(columnName)
      ?.getFilterValue() as string[];
    if (filterValues?.includes(value)) {
      const newFilterValues = filterValues.filter((v) => v !== value);
      table.getColumn(columnName)?.setFilterValue(newFilterValues);
      return;
    }
    const newFilterValues = filterValues ? [...filterValues, value] : [value];
    table
      .getColumn(columnName)
      ?.setFilterValue(newFilterValues.length ? newFilterValues : undefined);
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;
  if (!data) return <p>Aucun ticket trouvé</p>;

  return (
    <>
      <div className="flex flex-row items-center justify-start w-full">
        <h1 className="scroll-m-20 text-4xl font-light tracking-tight text-balance">
          Tickets ({tickets.length})
        </h1>
      </div>
      <div className="mt-8 bg-card p-8 rounded-lg w-full h-full overflow-hidden">
        <div className="w-full flex flex-row items-center justify-between">
          <div className="w-full flex flex-row items-center justify-start gap-4">
            <Input
              className="max-w-sm [&&]:bg-popover"
              placeholder="Rechercher un ticket par nom..."
              value={
                (table.getColumn("lastName")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("lastName")?.setFilterValue(event.target.value)
              }
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="[&&]:bg-popover">
                  <RiFilterLine />
                  Filtrer
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-90 flex flex-row items-stretch justify-between p-6">
                <div>
                  <h4 className="uppercase text-base font-light text-left mb-2">
                    Filtrer par statut
                  </h4>
                  {statusOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center py-1 gap-2"
                    >
                      <Checkbox
                        id={option.value}
                        checked={
                          (
                            table.getColumn("status")?.getFilterValue() as
                              | string[]
                              | undefined
                          )?.includes(option.value) ?? false
                        }
                        onCheckedChange={() =>
                          handleFilterChange("status", option.value)
                        }
                      />
                      <Label htmlFor={option.value} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="uppercase text-base font-light text-left mb-2">
                    Filtrer par service
                  </h4>
                  {servicesNames.map((option: string) => (
                    <div key={option} className="flex items-center py-1 gap-2">
                      <Checkbox
                        id={option}
                        checked={
                          (
                            table
                              .getColumn("service.name")
                              ?.getFilterValue() as string[] | undefined
                          )?.includes(option) ?? false
                        }
                        onCheckedChange={() =>
                          handleFilterChange("service.name", option)
                        }
                      />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          {columnFilters.length > 0 && (
            <Button
              variant="outline"
              className="[&&]:bg-red-600 text-white :hover:bg-red-700 :hover:text-white"
              onClick={() => {
                setColumnFilters([]);
              }}
            >
              <FaRegTrashAlt />
              Réinitialiser
            </Button>
          )}
        </div>
        <ScrollArea className="mt-6 bg-popover px-6 py-2 rounded-lg h-[90%] overflow-y-auto">
          <Table className="w-full" noWrapper>
            <TableHeader className="sticky top-0 z-10 w-full bg-popover">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="w-full">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="uppercase text-base font-light text-left py-4"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer text-base text-left"
                    onClick={() =>
                      navigate(`/dashboard/tickets/${row.original.id}`)
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-left py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Aucun résultat.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </>
  );
}
