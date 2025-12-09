import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import InputWithLabel from "../components/dashboard/InputWithLabel";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import logo from "../assets/images/Logo_NextOne_vert-noir.png";
import { useLazyQuery } from "@apollo/client";
import { LOGIN } from "../requests/queries/auth.query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginInfo } from "../utils/validations/loginValidation";

export default function LoginAdmin() {
  const [stayConnected, setStayConnected] = useState(false);
  const [formatedErrorMessage, setFormatedErrorMessage] = useState<
    string | undefined
  >(undefined);
  const { getInfos } = useAuth();
  const { toastSuccess } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginInfo),
    mode: "onChange",
  });

  const email = useWatch({
    control,
    name: "email",
  });

  const password = useWatch({
    control,
    name: "password",
  });

  const [login, { error }] = useLazyQuery(LOGIN, {
    fetchPolicy: "no-cache",
    async onCompleted() {
      await getInfos();
      navigate("/dashboard");
      toastSuccess("Connexion réussie !");
    },
  });

  const wrongCredentialsErrors = [
    "L'utilisateur n'est pas trouvé",
    "Mot de passe incorrect.",
  ];

  useEffect(() => {
    if (error) {
      if (wrongCredentialsErrors.includes(error.message)) {
        setFormatedErrorMessage("Email ou mot de passe incorrect.");
      } else {
        setFormatedErrorMessage("Une erreur est survenue. Veuillez réessayer.");
      }
    }
  }, [error]);

  useEffect(() => {
    if (formatedErrorMessage) {
      setFormatedErrorMessage(undefined);
    }
  }, [email, password]);

  const onSubmit = (data: any) => {
    login({
      variables: {
        infos: {
          email: data.email,
          password: data.password,
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
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-[45px]"
            >
              <div className="flex flex-col gap-[30px]">
                <InputWithLabel
                  label="Adresse mail"
                  type="email"
                  placeholder="example@example.com"
                  error={errors.email?.message || formatedErrorMessage}
                  {...register("email")}
                  className="!text-base font-normal !bg-transparent !shadow-none w-full"
                />
                <InputWithLabel
                  label="Mot de passe"
                  type="password"
                  placeholder="**********"
                  error={errors.password?.message}
                  {...register("password")}
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
                className="hover:underline bg-transparent p-0 cursor-pointer"
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
