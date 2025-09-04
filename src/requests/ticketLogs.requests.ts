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
