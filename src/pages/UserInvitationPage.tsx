import InputWithLabel from "@/components/dashboard/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CREATE_MANAGER_FROM_INVITATION } from "@/requests/mutations/manager.mutation";
import { GET_INVITATION_BY_TOKEN } from "@/requests/queries/invitation.query";
import { useMutation, useQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import * as yup from "yup";

type RouteParams = {
  invitationToken: string;
};

type GET_INVITATION_BY_TOKEN = {
  invitationByToken: {
    company: {
      name: string;
    };
    email: string;
    role: string;
    tokenExpiration: string;
    createdAt: string;
    updatedAt: string;
  };
};

export default function UserInvitationPage() {
  const { invitationToken } = useParams<RouteParams>();

  const {
    data: { invitationByToken: invitation } = { invitationByToken: null },
  } = useQuery<GET_INVITATION_BY_TOKEN, { token: string | undefined }>(
    GET_INVITATION_BY_TOKEN,
    {
      variables: { token: invitationToken },
      skip: !invitationToken,
    }
  );

  const isAuthorized = invitation !== null;

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
    email: yup.string().email().required(),
    role: yup.string().required(),
  });

  type InvitationFormData = yup.InferType<typeof invitationFormSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<InvitationFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      email: "",
      role: "",
    },
    mode: "onChange",
    resolver: yupResolver(invitationFormSchema),
  });

  useEffect(() => {
    if (invitation) {
      reset({
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
        email: invitation.email,
        role: invitation.role,
      });
    }
  }, [invitation, reset]);

  const { toastSuccess, toastError } = useToast();

  const [createManagerFromInvitation] = useMutation(
    CREATE_MANAGER_FROM_INVITATION,
    {
      onCompleted: () => {
        toastSuccess(
          "Votre compte est maintenant créé ! Vous pouvez vous connecter sur la page sur laquelle vous allez être redirigé dans quelques secondes."
        );
        setTimeout(() => {
          window.location.href = "/login";
        }, 5000);
      },
      onError: (error) => {
        console.error(
          "Une erreur est survenue pendant la création de votre compte, veuillez réessayer ou contacter votre responsable."
        );
        toastError("Erreur lors de la création du compte : " + error.message);
      },
    }
  );

  const onSubmit = async (data: InvitationFormData) => {
    if (!isAuthorized) return;

    await createManagerFromInvitation({
      variables: {
        infos: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          invitationToken: invitationToken!,
          isGloballyActive: true,
        },
      },
    });
  };

  return (
    <div className="h-screen flex items-stretch justify-between bg-background px-12 py-10">
      <div className="w-[50%] flex items-center justify-center px-24">
        <Card className="flex flex-col align-center justify-center w-full shadow-none border-0 py-12 px-4">
          <CardHeader className="flex flex-col items-center gap-7 mb-6">
            <CardTitle className="whitespace-nowrap font-['Archivo',Helvetica] font-normal text-[#1f2511] text-[1.5rem] text-center">
              {invitation ? (
                <>
                  {invitation.company.name} <br />
                  vous invite à rejoindre <br />
                  son espace NextOne
                </>
              ) : (
                "Vous n'êtes pas autorisé à rejoindre NextOne"
              )}
            </CardTitle>
          </CardHeader>
          {isAuthorized && (
            <CardContent>
              <form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <InputWithLabel
                  label="Prénom"
                  placeholder="John"
                  required
                  className="text-base! font-normal bg-transparent! shadow-none! w-full"
                  {...register("firstName")}
                  error={errors.firstName?.message}
                />
                <InputWithLabel
                  label="Nom"
                  placeholder="Doe"
                  required
                  className="text-base! font-normal bg-transparent! shadow-none! w-full"
                  {...register("lastName")}
                  error={errors.lastName?.message}
                />
                <InputWithLabel
                  label="Définissez votre mot de passe"
                  type="password"
                  placeholder="**********"
                  required
                  className="text-base! font-normal bg-transparent! shadow-none!"
                  {...register("password")}
                  error={errors.password?.message}
                />
                <InputWithLabel
                  label="Confirmez votre mot de passe"
                  type="password"
                  placeholder="**********"
                  required
                  className="text-base! font-normal bg-transparent! shadow-none!"
                  {...register("confirmPassword")}
                  error={errors.confirmPassword?.message}
                />
                <Button
                  type="submit"
                  className="w-full bg-[#1f2511] py-7 rounded-lg font-['Archivo',Helvetica] font-light text-lg"
                  disabled={!isDirty || !isValid || !isAuthorized}
                >
                  Créer mon compte et rejoindre l'entreprise
                </Button>
              </form>
            </CardContent>
          )}
        </Card>
      </div>
      <div className="w-[50%] flex items-center justify-center pl-24 overflow-hidden">
        <img
          src="/login-picture.jpg"
          alt="Accueil NextOne"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
}
