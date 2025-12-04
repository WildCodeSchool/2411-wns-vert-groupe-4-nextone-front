import { gql } from "@apollo/client";

export const GET_EMPLOYEE_AUTHORIZATIONS = gql`
  query GetEmployeeAuthorizations($managerId: UUID!) {
    authorizations: getEmployeeAuthorizations(managerId: $managerId) {
      service {
        id
        name
        isGloballyActive
        tickets {
          id
          code
          status
        }
      }
      manager {
        firstName
        lastName
        id
      }
      isAdministrator
    }
  }
`;
