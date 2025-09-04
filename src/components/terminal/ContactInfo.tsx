import NavigationActions from "./NavigationActions";
import CompanyIllustration from "./CompanyIllustration";
import Stepper from "./Stepper";
import InputWithLabel from "../dashboard/InputWithLabel";
import { useState } from "react";
import { useTicket } from "@/context/useContextTicket";
import { ChooseServiceProps } from "@/types/terminal";

function ContactInfo({ onBack, onNext, onCancel }: ChooseServiceProps) {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const { ticket, setTicket } = useTicket();
const [rgpdAccepted, setRgpdAccepted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rgpdAccepted) {
      alert("Vous devez accepter la politique RGPD pour continuer.");
      return;
    }
    setTicket({ ...ticket, email, phone, rgpdAccepted });
    console.log({ email, phone, rgpdAccepted });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full font-sans bg-white">
        <div className="w-full md:w-1/2 flex flex-col p-4 md:pl-8 overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 pb-4">
                <Stepper currentStep={3} onCancel={onCancel}/>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6">
                <InputWithLabel label="Votre adresse mail" name="mail" type="email" placeholder="Adresse mail" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                <InputWithLabel label="Votre numéro de téléphone" name="phone" type="tel" placeholder="Numéro de téléphone" required value={phone} onChange={(e) => setPhone(e.target.value)}/>
                <div className="flex flex-col items-start mt-2">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" name="rgpd" required checked={rgpdAccepted} onChange={(e) => setRgpdAccepted(e.target.checked)} className="w-4 h-4 accent-primary"/>
                        J'accepte la politique de confidentialité et RGPD
                    </label>
                    {rgpdAccepted && (
                        <span className="text-green-600 text-sm mt-1">
                        En cochant cette case, vous acceptez que vos données personnelles soient utilisées pour gérer votre ticket et la communication avec vous conformément à notre politique de confidentialité.
                        </span>
                    )}
                </div>
            </form>
            <NavigationActions onBack={onBack} onNext={onNext} />
        </div>
        <CompanyIllustration />
    </div>
  );
}

export default ContactInfo;
