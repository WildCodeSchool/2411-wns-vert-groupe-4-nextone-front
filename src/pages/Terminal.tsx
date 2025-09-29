import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import logo from "../assets/logo.png";
import QRCode from "react-qr-code";
import CompanyIllustration from "@/common/terminal/CompanyIllustration";
import { getScreenComponent } from "@/components/terminal/Screens"; 
import { useTicket } from "@/context/useContextTicket";
import { emptyTicket } from "@/utils/constants/ticket";
import { Screen } from "@/types/terminal";

function Terminal() {
  const [searchParams] = useSearchParams();
  const { ticket, setTicket } = useTicket();
  const screenFromUrl = searchParams.get("screen") as Screen | null;
  const isScannedFromUrl = searchParams.get("scanned") === "true";
  const [currentScreen, setCurrentScreen] = useState<Screen>(screenFromUrl || "home");
  const [isScanned] = useState(isScannedFromUrl);

  const handleCancel = () => {
    setTicket(emptyTicket);
    setCurrentScreen("home");
  };

  useEffect(() => {
    if (currentScreen === "successTicketPage" && !isScanned) {
      const timer = setTimeout(() => {
        setTicket(emptyTicket);
        setCurrentScreen("home");
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, isScanned, ticket, setTicket]);


  if (currentScreen !== "home") {
    return getScreenComponent(currentScreen, { setCurrentScreen, handleCancel, isScanned });
  }

  return (
    <div className="h-screen flex flex-col md:flex-row bg-white font-[Archivo]">
      <div className="w-full md:w-1/2 p-4 flex flex-col justify-start items-center gap-4 mt-4 md:mt-10">
        <img src={logo} alt="logo" className="h-10 md:h-14 opacity-100" />
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8">Bienvenue</h1>
        <p className="text-center text-base md:text-lg">
          Rejoignez la file d’attente directement
          <br />
          depuis cette borne
        </p>
        <button onClick={() => setCurrentScreen("chooseService")} className="bg-primary text-white text-base py-3 px-4 rounded-md w-full max-w-[400px] transition font-semibold">
          Rejoindre la file d’attente
        </button>
        <div className="flex items-center gap-2 justify-center my-4 text-black">
          <hr className="w-6 md:w-8 border-t border-black" />
            <span className="text-sm">OU</span>
          <hr className="w-6 md:w-8 border-t border-black" />
        </div>
        <p className="text-center text-base md:text-lg">
          Scannez ce QR code pour
          <br />
          prendre un ticket depuis votre smartphone
        </p>
        <div className="mt-2">
          <QRCode value={`${window.location.origin}/terminal?screen=chooseService&scanned=true`} size={100} fgColor="#000000"/>
        </div>
      </div>
      <CompanyIllustration />
    </div>
  );
}

export default Terminal;


