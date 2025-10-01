import InputWithLabel from "@/components/dashboard/InputWithLabel";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export default function UserInformationsForm() {
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

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<UserInformationsFormData>({
    resolver: yupResolver(userInformationsFormSchema),
    mode: "onChange",
    defaultValues: {
      lastName: "Doe",
      firstName: "John",
    },
  });

  const onSubmit = (data: UserInformationsFormData) => {
    console.log(data);
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
        value="john.doe@example.com"
        className="!text-base font-normal !bg-transparent !shadow-none w-full"
      />

      <Button disabled={!isValid} onClick={handleSubmit(onSubmit)}>
        Enregistrer les informations
      </Button>
    </>
  );
}
