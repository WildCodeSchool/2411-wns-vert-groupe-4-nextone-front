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