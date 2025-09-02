import NavigationActions from "./NavigationActions";
import CompanyIllustration from "./CompanyIllustration";
import Stepper from "./Stepper";
import InputWithLabel from "../dashboard/InputWithLabel";
import { useState } from "react";

type ChooseServiceProps = {
  onBack: () => void;
  onNext: () => void;
};

function PersonnalInformation({ onBack, onNext }: ChooseServiceProps) {
    const [name, setName] = useState("");
    const [firstName, setFirstName] = useState("");
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ name, firstName });
        // Appeler le resolver GraphQL de login ici
    };

    return (
        <div className="flex h-screen w-full font-sans bg-white pl-8">
        <div className="w-1/2 flex flex-col justify-center gap-8">
            <Stepper currentStep={2} />
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <InputWithLabel label="Votre nom" name="name" type="text" placeholder="Nom" required value={name} onChange={(e) => setName(e.target.value)}/>
                <InputWithLabel label="Votre prénom" name="firstName" type="password" placeholder="Prénom" required value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
            </form>
            <NavigationActions onBack={onBack} onNext={onNext} />
        </div>
        <CompanyIllustration />
        </div>
    );
}

export default PersonnalInformation;
