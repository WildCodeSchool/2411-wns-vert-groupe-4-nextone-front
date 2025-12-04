import {
  UPDATE_TICKET_STATUS,
  GET_TICKETS_PAGINATED,
  TICKET_ADDED_SUBSCRIPTION,
  TICKET_UPDATED_SUBSCRIPTION,
} from "../../requests/queries/ticket.query";
import {
  useLazyQuery,
  useMutation,
  useSubscription,
} from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
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
import { Ticket } from "./tickets/TicketPage";
import { useState, useMemo, useEffect, useCallback } from "react";
import { RiArrowUpDownLine } from "react-icons/ri";
import { GetTicketsPaginatedResult } from "../../types/ticket.d";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiFilterLine } from "react-icons/ri";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
import { useOperator } from "../../context/OperatorContext";
import { Input } from "../../components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { TicketActionMenu } from "./TicketActionMenu";
import { Checkbox } from "../../components/ui/checkbox";
import { statusOptions } from "../../utils/constants/ticket";
import { useToast } from "../../hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ApolloError } from "@apollo/client";
import { Spinner } from "@/components/ui/spinner";
import { useDebounceValue } from "usehooks-ts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChevronDown } from "lucide-react";
import StatusBadge from "./StatusBadge";

dayjs.extend(relativeTime);

type DashboardService = {
  id: string;
  name: string;
  status: "Fluide" | "En attente" | "En cours";
};

