import { Button } from "@/components/ui/button";

export type StepControlsProps = {
  onBack?: () => void;
  onNext?: () => void;
  updateTicket?: () => void;
};

function NavigationActions({ onBack, onNext, updateTicket }: StepControlsProps) {
  const handleNext = () => {
    updateTicket?.();
    onNext?.();
  };

  const handleBack = () => {
    updateTicket?.();
    onBack?.();
  };

  return (
    <div className="flex max-w-md mt-6 space-x-9">
      <Button onClick={handleBack} variant="ghost" className="text-primary text-[20px]">
        Retour
      </Button>
      <Button onClick={handleNext} className="text-[20px]">
        Continuer
      </Button>
    </div>
  );
}

export default NavigationActions;
