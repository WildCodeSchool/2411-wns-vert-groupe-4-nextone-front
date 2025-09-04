import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo.png";

export default function PhonePage({ ticketId }: { ticketId: string }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const ticketInfo = {
    service: "Neurologie",
    ticketNumber: ticketId,
    firstName: "Corentin",
    lastName: "Dupont",
    email: "corentin@example.com",
    phone: "+33 6 12 34 56 78",
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4 space-y-8">
        <div className="w-full max-w-sm flex justify-between items-center bg-white px-4 rounded-lg shadow">
            <div className="flex items-center space-x-2">
                <img src={logo} className="w-30 h-30 object-contain" alt="Logo" />
            </div>
            <div className="bg-primary text-white font-bold px-8 py-4 rounded-lg">
                {ticketInfo.ticketNumber}
            </div>
        </div>
        <div className="w-full max-w-sm bg-white rounded-lg shadow p-6 text-center space-y-6">
            <p className="text-gray-600 text-[20px]">Bonjour {ticketInfo.firstName},</p>
            <p className="text-gray-500 text-[13px]">
                Vous êtes en attente au service {ticketInfo.service}.
            </p>
            <div className="relative w-64 h-64 mx-auto">
                <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 36 36">
                    <circle className="text-gray-300" strokeWidth="4" stroke="currentColor" fill="transparent" r="16" cx="18" cy="18"/>
                    <circle className="text-primary" strokeWidth="4" strokeDasharray="25, 100" strokeLinecap="round" stroke="currentColor" fill="transparent" r="16" cx="18" cy="18"/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <span className="text-gray-500 text-[12px] italic">Vous êtes</span>
                    <span className="text-4xl font-bold text-primary text-[32px]">4ème</span>
                    <span className="text-gray-500 text-[12px] italic pb-4">dans la queue</span>
                    <span className="text-gray-500 text-[10px] mt-1 break-words">
                        <span className="italic">Temps d'attente estimé :</span>
                        <br />
                        <span className=" text-[16px] text-primary font-bold">
                            20 minutes
                        </span>
                    </span>
                </div>
            </div>
        </div>
        <div className="relative w-full max-w-sm">
            <Button className="w-full bg-primary text-white" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            Voir mes informations de ticket
            </Button>
            {isDrawerOpen && (
            <div className="mt-4 w-full bg-gray-50 rounded-lg shadow-lg p-4 transition-all duration-300 ease-out">
                <h2 className="text-lg font-bold mb-2 text-center">
                    Informations du ticket
                </h2>
                <div className="text-sm text-gray-700 space-y-1">
                <p>
                    <span className="font-semibold">Service :</span>{" "}
                    {ticketInfo.service}
                </p>
                <p>
                    <span className="font-semibold">Numéro de ticket :</span>{" "}
                    {ticketInfo.ticketNumber}
                </p>
                <p>
                    <span className="font-semibold">Nom :</span> {ticketInfo.lastName}
                </p>
                <p>
                    <span className="font-semibold">Prénom :</span>{" "}
                    {ticketInfo.firstName}
                </p>
                <p>
                    <span className="font-semibold">Email :</span> {ticketInfo.email}
                </p>
                <p>
                    <span className="font-semibold">Téléphone :</span>{" "}
                    {ticketInfo.phone}
                </p>
                </div>
                <button
                className="mt-3 w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition"
                onClick={() => setIsDrawerOpen(false)}
                >
                Fermer
                </button>
            </div>
            )}
        </div>
        <p className="text-gray-400 text-[11px] italic">Powered by NextOne</p>
    </div>
  );
}
