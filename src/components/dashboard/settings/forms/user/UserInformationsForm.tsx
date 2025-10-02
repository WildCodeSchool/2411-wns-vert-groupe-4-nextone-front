import InputWithLabel from "@/components/dashboard/InputWithLabel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { UPDATE_USER_INFORMATIONS } from "@/requests/queries/settings.query";
import { useMutation } from "@apollo/client/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export default function UserInformationsForm() {
  const { user, getInfos } = useAuth();

  const userEmail = user?.email || "";

  const defaultValues = {
    lastName: user?.lastName ?? "",
    firstName: user?.firstName ?? "",
  };

  const userInformationsFormSchema = yup.object({
    lastName: yup
      .string()
      .min(2, "Le nom doit comporter au moins 2 caractères")
      .required("Le nom est requis"),
    firstName: yup
      .string()
      .min(2, "Le prénom doit comporter au moins 2 caractères")
      .required("Le prénom est requis"),
  });

  type UserInformationsFormData = yup.InferType<
    typeof userInformationsFormSchema
  >;

  const [
    updateUserInformations,
    { loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_USER_INFORMATIONS);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isDirty, errors },
  } = useForm<UserInformationsFormData>({
    resolver: yupResolver(userInformationsFormSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: UserInformationsFormData) => {
    await updateUserInformations({
      variables: {
        updateManagerId: user?.id,
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
      },
    });

    if (updateError) {
      console.error(
        "Erreur lors de la mise à jour des informations :",
        updateError
      );
      reset(defaultValues);
      return;
    }

    await getInfos();
  };

  return (
    <>
      <InputWithLabel
        label="Nom"
        type="text"
        placeholder="Doe"
        required
        {...register("lastName")}
        error={errors.lastName?.message}
      />
      <InputWithLabel
        label="Prénom"
        type="text"
        placeholder="John"
        required
        {...register("firstName")}
        error={errors.firstName?.message}
      />
      <InputWithLabel
        label="Adresse e-mail"
        name="email"
        type="email"
        placeholder="john.doe@example.com"
        required
        disabled
        value={userEmail}
        className="!text-base font-normal !bg-transparent !shadow-none w-full"
      />

      <Button
        disabled={!isValid || !isDirty || updateLoading}
        onClick={handleSubmit(onSubmit)}
      >
        {updateLoading ? "Enregistrement..." : "Enregistrer les modifications"}
      </Button>
    </>
  );
}
