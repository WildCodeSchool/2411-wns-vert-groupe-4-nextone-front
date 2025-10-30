import { useMutation, useQuery } from "@apollo/client/react";
import {
  DELETE_INVITATION,
  GET_ALL_INVITATIONS,
  GET_ALL_MANAGERS,
  RENEW_INVITATION,
} from "@/requests/queries/settings.query";
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
import { Ban, Check, RefreshCw, Trash2 } from "lucide-react";
import { IoIosMore } from "react-icons/io";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type GET_ALL_MANAGERS = {
  SortedManagers: {
    active: Manager[];
    disable: Manager[];
  };
};

export type Invitation = {
  id: string;
  email: string;
  createdAt: string;
};

type InvitationsTabEnum = "expired_invitations" | "pending_invitations";

export default function ManagersManagementForm() {
  const { data: { SortedManagers } = {}, refetch: refetchManagers } =
    useQuery<GET_ALL_MANAGERS>(GET_ALL_MANAGERS);

  const disabledManagers = useMemo(
    () => SortedManagers?.disable || [],
    [SortedManagers]
  );
  const activeManagers = useMemo(
    () => SortedManagers?.active || [],
    [SortedManagers]
  );

  const { data: { sortedInvitations } = {}, refetch: refetchInvitations } =
    useQuery(GET_ALL_INVITATIONS);

  const { toastSuccess, toastError } = useToast();

  const [toggleManagerGlobalAccessMutation] = useMutation(
    TOGGLE_MANAGER_GLOBAL_ACCESS,
    {
      fetchPolicy: "no-cache",
    }
  );

  const [deleteManagerMutation] = useMutation(DELETE_MANAGER, {
    onCompleted: async () => {
      await refetchManagers();
      toastSuccess("Utilisateur supprimé avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression de l'utilisateur", error);
      toastError("Erreur lors de la suppression de l'utilisateur");
    },
    fetchPolicy: "no-cache",
  });

  const [renewInvitationMutation] = useMutation(RENEW_INVITATION, {
    onCompleted: async () => {
      await refetchInvitations();
      toastSuccess("Invitation renouvelée avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors du renouvellement de l'invitation", error);
      toastError("Erreur lors du renouvellement de l'invitation");
    },
    fetchPolicy: "no-cache",
  });

  const [deleteInvitationMutation] = useMutation(DELETE_INVITATION, {
    onCompleted: async () => {
      await refetchInvitations();
      toastSuccess("Invitation supprimée avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression de l'invitation", error);
      toastError("Erreur lors de la suppression de l'invitation");
    },
    fetchPolicy: "no-cache",
  });

  const toggleManagerGlobalAccess = async (manager: Manager) => {
    if (!manager) return;
    await toggleManagerGlobalAccessMutation({
      variables: { toggleGlobalAccessManagerId: manager.id },
      onCompleted: async () => {
        await refetchManagers();
        toastSuccess(
          manager.isGloballyActive
            ? "Utilisateur désactivé avec succès"
            : "Utilisateur activé avec succès"
        );
      },
      onError: (error) => {
        console.error(
          "Erreur lors du changement de l'accès de l'utilisateur",
          error
        );
        toastError("Erreur lors du changement de l'accès de l'utilisateur");
      },
    });
  };

  const deleteManager = async (managerId: string) => {
    if (!managerId) return;
    await deleteManagerMutation({
      variables: { deleteManagerId: managerId },
    });
  };

  const deleteInvitation = async (invitationId: string) => {
    if (!invitationId) return;
    await deleteInvitationMutation({
      variables: { deleteInvitationId: invitationId },
    });
  };

  const [currentInvitationsTab, setCurrentInvitationsTab] =
    useState<InvitationsTabEnum>("pending_invitations");

  return (
    <>
      <div className="flex flex-row gap-4 h-full justify-between items-center w-full mb-4">
        <SettingsHeader
          title="Gestion des utilisateurs"
          description="Gérez les utilisateurs de votre entreprise. Vous pouvez inviter de nouveaux utilisateurs, en supprimer ou en suspendre d'autres."
        />
        <InvitUserDialog
          managers={SortedManagers}
          refetchInvitations={refetchInvitations}
        />
      </div>
      <div className="flex flex-row gap-20 h-full justify-between items-start w-full">
        <div className="flex flex-col gap-4 h-full justify-start items-start w-[33%]">
          <h3 className="text-xl font-light tracking-tight text-balance text-muted-foreground mb-2 text-start">
            Utilisateurs actifs
          </h3>
          <div
            className={`mb-4 p-4 bg-popover rounded-md flex flex-col w-full`}
          >
            {activeManagers.length === 0 && (
              <div className="text-muted-foreground py-4">
                Aucun utilisateur actif
              </div>
            )}
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
            Utilisateurs suspendus
          </h3>
          <ScrollArea className="h-[100%] mb-4 p-4 bg-popover rounded-md flex flex-col w-full">
            {activeManagers.length === 0 && (
              <div className="text-muted-foreground py-4">
                Aucun utilisateur suspendu
              </div>
            )}
            {disabledManagers.map((manager) => (
              <ManagerListItem
                key={manager.id}
                manager={manager}
                onToggleGlobalAccess={toggleManagerGlobalAccess}
                onDelete={deleteManager}
              />
            ))}
          </ScrollArea>
        </div>
        <div className="flex flex-col gap-4 h-full justify-start items-start w-[33%]">
          <h3 className="text-xl font-light tracking-tight text-balance text-muted-foreground mb-2 text-start">
            Invitations envoyées
          </h3>
          <div
            className={`mb-4 p-4 bg-popover rounded-md flex flex-col w-full`}
          >
            <Tabs
              defaultValue={currentInvitationsTab}
              className="w-full"
              onValueChange={(value) =>
                setCurrentInvitationsTab(value as InvitationsTabEnum)
              }
            >
              <TabsList className="mb-2 gap-4 h-fit">
                <TabsTrigger
                  value="pending_invitations"
                  className="data-[state=active]:!bg-primary data-[state=active]:!text-white px-4 py-2"
                >
                  Invitations en cours
                </TabsTrigger>
                <TabsTrigger
                  value="expired_invitations"
                  className="data-[state=active]:!bg-primary data-[state=active]:!text-white px-4 py-2"
                >
                  Invitations expirées
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pending_invitations">
                {sortedInvitations?.pending.length === 0 && (
                  <div className="text-muted-foreground py-4">
                    Aucune invitation en cours
                  </div>
                )}
                {sortedInvitations?.pending.map((invitation: Invitation) => (
                  <InvitationListItem
                    key={invitation.id}
                    invitation={invitation}
                    onResend={() =>
                      renewInvitationMutation({
                        variables: { renewInvitationId: invitation.id },
                      })
                    }
                    onDelete={deleteInvitation}
                  />
                ))}
              </TabsContent>
              <TabsContent value="expired_invitations">
                {sortedInvitations?.expired.length === 0 && (
                  <div className="text-muted-foreground py-4">
                    Aucune invitation expirée
                  </div>
                )}
                {sortedInvitations?.expired.map((invitation: Invitation) => (
                  <InvitationListItem
                    key={invitation.id}
                    invitation={invitation}
                    onResend={() =>
                      renewInvitationMutation({
                        variables: { renewInvitationId: invitation.id },
                      })
                    }
                    onDelete={deleteInvitation}
                  />
                ))}
              </TabsContent>
            </Tabs>
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
              {manager.isGloballyActive ? (
                <Ban className="w-4 h-4 mr-2" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              {manager.isGloballyActive ? "Suspendre" : "Autoriser"}{" "}
              l'utilisateur
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="w-4 h-4 mr-2 text-red-500" />
              Supprimer l'utilisateur
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
              <RefreshCw className="w-4 h-4 mr-2" />
              Renvoyer l'invitation
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
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
