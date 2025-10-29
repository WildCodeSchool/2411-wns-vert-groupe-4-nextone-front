import { StepperProps } from "@/types/terminal";
import { clsx } from "clsx";

const steps = [
  { label: "Choix du service" },
  { label: "Informations personnelles" },
  { label: "Coordonnées" },
];

interface StepperWithCancelProps extends StepperProps {
  onCancel?: () => void;
}

function Stepper({ currentStep, onCancel }: StepperWithCancelProps) {
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-3">
        {steps.map((step, i) => {
          const stepNumber = i + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          return (
            <div key={step.label} className="flex flex-col items-center">
              <div className={clsx( "w-8 h-8 rounded-full flex items-center justify-center border-2 z-10",
                  { "bg-primary text-white border-primary": isActive || isCompleted,
                    "bg-white text-gray-400 border-gray-300": !isActive && !isCompleted,
                  })}>
                {stepNumber}
              </div>
              <span className={clsx("mt-2 text-xs md:text-sm text-center", { 
                  "text-primary font-semibold": isActive || isCompleted,
                  "text-gray-400": !isActive && !isCompleted})}>
                {step.label}
              </span>
            </div>
          )})}
      </div>
      <div className="h-1 bg-gray-300 rounded-full">
        <div className="h-1 bg-primary rounded-full transition-all duration-300" style={{ width: `${(currentStep / steps.length) * 100}%` }}/>
      </div>
      {onCancel && (
        <div className="mt-4 flex justify-start">
          <button onClick={onCancel} className="px-5 py-2 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors duration-300 shadow-sm">
            Annuler
          </button>
        </div>
      )}
    </div>
  );
}

export default Stepper;
