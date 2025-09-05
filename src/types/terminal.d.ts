type StepControlsProps = {
  onBack: string;
  onNext: string;
}

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
}

type ChooseServiceProps = {
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
};

export type Screen = "home" | "chooseService" | "persoInfo" | "contactInfo" | "successTicketPage" | "phone";
