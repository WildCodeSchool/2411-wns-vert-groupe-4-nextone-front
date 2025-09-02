import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import NavigationActions from "./NavigationActions";
import CompanyIllustration from "./CompanyIllustration";
import Stepper from "./Stepper";

const services = ["Neurologie", "Cardiologie", "Maternité", "Dermatologie"];
const defaultValue = "Neurologie";

type ChooseServiceProps = {
  onBack: () => void;
  onNext: () => void;
};

function ChooseService({ onBack, onNext }: ChooseServiceProps) {
  return (
    <div className="flex h-screen w-full font-sans bg-white pl-8">
      <div className="w-1/2 flex flex-col justify-center gap-8">
        <Stepper currentStep={1} />
        <h2 className="text-[22px] text-left">
          Quel service souhaitez-vous visiter ?
        </h2>
        <Tabs defaultValue={defaultValue} className="w-full">
          <TabsList className="grid grid-cols-2 gap-4 w-full">
            {services.map((service) => (
              <TabsTrigger
                key={service}
                value={service}
                className={cn(
                  "w-full text-[20px] text-primary py-6 rounded-md border border-primary text-center",
                  "data-[state=active]:bg-primary data-[state=active]:text-white"
                )}
              >
                {service}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <NavigationActions onBack={onBack} onNext={onNext} />
      </div>
      <CompanyIllustration />
    </div>
  );
}

export default ChooseService;
