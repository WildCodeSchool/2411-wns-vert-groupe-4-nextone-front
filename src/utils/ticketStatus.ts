// helper TS : centralisation du mapping

export type TicketStatus =
  | "PENDING"
  | "INPROGRESS"
  | "CREATED"
  | "DONE"
  | "CANCELED"
  | "ARCHIVED";

// Liste des statuts avec libellés "humains"
export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  PENDING: "En attente",
  INPROGRESS: "En cours de traitement",
  CREATED: "Créé",
  DONE: "Terminé",
  CANCELED: "Annulé",
  ARCHIVED: "Archivé",
};

// Mapping inversé : depuis label humain → valeur GraphQL
export const STATUS_LABEL_TO_ENUM: Record<string, TicketStatus> = Object.entries(TICKET_STATUS_LABELS).reduce(
  (acc, [key, value]) => {
    acc[value] = key as TicketStatus;
    return acc;
  },
  {} as Record<string, TicketStatus>
);

// Liste d’options de menu/filtre
export const TICKET_STATUS_OPTIONS = Object.entries(TICKET_STATUS_LABELS).map(([value, label]) => ({
  label,
  value: value as TicketStatus,
}));


