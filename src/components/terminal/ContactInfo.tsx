import NavigationActions from "./NavigationActions";
import CompanyIllustration from "./CompanyIllustration";
import Stepper from "./Stepper";
import InputWithLabel from "../dashboard/InputWithLabel";
import { useState } from "react";

type ChooseServiceProps = {
  onBack: () => void;
  onNext: () => void;
};

function ContactInfo({ onBack, onNext }: ChooseServiceProps) {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ email, phone });
        // Appeler le resolver GraphQL de login ici
    };

    return (
        <div className="flex h-screen w-full font-sans bg-white pl-8">
        <div className="w-1/2 flex flex-col justify-center gap-8">
            <Stepper currentStep={3} />
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <InputWithLabel label="Votre adresse mail" name="mail" type="email" placeholder="Adresse mail" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                <InputWithLabel label="Votre numéro de téléphone" name="phone" type="phone" placeholder="Numéro de téléphone" required value={phone} onChange={(e) => setPhone(e.target.value)}/>
            </form>
            <NavigationActions onBack={onBack} onNext={onNext} />
        </div>
        <CompanyIllustration />
        </div>
    );
}

export default ContactInfo;
