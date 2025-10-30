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
  query GetAllManagersForManagement {
    SortedManagers {
      active {
        id
        firstName
        lastName
        email
        isGloballyActive
      }
      disable {
        id
        firstName
        lastName
        email
        isGloballyActive
      }
    }
  }
`;

export const GET_ALL_INVITATIONS = gql`
  query SortedInvitations {
    sortedInvitations {
      expired {
        id
        email
        updatedAt
      }
      pending {
        id
        email
        updatedAt
      }
    }
  }
`;

export const CREATE_INVITATION = gql`
  mutation CreateInvitation($args: CreateInvitationInput!) {
    createInvitation(args: $args) {
      email
      id
      role
      token
      updatedAt
      createdAt
    }
  }
`;

export const RENEW_INVITATION = gql`
  mutation RenewInvitation($renewInvitationId: UUID!) {
    renewInvitation(id: $renewInvitationId) {
      tokenExpiration
    }
  }
`;

export const DELETE_INVITATION = gql`
  mutation DeleteInvitation($deleteInvitationId: UUID!) {
    deleteInvitation(id: $deleteInvitationId) {
      message
      success
    }
  }
`;
