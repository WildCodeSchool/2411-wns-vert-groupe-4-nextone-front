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
            status
            service {
                id
                name
            }
            createdAt
            updatedAt
        }
    }
`;