export default function DashboardServiceCard({
  service,
  isOpen,
  onToggle,
}: {
  readonly service: DashboardService;
  readonly isOpen: boolean;
  readonly onToggle: () => void;
  readonly onTicketsUpdate?: () => void;
}) {
  const navigate = useNavigate();

  const itemsToFetch: number = 15;
  const [ticketCursor, setTicketCursor] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isFetchingMoreLoading, setIsFetchingMoreLoading] =
    useState<boolean>(false);

  const [sorting, setSorting] = useState<SortingState>([]);

  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedSearchValue] = useDebounceValue(searchValue, 300);

  const updatedAtDescSorting = useMemo(
    () => sorting.find((s) => s.id === "updatedAt")?.desc,
    [sorting]
  );

  useEffect(() => {
    setSorting([{ id: "updatedAt", desc: false }]);
  }, []);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: "status",
      value: ["PENDING", "INPROGRESS", "CREATED"],
    },
  ]);

  const [getTickets, { data, loading, error, refetch, fetchMore }] =
    useLazyQuery<GetTicketsPaginatedResult>(GET_TICKETS_PAGINATED, {
      variables: {
        fields: {
          status: columnFilters.find((f) => f.id === "status")?.value as
            | string[]
            | undefined,
          lastName: debouncedSearchValue || undefined,
          serviceId: service.id,
        },
        pagination: {
          limit: itemsToFetch,
          order: updatedAtDescSorting ? "DESC" : "ASC",
          cursor: null,
        },
      },
      fetchPolicy: "network-only",
    });

  const hasMoreTickets = useMemo(() => {
    if (!data) return false;

    return (
      data.ticketsByProperties.totalCount >
      (tickets.length as unknown as number)
    );
  }, [data, tickets]);

  const fetchMoreTickets = async () => {
    if (!ticketCursor || !hasMoreTickets) return;
    setIsFetchingMoreLoading(true);
    const { data } = await fetchMore({
      variables: {
        pagination: {
          cursor: ticketCursor?.id || null,
          order: updatedAtDescSorting ? "DESC" : "ASC",
        },
      },
    });
    const newTickets = data.ticketsByProperties.items as unknown as Ticket[];
    setTickets((prevTickets) => [...prevTickets, ...newTickets]);
    setIsFetchingMoreLoading(false);
  };

  useEffect(() => {
    getTickets();
  }, []);

  useEffect(() => {
    setTickets((data?.ticketsByProperties.items as unknown as Ticket[]) || []);
  }, [data]);

  useEffect(() => {
    setTicketCursor(
      tickets.length ? (tickets[tickets.length - 1] as unknown as Ticket) : null
    );
  }, [tickets]);

  // useEffect(() => {
  //   refetch({
  //     fields: {
  //       status: columnFilters.find((f) => f.id === "status")?.value as
  //         | string[]
  //         | undefined,
  //     },
  //     pagination: {
  //       limit: itemsToFetch,
  //       order: updatedAtDescSorting ? "DESC" : "ASC",
  //       cursor: null,
  //     },
  //   });
  // }, [updatedAtDescSorting]);

  useSubscription(TICKET_ADDED_SUBSCRIPTION, {
    onData: ({ data }) => {
      const newTicket = data.data.ticketAdded;

      if (newTicket.service.id !== service.id) return;

      if (updatedAtDescSorting) {
        if (tickets.length < itemsToFetch) {
          setTickets((prevTickets) => [newTicket, ...prevTickets]);
          return;
        }
        setTickets((prevTickets) => [newTicket, ...prevTickets.slice(0, -1)]);
        return;
      }

      if (tickets.length < itemsToFetch) {
        setTickets((prevTickets) => [...prevTickets, newTicket]);
        return;
      }

      return;
    },
  });

  useSubscription(TICKET_UPDATED_SUBSCRIPTION, {
    onData: ({ data }) => {
      const updated = data.data.ticketUpdated;

      if (updated.service.id !== service.id) return;

      setTickets((prevTickets) => {
        const ticketIndex = prevTickets.findIndex((t) => t.id === updated.id);
        if (ticketIndex === -1) return prevTickets;

        const updatedTicket = { ...prevTickets[ticketIndex], ...updated };
        const newTickets = [...prevTickets];
        newTickets[ticketIndex] = updatedTicket;
        return newTickets;
      });
    },
  });

  const [updateTicketStatus] = useMutation(UPDATE_TICKET_STATUS);

  const { toastSuccess, toastError } = useToast();

  const handleUpdateTicketToInProgress = useCallback(
    async (ticketId: string) => {
      await updateTicketStatus({
        variables: {
          updateTicketStatusData: {
            id: ticketId,
            status: "INPROGRESS",
          },
        },
        refetchQueries: [{ query: GET_TICKETS_PAGINATED }],
      });
    },
    [updateTicketStatus]
  );

  const handleArchive = useCallback(
    async (ticketId: string) => {
      try {
        await updateTicketStatus({
          variables: {
            updateTicketStatusData: { id: ticketId, status: "ARCHIVED" },
          },
        });
        toastSuccess("Ticket archivé avec succès");
        await refetch();
      } catch (error) {
        toastError("Erreur lors de l'archivage du ticket");
        console.error(error);
      }
    },
    [updateTicketStatus, refetch, toastSuccess, toastError]
  );

  const handleResetStatus = useCallback(
    async (ticketId: string) => {
      try {
        await updateTicketStatus({
          variables: {
            updateTicketStatusData: { id: ticketId, status: "PENDING" },
          },
        });
        toastSuccess("Statut remis à 'En attente'");
        await refetch();
      } catch (error) {
        toastError("Erreur lors du changement de statut");
        console.error(error);
      }
    },
    [updateTicketStatus, refetch, toastSuccess, toastError]
  );

  const { processingTicket, processTicket } = useOperator();

  const rawTickets = useMemo(() => (tickets ?? []) as Ticket[], [tickets]);

  const filteredTickets = useMemo(
    () => rawTickets.filter((ticket) => ticket.status !== "ARCHIVED"),
    [rawTickets]
  );

  const table = useReactTable({
    data: filteredTickets,
    columns: useMemo<ColumnDef<Ticket>[]>(
      () => [
        {
          accessorKey: "code",
          header: "Code",
        },
        {
          accessorKey: "lastName",
          header: ({ column }) => (
            <div
              className="flex flex-row items-center cursor-pointer select-none gap-4"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Nom
              <RiArrowUpDownLine />
            </div>
          ),
        },
        {
          accessorKey: "firstName",
          header: "Prénom",
        },
        {
          accessorKey: "status",
          header: ({ column }) => (
            <div
              className="flex flex-row items-center cursor-pointer select-none gap-4"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Statut
              <RiArrowUpDownLine />
            </div>
          ),
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
              <Badge
                className={`${statusOption?.badgeStyle} font-light px-4 py-2`}
              >
                {label}
              </Badge>
            );
          },
        },
        {
          id: "service.id",
          accessorFn: (row) => row.service?.id ?? "",
          header: "Service",
          filterFn: (row, columnId, filterValue) => {
            if (!filterValue || filterValue.length === 0) return true;
            return filterValue.includes(row.getValue(columnId));
          },
          cell: ({ row }) => (
            <Badge className="px-3 py-1 rounded-4xl border-1 border-primary/10 bg-primary/5 text-primary font-light">
              {row.original.service?.name || ""}
            </Badge>
          ),
        },
        {
          accessorKey: "updatedAt",
          header: ({ column }) => (
            <div
              className="flex flex-row items-center cursor-pointer select-none gap-4"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Dernière modification
              <RiArrowUpDownLine />
            </div>
          ),
          cell: ({ getValue }) => {
            const date = dayjs(getValue<string>());
            return date.locale("fr").fromNow();
          },
        },
        {
          accessorKey: "options",
          header: "",
          cell: ({ row }) => (
            <div className="flex flex-row items-center justify-end gap-6">
              {((row.getValue("status") === "PENDING" &&
                processingTicket === null) ||
                (row.getValue("status") === "CREATED" &&
                  processingTicket === null)) && (
                <Button
                  className="cursor-pointer"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleUpdateTicketToInProgress(row.original.id);
                    processTicket(row.original);
                  }}
                >
                  Prendre le ticket
                </Button>
              )}

              <div onClick={(e) => e.stopPropagation()}>
                {/* <IoIosMore size={20} className="cursor-pointer" /> */}
                <TicketActionMenu
                  ticketId={row.original.id}
                  onArchive={() => handleArchive(row.original.id)}
                  onResetStatus={() => handleResetStatus(row.original.id)}
                />
              </div>
            </div>
          ),
        },
      ],
      [handleArchive, handleResetStatus, handleUpdateTicketToInProgress]
    ),
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

  useEffect(() => {
    table
      .getColumn("lastName")
      ?.setFilterValue(debouncedSearchValue || undefined);
  }, [debouncedSearchValue, table]);

  return (
    <Card key={service.id} className="w-full border border-gray-200 shadow-sm">
      <CardHeader className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-bold flex-col items-start justify-start">
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
        <CardContent>
          <div className="bg-card p-2 rounded-lg w-full h-[35vh] overflow-hidden">
            <div className="w-full flex flex-row items-center justify-between">
              <div className="w-full flex flex-row items-center justify-start gap-4">
                <Input
                  className="max-w-sm [&&]:bg-popover"
                  placeholder="Rechercher un ticket par nom..."
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="[&&]:bg-popover">
                      <RiFilterLine />
                      Filtrer
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full flex flex-row items-stretch justify-between p-6">
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
                          <Label
                            htmlFor={option.value}
                            className="cursor-pointer"
                          >
                            {option.label}
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
                  className="[&&]:bg-red-600 text-white hover:bg-red-700 hover:text-white"
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
                    <>
                      {table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className="cursor-pointer text-base text-left bg-popover hover:bg-muted/30 transition-colors"
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
                      ))}
                      <TableRow>
                        <TableCell colSpan={table.getAllColumns().length}>
                          {hasMoreTickets && (
                            <Button
                              variant="outline"
                              className="w-full my-4 [&&]:bg-popover"
                              disabled={isFetchingMoreLoading}
                              onClick={async () => {
                                await fetchMoreTickets();
                              }}
                            >
                              {isFetchingMoreLoading && (
                                <Spinner className="mr-2" />
                              )}
                              Charger plus de tickets
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <StateTableComponent
                      loading={loading}
                      error={error}
                      tickets={tickets}
                      table={table}
                    />
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

const StateTableComponent = ({
  loading,
  error,
  tickets,
  table,
}: {
  loading: boolean;
  error: ApolloError | undefined;
  tickets: Ticket[] | null;
  table: ReturnType<typeof useReactTable<Ticket>>;
}) => {
  const getMessageToShow = () => {
    if (loading) return "Chargement...";
    if (error) return `Erreur : ${error.message}`;
    if (!tickets) return "Aucun résultat.";
  };

  const message = getMessageToShow();

  return (
    <TableRow>
      <TableCell
        colSpan={table.getAllColumns().length}
        className="h-24 text-center"
      >
        {loading && <Spinner className="mr-2" />}
        {message}
      </TableCell>
    </TableRow>
  );
};
