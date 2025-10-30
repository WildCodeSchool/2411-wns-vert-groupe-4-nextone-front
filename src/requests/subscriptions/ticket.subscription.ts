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
