import NavigationActions from "./NavigationActions";
import CompanyIllustration from "./CompanyIllustration";
import Stepper from "./Stepper";
import InputWithLabel from "../dashboard/InputWithLabel";
import { useState } from "react";
import { useTicket } from "@/context/useContextTicket";
import { ChooseServiceProps } from "@/types/terminal";

function ContactInfo({ onBack, onNext }: ChooseServiceProps) {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const { ticket, setTicket } = useTicket();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTicket({ ...ticket, email, phone });
    };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full font-sans bg-white">
        <div className="w-full md:w-1/2 flex flex-col p-4 md:pl-8 overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 pb-4">
                <Stepper currentStep={3} />
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6">
                <InputWithLabel label="Votre adresse mail" name="mail" type="email" placeholder="Adresse mail" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                <InputWithLabel label="Votre numéro de téléphone" name="phone" type="tel" placeholder="Numéro de téléphone" required value={phone} onChange={(e) => setPhone(e.target.value)}/>
            </form>
            <NavigationActions onBack={onBack} onNext={onNext} />
        </div>
        <CompanyIllustration />
    </div>
  );
}

export default ContactInfo;
