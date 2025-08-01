import { clsx } from "clsx";

const steps = [
  { label: "Choix du service" },
  { label: "Informations personnelles" },
  { label: "Coordonnées" },
];

function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="w-full mx-auto pb-25">
      <div className="flex justify-between mb-6 relative z-20">
        {steps.map((step, i) => {
          const stepNumber = i + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          return (
            <div key={step.label} className="flex flex-col items-center w-1/3">
              <div
                className={clsx("w-8 h-8 rounded-full flex items-center justify-center border-2",
                  { "bg-primary text-white border-primary": isActive || isCompleted,
                    "bg-white text-gray-500 border-gray-300": !isActive && !isCompleted})}>
                {stepNumber}
              </div>
              <span className={clsx("mt-2 text-sm text-center", {
                "text-primary font-semibold": isActive || isCompleted,
                "text-gray-500": !isActive && !isCompleted})}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="relative h-1 bg-gray-300 rounded-full">
        <div className="absolute top-0 left-0 h-1 bg-primary rounded-full transition-all duration-300" style={{ width: `${(currentStep / steps.length) * 100}%` }}/>
      </div>
    </div>
  );
}

export default Stepper;