import { gql } from "@apollo/client";

export const UPDATE_USER_INFORMATIONS = gql`
  mutation UpdateManager($updateManagerId: ID!, $data: UpdateManagerInput!) {
    updateManager(id: $updateManagerId, data: $data) {
      firstName
      lastName
    }
  }
`;

export const UPDATE_COMPANY_INFORMATIONS = gql`
  mutation UpdateCompanyInformations($data: UpdateCompanyInput!) {
    updateCompany(data: $data) {
      address
      city
      email
      name
      phone
      postalCode
      siret
    }
  }
`;
