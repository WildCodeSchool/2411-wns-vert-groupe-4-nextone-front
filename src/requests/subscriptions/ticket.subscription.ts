import { gql } from "@apollo/client";

export const GET_TICKETS_PAGINATED_SUBSCRIPTION = gql`
  subscription TicketAdded {
    ticketAdded {
      id
      code
      firstName
      lastName
      email
      status
      createdAt
      service {
        id
        name
      }
    }
  }
`;

export const TICKET_UPDATED_SUBSCRIPTION = gql`
  subscription TicketUpdated {
    ticketUpdated {
      code
      createdAt
      email
      firstName
      id
      lastName
      phone
      service {
        id
        name
      }
      status
      updatedAt
      ticketLogs {
        id
      }
    }
  }
`;

export const TICKETS_CHANGED_SUBSCRIPTION = gql`
  subscription OnTicketsChanged {
    ticketsChanged {
      id
      status
    }
  }
`;

export const TICKETS_CHANGED = gql`
  subscription TicketsChanged {
    ticketsChanged {
      id
      code
      email
      firstName
      id
      lastName
      phone
      status
      service {
        id
      }
      updatedAt
      createdAt
    }
  }
`;

export const TICKET_STATUS_UPDATED_SUBSCRIPTION = gql`
  subscription TicketStatusChanged($ticketId: ID!) {
    ticketStatusChanged(ticketId: $ticketId) {
      code
      createdAt
      id
      service {
        id
      }
      status
      updatedAt
    }
  }
`;
