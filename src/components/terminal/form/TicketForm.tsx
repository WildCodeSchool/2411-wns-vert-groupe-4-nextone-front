import Stepper from "@/common/terminal/Stepper";
import ServiceStep from "./form-steps/ServiceStep";
import { useForm } from "react-hook-form";
import { InferType, object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function TicketForm({
  formStep,
  setFormStep,
}: {
  formStep: number;
  setFormStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const formStep1SchemaValidation = object({
    serviceId: string().uuid().required("Le service est requis"),
  });

  const formStep2SchemaValidation = object({
    customerLastName: string()
      .min(1, "Le nom est trop court")
      .max(100, "Le nom est trop long")
      .required("Le nom est requis"),
    customerFirstName: string()
      .min(1, "Le prénom est trop court")
      .max(100, "Le prénom est trop long")
      .required("Le prénom est requis"),
  });

  const formStep3SchemaValidation = object({
    customerEmail: string()
      .email("L'email n'est pas valide")
      .max(255, "L'email est trop long")
      .required("L'email est requis"),
    customerPhone: string()
      .matches(/^\+?[1-9]\d{1,14}$/, "Le numéro de téléphone n'est pas valide")
      .max(15, "Le numéro de téléphone est trop long")
      .required("Le numéro de téléphone est requis"),
  });

  const ticketFormSchemaValidation = formStep1SchemaValidation
    .concat(formStep2SchemaValidation)
    .concat(formStep3SchemaValidation);

  type TicketFormData = InferType<typeof ticketFormSchemaValidation>;

  const methods = useForm<TicketFormData>({
    mode: "onChange",
    resolver: yupResolver(ticketFormSchemaValidation),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [isStepValid, setIsStepValid] = useState(false);

  const stepFields: Record<number, (keyof TicketFormData)[]> = {
    1: ["serviceId"],
    2: ["customerLastName", "customerFirstName"],
    3: ["customerEmail", "customerPhone"],
  };

  const handleNext = () => {
    // if (!isStepValid) return;
    console.log(
      "Handling next for step:",
      formStep,
      "with isStepValid:",
      isStepValid
    );

    if (formStep < 3) {
      setFormStep(formStep + 1);
    } else {
      handleSubmit((data: TicketFormData) => {
        console.log("Form submitted with data:", data);
      })();
    }
  };

  const handleBack = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
    }
  };

  const handleCancel = () => {
    setFormStep(0);
  };

  useEffect(() => {
    const subscription = methods.watch((values) => {
      const fields = stepFields[formStep];
      const valid = fields.every((field) => !errors[field] && !!values[field]);
      setIsStepValid(valid);
    });
    return () => subscription.unsubscribe();
  }, [methods, formStep]);

  const StepForm = () => {
    switch (formStep) {
      case 1:
        return <ServiceStep formMethods={methods} />;
      case 2:
        return <div>Step 2 Form Fields</div>;
      case 3:
        return <div>Step 3 Form Fields</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex-column w-full h-full">
      <Stepper currentStep={formStep} />
      <StepForm />
      <FormButtons
        isStepValid={isStepValid}
        onBack={handleBack}
        onNext={handleNext}
        onCancel={handleCancel}
      />
    </div>
  );
}

const FormButtons = ({
  isStepValid,
  onBack,
  onNext,
  onCancel,
}: {
  isStepValid: boolean;
  onBack: () => void;
  onNext: () => void;
  onCancel?: () => void;
}) => {
  return (
    <div className="flex w-full items-center justify-between mt-6">
      <div className="flex space-x-9">
        <Button
          type="button"
          onClick={onBack}
          variant="ghost"
          className="text-primary text-[17px] p-6"
        >
          Retour
        </Button>
        <Button onClick={onNext} className="text-[17px] p-6">
          Continuer
        </Button>
      </div>
      {onCancel && (
        <Button
          type="button"
          onClick={onCancel}
          variant="ghost"
          className="text-primary text-[17px] p-6"
          disabled={!isStepValid}
        >
          Annuler
        </Button>
      )}
    </div>
  );
};
