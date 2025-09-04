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

export const GET_SERVICE = gql`
  query Service($id: UUID!) {
    service(id: $id) {
      id
      name
      isGloballyActive
      # 🔜 Quand le schéma exposera les tickets côté Service :
      # tickets {
      #   id
      #   code
      #   status
      #   createdAt
      #   updatedAt
      #   firstName
      #   lastName
      # }
    }
  }
`;

export const CREATE_SERVICE = gql`
  mutation CreateService($data: CreateServiceInput!) {
    createService(data: $data) {
      id
      name
      isGloballyActive
    }
  }
`;

export const UPDATE_SERVICE = gql`
  mutation UpdateService($id: UUID!, $data: UpdateServiceInput!) {
    updateService(id: $id, data: $data) {
      success
      message
    }
  }
`;

export const DELETE_SERVICE = gql`
  mutation DeleteService($id: UUID!) {
    deleteService(id: $id) {
      success
      message
    }
  }
`;

export const TOGGLE_GLOBAL_ACCESS_SERVICE = gql`
  mutation ToggleGlobalAccessService($toggleGlobalAccessServiceId: UUID!) {
    toggleGlobalAccessService(id: $toggleGlobalAccessServiceId) {
      success
      message
    }
  }
`;

        



