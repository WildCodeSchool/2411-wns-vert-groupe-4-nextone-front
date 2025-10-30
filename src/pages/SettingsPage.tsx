import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InputWithLabel from "@/components/dashboard/InputWithLabel";
import { Button } from "@/components/ui/button";
import UserInformationsForm from "@/components/dashboard/settings/user/forms/UserInformationsForm";
import UserProfilePictureForm from "@/components/dashboard/settings/user/forms/UserProfilePictureForm";
import CompanyInformationsForm from "@/components/dashboard/settings/company/forms/CompanyInformationsForm";
import CompanyLogoForm from "@/components/dashboard/settings/company/forms/CompanyLogoForm";
import CompanyColorForm from "@/components/dashboard/settings/company/forms/CompanyColorForm";
import ServicesManagementForm from "@/components/dashboard/settings/services/forms/ServicesManagementForm";
import SettingsHeader from "@/components/dashboard/settings/SettingsHeader";
import ManagersManagementForm from "@/components/dashboard/settings/services/forms/ManagersManagementForm";
import { useAuth } from "@/context/AuthContext";

type TabEnum = "user" | "company";

export default function SettingsPage() {
  const { user } = useAuth();

  const [currentTab, setCurrentTab] = useState<TabEnum>("user");

  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-light tracking-tight text-balance">
        Paramètres
      </h1>
      <div className="mt-8 bg-card p-8 rounded-lg w-full h-full overflow-hidden">
        <Tabs
          defaultValue={currentTab}
          className="w-full"
          onValueChange={(value) => setCurrentTab(value as TabEnum)}
        >
          <TabsList className="mb-8 gap-4 h-fit">
            <TabsTrigger
              value="user"
              className="data-[state=active]:!bg-primary data-[state=active]:!text-white px-4 py-2"
            >
              Informations de l'utilisateur
            </TabsTrigger>
            {user?.role === "SUPER_ADMIN" && (
              <>
                <TabsTrigger
                  value="company"
                  className="data-[state=active]:!bg-primary data-[state=active]:!text-white px-4 py-2"
                >
                  Informations de l'entreprise
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  className="data-[state=active]:!bg-primary data-[state=active]:!text-white px-4 py-2"
                >
                  Gestion des services
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:!bg-primary data-[state=active]:!text-white px-4 py-2"
                >
                  Gestion des utilisateurs
                </TabsTrigger>
              </>
            )}
          </TabsList>
          <TabsContent value="user">
            <div className="flex gap-24 h-full justify-start items-stretch px-4 mb-4">
              <div className="flex flex-col gap-4 h-full justify-start items-start w-[50%]">
                <SettingsHeader
                  title="Modifier les informations de l'utilisateur"
                  description="Vous pouvez modifier le nom, l'adresse e-mail et le numéro de téléphone de l'utilisateur."
                />
                <UserInformationsForm />
                <div className="flex gap-6 items-end justify-start mt-6">
                  <InputWithLabel
                    label="Mot de passe"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    disabled
                    value="••••••••"
                  />
                  <Button>Réinitialiser le mot de passe</Button>
                </div>
              </div>
              <div className="flex flex-col gap-4 h-full justify-start items-start w-[50%]">
                <SettingsHeader
                  title="Personnaliser l'avatar de l'utilisateur"
                  description="Vous pouvez personnaliser l'avatar de l'utilisateur en téléchargeant une nouvelle image."
                />
                <UserProfilePictureForm />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="company">
            <div className="flex gap-24 h-full justify-start items-stretch px-4 mb-4">
              <div className="flex flex-col gap-6 h-full justify-start items-start w-[50%]">
                <SettingsHeader
                  title="Modifier les informations de l'entreprise"
                  description="Vous pouvez modifier le nom, l'adresse et les informations de contact de votre entreprise."
                />
                <CompanyInformationsForm />
              </div>
              <div className="flex flex-col gap-4 h-full justify-start items-start w-[50%]">
                <SettingsHeader
                  title="Personnaliser l'apparence de l'entreprise"
                  description="Vous pouvez personnaliser le logo et les couleurs de votre entreprise pour refléter votre identité visuelle."
                />
                <CompanyLogoForm />
                <CompanyColorForm />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="services">
            <div className="flex flex-col gap-4 h-full justify-start items-stretch px-4 mb-4">
              <ServicesManagementForm />
            </div>
          </TabsContent>
          <TabsContent value="users">
            <div className="flex flex-col gap-4 h-full">
              <ManagersManagementForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
