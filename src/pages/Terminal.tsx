import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import logo from "../assets/logo.png";
import QRCode from "react-qr-code";
import CompanyIllustration from "@/components/terminal/CompanyIllustration";
import ChooseService from "@/components/terminal/ChooseService";
import PersonnalInformation from "@/components/terminal/PersonnalInformation";
import ContactInfo from "@/components/terminal/ContactInfo";
import SuccessTicketPage from "@/components/terminal/SuccessTicketPage";
import PhonePage from "@/pages/PhonePage";

type Screen = "home" | "chooseService" | "persoInfo" | "contactInfo" | "successTicketPage" | "phone";

function Terminal() {
  const [searchParams] = useSearchParams();
  const screenFromUrl = searchParams.get("screen") as Screen | null;
  const isScannedFromUrl = searchParams.get("scanned") === "true";
  const ticketIdFromUrl = searchParams.get("ticketId");

  const [currentScreen, setCurrentScreen] = useState<Screen>(screenFromUrl || "home");
  const [ticketId, setTicketId] = useState(ticketIdFromUrl || generateTicketId());
  const [isScanned, setIsScanned] = useState(isScannedFromUrl);

  function generateTicketId() {
    return `ticket-${Math.random().toString(36).substring(2, 10)}`;
  }

  useEffect(() => {
    if (currentScreen === "successTicketPage" && !isScanned) {
      const timer = setTimeout(() => setCurrentScreen("home"), 20000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, isScanned]);

  if (currentScreen === "chooseService") {
    return <ChooseService onBack={() => setCurrentScreen("home")} onNext={() => setCurrentScreen("persoInfo")} onCancel={() => setCurrentScreen("home")} />;
  }

  if (currentScreen === "persoInfo") {
    return <PersonnalInformation onBack={() => setCurrentScreen("chooseService")} onNext={() => setCurrentScreen("contactInfo")} onCancel={() => setCurrentScreen("home")} />;
  }

  if (currentScreen === "contactInfo") {
    return <ContactInfo onBack={() => setCurrentScreen("persoInfo")} onNext={() => setCurrentScreen("successTicketPage")} onCancel={() => setCurrentScreen("home")} />;
  }

  if (currentScreen === "successTicketPage") {
    return <SuccessTicketPage
      isScanned={isScanned}
      ticketId={ticketId}
      onTimeout={() => setCurrentScreen("phone")}
    />;
  }

  if (currentScreen === "phone") {
    return <PhonePage ticketId={ticketId} />;
  }

  return (
    <div className="h-screen flex flex-col md:flex-row bg-white font-[Archivo]">
      <div className="w-full md:w-1/2 p-4 flex flex-col justify-start items-center gap-4 mt-4 md:mt-10">
        <img src={logo} alt="logo" className="h-10 md:h-12 opacity-100" />
        <h1 className="text-3xl md:text-4xl font-semibold text-center">Bienvenue</h1>
        <p className="text-center text-base md:text-lg">
          Rejoignez la file d’attente directement
          <br />
          depuis cette borne
        </p>
        <button
          onClick={() => setCurrentScreen("chooseService")} className="bg-primary text-white text-base py-2 px-4 rounded-md w-full max-w-[400px] transition font-semibold">
          Rejoindre la file d’attente
        </button>
        <div className="flex items-center gap-2 justify-center mt-2 text-black">
          <hr className="w-6 md:w-8 border-t border-black" />
            <span className="text-sm">OU</span>
          <hr className="w-6 md:w-8 border-t border-black" />
        </div>
        <p className="text-center text-sm md:text-base mt-2">
          Scannez ce QR code pour
          <br />
          prendre un ticket depuis votre smartphone
        </p>
        <div className="mt-2">
          <QRCode
            value={`${window.location.origin}/terminal?screen=chooseService&scanned=true`}
            size={120}
            fgColor="#000000"
          />
        </div>
      </div>
      <CompanyIllustration />
    </div>
  );
}

export default Terminal;
