import NavigationActions from "./NavigationActions";
import CompanyIllustration from "./CompanyIllustration";
import Stepper from "./Stepper";
import InputWithLabel from "../dashboard/InputWithLabel";
import { useState } from "react";
import { useTicket } from "@/context/useContextTicket";
import { ChooseServiceProps } from "@/types/terminal";

function PersonnalInformation({ onBack, onNext, onCancel }: ChooseServiceProps) {
    const [name, setName] = useState("");
    const [firstName, setFirstName] = useState("");
    const { ticket, setTicket } = useTicket();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTicket({ ...ticket, name, firstName });
    };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full font-sans bg-white">
        <div className="w-full md:w-1/2 flex flex-col p-4 md:pl-8 overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 pb-4">
                <Stepper currentStep={2} onCancel={onCancel}/>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6">
                <InputWithLabel label="Votre nom" name="name" type="text" placeholder="Nom" required value={name} onChange={(e) => setName(e.target.value)}/>
                <InputWithLabel label="Votre prénom" name="firstName" type="text" placeholder="Prénom" required value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
            </form>
            <NavigationActions onBack={onBack} onNext={onNext} />
        </div>
        <CompanyIllustration />
    </div>
  );
}

export default PersonnalInformation;
