import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import {
  GET_TICKET_INFOS,
  UPDATE_TICKET_STATUS,
} from "../../../requests/queries/ticket.query";
import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { MdOutlineEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";
import { MdRoomService } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";
import { FaTicketSimple } from "react-icons/fa6";
import { statusOptions } from "../../../utils/constants/ticket";
import TicketInfos from "./TicketInfos";
import { TicketActionMenu } from "../TicketActionMenu";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import TicketUpdateDialog from "./dialogs/TicketUpdateDialog";
import { TICKET_UPDATED_SUBSCRIPTION } from "@/requests/subscriptions/ticket.subscription";

type RouteParams = {
  id: string;
};

type GetTicketType = {
  ticket: Ticket;
};

type TicketLog = {
  id: string;
  status: string;
  manager: {
    firstName: string;
    lastName: string;
    profileImage: string;
  };
  createdAt: string;
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
  ticketLogs?: TicketLog[];
};

export default function TicketPage() {
  const { id } = useParams<RouteParams>();
  const [searchParams] = useSearchParams();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [ticketLogs, setTicketLogs] = useState<TicketLog[] | null>(null);

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const isEditingRedirection = useMemo(
    () => searchParams.get("edit") === "true",
    [searchParams]
  );

  const navigate = useNavigate();

  const { data, loading, error, refetch } = useQuery<GetTicketType>(
    GET_TICKET_INFOS,
    {
      variables: { ticketId: id },
    }
  );

  const ticketOptions = statusOptions.find(
    (option) => option.value === data?.ticket.status
  );

  const { toastSuccess, toastError } = useToast();

  const [updateTicketStatus] = useMutation(UPDATE_TICKET_STATUS);

  const url_api = import.meta.env.VITE_ORIGIN_URL as string;

  useSubscription(TICKET_UPDATED_SUBSCRIPTION, {
    onData: ({ data }) => {
      const updatedTicket = data.data.ticketUpdated;

      if (updatedTicket.id !== ticket?.id) return;

      const newTicketLogs = updatedTicket.ticketLogs;

      setTicket((prevTicket) =>
        prevTicket ? { ...prevTicket, ...updatedTicket } : prevTicket
      );

      setTicketLogs(newTicketLogs);
    },
  });

  useEffect(() => {
    if (data && data.ticket) {
      setTicket(data.ticket);
      setTicketLogs(data.ticket.ticketLogs || null);
    }
  }, [data]);

  const handleArchive = useCallback(
    async (ticketId: string) => {
      try {
        await updateTicketStatus({
          variables: {
            updateTicketStatusData: { id: ticketId, status: "ARCHIVED" },
          },
        });
        toastSuccess("Ticket archivé avec succès");
        await refetch();
      } catch (error) {
        toastError("Erreur lors de l'archivage du ticket");
        console.error(error);
      }
    },
    [updateTicketStatus, refetch, toastSuccess, toastError]
  );

  const handleResetStatus = useCallback(
    async (ticketId: string) => {
      try {
        await updateTicketStatus({
          variables: {
            updateTicketStatusData: { id: ticketId, status: "PENDING" },
          },
        });
        toastSuccess("Statut remis à 'En attente'");
        await refetch();
      } catch (error) {
        toastError("Erreur lors du changement de statut");
        console.error(error);
      }
    },
    [updateTicketStatus, refetch, toastSuccess, toastError]
  );

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
      case "UPDATED":
        return `Informations du ticket mises à jour`;
      default:
        return "Statut inconnu";
    }
  };

  useEffect(() => {
    if (isEditingRedirection) {
      setIsUpdateDialogOpen(true);
    }
  }, [isEditingRedirection]);

  if (!id) {
    return <p>Aucun ID fourni</p>;
  }

  if (loading) return <p data-testid="ticket-loading">Chargement...</p>;
  if (!data || !ticket)
    return <p data-testid="ticket-not-found">Aucun ticket trouvé</p>;
  if (error) return <p data-testid="ticket-error">Erreur: {error.message}</p>;

  return (
    <>
      <div className="flex flex-row items-center w-full">
        <div className="flex items-center">
          <div
            className="bg-card flex items-center justify-center rounded-full p-3 mr-5 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <IoIosArrowBack className="w-6 h-6 text-foreground cursor-pointer" />
          </div>
          <h1 className="scroll-m-20 text-4xl font-light tracking-tight text-balance mr-2">
            {ticket.firstName} {ticket.lastName}
          </h1>
          <span className="ml-4 px-4 py-2 rounded-lg text-sm font-light bg-primary text-white">
            Ticket {ticket.code}
          </span>
          <span
            className={`ml-4 px-4 py-2 rounded-lg text-sm font-light mr-6 ${
              ticketOptions ? ticketOptions.badgeStyle : ""
            }`}
          >
            {ticketOptions ? ticketOptions.label : ticket.status}
          </span>
          <TicketActionMenu
            ticketId={ticket.id}
            ticketStatus={ticket.status}
            onArchive={() => handleArchive(ticket.id)}
            onResetStatus={() => handleResetStatus(ticket.id)}
            openUpdateDialog={() => setIsUpdateDialogOpen(true)}
          />
        </div>
      </div>

      <div className="flex flex-row items-stretch justify-between w-full h-full mt-8 gap-10">
        <div className="flex flex-col items-start justify-start gap-6 w-full">
          <div
            className="bg-card p-6 rounded-lg flex flex-col items-start justify-start gap-4 text-left w-full mr-4"
            data-testid="personal-info-card"
          >
            <h2 className="scroll-m-20 text-xl font-light tracking-tight text-balance text-muted-foreground">
              Informations personnelles
            </h2>
            <TicketInfos
              information={`${ticket.firstName} ${ticket.lastName}`}
              icon={FaPerson}
              data-testid="info-full-name"
            />
            <TicketInfos
              information={ticket.email}
              icon={MdOutlineEmail}
              data-testid="info-email"
            />
            <TicketInfos
              information={ticket.phone}
              icon={FaPhoneAlt}
              data-testid="info-phone"
            />
          </div>
          <div
            className="bg-card p-6 rounded-lg flex flex-col items-start justify-start gap-4 text-left w-full mr-4"
            data-testid="ticket-details-card"
          >
            <h2 className="scroll-m-20 text-xl font-light tracking-tight text-balance text-muted-foreground">
              Informations sur le ticket
            </h2>
            <TicketInfos
              information={data.ticket.code}
              icon={FaTicketSimple}
              data-testid="info-code"
            />
            <TicketInfos
              information={ticket.service.name || "N/A"}
              icon={MdRoomService}
              data-testid="info-service"
            />
            <TicketInfos
              information={`${new Date(
                ticket.createdAt
              ).toLocaleDateString()} à ${" "}
                ${new Date(ticket.createdAt).toLocaleTimeString()}`}
              icon={FaPlus}
              data-testid="info-created-at"
            />
            <TicketInfos
              information={`${new Date(
                ticket.updatedAt
              ).toLocaleDateString()} à ${" "}
                ${new Date(ticket.updatedAt).toLocaleTimeString()}`}
              icon={MdOutlineEdit}
              data-testid="info-updated-at"
            />
          </div>
        </div>
        <div className="flex flex-col items-stretch justify-start w-full h-full gap-10">
          <div
            className="bg-card p-6 rounded-lg flex flex-col items-start justify-start gap-4 text-left w-full h-full overflow-hidden"
            data-testid="ticket-history-card"
          >
            <h2 className="text-xl font-light tracking-tight text-balance text-muted-foreground">
              Historique du ticket
            </h2>
            <div className="flex flex-col items-start justify-start w-full h-full overflow-y-auto">
              {ticketLogs &&
                ticketLogs.map(
                  (
                    log: {
                      id: string;
                      status: string;
                      manager: {
                        firstName: string;
                        lastName: string;
                        profileImage: string;
                      };
                      createdAt: string;
                    },
                    idx: number
                  ) => {
                    const isLast = idx === ticketLogs.length - 1;

                    return (
                      <div
                        key={log.id}
                        data-testid={`log-entry-${log.id}`}
                        className={`flex flex-row items-center justify-between p-4 w-full text-sm ${
                          !isLast ? "border-b-2 border-muted" : ""
                        }`}
                      >
                        <div className="flex flex-row items-center justify-start mr-4 gap-3">
                          {log.manager ? (
                            <img
                              src={
                                log?.manager.profileImage
                                  ? `${url_api}/images/files/${encodeURIComponent(
                                      log.manager.profileImage
                                    )}`
                                  : "/avatar-example.jpg"
                              }
                              alt=""
                              className="w-7 h-7 rounded-full"
                            />
                          ) : (
                            <img
                              src="/avatar-example.jpg"
                              alt=""
                              className="w-7 h-7 rounded-full"
                            />
                          )}
                          {log.manager ? (
                            <p className="mr-4 font-medium">
                              {log.manager.firstName} {log.manager.lastName}
                            </p>
                          ) : (
                            <p className="mr-4 font-medium">Système</p>
                          )}
                          <p
                            className="font-light"
                            data-testid={`log-status-${log.id}`}
                          >
                            {ticketLogSentence(log)}
                          </p>
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
        </div>
        <TicketUpdateDialog
          ticketInfos={ticket}
          refetchTicket={refetch}
          open={isUpdateDialogOpen}
          setOpen={setIsUpdateDialogOpen}
        />
      </div>
    </>
  );
}
