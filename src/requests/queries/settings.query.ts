import { gql } from "@apollo/client";

export const GET_COMPANY_INFORMATIONS = gql`
  query GetCompanyInfos($companyId: ID!) {
    company(id: $companyId) {
      name
      address
      siret
      phone
      id
      email
      city
      postalCode
    }
  }
`;
