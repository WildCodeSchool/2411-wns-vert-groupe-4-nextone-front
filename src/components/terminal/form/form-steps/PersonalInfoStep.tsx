import InputWithLabel from "@/components/dashboard/InputWithLabel";
import type { FormStepProps } from "@/types/terminal";

export default function PersonalInfoStep({ formMethods }: FormStepProps) {
  const {
    register,
    formState: { errors },
  } = formMethods;

  return (
    <div className="flex flex-col gap-6 w-full max-w-[500px]">
      <InputWithLabel
        label="Votre nom ?"
        placeholder="Nom"
        error={errors.name?.message}
        {...register("name")}
      />

      <InputWithLabel
        label="Votre prénom ?"
        placeholder="Prénom"
        error={errors.firstName?.message}
        {...register("firstName")}
      />
    </div>
  );
}
