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

export const CREATE_NEW_SERVICE = gql`
  mutation CreateNewService($data: CreateServiceInput!) {
    createService(data: $data) {
      id
    }
  }
`;

export const ADD_NEW_AUTHORIZATION_TO_SERVICE = gql`
  mutation AddNewAuthorizationToService($input: NewAuthInput!) {
    addAuthorization(input: $input) {
      message
      success
    }
  }
`;

export const DELETE_AUTHORIZATION_FROM_SERVICE = gql`
  mutation DeleteAuthorizationFromService($input: DeleteAuthInput!) {
    deleteAuthorization(input: $input) {
      message
      success
    }
  }
`;

export const DELETE_SERVICE = gql`
  mutation DeleteService($deleteServiceId: UUID!) {
    deleteService(id: $deleteServiceId) {
      message
      success
    }
  }
`;
