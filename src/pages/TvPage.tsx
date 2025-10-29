import React from "react";
import { Clock } from "lucide-react";
import logo from "../assets/images/Logo_NextOne_vert-noir.png";
import { useState, useEffect } from "react";
import { formattedTime } from "../utils/formattedTime";
import { formattedDate } from "../utils/formattedDate";

const TvPage: React.FC = () => {
    const [dateTime, setDateTime] = useState(new Date());

    const currentTicket = { number: "B005", service: "Radiologie" };
    const ticketsInProgress = [
        { number: "A041", service: "Cardiologie" },
        { number: "B604", service: "Dentiste" },
        { number: "A040", service: "Pneumologie" },
        { number: "A039", service: "Néphrologie" },
        { number: "A038", service: "Dermatologie" },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-screen w-screen bg-gray-50 flex justify-center items-center font-sans">
            <div className="flex flex-1 h-full w-full max-w-full shadow-lg overflow-hidden">
                <div className="flex-1 bg-[#F0F0EE] flex flex-col justify-between text-white">
                    <div className="flex justify-between p-8 items-center mb-8 text-black text-xl font-medium">
                        <div className="flex items-center gap-4">
                            <span>☀️ 27°C</span>
                            <span className="capitalize">{formattedDate(dateTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={18} />
                            <span>{formattedTime(dateTime)}</span>
                        </div>
                    </div>
                    <div className="bg-foreground text-white text-center py-12 w-full max-w-sm mx-auto mb-8 rounded-2xl shadow-lg">
                        <h1 className="text-8xl font-medium">{currentTicket.number}</h1>
                        <p className="text-4xl mt-4 text-lime-500">
                            <span className="font-bold">Service {currentTicket.service}</span>
                        </p>
                    </div>
                    <div className="flex items-center justify-center text-black bg-white gap-3 mt-4  p-3 shadow">
                        <img src={logo} alt="Logo" className="w-[70px] h-[70px] rounded-lg"/>
                        <p className="text-xl font-medium text-left">Veuillez patienter,<br></br> votre numéro sera appelé prochainement.</p>
                    </div>
                </div>
                <div className="w-1/3 bg-foreground text-white p-6 flex flex-col">
                    <div className="flex justify-center">
                        <h2 className="text-3xl font-semibold text-white border-b-[2px] border-gray-700 inline-block pb-2 w-fit">
                            Tickets en cours
                        </h2>
                    </div>
                    <ul className="flex flex-col justify-between items-center h-full p-12">
                        {ticketsInProgress.map((ticket) => (
                            <li key={ticket.number} className="text-center">
                                <p className="text-4xl">{ticket.number}</p>
                                <p className="text-xl text-secondary">Service {ticket.service}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TvPage;
