import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { GET_TICKET_INFOS } from "@/requests/tickets.requests";
import { useQuery } from "@apollo/client/react";

type RouteParams = {
  id: string;
};

type GetTicketType = {
  getTicket: Ticket;
};

type Ticket = {
  code: string;
  email: string;
  createdAt: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string;
  status: string;
  updatedAt: string;
};

export default function TicketPage() {
  const { id } = useParams<RouteParams>();

  const navigate = useNavigate();

  const { data, loading, error } = useQuery<GetTicketType>(GET_TICKET_INFOS, {
    variables: { getTicketId: id },
  });

  const statusString = (status: string) => {
    switch (status) {
      case "CREATED":
        return "Créé";
      case "PENDING":
        return "En attente";
      case "CANCELED":
        return "Annulé";
      case "DONE":
        return "Terminé";
      case "ARCHIVED":
        return "Archivé";
      default:
        return "Statut inconnu";
    }
  };

  if (!id) {
    return <p>Aucun ID fourni</p>;
  }

  if (loading) return <p>Chargement...</p>;
  if (!data) return <p>Aucun ticket trouvé</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  return (
    <>
      <div className="flex flex-row items-center justify-start w-full">
        <div
          className="bg-card flex items-center justify-center rounded-full p-3 mr-5 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <IoIosArrowBack className="w-6 h-6 text-foreground cursor-pointer" />
        </div>
        <h1 className="scroll-m-20 text-4xl font-light tracking-tight text-balance">
          Ticket {data.getTicket.code}
        </h1>
        <div>
          <span className="ml-4 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {statusString(data.getTicket.status)}
          </span>
        </div>
      </div>
      <div className="flex flex-row items-stretch justify-between w-full h-full mt-10">
        <div className="bg-card p-6 rounded-lg flex flex-col items-start justify-start gap-4 text-left w-full mr-4">
          <h3 className="text-1xl font-light text-muted-foreground flex flex-col items-start justify-start">
            Informations personnelles
          </h3>
          <p>Prénom: {data.getTicket.firstName}</p>
          <p>Nom: {data.getTicket.lastName}</p>
          <p>Email: {data.getTicket.email}</p>
          <p>Téléphone: {data.getTicket.phone}</p>
          <p>
            Créé le: {new Date(data.getTicket.createdAt).toLocaleDateString()}
          </p>
          <p>
            Dernière mise à jour:{" "}
            {new Date(data.getTicket.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg flex flex-col items-start justify-start gap-4 text-left w-full ml-4">
          <h3 className="text-1xl font-light text-muted-foreground flex flex-col items-start justify-start">
            Historique du ticket
          </h3>
        </div>
      </div>
    </>
  );
}
