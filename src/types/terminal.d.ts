import type { ApolloError } from "@apollo/client";
import type { UseFormReturn } from "react-hook-form";

type StepControlsProps = {
  onBack: string;
  onNext: string;
};

interface StepperProps {
  currentStep: number;
}

export type Service = {
  id: string;
  name: string;
  isGloballyActive: boolean;
};

type PersoInfo = {
  name: string;
  firstName: string;
};

type ContactInfo = {
  email: string;
  phone: string;
  rgpdAccepted: boolean;
};

type ChooseServiceProps = {
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
};

export type Screen =
  | "home"
  | "chooseService"
  | "persoInfo"
  | "contactInfo"
  | "successTicketPage"
  | "phone";

export type Company = {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  logoCompany?: string;
  siret: string;
  email: string;
};

type IPCompanyContextType = {
  company: Company | null;
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => void;
};

export type TicketFormData = {
  serviceId: string;
} & PersoInfo &
  ContactInfo;

export type FormStepProps = {
  formMethods: UseFormReturn<TicketFormData>;
};
