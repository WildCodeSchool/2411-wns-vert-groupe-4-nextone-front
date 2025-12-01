import { gql } from "@apollo/client";

export const SERVICE_TOGGLED_SUBSCRIPTION = gql`
  subscription OnServiceToggled {
    serviceToggled {
      id
      name
      isGloballyActive
    }
  }
`;
