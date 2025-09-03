import { Button } from "@/components/ui/button";
import logo from "../assets/logo.png"

export default function TicketCard() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4 space-y-8">
        <div className="w-full max-w-sm flex justify-between items-center bg-white px-4 rounded-lg shadow">
            <div className="flex items-center space-x-2">
                <img src={logo} className="w-30 h-30 object-contain" alt="Logo" />
            </div>
            <div className="bg-primary text-white font-bold px-8 py-4 rounded-lg">
                EU238
            </div>
        </div>
        <div className="w-full max-w-sm bg-white rounded-lg shadow p-6 text-center space-y-6">
            <p className="text-gray-600 text-[20px]">Bonjour Corentin,</p>
            <p className="text-gray-500 text-[13px]">
            Vous êtes en attente au service Neurologie.
            </p>
            <div className="relative w-64 h-64 mx-auto">
                <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 36 36">
                    <circle className="text-gray-300" strokeWidth="4" stroke="currentColor" fill="transparent" r="16" cx="18" cy="18"/>
                    <circle className="text-primary" strokeWidth="4" strokeDasharray="25, 100" strokeLinecap="round" stroke="currentColor" fill="transparent" r="16" cx="18" cy="18"/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <span className="text-gray-500 text-[12px] italic">Vous êtes</span>
                    <span className="text-4xl font-bold text-primary font-bold text-[32px]">4ème</span>
                    <span className="text-gray-500 text-[12px] italic pb-4">dans la queue</span>
                    <span className="text-gray-500 text-[10px] mt-1 break-words">
                    <span className="italic">Temps d'attente estimé :</span><br /><span className=" text-[16px] text-primary font-bold">20 minutes</span>
                    </span>
                </div>
            </div>
        </div>
        <Button className="w-full max-w-sm bg-primary text-white">
            Voir mes informations de ticket
        </Button>
        <p className="text-gray-400 text-[11px] italic">Powered by NextOne</p>
    </div>
  );
}

