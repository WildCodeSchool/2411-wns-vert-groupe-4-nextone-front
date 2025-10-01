import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
          <TabsList className="mb-4 gap-4">
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
            <div className="flex flex-col gap-4 h-full justify-start items-start px-4">
              <p>Nom</p>
              <p>Prénom</p>
              <p>Adresse e-mail</p>
              <p>Numéro de téléphone</p>
              <p>Mot de passe</p>
              <p>Photo de profil</p>
            </div>
          </TabsContent>
          <TabsContent value="company">
            <div className="flex flex-col gap-4 h-full justify-start items-start px-4">
              <p>Logo de l'entreprise</p>
              <p>Nom de l'entreprise</p>
              <p>Adresse de l'entreprise</p>
              <p>Numéro de téléphone de l'entreprise</p>
              <p>Adresse e-mail de l'entreprise</p>
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
