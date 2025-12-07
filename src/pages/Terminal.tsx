import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CompanyIllustration from "../common/terminal/CompanyIllustration";
import { getScreenComponent } from "../components/terminal/Screens";
import { useTicket } from "../context/useContextTicket";
import { emptyTicket } from "../utils/constants/ticket";
import { Screen } from "../types/terminal";
import HomeStep from "@/components/terminal/form/form-steps/HomeStep";
import { motion } from "motion/react";
import { tabContentEnterAnimation } from "@/lib/animations/settings.animation";
import ServiceStep from "@/components/terminal/form/form-steps/ServiceStep";
import TicketForm from "@/components/terminal/form/TicketForm";

export default function Terminal() {
  const [searchParams] = useSearchParams();
  const { ticket, setTicket } = useTicket();
  const screenFromUrl = searchParams.get("screen") as Screen | null;
  const isScannedFromUrl = searchParams.get("scanned") === "true";
  const [currentScreen, setCurrentScreen] = useState<Screen>(
    screenFromUrl || "home"
  );
  const [isScanned] = useState(isScannedFromUrl);

  const [formStep, setFormStep] = useState<number>(0);

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
    return getScreenComponent(currentScreen, {
      setCurrentScreen,
      handleCancel,
      isScanned,
    });
  }

  const TerminalComponent = () => {
    switch (formStep) {
      case 0:
        return <HomeStep setFormStep={setFormStep} />;
      case 4:
        return null;
      default:
        return <TicketForm formStep={formStep} setFormStep={setFormStep} />;
    }
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-white font-[Archivo]">
      <motion.div
        className="w-1/2 flex flex-col justify-center items-center gap-4 p-10"
        initial={tabContentEnterAnimation.initial}
        animate={tabContentEnterAnimation.animate}
        transition={tabContentEnterAnimation.transition}
        key={formStep}
      >
        <TerminalComponent />
      </motion.div>
      <CompanyIllustration />
    </div>
  );
}
