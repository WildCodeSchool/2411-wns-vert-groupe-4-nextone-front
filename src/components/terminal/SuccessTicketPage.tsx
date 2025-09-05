import { useEffect } from "react";
import CompanyIllustration from "./CompanyIllustration";
import success from "../../assets/success.png";
import QRCode from "react-qr-code";
import { useTicket } from "@/context/useContextTicket";

function SuccessTicketPage({isScanned, onTimeout}: {isScanned: boolean; onTimeout: () => void;}) {
    const { ticket } = useTicket();

    useEffect(() => {
        if (isScanned) {
        const timer = setTimeout(() => onTimeout(), 10000);
        return () => clearTimeout(timer);
        }
    }, [isScanned, onTimeout]);

    const qrValue = `${window.location.origin}/terminal?screen=phone&scanned=true&ticketId=${ticket.id}&ticket=${encodeURIComponent(JSON.stringify(ticket))}`;

    return (
        <div className="flex flex-col md:flex-row h-screen w-full font-sans bg-white p-4 md:pl-8">
            <div className="w-full md:w-1/2 flex flex-col gap-4 md:gap-5 items-center mt-4 md:mt-[20px]">
                <img src={success} alt="succès" className="w-24 sm:w-32 md:w-40 h-auto mx-auto object-contain" />
                <p className="text-lg md:text-[25px] font-semibold text-center">
                    C’est fait ! <br></br>Vous êtes dans la file.
                </p>
                <p className="text-sm md:text-[15px] font-medium">Votre numéro de ticket :</p>
                <div className="bg-primary flex items-center justify-center text-white text-l p-4 font-bold rounded-md w-[100px] md:w-[120px] h-[45px] md:h-[50px]">
                    {ticket.code}
                </div>
                {!isScanned && (
                <>
                    <p className="text-xs md:text-[12px] font-medium text-center">
                    Surveillez l’écran d’appel,<br></br> ou scannez ce QR code pour suivre la file<br></br>
                    depuis votre téléphone :
                    </p>
                    <QRCode value={qrValue} size={120} fgColor="#000000" />
                </>
                )}
            </div>
            <CompanyIllustration />
            </div>
        );
}

export default SuccessTicketPage;
