import InputWithLabel from "@/components/dashboard/InputWithLabel";
import type { FormStepProps } from "@/types/terminal";

export default function ContactInfoStep({ formMethods }: FormStepProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = formMethods;

  const rgpdChecked = watch("rgpdAccepted");

  return (
    <div className="flex flex-col gap-6 w-full max-w-[500px]">
      <InputWithLabel
        label="Votre email ?"
        placeholder="exemple@email.com"
        type="email"
        error={errors.email?.message}
        {...register("email")}
        data-testid="email-input"
      />

      <InputWithLabel
        label="Votre numéro de téléphone ?"
        placeholder="+33 6 12 34 56 78"
        type="tel"
        error={errors.phone?.message}
        {...register("phone")}
        data-testid="phone-input"
      />
      <div className="flex flex-col items-start mt-2">
        {" "}
        <label className="flex items-center gap-2 text-sm text-gray-700">
          {" "}
          <input
            type="checkbox"
            {...register("rgpdAccepted")}
            className="w-4 h-4 accent-primary"
            data-testid="rgpd-checkbox"
          />
          J'accepte la politique de confidentialité et RGPD{" "}
        </label>{" "}
        {errors.rgpdAccepted && (
          <span className="text-red-600 text-sm mt-1">
            {errors.rgpdAccepted.message}{" "}
          </span>
        )}{" "}
        {rgpdChecked && !errors.rgpdAccepted && (
          <span className="text-green-600 text-sm mt-1">
            personnelles soient utilisées pour gérer votre ticket et la
            communication avec vous conformément à notre politique de
            confidentialité.{" "}
          </span>
        )}{" "}
      </div>
    </div>
  );
}
