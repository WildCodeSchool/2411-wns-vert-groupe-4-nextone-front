import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import NavigationActions from "./NavigationActions";
import CompanyIllustration from "./CompanyIllustration";
import Stepper from "./Stepper";
import InputWithLabel from "../dashboard/InputWithLabel";
import { useTicket } from "@/context/useContextTicket";
import { ChooseServiceProps } from "@/types/terminal";
import { PersoInfo } from "@/types/terminal";
import {persoInfo} from "../../lib/validateSchema"

function PersonnalInformation({ onBack, onNext, onCancel }: ChooseServiceProps) {
  const { ticket, setTicket } = useTicket();

  const { register, handleSubmit, formState: { errors }} = useForm<PersoInfo>({
    resolver: yupResolver(persoInfo),
    defaultValues: {
      name: ticket.name || "",
      firstName: ticket.firstName || "",
    },
  });

  const onSubmit = (data: PersoInfo) => {
    setTicket({ ...ticket, ...data });
    onNext();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full font-sans bg-white">
      <div className="w-full md:w-1/2 flex flex-col p-4 md:pl-8 overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 pb-4">
          <Stepper currentStep={2} onCancel={onCancel} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 md:gap-6">
          <InputWithLabel label="Votre nom" placeholder="Nom" error={errors.name?.message}{...register("name")}/>
          <InputWithLabel label="Votre prénom" placeholder="Prénom" error={errors.firstName?.message} {...register("firstName")}/>
          <NavigationActions onBack={onBack}/>
        </form>
      </div>

      <CompanyIllustration />
    </div>
  );
}

export default PersonnalInformation;
