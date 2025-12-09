import InputWithLabel from "@/components/dashboard/InputWithLabel";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useCompany } from "@/context/CompanyContext";
import placeholderCompany from "@/assets/images/placeholderCompany.jpg";
import { url_api } from "@/main";

export default function CompanyLogoForm() {
  const companyLogoSchema = yup.object().shape({
    logo: yup
      .mixed()
      .required("Vous devez sélectionner un fichier")
      .test("fileSize", "Le fichier est trop volumineux", (value) => {
        if (!value) return true;
        const files = value as FileList;
        return files && files[0].size <= 2000000;
      })
      .test(
        "type",
        "Uniquement les formats suivants: .jpeg, .jpg, .png",
        (value) => {
          if (!value) return true;
          const files = value as FileList;
          return (
            files &&
            (files[0].type === "image/jpeg" ||
              files[0].type === "image/jpg" ||
              files[0].type === "image/png")
          );
        }
      ),
  });

  type CompanyLogoFormData = yup.InferType<typeof companyLogoSchema>;

  const { register, handleSubmit, formState: { isValid, errors } } = useForm<CompanyLogoFormData>({ resolver: yupResolver(companyLogoSchema), mode: "onChange" });

  const { company, getCompany } = useCompany();

  const onSubmit = async (data: CompanyLogoFormData) => {
    if (!data.logo || !(data.logo instanceof FileList)) return;
    const file = data.logo[0];
    const formData = new FormData();
    formData.append("file", file);
      try {
      const response = await fetch(`${url_api}companies/${company?.id}/logo`, {
        method: "PUT",
        body: formData,
        credentials: "include", 
      });
      const result = await response.json();
      if (response.ok) {
        getCompany()
      } else {
        console.error("Erreur :", result.error);
      }
    } catch (error) {
      console.error("Erreur fetch :", error);
    }
  };

  return (
    <>
      <InputWithLabel label="Logo de l'entreprise" {...register("logo")} type="file" accept="image/png, image/jpeg" className="text-base! font-normal bg-transparent! shadow-none! w-full" error={errors.logo?.message}>
       <img src={company?.logoCompany
        ? `${url_api}files/${encodeURIComponent(company.logoCompany)}`
        : placeholderCompany } alt="Aperçu logo" className="w-32 h-32 mb-2 rounded-full object-cover"/>
      </InputWithLabel>
      <Button onClick={handleSubmit(onSubmit)} disabled={!isValid}>
        Enregistrer le logo
      </Button>
    </>
  );
}
