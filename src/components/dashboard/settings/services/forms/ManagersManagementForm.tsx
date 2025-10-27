import { useQuery } from "@apollo/client/react";
import { GET_ALL_MANAGERS } from "@/requests/queries/settings.query";
import { Manager } from "./AddAndUpdateServiceForm";
import SettingsHeader from "../../SettingsHeader";
import { useMemo } from "react";
import InvitUserDialog from "../../user/dialogs/InvitUserDialog";

type GET_ALL_MANAGERS = {
  managers: Manager[];
};

export default function ManagersManagementForm() {
  const { data } = useQuery<GET_ALL_MANAGERS>(GET_ALL_MANAGERS);

  const disabledManagers = useMemo(
    () => data?.managers.filter((manager) => !manager.isGloballyActive) || [],
    [data]
  );
  const activeManagers = useMemo(
    () => data?.managers.filter((manager) => manager.isGloballyActive) || [],
    [data]
  );

  return (
    <>
      <div className="flex flex-row gap-4 h-full justify-between items-center w-full mb-4">
        <SettingsHeader
          title="Gestion des utilisateurs"
          description="Gérez les utilisateurs de votre entreprise. Vous pouvez inviter de nouveaux utilisateurs, en supprimer ou en suspendre d'autres."
        />
        <InvitUserDialog managers={data?.managers} />
      </div>
      <div className="flex flex-row gap-20 h-full justify-between items-start w-full">
        <div className="flex flex-col gap-4 h-full justify-start items-start w-[50%]">
          <h3 className="text-xl font-light tracking-tight text-balance text-muted-foreground mb-2 text-start">
            Utilisateurs actifs
          </h3>
          <div
            className={`mb-4 p-4 bg-popover rounded-md flex flex-col w-full`}
          >
            {activeManagers.map((manager) => (
              <div
                key={manager.id}
                className="flex justify-start items-center px-2 py-2"
              >
                {manager.firstName} {manager.lastName}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 h-full justify-start items-start w-[50%]">
          <h3 className="text-xl font-light tracking-tight text-balance text-muted-foreground mb-2 text-start">
            Utilisateurs désactivés
          </h3>
          <div
            className={`mb-4 p-4 bg-popover rounded-md flex flex-col w-full`}
          >
            {disabledManagers.map((manager) => (
              <div key={manager.id}>
                {manager.firstName} {manager.lastName}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
