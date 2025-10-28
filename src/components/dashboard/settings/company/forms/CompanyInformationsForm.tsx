import InputWithLabel from "@/components/dashboard/InputWithLabel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { UPDATE_COMPANY_INFORMATIONS } from "@/requests/mutations/settings.mutation";
import { GET_COMPANY_INFORMATIONS } from "@/requests/queries/settings.query";
import { useMutation, useQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export default function CompanyInformationsForm() {
  const { user } = useAuth();

  const companyId = user?.companyId;

  const { data: companyData } = useQuery(GET_COMPANY_INFORMATIONS, {
    variables: { companyId: companyId },
    skip: !companyId,
    fetchPolicy: "no-cache",
  });

  const companyInformationsFormSchema = yup.object({
    companyName: yup
      .string()
      .min(2, "Le nom de l'entreprise doit comporter au moins 2 caractères")
      .required("Le nom de l'entreprise est requis"),
    companyAddress: yup
      .string()
      .min(2, "L'adresse de l'entreprise doit comporter au moins 2 caractères")
      .required("L'adresse de l'entreprise est requise"),
    companyZipCode: yup
      .string()
      .min(5, "Le code postal doit comporter au moins 5 caractères")
      .required("Le code postal est requis"),
    companyCity: yup
      .string()
      .min(2, "La ville doit comporter au moins 2 caractères")
      .required("La ville est requise"),
    companyPhone: yup
      .string()
      .min(10, "Le numéro de téléphone doit comporter au moins 10 caractères")
      .required("Le numéro de téléphone est requis"),
    companySiret: yup
      .string()
      .min(14, "Le SIRET doit comporter au moins 14 caractères")
      .required("Le SIRET est requis"),
  });

  type CompanyInformationsFormData = yup.InferType<
    typeof companyInformationsFormSchema
  >;

  const companyEmail = companyData?.company?.email || "";

  const defaultValues = {
    companyName: companyData?.company?.name || "",
    companyAddress: companyData?.company?.address || "",
    companyZipCode: companyData?.company?.postalCode || "",
    companyCity: companyData?.company?.city || "",
    companyPhone: companyData?.company?.phone || "",
    companySiret: companyData?.company?.siret || "",
  };

  const [
    updateCompanyInformations,
    { loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_COMPANY_INFORMATIONS);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isDirty, errors },
  } = useForm<CompanyInformationsFormData>({
    resolver: yupResolver(companyInformationsFormSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: CompanyInformationsFormData) => {
    await updateCompanyInformations({
      variables: {
        data: {
          id: companyId,
          name: data.companyName,
          address: data.companyAddress,
          postalCode: data.companyZipCode,
          city: data.companyCity,
          phone: data.companyPhone,
          siret: data.companySiret,
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

    reset(data);
  };

  useEffect(() => {
    if (companyData?.company) {
      reset({
        companyName: companyData.company.name ?? "",
        companyAddress: companyData.company.address ?? "",
        companyZipCode: companyData.company.postalCode ?? "",
        companyCity: companyData.company.city ?? "",
        companyPhone: companyData.company.phone ?? "",
        companySiret: companyData.company.siret ?? "",
      });
    }
  }, [companyData, reset]);

  return (
    <>
      <div className="flex gap-4 w-full">
        <InputWithLabel
          label="Nom de l'entreprise"
          type="text"
          placeholder="Company Inc."
          required
          {...register("companyName")}
          error={errors.companyName?.message}
        />
        <InputWithLabel
          label="SIRET de l'entreprise"
          type="text"
          placeholder="12345678901234"
          required
          {...register("companySiret")}
          error={errors.companySiret?.message}
        />
      </div>
      <InputWithLabel
        label="Adresse de l'entreprise"
        type="text"
        placeholder="123 Main St"
        required
        {...register("companyAddress")}
        error={errors.companyAddress?.message}
      />
      <div className="flex gap-4 w-full">
        <InputWithLabel
          label="Code postal"
          type="text"
          placeholder="75001"
          required
          {...register("companyZipCode")}
          error={errors.companyZipCode?.message}
        />
        <InputWithLabel
          label="Ville"
          type="text"
          placeholder="Paris"
          required
          {...register("companyCity")}
          error={errors.companyCity?.message}
        />
      </div>
      <div className="flex gap-4 w-full">
        <InputWithLabel
          label="Adresse e-mail"
          name="email"
          type="email"
          placeholder="admin@company.com"
          required
          disabled
          value={companyEmail}
        />
        <InputWithLabel
          label="Numéro de téléphone"
          type="text"
          placeholder="0123456789"
          required
          {...register("companyPhone")}
          error={errors.companyPhone?.message}
        />
      </div>
      <Button
        onClick={handleSubmit(onSubmit)}
        disabled={!isValid || !isDirty || updateLoading}
        className="mt-2"
      >
        Enregistrer les informations de l'entreprise
      </Button>
    </>
  );
}
