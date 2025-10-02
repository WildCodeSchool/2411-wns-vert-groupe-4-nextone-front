import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InputWithLabel from "@/components/dashboard/InputWithLabel";
import { Button } from "@/components/ui/button";
import UserInformationsForm from "@/components/dashboard/settings/user/forms/UserInformationsForm";
import UserProfilePictureForm from "@/components/dashboard/settings/user/forms/UserProfilePictureForm";
import CompanyInformationsForm from "@/components/dashboard/settings/company/forms/CompanyInformationsForm";
import CompanyLogoForm from "@/components/dashboard/settings/company/forms/CompanyLogoForm";
import CompanyColorForm from "@/components/dashboard/settings/company/forms/CompanyColorForm";

type TabEnum = "user" | "company";

export default function SettingsPage() {
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
          <TabsList className="mb-8 gap-4">
            <TabsTrigger value="user">
              Informations de l'utilisateur
            </TabsTrigger>
            <TabsTrigger value="company">
              Informations de l'entreprise
            </TabsTrigger>
            <TabsTrigger value="services">Gestion des services</TabsTrigger>
            <TabsTrigger value="users">Gestion des utilisateurs</TabsTrigger>
          </TabsList>
          <TabsContent value="user">
            <div className="flex gap-24 h-full justify-start items-stretch px-4 mb-4">
              <div className="flex flex-col gap-6 h-full justify-start items-start w-[50%]">
                <UserInformationsForm />
                <div className="flex gap-6 items-end justify-start mt-6">
                  <InputWithLabel
                    label="Mot de passe"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    disabled
                    value="••••••••"
                    className="!text-base font-normal !bg-transparent !shadow-none w-full"
                  />
                  <Button>Réinitialiser le mot de passe</Button>
                </div>
              </div>
              <div className="flex flex-col gap-4 h-full justify-start items-start w-[50%]">
                <UserProfilePictureForm />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="company">
            <div className="flex gap-24 h-full justify-start items-stretch px-4 mb-4">
              <div className="flex flex-col gap-6 h-full justify-start items-start w-[50%]">
                <CompanyInformationsForm />
              </div>
              <div className="flex flex-col gap-4 h-full justify-start items-start w-[50%]">
                <CompanyLogoForm />
                <CompanyColorForm />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="services">
            <div className="flex flex-col gap-4 h-full">
              <p>Services de l'entreprise</p>
            </div>
          </TabsContent>
          <TabsContent value="users">
            <div className="flex flex-col gap-4 h-full">
              <p>Gestion des utilisateurs</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
