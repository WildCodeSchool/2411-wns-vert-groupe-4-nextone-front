import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CompanyIllustration from "../common/terminal/CompanyIllustration";
import { useTicket } from "../context/useContextTicket";
import { useAuth } from "@/context/AuthContext";
import { emptyTicket } from "../utils/constants/ticket";
import { useIPCompany } from "../context/IPCompanyContext";
import HomeStep from "@/components/terminal/form/form-steps/HomeStep";
import { motion } from "motion/react";
import { tabContentEnterAnimation } from "@/lib/animations/settings.animation";
import TicketForm from "@/components/terminal/form/TicketForm";
import SuccessTicketPage from "@/components/terminal/SuccessTicket";
import { useQuery } from "@apollo/client";
import { GET_TICKET_INFOS } from "@/requests/queries/ticket.query";
import { Screen } from "../types/terminal";
import { useCompany } from "@/context/CompanyContext";

type UrlScreen = "chooseService" | "successTicketPage" | "phone";

const screenToFormStep: Record<UrlScreen, number> = {
  chooseService: 1,
  successTicketPage: 4,
  phone: 4,
};

export function Terminal() {
  const { user } = useAuth();
  const { loading, error } = useIPCompany();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setTicket, ticket } = useTicket();

  const isScannedFromUrl = searchParams.get("scanned") === "true";
  const screenFromUrl = searchParams.get("screen") as UrlScreen | null;
  const ticketIdFromUrl = searchParams.get("ticketId");

  const initialFormStep = screenFromUrl
    ? screenToFormStep[screenFromUrl] ?? 0
    : 0;

  const [isScanned] = useState(isScannedFromUrl);
  const [formStep, setFormStep] = useState<number>(initialFormStep);
  const url_api = import.meta.env.VITE_ORIGIN_URL as string;

  const { loading: loadingTicket } = useQuery(GET_TICKET_INFOS, {
    variables: { ticketId: ticketIdFromUrl },
    skip: !ticketIdFromUrl || !!ticket?.id,
    onCompleted: (data) => {
      if (data?.ticket) {
        setTicket(data.ticket);
      } else if (ticketIdFromUrl) {
        setFormStep(0);
      }
    },
    onError: (error) => {
      console.error("Erreur de chargement du ticket par ID:", error);
      setFormStep(0);
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (formStep === 4 && !isScanned) {
      const timer = setTimeout(() => {
        setTicket(emptyTicket);
        setFormStep(0);
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [formStep, isScanned, setTicket]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center max-w-md p-8 bg-card rounded-lg shadow-lg">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Accès non autorisé
          </h1>
          <p className="text-muted-foreground mb-2">
            Cette borne n'est pas enregistrée dans le système.
          </p>
          <p className="text-sm text-muted-foreground">
            Contactez un administrateur pour enregistrer cette borne.
          </p>
          {error.message && (
            <div className="mt-6 p-4 bg-muted rounded text-left">
              <p className="text-xs font-mono text-muted-foreground break-all">
                {error.message}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loadingTicket) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">
            Chargement du ticket...
          </p>
        </div>
      </div>
    );
  }

  const TerminalComponent = () => {
    switch (formStep) {
      case 0:
        return <HomeStep setFormStep={setFormStep} />;
      case 1:
      case 2:
      case 3:
        return (
          <TicketForm
            formStep={formStep}
            setFormStep={setFormStep}
            onSuccess={() => setFormStep(4)}
          />
        );
      case 4:
        if (screenFromUrl === "phone" && !ticket?.id) {
          return <p>Ticket non trouvé ou non chargé. Retour à l'accueil...</p>;
        }
        return (
          <SuccessTicketPage
            isScanned={isScanned || screenFromUrl === "phone"}
            onTimeout={() => {
              setTicket(emptyTicket);
              setFormStep(0);
            }}
          />
        );
      default:
        return <HomeStep setFormStep={setFormStep} />;
    }
  };

  if (formStep === 4) {
    return <TerminalComponent />;
  }

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

export default Terminal;
