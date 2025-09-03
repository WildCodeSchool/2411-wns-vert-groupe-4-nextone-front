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

type ChooseServiceProps = {
  onBack: () => void;
  onNext: () => void;
};