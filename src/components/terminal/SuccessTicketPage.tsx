import CompanyIllustration from "./CompanyIllustration";
import success from "../../assets/success.png"
import { QrAtStart } from "@/utils/constants/terminal";
import QRCode from "react-qr-code";

function SuccessTicketPage() {
    return (
        <div className="flex h-screen w-full font-sans bg-white pl-8">
        <div className="w-1/2 flex flex-col gap-5 p-4 mt-[20px] items-center">
        <img src={success} alt="succès" className="w-32 sm:w-40 md:w-30 h-auto mx-auto object-contain"/>
            <p className="text-[25px] font-semibold">C’est fait !<br></br> Vous êtes dans la file.</p>
            <p className="text-[15px] font-medium">Votre numéro de ticket :</p>
            <div className="bg-primary flex items-center justify-center text-white text-xl font-bold"
                style={{
                    width: "120px",
                    height: "50px",
                    borderRadius: "10px",
                    padding: "15px 20px",
                }}>
                EU238
            </div>
            <p className="text-[12px] font-medium">Surveillez l’écran d’appel,<br></br> ou scannez ce QR code pour suivre la file<br></br> depuis votre téléphone :</p>
            <QRCode value={QrAtStart} size={120} fgColor="#000000" />
        </div>
        <CompanyIllustration />
    </div>
    )
}

export default SuccessTicketPage;