import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NavigationActions from "./NavigationActions";
import CompanyIllustration from "./CompanyIllustration";
import Stepper from "./Stepper";
import InputWithLabel from "../dashboard/InputWithLabel";
import { useTicket } from "@/context/useContextTicket";
import { ChooseServiceProps, ContactInfo } from "@/types/terminal";
import { useMutation } from "@apollo/client";
import { CREATE_TICKET } from "@/requests/mutations/ticket.mutation";
import { contactInfo } from "@/lib/validateSchema";

function ContactInformation({ onBack, onNext, onCancel }: ChooseServiceProps) {
  const { ticket, setTicket } = useTicket();
  const [generateTicket] = useMutation(CREATE_TICKET);

  const { register, handleSubmit, getValues, watch, formState: { errors } } = useForm<ContactInfo>({
    resolver: yupResolver(contactInfo),
    defaultValues: {
      email: ticket.email || "",
      phone: ticket.phone || "",
      rgpdAccepted: ticket.rgpdAccepted || false,
    },
  });

  const handleGenerateTicket = async (data: any) => {
    const { email, phone } = data;
    const { data: response } = await generateTicket({
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
    const generated = response.generateTicket;
    setTicket({ ...ticket, email, phone, rgpdAccepted: data.rgpdAccepted, code: generated.code });
    return generated.code;
  };

  const onSubmit = async (data: any) => {
    await handleGenerateTicket(data);
    onNext?.();
  };
  
  const setTicketForGenerate = () => {
    setTicket({
      ...ticket,                     
      email: getValues("email"),   
      phone: getValues("phone"),
      rgpdAccepted: getValues("rgpdAccepted") ?? false
    })
  }

  const rgpdChecked = watch("rgpdAccepted");

  return (
    <div className="flex flex-col md:flex-row h-screen w-full font-sans bg-white">
      <div className="w-full md:w-1/2 flex flex-col p-4 md:pl-8 overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 pb-4">
          <Stepper currentStep={3} onCancel={onCancel} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 md:gap-6">
          <InputWithLabel label="Votre adresse mail" type="email" placeholder="Adresse mail" {...register("email")} error={errors.email?.message}/>
          <InputWithLabel label="Votre numéro de téléphone" type="tel" placeholder="Numéro de téléphone" {...register("phone")} error={errors.phone?.message}/>
          <div className="flex flex-col items-start mt-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" {...register("rgpdAccepted")} className="w-4 h-4 accent-primary"/>
              J'accepte la politique de confidentialité et RGPD
            </label>
            {errors.rgpdAccepted && (
              <span className="text-red-600 text-sm mt-1">{errors.rgpdAccepted.message}</span>
            )}
            {rgpdChecked && !errors.rgpdAccepted && (
              <span className="text-green-600 text-sm mt-1">
                En cochant cette case, vous acceptez que vos données personnelles soient utilisées
                pour gérer votre ticket et la communication avec vous conformément à notre politique
                de confidentialité.
              </span>
            )}
          </div>
          <NavigationActions onBack={onBack} onNext={handleSubmit(onSubmit)} updateTicket={() => setTicketForGenerate()}/>
        </form>
      </div>
      <CompanyIllustration />
    </div>
  );
}

export default ContactInformation;
