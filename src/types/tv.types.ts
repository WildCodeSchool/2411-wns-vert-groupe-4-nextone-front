export interface TvHeaderProps {
  dateTime: Date;
}

export interface TvTicket {
  id: string;
  code: string;
  service: {
    name: string;
  };
}

export interface CurrentTicketProps {
  tickets: TvTicket[];
}