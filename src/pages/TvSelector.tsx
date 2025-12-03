import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate, Outlet, useParams } from "react-router-dom";
import { GET_SERVICES } from "../requests/queries/service.query";

export default function TvSelector() {
    const navigate = useNavigate();
    const { serviceId } = useParams();
    const { data, loading, error } = useQuery(GET_SERVICES);

    const [selectedService, setSelectedService] = useState("");

    if (loading) return <p>Chargement des services...</p>;
    if (error) return <p>Erreur : {error.message}</p>;

    const services = data?.services || [];

    if (serviceId) {
        return <Outlet />;
    }

    const handleSubmit = () => {
        if (!selectedService) return;
        navigate(`/tv/${selectedService}`);
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-10 rounded-xl shadow-xl w-[450px] flex flex-col gap-6">
                <h1 className="text-3xl text-center font-bold text-foreground">
                    Sélectionner un écran TV
                </h1>
                <p className="text-center text-gray-600">
                    Choisissez le service à afficher :
                </p>
                <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}
                className="border border-gray-300 p-3 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-foreground">
                    <option value="">-- Sélectionner un service --</option>
                    {services.map((service: any) => (
                        <option key={service.id} value={service.id}>
                            {service.name}
                        </option>
                    ))}
                </select>
                <button disabled={!selectedService} onClick={handleSubmit}
                className={`px-4 py-3 rounded-lg text-white font-medium transition ${selectedService ? "bg-foreground hover:bg-black" : "bg-gray-400 cursor-not-allowed"}`}>
                    Voir l’écran TV
                </button>
            </div>
        </div>
    );
};
