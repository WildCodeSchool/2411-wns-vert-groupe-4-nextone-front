import logo from "../../../../assets/logo-nextone.svg";
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
    ? `${BASE_URL}/images/files/${encodeURIComponent(company.logoCompany)}`
    : logo;

  return (
    <>
      <img src={logoSrc} alt="logo" className="w-[33%] mb-6" />
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
        data-testid="join-queue-button"
      >
        Rejoindre la file d’attente
      </button>
    </>
  );
}
