import { gql } from "@apollo/client";

export const GET_COMPANY_BY_IP = gql`
  query GetCompanyByIP {
    companyByIP {
      id
      name
      address
      postalCode
      city
      phone
      logoCompany
      siret
      email
    }
  }
`;
