import { gql } from "@apollo/client";

export const GET_TICKET_LOGS = gql`
  query TicketLogsByProperty($field: TicketLogPropertyInput!) {
    ticketLogsByProperty(field: $field) {
      status
      createdAt
      id
      manager {
        id
        lastName
        firstName
      }
    }
  }
`;

//PAGINATION
export const GET_TICKET_LOGS_PAGINATED = gql`
  query GetTicketLogs($pagination: PaginationInput) {
    ticketLogs(pagination: $pagination) {
      id
      ticket {
        id
        code
      }
      manager {
        id
        email
      }
      status
      createdAt
    }
  }
`;
