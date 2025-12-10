import Stepper from "@/common/terminal/Stepper";
import ServiceStep from "./form-steps/ServiceStep";
import PersonalInfoStep from "./form-steps/PersonalInfoStep";
import ContactInfoStep from "./form-steps/ContactInfoStep";
import { useForm } from "react-hook-form";
import { object, string, boolean } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@apollo/client";
import { CREATE_TICKET } from "@/requests/mutations/ticket.mutation";
import { useIPCompany } from "@/context/IPCompanyContext";
import FormButtons from "@/components/terminal/form/FormButtons";
import { TicketFormData } from "@/types/terminal";

const STEP_FIELDS = {
  1: ["serviceId"],
  2: ["name", "firstName"],
  3: ["email", "phone", "rgpdAccepted"],
} as const;

export default function TicketForm({
  formStep,
  setFormStep,
  onSuccess,
}: {
  formStep: number;
  setFormStep: React.Dispatch<React.SetStateAction<number>>;
  onSuccess?: () => void;
}) {
  const { company } = useIPCompany();

  const formStep1SchemaValidation = object({
    serviceId: string().uuid().required("Le service est requis"),
  });

  const formStep2SchemaValidation = object({
    name: string()
      .min(1, "Le nom est trop court")
      .max(100, "Le nom est trop long")
      .required("Le nom est requis"),
    firstName: string()
      .min(1, "Le prénom est trop court")
      .max(100, "Le prénom est trop long")
      .required("Le prénom est requis"),
  });

  const formStep3SchemaValidation = object({
    email: string()
      .email("L'email n'est pas valide")
      .max(255, "L'email est trop long")
      .required("L'email est requis"),
    phone: string()
      .matches(/^\+?[1-9]\d{1,14}$/, "Le numéro de téléphone n'est pas valide")
      .max(15, "Le numéro de téléphone est trop long")
      .required("Le numéro de téléphone est requis"),
    rgpdAccepted: boolean()
      .oneOf([true], "Vous devez accepter les conditions")
      .required("Vous devez accepter les conditions"),
  });

  const ticketFormSchemaValidation = formStep1SchemaValidation
    .concat(formStep2SchemaValidation)
    .concat(formStep3SchemaValidation);

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(ticketFormSchemaValidation),
  });

  const [createTicket, { loading: creatingTicket }] = useMutation(
    CREATE_TICKET,
    {
      onCompleted: (data) => {
        console.log("✅ Ticket créé:", data.createTicket);
        if (onSuccess) onSuccess();
      },
      onError: (error) => {
        console.error("❌ Erreur création ticket:", error);
        alert("Erreur lors de la création du ticket. Veuillez réessayer.");
      },
    }
  );

  const handleNext = async (data: TicketFormData) => {
    console.log("🔴 handleNext APPELÉ !");
    const fields = STEP_FIELDS[formStep as keyof typeof STEP_FIELDS];
    const isValid = await methods.trigger(fields, { shouldFocus: true });

    console.log("🔍 formStep:", formStep, "isValid:", isValid);
    if (!isValid) {
      console.log("❌ Validation RHF échouée.");
      return;
    }

    console.log("✅ Validation OK, passage à l'étape suivante");

    if (formStep < 3) {
      setFormStep(formStep + 1);
    } else {
      console.log("📤 Soumission du formulaire:", data);

      createTicket({
        variables: {
          data: {
            serviceId: data.serviceId,
            companyId: company?.id,
            customerLastName: data.name,
            customerFirstName: data.firstName,
            customerEmail: data.email,
            customerPhone: data.phone,
          },
        },
      });
    }
  };

  const handleBack = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
    } else {
      setFormStep(0);
    }
  };

  const handleCancel = () => {
    setFormStep(0);
  };

  const isLastStep = formStep === 3;

  const StepForm = () => {
    switch (formStep) {
      case 1:
        return <ServiceStep formMethods={methods} />;
      case 2:
        return <PersonalInfoStep formMethods={methods} />;
      case 3:
        return <ContactInfoStep formMethods={methods} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-column w-full h-full">
      <form onSubmit={methods.handleSubmit(handleNext)}>
        <Stepper currentStep={formStep} />
        <StepForm />
        <FormButtons
          onBack={handleBack}
          onCancel={handleCancel}
          loading={creatingTicket}
          isLastStep={isLastStep}
        />
      </form>
    </div>
  );
}
