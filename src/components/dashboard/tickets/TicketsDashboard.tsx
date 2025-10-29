import {
  UPDATE_TICKET_STATUS,
  GET_TICKETS_PAGINATED,
} from "@/requests/queries/ticket.query";
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
import { useRef, useState, useMemo, useEffect } from "react";
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
import { statusOptions } from "../../../utils/constants/ticket";
// MR
import { ItemsPerPageSelector } from "@/components/dashboard/ItemsPerPageSelector";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { nextCreatedCursor, resetCursor } from "@/utils/pagination";
import { usePagination } from "@/hooks/usePagination";
import { GetTicketsPaginatedResult } from "@/types/tickets.types";
// MR end

dayjs.extend(relativeTime);

export default function TicketsDashboard() {
  const navigate = useNavigate();

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [createdCursor, setCreatedCursor] = useState<Date>(resetCursor());
  const cursorStack = useRef<Date[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: "status",
      value: ["CREATED", "PENDING", "INPROGRESS"],
    },
  ]);

  const { data, loading, error, fetchMore, refetch } =
    useQuery<GetTicketsPaginatedResult>(GET_TICKETS_PAGINATED, {
      variables: {
        fields: {},
        pagination: {
          limit: itemsPerPage,
          order: "ASC",
          cursor: createdCursor,
        },
      },
      fetchPolicy: "cache-and-network",
    });

  const [updateTicketStatus] = useMutation(UPDATE_TICKET_STATUS);

  const handleUpdateTicketToInProgress = async (ticketId: string) => {
    await updateTicketStatus({
      variables: {
        updateTicketStatusData: {
          id: ticketId,
          status: "INPROGRESS",
        },
      },
      refetchQueries: [{ query: GET_TICKETS_PAGINATED }],
    });
  };

  const rawTickets = useMemo(
    () => (data?.ticketsByProperties?.items ?? []) as Ticket[],
    [data]
  );

  const totalCount = data?.ticketsByProperties?.totalCount ?? 0;

  const loadNext = async () => {
    if (!rawTickets.length) return;
    const last = rawTickets[rawTickets.length - 1];
    if (!last) return;

    const nextCursor = nextCreatedCursor(last.createdAt);
    const result = await fetchMore({
      variables: {
        fields: {},
        pagination: { limit: itemsPerPage, order: "ASC", cursor: nextCursor },
      },
    });

    const nextItems = result?.data?.ticketsByProperties
      ?.items as unknown as Ticket[];
    if (nextItems.length > 0) {
      cursorStack.current.push(createdCursor);
      setCreatedCursor(nextCursor);
      setCurrentPage((p) => p + 1);
    }
  };

  const loadPrev = async () => {
    if (cursorStack.current.length === 0) return;
    const prevCursor = cursorStack.current.pop()!;
    setCreatedCursor(prevCursor);
    await refetch({
      fields: {},
      pagination: { limit: itemsPerPage, order: "ASC", cursor: prevCursor },
    });
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const { paginationRange, totalPages } = usePagination({
    totalCount,
    pageSize: itemsPerPage,
    currentPage,
  });

  const table = useReactTable({
    data: rawTickets,
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
          id: "service.name",
          accessorFn: (row) => row.service?.name ?? "",
          header: "Service",
          filterFn: (row, columnId, filterValue) => {
            if (!filterValue || filterValue.length === 0) return true;
            return filterValue.includes(row.getValue(columnId));
          },
          cell: ({ getValue }) => (
            <Badge className="px-3 py-1 rounded-4xl border-1 border-primary/10 bg-primary/5 text-primary font-light">
              {getValue<string>()}
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
          ),
        },
      ],
      []
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

  const servicesNames: string[] = Array.from(
    new Set(
      rawTickets.map((ticket: Ticket) => ticket.service?.name).filter(Boolean)
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

  console.log("🧭 PAGINATION DEBUG", {
    totalCount,
    totalPages,
    currentPage,
    itemsPerPage,
    paginationRange,
  });

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;
  if (!data) return <p>Aucun ticket trouvé</p>;

  return (
    <>
      <div className="flex flex-row items-center justify-start w-full">
        <h1 className="scroll-m-20 text-4xl font-light tracking-tight text-balance">
          Tickets ({totalCount})
        </h1>
      </div>
      <div className="mt-8 bg-card p-8 rounded-lg w-full overflow-visible shadow-sm">
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

        {/* Table Header - Fixed */}
        <div className="mt-6 bg-popover px-[24px] rounded-t-lg">
          <Table className="table-fixed">
            <TableHeader className="bg-popover">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
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
                  ))}
                </TableRow>
              ))}
            </TableHeader>
          </Table>
        </div>

        {/* Table Body - Scrollable */}
        <div
          ref={scrollRef}
          className="bg-popover px-[24px] rounded-b-lg max-h-[300px] min-h-[300px] overflow-y-scroll"
        >
          <Table className="table-fixed">
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
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
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    Aucun résultat.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-[24px] pt-4 gap-4">
          <ItemsPerPageSelector
            value={itemsPerPage}
            onChange={(val) => {
              setItemsPerPage(val);
              setCreatedCursor(resetCursor());
              setCurrentPage(1);
              cursorStack.current = [];
            }}
          />
          <PaginationControls
            paginationRange={paginationRange}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => {
              if (page > currentPage) loadNext();
              else if (page < currentPage) loadPrev();
            }}
          />
        </div>
      </div>
    </>
  );
}
