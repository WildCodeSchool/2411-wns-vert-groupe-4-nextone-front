import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputWithLabel from "@/components/dashboard/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import logo from "@/assets/images/Logo_NextOne_vert-noir.png";
import { useLazyQuery } from "@apollo/client";
import { LOGIN } from "@/requests/queries/auth.query";
import { useNavigate } from "react-router-dom";
export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stayConnected, setStayConnected] = useState(false);

  const navigate = useNavigate();

  const [login] = useLazyQuery(LOGIN, {
    async onCompleted(data) {
      console.log(data);
      navigate("/dashboard");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form with:", { email, password });
    login({
      variables: {
        infos: {
          email,
          password,
        },
      },
    });
  };
  return (
    <div className="h-screen flex items-stretch justify-between bg-background px-12 py-10">
      <div className="w-[50%] flex items-center justify-center px-24">
        <Card className="flex flex-col align-center justify-center w-full shadow-none border-0 py-12 px-4">
          <CardHeader className="flex flex-col items-center gap-7 mb-6">
            <img
              src={logo}
              alt="Logo"
              className="w-[70px] h-[70px] rounded-lg"
            />
            <CardTitle className="whitespace-nowrap font-['Archivo',Helvetica] font-normal text-[#1f2511] text-[1.7rem] text-center">
              Connectez-vous à votre compte
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                  className="!text-base font-normal !bg-transparent !shadow-none w-full"
                />
                <InputWithLabel
                  label="Mot de passe"
                  name="password"
                  type="password"
                  placeholder="**********"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="!text-base font-normal !bg-transparent !shadow-none"
                />
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2.5">
                    <Checkbox
                      id="stay-connected"
                      checked={stayConnected}
                      onCheckedChange={(checked) =>
                        setStayConnected(checked === true)
                      }
                      className="w-5 h-5 rounded-none bg-gray-300 border-none checked:bg-[#1f2511] transition-all"
                    />
                    <label
                      htmlFor="stay-connected"
                      className="text-sm cursor-pointer"
                    >
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
                className="w-full bg-[#1f2511] py-7 rounded-lg font-['Archivo',Helvetica] font-light text-lg"
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
      <div className="w-[50%] flex items-center justify-center pl-24 overflow-hidden">
        <img
          src="/login-picture.jpg"
          alt="Accueil NextOne"
          className="w-[100%] h-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
}
