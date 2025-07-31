import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputWithLabel from "@/components/dashboard/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stayConnected, setStayConnected] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, stayConnected });
    // Appeler le resolver GraphQL de login ici
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4fb] px-4 font-['Archivo',Helvetica]">
      <Card className="w-full max-w-md bg-white rounded-[15px] border-none shadow-lg">
        <CardHeader className="flex flex-col items-center gap-[35px] p-[50px] pb-0">
          <img
            src="../assets/images/Logo_NextOne_vert-noir.png"
            alt="Logo"
            className="w-[150px] h-auto mb-4"
          />
          <CardTitle className="font-['Archivo',Helvetica] font-normal text-[#1f2511] text-[26px] text-center tracking-[0] leading-normal">
            Connectez-vous à votre compte
          </CardTitle>
        </CardHeader>

        <CardContent className="p-[50px] pt-0">
          <form onSubmit={handleSubmit} className="flex flex-col gap-[45px]">
            <div className="flex flex-col gap-[30px]">
              <InputWithLabel
                label="Adresse mail"
                name="email"
                type="email"
                placeholder="example@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputWithLabel
                label="Mot de passe"
                name="password"
                type="password"
                placeholder="**********"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

               <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2.5">
                  <Checkbox
                    id="stay-connected"
                    checked={stayConnected}
                    onCheckedChange={(checked) => setStayConnected(checked === true)}
                  />
                  <label htmlFor="stay-connected" className="text-sm cursor-pointer">
                    Rester connecté
                  </label>
                </div>
                <button type="button" className="text-sm hover:underline">
                  Mot de passe oublié ?
                </button>
              </div> 
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#1f2511] hover:bg-[#2a3217] py-5 rounded-[10px] font-['Archivo',Helvetica] font-medium text-lg"
            >
              Me connecter
            </Button>
          </form>

          <p className="text-center text-sm mt-[45px] font-['Archivo',Helvetica] font-normal text-[#1f2511]">
            Pas encore de compte ?{" "}
            <button
              type="button"
              className="hover:underline bg-transparent border-none p-0 cursor-pointer font-['Archivo',Helvetica] font-normal text-[#1f2511]"
            >
              Contactez-nous
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};