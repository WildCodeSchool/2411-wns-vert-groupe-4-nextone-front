import { useState } from "react";
import NavigationActions from "./NavigationActions";
import CompanyIllustration from "./CompanyIllustration";
import Stepper from "./Stepper";
import InputWithLabel from "../dashboard/InputWithLabel";
import { useTicket } from "@/context/useContextTicket";
import { ChooseServiceProps } from "@/types/terminal";
import { useMutation } from "@apollo/client";
import { CREATE_TICKET } from "@/requests/mutations/ticket.mutation";

function ContactInfo({ onBack, onNext, onCancel }: ChooseServiceProps) {
  const { ticket, setTicket } = useTicket();
  const [email, setEmail] = useState(ticket.email || "");
  const [phone, setPhone] = useState(ticket.phone || "");
  const [rgpdAccepted, setRgpdAccepted] = useState(ticket.rgpdAccepted || false);
  const [generateTicket] = useMutation(CREATE_TICKET);

  const handleGenerateTicket = async () => {
    const { data } = await generateTicket({
      variables: {
        data: {
          serviceId: ticket.serviceId,
          firstName: ticket.firstName,
          lastName: ticket.name,
          email,
          phone,
        },
      },
    });
    const generated = data.generateTicket;
    setTicket({...ticket, email, phone, rgpdAccepted, code: generated.code});
    return generated.code; 
  };

  const handleNext = async () => {
    if (!rgpdAccepted) return alert("Vous devez accepter la politique RGPD.");
    setTicket({ ...ticket, email, phone, rgpdAccepted });
    await handleGenerateTicket();
    onNext?.();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full font-sans bg-white">
      <div className="w-full md:w-1/2 flex flex-col p-4 md:pl-8 overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 pb-4">
          <Stepper currentStep={3} onCancel={onCancel} />
        </div>
        <form className="flex flex-col gap-4 md:gap-6">
          <InputWithLabel label="Votre adresse mail" name="mail" type="email" placeholder="Adresse mail" required value={email} onChange={e => setEmail(e.target.value)} />
          <InputWithLabel label="Votre numéro de téléphone" name="phone" type="tel" placeholder="Numéro de téléphone" required value={phone} onChange={e => setPhone(e.target.value)} />
          <div className="flex flex-col items-start mt-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={rgpdAccepted} onChange={e => setRgpdAccepted(e.target.checked)} className="w-4 h-4 accent-primary" />
              J'accepte la politique de confidentialité et RGPD
            </label>
            {rgpdAccepted && <span className="text-green-600 text-sm mt-1">En cochant cette case, vous acceptez que vos données personnelles soient utilisées pour gérer votre ticket et la communication avec vous conformément à notre politique de confidentialité.</span>}
          </div>
        </form>
        <NavigationActions onBack={onBack} onNext={handleNext} updateTicket={() => setTicket({ ...ticket, email, phone, rgpdAccepted })} />
      </div>
      <CompanyIllustration />
    </div>
  );
}

export default ContactInfo;
