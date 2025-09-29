import { Button } from "@/components/ui/button";

export type StepControlsProps = {
  onBack?: () => void;
  onNext?: () => void;
  onCancel?: () => void;
  updateTicket?: () => void;
};

function NavigationActions({ onBack, onNext, onCancel, updateTicket }: StepControlsProps) {
  const handleNext = () => {
    updateTicket?.();
    onNext?.();
  };

  const handleBack = () => {
    updateTicket?.();
    onBack?.();
  };

  return (
    <div className="flex w-full items-center justify-between mt-6">
      <div className="flex space-x-9">
        <Button type="button" onClick={handleBack} variant="ghost" className="text-primary text-[17px] p-6">
          Retour
        </Button>
        <Button type="submit" onClick={handleNext} className="text-[17px] p-6">
          Continuer
        </Button>
      </div>
      {onCancel && (
        <Button type="button" onClick={onCancel} variant="ghost" className="text-primary text-[17px] p-6">
          Annuler
        </Button>
      )}
    </div>
  );
}

export default NavigationActions;
