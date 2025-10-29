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
