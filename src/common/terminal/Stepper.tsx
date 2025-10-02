import { StepperProps } from "@/types/terminal";
import { clsx } from "clsx";
import steps from "../../utils/constants/steps";

function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        {steps.map((step, i) => {
          const stepNumber = i + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          return (
            <div key={step.label} className="flex flex-col items-center">
              <div data-testid={`step-circle-${stepNumber}`} className={clsx( "w-8 h-8 rounded-full flex items-center justify-center border-2 z-10",
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
        <div className="h-1 bg-primary rounded-full transition-all duration-300" role="progressbar" style={{ width: `${(currentStep / steps.length) * 100}%` }}/>
      </div>
    </div>
  );
}

export default Stepper;
