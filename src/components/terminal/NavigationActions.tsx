import { Button } from "@/components/ui/button";

export type StepControlsProps = {
  onBack: () => void;
  onNext: () => void;
};

function NavigationActions({ onBack, onNext }: StepControlsProps) {
  return (
    <div className="flex max-w-md mt-6 space-x-9">
        <Button onClick={onBack} variant="ghost" className="text-primary text-[20px]">
            Retour
        </Button>
        <Button onClick={onNext} className="text-[20px]">
            Continuer
        </Button>
    </div>
  );
}

export default NavigationActions;

