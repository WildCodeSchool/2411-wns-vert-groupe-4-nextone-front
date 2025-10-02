import { gql } from "@apollo/client";

export const CREATE_TICKET = gql`
  mutation GenerateTicket($data: GenerateTicketInput!) {
    generateTicket(data: $data) {
        id
        code
        service {
            id
        }
        firstName
        lastName
        email
        phone
    }
  }
`;

export const UPDATE_TICKET = gql`
  mutation UpdateTicket($updateTicketData: UpdateTicketInput!) {
    updateTicket(data: $updateTicketData) {
      id
      firstName
      lastName
      email
      phone
      status
    }
  }
`;

export const UPDATE_TICKET_STATUS = gql`
  mutation Mutation($updateTicketStatusData: UpdateStatusTicketInput!) {
    updateTicketStatus(data: $updateTicketStatusData) {
      id
      status
      code
    }
  }
`;
