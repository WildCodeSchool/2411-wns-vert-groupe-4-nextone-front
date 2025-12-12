export interface TvHeaderProps {
  dateTime: Date;
  tvKey: string | undefined;
}

export interface TvTicket {
  id: string;
  code: string;
  status: string
  service: {
    name: string;
  };
}

export interface CurrentTicketProps {
  tickets: TvTicket[];
}