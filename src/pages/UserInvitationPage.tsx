import InputWithLabel from "@/components/dashboard/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLazyQuery } from "@apollo/client/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import * as yup from "yup";

export default function UserInvitationPage() {
  const [searchParams] = useSearchParams();

  const invitationToken = searchParams.get("invitationToken");

  //   const [checkInvitationToken, { data: invitationData }] = [
  //     useLazyQuery(GET_INVITATION, {
  //       variables: { token: invitationToken },
  //     }),
  //   ];

  //   const isInvitationExisting = invitationData !== null;

  //   const isInvitationExpired = false;

  //   useEffect(() => {
  //     if (invitationToken) {
  //       checkInvitationToken();
  //     }
  //   }, [invitationToken, checkInvitationToken]);

  const invitationFormSchema = yup.object({
    firstName: yup.string().required("Le prénom est requis"),
    lastName: yup.string().required("Le nom est requis"),
    password: yup
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .required("Le mot de passe est requis"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Les mots de passe ne correspondent pas")
      .required("La confirmation du mot de passe est requise"),
  });

  const {
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
    resolver: yupResolver(invitationFormSchema),
  });

  return (
    <div className="h-screen flex items-stretch justify-between bg-background px-12 py-10">
      <div className="w-[50%] flex items-center justify-center px-24">
        <Card className="flex flex-col align-center justify-center w-full shadow-none border-0 py-12 px-4">
          <CardHeader className="flex flex-col items-center gap-7 mb-6">
            <img alt="Logo" className="w-[70px] h-[70px] rounded-lg" />
            <CardTitle className="whitespace-nowrap font-['Archivo',Helvetica] font-normal text-[#1f2511] text-[1.5rem] text-center">
              {invitationToken ? "coucou" : "pas coucou"}
              [Nom de l'entreprise] <br />
              vous invite à rejoindre <br />
              son espace NextOne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-6">
              <InputWithLabel
                label="Prénom"
                placeholder="John"
                required
                className="!text-base font-normal !bg-transparent !shadow-none w-full"
                {...register("firstName")}
                error={errors.firstName?.message}
              />
              <InputWithLabel
                label="Nom"
                placeholder="Doe"
                required
                className="!text-base font-normal !bg-transparent !shadow-none w-full"
                {...register("lastName")}
                error={errors.lastName?.message}
              />
              <InputWithLabel
                label="Définissez votre mot de passe"
                type="password"
                placeholder="**********"
                required
                className="!text-base font-normal !bg-transparent !shadow-none"
                {...register("password")}
                error={errors.password?.message}
              />
              <InputWithLabel
                label="Confirmez votre mot de passe"
                type="password"
                placeholder="**********"
                required
                className="!text-base font-normal !bg-transparent !shadow-none"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
              />
              <Button
                type="submit"
                className="w-full bg-[#1f2511] py-7 rounded-lg font-['Archivo',Helvetica] font-light text-lg"
              >
                Créer mon compte et rejoindre l'entreprise
              </Button>
            </form>
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
