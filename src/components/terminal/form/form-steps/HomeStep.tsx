import logo from "../../../../assets/nextone-green.svg";
import QRCode from "react-qr-code";
import { useIPCompany } from "@/context/IPCompanyContext";

export default function HomeStep({
  setFormStep,
}: {
  setFormStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { company } = useIPCompany();
  const API_URL = import.meta.env.VITE_API_URL as string;
  const BASE_URL = API_URL.replace(/\/graphql$/, "");

  const logoSrc = company?.logoCompany
    ? `${BASE_URL}/files/${encodeURIComponent(company.logoCompany)}`
    : logo;

  return (
    <>
      <img src={logoSrc} alt="logo" className="h-18 mb-3" />
      <h1 className="text-4xl font-semibold text-center mb-8">Bienvenue</h1>
      <p className="text-center text-xl mb-4">
        Rejoignez la file d’attente directement
        <br />
        depuis cette borne
      </p>
      <button
        onClick={() => {
          console.log("Bouton cliqué !");
          setFormStep(1);
        }}
        className="bg-primary text-white text-xl py-4 rounded-md w-full max-w-[500px] transition font-normal"
      >
        Rejoindre la file d’attente
      </button>
      <div className="flex items-center gap-2 justify-center my-4 text-black">
        <hr className="w-6 md:w-8 border-t border-black" />
        <span className="text-sm">OU</span>
        <hr className="w-6 md:w-8 border-t border-black" />
      </div>
      <p className="text-center text-xl">
        Scannez ce QR code pour
        <br />
        prendre un ticket depuis votre smartphone
      </p>
      <div className="mt-2">
        <QRCode
          data-testid="qr-code"
          value={`${window.location.origin}/terminal?scanned=true`}
          size={100}
          fgColor="#000000"
        />
      </div>
    </>
  );
}
