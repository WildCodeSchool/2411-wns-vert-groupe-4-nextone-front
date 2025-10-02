import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack, IoIosMore } from "react-icons/io";
import { GET_TICKET_INFOS } from "@/requests/queries/ticket.query";
import { useQuery } from "@apollo/client/react";
import { MdOutlineEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";
import { MdRoomService } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";
import { FaTicketSimple } from "react-icons/fa6";
import { GET_TICKET_LOGS } from "@/requests/queries/ticketLogs.query";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { statusOptions } from "@/lib/ticketUtils";
import TicketInfos from "./TicketInfos";

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

  const ticketOptions = statusOptions.find(
    (option) => option.value === data?.ticket.status
  );

  const [isEditingComments, setIsEditingComments] = useState(false);
  const [comments, setComments] = useState("");

  const { data: ticketLogs } = useQuery(GET_TICKET_LOGS, {
    variables: { field: { ticketId: id } },
  });

  const ticketLogSentence = (log: { status: string }) => {
    switch (log.status) {
      case "CREATED":
        return `Ticket créé`;
      case "INPROGRESS":
        return `Ticket en cours de traitement`;
      case "CANCELED":
        return `Ticket annulé`;
      case "DONE":
        return `Ticket traité`;
      case "ARCHIVED":
        return `Ticket archivé`;
      case "PENDING":
        return `Ticket mis en attente`;
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
        <h1 className="scroll-m-20 text-4xl font-light tracking-tight text-balance mr-2">
          {data.ticket.firstName} {data.ticket.lastName}
        </h1>
        <span className="ml-4 px-4 py-2 rounded-lg text-sm font-light bg-primary text-white">
          Ticket {data.ticket.code}
        </span>
        <span
          className={`ml-4 px-4 py-2 rounded-lg text-sm font-light mr-6 ${
            ticketOptions ? ticketOptions.badgeStyle : ""
          }`}
        >
          {ticketOptions ? ticketOptions.label : data.ticket.status}
        </span>
        <IoIosMore size={20} />
      </div>
      <div className="flex flex-row items-stretch justify-between w-full h-full mt-10 gap-10">
        <div className="flex flex-col items-start justify-start gap-6 w-full">
          <div className="bg-card p-6 rounded-lg flex flex-col items-start justify-start gap-4 text-left w-full mr-4">
            <h2 className="scroll-m-20 text-xl font-light tracking-tight text-balance text-muted-foreground">
              Informations personnelles
            </h2>
            <TicketInfos
              information={`${data.ticket.firstName} ${data.ticket.lastName}`}
              icon={FaPerson}
            />
            <TicketInfos
              information={data.ticket.email}
              icon={MdOutlineEmail}
            />
            <TicketInfos information={data.ticket.phone} icon={FaPhoneAlt} />
          </div>
          <div className="bg-card p-6 rounded-lg flex flex-col items-start justify-start gap-4 text-left w-full mr-4">
            <h2 className="scroll-m-20 text-xl font-light tracking-tight text-balance text-muted-foreground">
              Informations sur le ticket
            </h2>
            <TicketInfos information={data.ticket.code} icon={FaTicketSimple} />
            <TicketInfos
              information={data.ticket.service.name || "N/A"}
              icon={MdRoomService}
            />
            <TicketInfos
              information={`${new Date(
                data.ticket.createdAt
              ).toLocaleDateString()} à ${" "}
                ${new Date(data.ticket.createdAt).toLocaleTimeString()}`}
              icon={FaPlus}
            />
            <TicketInfos
              information={`${new Date(
                data.ticket.updatedAt
              ).toLocaleDateString()} à ${" "}
                ${new Date(data.ticket.updatedAt).toLocaleTimeString()}`}
              icon={MdOutlineEdit}
            />
          </div>
        </div>
        <div className="flex flex-col items-stretch justify-start w-full h-full gap-10">
          <div className="bg-card p-6 rounded-lg flex flex-col items-start justify-start gap-4 text-left w-full h-[45%]">
            <h2 className="text-xl font-light tracking-tight text-balance text-muted-foreground">
              Historique du ticket
            </h2>
            <div className="flex flex-col items-start justify-start w-full h-full overflow-y-auto">
              {ticketLogs &&
                ticketLogs.ticketLogsByProperty.map(
                  (
                    log: {
                      id: string;
                      status: string;
                      manager: { firstName: string; lastName: string };
                      createdAt: string;
                    },
                    idx: number
                  ) => {
                    const isLast =
                      idx === ticketLogs.ticketLogsByProperty.length - 1;
                    return (
                      <div
                        key={log.id}
                        className={`flex flex-row items-center justify-between p-4 w-full text-sm ${
                          !isLast ? "border-b-2 border-muted" : ""
                        }`}
                      >
                        <div className="flex flex-row items-center justify-start mr-4 gap-3">
                          <img
                            src="/avatar-example.jpg"
                            alt=""
                            className="w-7 h-7 rounded-full"
                          />
                          {log.manager ? (
                            <p className="mr-4 font-medium">
                              {log.manager.firstName} {log.manager.lastName}
                            </p>
                          ) : (
                            <p className="mr-4 font-medium">Système</p>
                          )}
                          <p className="font-light">{ticketLogSentence(log)}</p>
                        </div>
                        <p className="font-light text-xs text-muted-foreground ml-4">
                          {new Date(log.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "numeric",
                            year: "2-digit",
                          })}
                          <br />
                          {new Date(log.createdAt).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    );
                  }
                )}
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg flex flex-col items-start justify-start gap-4 text-left w-full h-[55%]">
            <div className="flex flex-row items-center justify-between w-full">
              <h2 className="scroll-m-20 text-xl font-light tracking-tight text-balance text-muted-foreground">
                Commentaires
              </h2>
              <Button onClick={() => setIsEditingComments(true)}>
                Modifier les commentaires
              </Button>
            </div>
            {isEditingComments ? (
              <>
                <Textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  rows={4}
                />
                <Button onClick={() => setIsEditingComments(false)}>
                  Sauvegarder
                </Button>
              </>
            ) : (
              <p>{comments ? comments : "Aucun commentaire"}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
