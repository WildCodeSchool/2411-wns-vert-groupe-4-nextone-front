import { useState } from "react";
import SettingsHeader from "../SettingsHeader";
import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DELETE_IP_ADDRESS,
  GET_ALL_IP_ADDRESSES,
} from "@/requests/queries/settings.query";
import { useMutation, useQuery } from "@apollo/client/react";
import { useToast } from "@/hooks/use-toast";
import AddIpAddressDialog from "./dialogs/AddIpAddressDialog";
import { Trash2 } from "lucide-react";

type GET_ALL_IP_ADDRESSES = {
  whitelistedIps: { id: string; ipAddress: string }[];
};

export default function PublicDisplaySettings() {
  const { data: { whitelistedIps } = {}, refetch: refetchIps } =
    useQuery<GET_ALL_IP_ADDRESSES>(GET_ALL_IP_ADDRESSES);

  const { toastSuccess, toastError } = useToast();

  const [deleteIpAddressMutation] = useMutation(DELETE_IP_ADDRESS, {
    onCompleted: async () => {
      await refetchIps();
      toastSuccess("Adresse IP supprimée avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression de l'adresse IP", error);
      toastError("Erreur lors de la suppression de l'adresse IP");
    },
    fetchPolicy: "no-cache",
  });

  return (
    <>
      <SettingsHeader
        title="Gérer votre panneau d'affichage public"
        description="Personnalisez et gérez le contenu affiché sur votre panneau d'affichage public et les personnes qui peuvent l'afficher."
      />
      <div className="flex gap-24 h-full justify-start items-stretch mb-4 mt-4">
        <div className="flex flex-col gap-4 h-full justify-start items-start w-[50%]">
          <div className="flex flex-row gap-4 h-full justify-between items-center w-full mb-4">
            <SettingsHeader
              title="Adresses IP autorisées"
              description="Gérez les adresses IP autorisées à accéder et afficher le panneau d'affichage public de votre entreprise."
              smaller={true}
            />
            <AddIpAddressDialog
              ipAddresses={whitelistedIps || []}
              refetchIps={refetchIps}
            />
          </div>

          <ScrollArea className="h-80 mb-4 p-4 bg-popover rounded-md flex flex-col w-full">
            {whitelistedIps?.length === 0 && (
              <div className="text-muted-foreground">
                Aucune adresse IP autorisée n'a été ajoutée.
              </div>
            )}
            {whitelistedIps?.map((ipItem) => (
              <IpAddressListItem
                key={ipItem.id}
                ipItem={ipItem}
                onDelete={async () => {
                  await deleteIpAddressMutation({
                    variables: { deleteWhitelistedIpId: ipItem.id },
                  });
                }}
              />
            ))}
          </ScrollArea>
        </div>
        <div className="flex flex-col gap-4 h-full justify-start items-start w-[50%]">
          <SettingsHeader
            title="Autres paramètres"
            description="Personnalisez et gérez le contenu affiché sur votre panneau d'affichage public et les personnes qui peuvent l'afficher."
            smaller={true}
            noDescription={true}
          />
          <p>À venir...</p>
        </div>
      </div>
    </>
  );
}

const IpAddressListItem = ({
  ipItem,
  onDelete,
}: {
  ipItem: { ipAddress: string; id: string };
  onDelete: (ipItemId: string) => void;
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center px-2 py-2">
        <div>{ipItem.ipAddress}</div>
        <Button
          onClick={() => setShowDeleteDialog(true)}
          size="icon"
          variant="destructive"
        >
          <Trash2 />
        </Button>
      </div>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Voulez-vous vraiment supprimer cette adresse IP ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera
              définitivement l'adresse IP et les réseaux utilisant cette adresse
              ne pourront plus accéder au panneau d'affichage public.
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
                  onDelete(ipItem.id);
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
