import { useTicket } from "@/context/useContextTicket";
import success from "../../../../assets/success.png";

export default function ConfirmationStep() {
  const { ticket } = useTicket();

  return (
    <div className="w-full md:w-1/2 flex flex-col gap-4 md:gap-5 items-center mt-4 md:mt-[20px]">
      <img
        src={success}
        alt="succès"
        className="w-18 md:w-25 mx-auto object-contain"
      />
      <p className="text-lg md:text-[30px] font-semibold text-center">
        C’est fait ! <br></br>Vous êtes dans la file.
      </p>
      <p className="text-sm md:text-[20px] font-medium">
        Votre numéro de ticket :
      </p>
      <div className="bg-primary flex items-center justify-center text-white text-l p-4 px-4 font-bold rounded-md">
        <span className="text-[35px]" data-testid="ticket-number">
          {ticket.code}
        </span>
      </div>
      <p className="text-xs md:text-[20px] font-medium text-center mt-10">
        Surveillez l’écran dans la salle d'attente pour suivre votre ticket.
      </p>
    </div>
  );
}
