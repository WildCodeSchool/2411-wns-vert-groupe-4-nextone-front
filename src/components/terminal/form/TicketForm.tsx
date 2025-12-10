import Stepper from "@/common/terminal/Stepper";
import ServiceStep from "./form-steps/ServiceStep";
import PersonalInfoStep from "./form-steps/PersonalInfoStep";
import ContactInfoStep from "./form-steps/ContactInfoStep";
import { useForm } from "react-hook-form";
import { object, string, boolean } from "yup";
import { useMutation } from "@apollo/client";
import { CREATE_TICKET } from "@/requests/mutations/ticket.mutation";
import { useIPCompany } from "@/context/IPCompanyContext";
import FormButtons from "@/components/terminal/form/FormButtons";
import { TicketFormData } from "@/types/terminal";
import { useRef } from "react";
import { useTicket } from "@/context/useContextTicket";

export default function TicketForm({
  formStep,
  setFormStep,
  onSuccess,
}: {
  formStep: number;
  setFormStep: React.Dispatch<React.SetStateAction<number>>;
  onSuccess?: () => void;
}) {
  useIPCompany();
  const { setTicket } = useTicket();

  const getStoredFormData = (): Partial<TicketFormData> => {
    const stored = sessionStorage.getItem("ticketFormData");
    return stored ? JSON.parse(stored) : {};
  };

  const formDataRef = useRef<Partial<TicketFormData>>(getStoredFormData());

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
      .matches(
        /^(\+?\d{1,3}[-.\s]?)?\d{9,14}$/,
        "Le numéro de téléphone n'est pas valide"
      )
      .min(10, "Le numéro de téléphone est trop court")
      .max(20, "Le numéro de téléphone est trop long")
      .required("Le numéro de téléphone est requis"),
    rgpdAccepted: boolean()
      .oneOf([true], "Vous devez accepter les conditions")
      .required("Vous devez accepter les conditions"),
  });

  const methods = useForm<TicketFormData>({
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: formDataRef.current,
  });

  const [createTicket, { loading: creatingTicket }] = useMutation(
    CREATE_TICKET,
    {
      onCompleted: (data) => {
        console.log("✅ Ticket créé:", data.generateTicket);
        if (data.generateTicket) {
          setTicket(data.generateTicket);
        }
        sessionStorage.removeItem("ticketFormData");
        if (onSuccess) onSuccess();
      },
      onError: (error) => {
        console.error("❌ Erreur création ticket:", error);
        alert("Erreur lors de la création du ticket. Veuillez réessayer.");
      },
    }
  );

  const handleNext = async () => {
    console.log("🔴 handleNext APPELÉ !");
    const currentStepData = methods.getValues();
    console.log("📊 Valeurs de l'étape actuelle:", currentStepData);

    formDataRef.current = { ...formDataRef.current, ...currentStepData };

    sessionStorage.setItem(
      "ticketFormData",
      JSON.stringify(formDataRef.current)
    );
    console.log("📦 Toutes les valeurs accumulées:", formDataRef.current);

    let schema;
    if (formStep === 1) {
      schema = formStep1SchemaValidation;
    } else if (formStep === 2) {
      schema = formStep2SchemaValidation;
    } else if (formStep === 3) {
      schema = formStep3SchemaValidation;
    }

    try {
      if (schema) {
        await schema.validate(currentStepData, { abortEarly: false });
      }
      console.log("✅ Validation OK, passage à l'étape suivante");

      if (formStep < 3) {
        setFormStep(formStep + 1);
      } else {
        console.log("📤 Soumission du formulaire:", formDataRef.current);

        createTicket({
          variables: {
            data: {
              serviceId: formDataRef.current.serviceId,
              firstName: formDataRef.current.firstName,
              lastName: formDataRef.current.name,
              email: formDataRef.current.email,
              phone: formDataRef.current.phone,
            },
          },
        });
      }
    } catch (error: any) {
      console.log("❌ Validation Yup échouée:", error);
      if (error.inner && error.inner.length > 0) {
        error.inner.forEach((err: any) => {
          if (err.path) {
            methods.setError(err.path, {
              type: "manual",
              message: err.message,
            });
          }
        });
      }
    }
  };

  const handleBack = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
    } else {
      sessionStorage.removeItem("ticketFormData");
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
