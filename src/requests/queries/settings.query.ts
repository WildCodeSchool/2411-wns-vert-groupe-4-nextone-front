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

export const GET_SERVICES_THAT_CAN_BE_MANAGED = gql`
  query GetServicesThatCanBeManaged($managerId: UUID!) {
    getEmployeeAuthorizations(managerId: $managerId) {
      service {
        id
        name
        authorizations {
          manager {
            id
            firstName
            lastName
          }
          isAdministrator
        }
      }
      isAdministrator
    }
  }
`;

export const GET_ALL_MANAGERS = gql`
  query GetAllManagers {
    managers {
      id
      firstName
      lastName
      email
      isGloballyActive
    }
  }
`;
