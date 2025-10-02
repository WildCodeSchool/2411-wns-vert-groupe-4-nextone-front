import { gql } from "@apollo/client";

export const GET_SERVICES = gql`
  query Services {
    services {
      id
      name
      isGloballyActive
    }
  }
`;

export const GET_SERVICE = gql`
  query Service($id: UUID!) {
    service(id: $id) {
      id
      name
      isGloballyActive
      # 🔜 Quand le schéma exposera les tickets côté Service :
      # tickets {
      #   id
      #   code
      #   status
      #   createdAt
      #   updatedAt
      #   firstName
      #   lastName
      # }
    }
  }
`;