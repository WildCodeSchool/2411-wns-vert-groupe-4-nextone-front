import logo from "../../../../assets/logo.png";
import QRCode from "react-qr-code";

export default function HomeStep({
  setFormStep,
}: {
  setFormStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <>
      <img src={logo} alt="logo" className="h-18 mb-3" />
      <h1 className="text-4xl font-semibold text-center mb-8">Bienvenue</h1>
      <p className="text-center text-xl mb-4">
        Rejoignez la file d’attente directement
        <br />
        depuis cette borne
      </p>
      <button
        onClick={() => setFormStep(1)}
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
          value={`${window.location.origin}/terminal?screen=chooseService&scanned=true`}
          size={100}
          fgColor="#000000"
        />
      </div>
    </>
  );
}
