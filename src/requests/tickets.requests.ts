import { gql } from "@apollo/client";

export const GET_TICKETS = gql`
  query GetTickets {
    getTickets {
      id
      firstName
      code
      createdAt
      email
      lastName
      phone
      status
      updatedAt
    }
  }
`;

export const GET_TICKET_INFOS = gql`
  query GetTicketInfo($getTicketId: ID!) {
    getTicket(id: $getTicketId) {
      code
      email
      createdAt
      firstName
      id
      lastName
      phone
      status
      updatedAt
    }
  }
`;
