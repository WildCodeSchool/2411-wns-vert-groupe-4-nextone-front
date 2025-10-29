import { gql } from "@apollo/client";

export const GET_TICKETS = gql`
  query Tickets {
    tickets {
      id
      firstName
      code
      createdAt
      email
      lastName
      phone
      status
      updatedAt
      service {
        id
        name
      }
    }
  }
`;

export const GET_TICKET_INFOS = gql`
  query Ticket($ticketId: ID!) {
    ticket(id: $ticketId) {
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

//PAGINATION
export const GET_TICKETS_PAGINATED = gql`
  query GetTicketsPaginated(
    $fields: TicketPropertiesInput
    $pagination: PaginationInput
  ) {
    ticketsByProperties(fields: $fields, pagination: $pagination) {
      items {
        id
        firstName
        code
        createdAt
        email
        lastName
        phone
        status
        updatedAt
        service {
          id
          name
        }
      }
      totalCount
    }
  }
`;
