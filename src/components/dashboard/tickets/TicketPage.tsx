import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { GET_TICKET_INFOS } from "@/requests/tickets.requests";
import { useQuery } from "@apollo/client/react";
import { MdOutlineEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";
import { MdRoomService } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";
import { FaTicketSimple } from "react-icons/fa6";
import { GET_TICKET_LOGS } from "@/requests/ticketLogs.requests";

type RouteParams = {
  id: string;
};

type GetTicketType = {
  ticket: Ticket;
};

export type Ticket = {
  code: string;
  email: string;
  createdAt: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string;
  status: string;
  updatedAt: string;
  service: {
    id: string;
    name: string;
  };
};

export default function TicketPage() {
  const { id } = useParams<RouteParams>();

  const navigate = useNavigate();

  const { data, loading, error } = useQuery<GetTicketType>(GET_TICKET_INFOS, {
    variables: { ticketId: id },
  });

  const {
    data: ticketLogs,
    loading: ticketLogsLoading,
    error: ticketLogsError,
  } = useQuery(GET_TICKET_LOGS, {
    variables: { field: { ticketId: id } },
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

  const ticketLogSentence = (log: any) => {
    const managerName = log.manager
      ? `${log.manager.firstName} ${log.manager.lastName}`
      : "le système";

    switch (log.status) {
      case "CREATED":
        return `Le ticket a été créé par ${managerName}`;
      case "INPROGRESS":
        return `Le ticket est en cours de traitement par ${managerName}`;
      case "CANCELED":
        return `Le ticket a été annulé par ${managerName}`;
      case "DONE":
        return `Le ticket a été marqué comme traité par ${managerName}`;
      case "ARCHIVED":
        return `Le ticket a été archivé par ${managerName}`;
      case "PENDING":
        return `Le ticket a été mis en attente par ${managerName}`;
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
          {data.ticket.firstName} {data.ticket.lastName}
        </h1>
        <div>
          <span className="ml-4 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Ticket #{data.ticket.code}
          </span>
          <span className="ml-4 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {statusString(data.ticket.status)}
          </span>
        </div>
      </div>
      <div className="flex flex-row items-stretch justify-between w-full h-full mt-10 gap-10">
        <div className="flex flex-col items-start justify-start gap-6 w-full">
          <div className="bg-card p-6 rounded-lg flex flex-col items-start justify-start gap-4 text-left w-full mr-4">
            <h2 className="scroll-m-20 text-xl font-light tracking-tight text-balance text-muted-foreground">
              Informations personnelles
            </h2>

            <div className="flex flex-row items-center justify-start">
              <FaPerson className="mr-4" size={20} />
              <p>
                {data.ticket.firstName} {data.ticket.lastName}
              </p>
            </div>
            <div className="flex flex-row items-center justify-start">
              <MdOutlineEmail className="mr-4" size={20} />
              <p>{data.ticket.email}</p>
            </div>
            <div className="flex flex-row items-center justify-start">
              <FaPhoneAlt className="mr-4" size={20} />
              <p>{data.ticket.phone}</p>
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg flex flex-col items-start justify-start gap-4 text-left w-full mr-4">
            <h2 className="scroll-m-20 text-xl font-light tracking-tight text-balance text-muted-foreground">
              Informations sur le ticket
            </h2>
            <div className="flex flex-row items-center justify-start">
              <FaTicketSimple className="mr-4" size={20} />
              <p>#{data.ticket.code}</p>
            </div>
            <div className="flex flex-row items-center justify-start">
              <MdRoomService className="mr-4" size={20} />
              <p>{data.ticket.service.name || "N/A"}</p>
            </div>
            <div className="flex flex-row items-center justify-start">
              <FaPlus className="mr-4" size={20} />
              <p>{new Date(data.ticket.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-row items-center justify-start">
              <MdOutlineEdit className="mr-4" size={20} />
              <p>{new Date(data.ticket.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg flex flex-col items-start justify-start gap-4 text-left w-full mr-4">
            <h2 className="scroll-m-20 text-xl font-light tracking-tight text-balance text-muted-foreground">
              Commentaires
            </h2>
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg flex flex-col items-start justify-start gap-4 text-left w-full">
          <h2 className="scroll-m-20 text-xl font-light tracking-tight text-balance text-muted-foreground">
            Historique du ticket
          </h2>
          <div className="flex flex-col items-start justify-start gap-4 w-full h-full overflow-y-scroll">
            {ticketLogs &&
              ticketLogs.ticketLogsByProperty.map((log: any) => (
                <div
                  key={log.id}
                  className="flex flex-row items-center justify-start border-2 border-muted p-4 w-[90%] rounded-lg"
                >
                  <p className="font-medium">
                    {new Date(log.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(log.createdAt).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    :
                  </p>
                  <p className="ml-2">{ticketLogSentence(log)}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
