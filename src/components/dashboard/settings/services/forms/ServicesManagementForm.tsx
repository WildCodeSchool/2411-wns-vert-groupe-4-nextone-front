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
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IoIosMore } from "react-icons/io";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_SERVICES_THAT_CAN_BE_MANAGED } from "@/requests/queries/settings.query";
import { useAuth } from "@/context/AuthContext";
import PersonsServiceColumnComponent from "../PersonsServiceColumnComponent";
import SettingsHeader from "../../SettingsHeader";
import AddServiceDialog from "../../company/dialogs/AddServiceDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import UpdateServiceDialog from "../../company/dialogs/UpdateServiceDialog";
import { DELETE_SERVICE } from "@/requests/mutations/settings.mutation";
import { useToast } from "@/hooks/use-toast";

export default function ServicesManagementForm() {
  const { user } = useAuth();

  const {
    data: services,
    error,
    refetch,
  } = useQuery(GET_SERVICES_THAT_CAN_BE_MANAGED, {
    variables: { managerId: user?.id },
    skip: !user?.id,
    fetchPolicy: "network-only",
  });

  const [deleteService] = useMutation(DELETE_SERVICE);

  const { toastSuccess } = useToast();

  const formattedServices = useMemo(() => {
    return (
      services?.getEmployeeAuthorizations?.map((authorization: any) => {
        return {
          id: authorization.service.id,
          name: authorization.service.name,
          administrators: authorization.service.authorizations
            .filter((a) => a.isAdministrator)
            .map((a) => ({
              id: a.manager.id,
              firstName: a.manager.firstName,
              lastName: a.manager.lastName,
            })),
          members: authorization.service.authorizations
            .filter((a) => !a.isAdministrator)
            .map((a) => ({
              id: a.manager.id,
              firstName: a.manager.firstName,
              lastName: a.manager.lastName,
            })),
        };
      }) || []
    );
  }, [services]);

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Nom du service",
      },
      {
        accessorKey: "administrators",
        header: "Administrateur(s)",
        cell: ({ row }) => {
          return (
            <PersonsServiceColumnComponent
              persons={row.original.administrators}
              personType="administrator"
            />
          );
        },
      },
      {
        accessorKey: "members",
        header: "Membre(s)",
        cell: ({ row }) => {
          return (
            <PersonsServiceColumnComponent
              persons={row.original.members}
              personType="member"
            />
          );
        },
      },
      {
        accessorKey: "options",
        header: "",
        cell: ({ row }) => {
          console.log("row rendered");
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="flex justify-end">
                  <Button variant="ghost" size="sm" className="cursor-pointer">
                    <IoIosMore size={20} className="cursor-pointer" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <UpdateServiceDialog
                    refetch={refetch}
                    serviceData={row.original}
                  />
                  <DropdownMenuItem
                    onClick={async () => {
                      console.log("Deleting service:", row.original.id);
                      await deleteService({
                        variables: { deleteServiceId: row.original.id },
                      });
                      toastSuccess("Service supprimé avec succès");
                      refetch();
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2 text-red-500" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [deleteService, refetch, toastSuccess]
  );

  const table = useReactTable({
    data: formattedServices,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!services) return null;

  return (
    <>
      <div className="flex flex-row gap-4 h-full justify-between items-center w-full">
        <SettingsHeader
          title="Services disponibles"
          description="Gérez les services qui composent votre entreprise. Vous pouvez ajouter, modifier ou supprimer des services selon vos besoins."
        />
        <AddServiceDialog refetch={refetch} />
      </div>
      <ScrollArea className="mt-2 bg-popover px-6 py-2 rounded-lg h-[90%] overflow-y-auto">
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
                  //   onClick={() =>
                  //     navigate(`/dashboard/tickets/${row.original.id}`)
                  //   }
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
    </>
  );
}
