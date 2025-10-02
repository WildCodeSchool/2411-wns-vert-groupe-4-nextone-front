import { gql } from "@apollo/client";

export const UPDATE_USER_INFORMATIONS = gql`
  mutation UpdateManager($updateManagerId: ID!, $data: UpdateManagerInput!) {
    updateManager(id: $updateManagerId, data: $data) {
      firstName
      lastName
    }
  }
`;
