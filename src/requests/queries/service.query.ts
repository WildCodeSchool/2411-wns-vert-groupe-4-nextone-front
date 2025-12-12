import { gql } from "@apollo/client";

export const GET_SERVICES = gql`
  query Services {
    services {
      id
      name
      isGloballyActive
      tickets {
        id
        code
        status
      }
    }
  }
`;

export const GET_SERVICES_BY_KEY = gql`
  query ServicesByKey($key: String!) {
    servicesByKey(key: $key) {
      id
      name
      isGloballyActive
    }
  }
`;

export const GET_SERVICES_WITH_MANAGERS = gql`
  query ServicesWithManagers {
    services {
      id
      name
      isGloballyActive
      authorizations {
        createdAt
      }
    }
  }
`;

export const GET_SERVICE = gql`
  query Service($id: UUID!) {
    service(id: $id) {
      id
      name
      isGloballyActive
      tickets {
        id
        code
        status
        createdAt
        updatedAt
        firstName
        lastName
      }
    }
  }
`;
