import { useMutation, useQuery } from "@apollo/client/react";
import { GET_ALL_MANAGERS } from "@/requests/queries/settings.query";
import { Manager } from "./AddAndUpdateServiceForm";
import SettingsHeader from "../../SettingsHeader";
import { useMemo, useState } from "react";
import InvitUserDialog from "../../user/dialogs/InvitUserDialog";
import {
  DELETE_MANAGER,
  TOGGLE_MANAGER_GLOBAL_ACCESS,
} from "@/requests/mutations/manager.mutation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { IoIosMore } from "react-icons/io";

type GET_ALL_MANAGERS = {
  managers: Manager[];
};

export type Invitation = {
  id: string;
  email: string;
  createdAt: string;
};

export default function ManagersManagementForm() {
  const { data: { managers } = {}, refetch: refetchManagers } =
    useQuery<GET_ALL_MANAGERS>(GET_ALL_MANAGERS);

  const disabledManagers = useMemo(
    () => managers?.filter((manager) => !manager.isGloballyActive) || [],
    [managers]
  );
  const activeManagers = useMemo(
    () => managers?.filter((manager) => manager.isGloballyActive) || [],
    [managers]
  );

  const { data: { invitations } = {}, refetch: refetchInvitations } =
    useQuery<GET_ALL_MANAGERS>(GET_ALL_MANAGERS);

  const { toastSuccess, toastError } = useToast();

  const [
    toggleManagerGlobalAccessMutation,
    { data: toggleGlobalAccessSuccess },
  ] = useMutation(TOGGLE_MANAGER_GLOBAL_ACCESS, {
    fetchPolicy: "no-cache",
  });

  const [deleteManagerMutation, { data: deleteManagerSuccess }] = useMutation(
    DELETE_MANAGER,
    {
      fetchPolicy: "no-cache",
    }
  );

  const toggleManagerGlobalAccess = async (manager: Manager) => {
    if (!manager) return;
    await toggleManagerGlobalAccessMutation({
      variables: { toggleGlobalAccessManagerId: manager.id },
    });
    if (toggleGlobalAccessSuccess) {
      toastSuccess(
        manager.isGloballyActive
          ? "Utilisateur désactivé avec succès"
          : "Utilisateur activé avec succès"
      );
      await refetchManagers();
    } else {
      console.error("Erreur lors du changement de l'accès de l'utilisateur");
      toastError("Erreur lors du changement de l'accès de l'utilisateur");
    }
  };

  const deleteManager = async (managerId: string) => {
    if (!managerId) return;
    await deleteManagerMutation({
      variables: { deleteManagerId: managerId },
    });
    if (deleteManagerSuccess) {
      toastSuccess("Utilisateur supprimé avec succès");
      await refetchManagers();
    } else {
      console.error("Erreur lors de la suppression de l'utilisateur");
      toastError("Erreur lors de la suppression de l'utilisateur");
    }
  };

  return (
    <>
      <div className="flex flex-row gap-4 h-full justify-between items-center w-full mb-4">
        <SettingsHeader
          title="Gestion des utilisateurs"
          description="Gérez les utilisateurs de votre entreprise. Vous pouvez inviter de nouveaux utilisateurs, en supprimer ou en suspendre d'autres."
        />
        <InvitUserDialog managers={managers} />
      </div>
      <div className="flex flex-row gap-20 h-full justify-between items-start w-full">
        <div className="flex flex-col gap-4 h-full justify-start items-start w-[33%]">
          <h3 className="text-xl font-light tracking-tight text-balance text-muted-foreground mb-2 text-start">
            Utilisateurs actifs
          </h3>
          <div
            className={`mb-4 p-4 bg-popover rounded-md flex flex-col w-full`}
          >
            {activeManagers.map((manager) => (
              <ManagerListItem
                key={manager.id}
                manager={manager}
                onToggleGlobalAccess={toggleManagerGlobalAccess}
                onDelete={deleteManager}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 h-full justify-start items-start w-[33%]">
          <h3 className="text-xl font-light tracking-tight text-balance text-muted-foreground mb-2 text-start">
            Utilisateurs désactivés
          </h3>
          <div
            className={`mb-4 p-4 bg-popover rounded-md flex flex-col w-full`}
          >
            {disabledManagers.map((manager) => (
              <ManagerListItem
                key={manager.id}
                manager={manager}
                onToggleGlobalAccess={toggleManagerGlobalAccess}
                onDelete={deleteManager}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 h-full justify-start items-start w-[33%]">
          <h3 className="text-xl font-light tracking-tight text-balance text-muted-foreground mb-2 text-start">
            Invitations en attente
          </h3>
          <div
            className={`mb-4 p-4 bg-popover rounded-md flex flex-col w-full`}
          >
            {invitations?.map((invitation: Invitation) => (
              <InvitationListItem
                key={invitation.id}
                invitation={invitation}
                onResend={(invitation) =>
                  console.log("Invitation resent to ", invitation.email)
                }
                onDelete={(invitationId) =>
                  console.log("Delete invitation", invitationId)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const ManagerListItem = ({
  manager,
  onToggleGlobalAccess,
  onDelete,
}: {
  manager: Manager;
  onToggleGlobalAccess: (manager: Manager) => void;
  onDelete: (managerId: string) => void;
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center px-2 py-2">
        <div>
          {manager.firstName} {manager.lastName}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="flex justify-end">
            <Button variant="ghost" size="sm" className="cursor-pointer">
              <IoIosMore size={20} className="cursor-pointer" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={async () => {
                onToggleGlobalAccess(manager);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2 text-red-500" />
              {manager.isGloballyActive ? "Désactiver" : "Activer"}{" "}
              l'utilisateur
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="w-4 h-4 mr-2 text-red-500" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Voulez-vous vraiment supprimer cet utilisateur ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera
              définitivement l'utilisateur et toutes ses données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Annuler</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete(manager.id);
                  setShowDeleteDialog(false);
                }}
              >
                Supprimer
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const InvitationListItem = ({
  invitation,
  onResend,
  onDelete,
}: {
  invitation: Invitation;
  onResend: (invitation: Invitation) => void;
  onDelete: (invitationId: string) => void;
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center px-2 py-2">
        <div>{invitation.email}</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="flex justify-end">
            <Button variant="ghost" size="sm" className="cursor-pointer">
              <IoIosMore size={20} className="cursor-pointer" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onResend(invitation)}>
              <Trash2 className="w-4 h-4 mr-2 text-red-500" />
              Renvoyer l'invitation
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Delete invitation")}>
              <Trash2 className="w-4 h-4 mr-2 text-red-500" />
              Supprimer l'invitation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Voulez-vous vraiment supprimer cette invitation ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera
              définitivement l'invitation et l'utilisateur invité ne pourra plus
              vous rejoindre.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Annuler</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete(invitation.id);
                  setShowDeleteDialog(false);
                }}
              >
                Supprimer
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
