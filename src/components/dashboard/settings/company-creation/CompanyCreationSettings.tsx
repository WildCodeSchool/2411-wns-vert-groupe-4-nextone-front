import SettingsHeader from "../SettingsHeader";
import { useMutation } from "@apollo/client/react";
import { useToast } from "@/hooks/use-toast";
import { CREATE_COMPANY } from "@/requests/mutations/company.mutation";
import { useForm } from "react-hook-form";
import { InferType, object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputWithLabel from "../../InputWithLabel";
import { Button } from "@/components/ui/button";
import * as yup from "yup";

export default function CompanyCreationSettings() {
  const createCompanyFormValidationSchema = object({
    companyName: string().required("Le nom de l'entreprise est requis"),
    companyEmail: string()
      .email("L'email de l'entreprise doit être valide")
      .required("L'email de l'entreprise est requis"),
    companyPhone: yup
      .string()
      .required("Le téléphone de l'entreprise est requis"),
    companySiret: string()
      .min(14, "Le SIRET de l'entreprise doit contenir au moins 14 caractères")
      .max(
        14,
        "Le SIRET de l'entreprise doit contenir au maximum 14 caractères"
      )
      .matches(
        /^[0-9]+$/,
        "Le SIRET de l'entreprise ne doit contenir que des chiffres"
      )
      .required("Le SIRET de l'entreprise est requis"),
    companyAddress: string().required("L'adresse de l'entreprise est requise"),
    companyZipCode: string().required(
      "Le code postal de l'entreprise est requis"
    ),
    companyCity: string().required("La ville de l'entreprise est requise"),
  });

  type CreateCompanyFormData = InferType<
    typeof createCompanyFormValidationSchema
  >;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<CreateCompanyFormData>({
    resolver: yupResolver(createCompanyFormValidationSchema),
    mode: "onChange",
    defaultValues: {
      companyName: "",
      companyEmail: "",
      companyPhone: "",
      companySiret: "",
      companyAddress: "",
      companyZipCode: "",
      companyCity: "",
    },
  });

  const { toastSuccess, toastError } = useToast();

  const [createCompanyMutation] = useMutation(CREATE_COMPANY, {
    onCompleted: async () => {
      reset();
      toastSuccess(
        "Entreprise créée avec succès. L'utilisateur sera notifié par email."
      );
    },
    onError: (error) => {
      console.error("Erreur lors de la création de l'entreprise", error);
      toastError("Erreur lors de la création de l'entreprise");
    },
    fetchPolicy: "no-cache",
  });

  const onSubmit = async (data: CreateCompanyFormData) => {
    await createCompanyMutation({
      variables: {
        data: {
          name: data.companyName,
          email: data.companyEmail,
          phone: data.companyPhone,
          siret: data.companySiret,
          address: data.companyAddress,
          postalCode: data.companyZipCode,
          city: data.companyCity,
        },
      },
    });
  };

  return (
    <>
      <SettingsHeader
        title="Créer un compte entreprise"
        description="Créez un nouveau compte entreprise pour permettre à une nouvelle entreprise d'accéder à la plateforme."
      />
      <div className="flex gap-24 h-full justify-start items-stretch mb-4 mt-4">
        <div className="flex flex-col gap-4 h-full justify-start items-start w-[50%]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full"
          >
            <div className="flex gap-10">
              <InputWithLabel
                label="Nom de l'entreprise"
                type="companyName"
                placeholder="Apple Inc."
                required
                {...register("companyName")}
                error={errors.companyName?.message}
              />
              <InputWithLabel
                label="Email de l'entreprise"
                type="email"
                placeholder="contact@apple.com"
                required
                {...register("companyEmail")}
                error={errors.companyEmail?.message}
              />
            </div>
            <div className="flex gap-10">
              <InputWithLabel
                label="Téléphone de l'entreprise"
                type="text"
                placeholder="+1 800 275 2273"
                required
                {...register("companyPhone")}
                error={errors.companyPhone?.message}
              />
              <InputWithLabel
                label="SIRET de l'entreprise"
                type="text"
                placeholder="123 456 789 00012"
                required
                {...register("companySiret")}
                error={errors.companySiret?.message}
              />
            </div>
            <InputWithLabel
              label="Adresse de l'entreprise"
              type="text"
              placeholder="1 Infinite Loop, Cupertino, CA"
              required
              {...register("companyAddress")}
              error={errors.companyAddress?.message}
            />
            <div className="flex gap-10 mb-4">
              <InputWithLabel
                label="Code postal de l'entreprise"
                type="text"
                placeholder="95014"
                required
                {...register("companyZipCode")}
                error={errors.companyZipCode?.message}
              />
              <InputWithLabel
                label="Ville de l'entreprise"
                type="text"
                placeholder="Cupertino"
                required
                {...register("companyCity")}
                error={errors.companyCity?.message}
              />
            </div>
            <Button
              type="submit"
              className="self-start"
              disabled={!isValid || !isDirty}
            >
              Ajouter l'entreprise
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
