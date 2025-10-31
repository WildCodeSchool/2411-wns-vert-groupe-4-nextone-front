import { gql } from "@apollo/client";

export const TOGGLE_MANAGER_GLOBAL_ACCESS = gql`
  mutation Mutation($toggleGlobalAccessManagerId: UUID!) {
    toggleGlobalAccessManager(id: $toggleGlobalAccessManagerId) {
      success
    }
  }
`;

export const DELETE_MANAGER = gql`
  mutation DeleteManager($deleteManagerId: ID!) {
    deleteManager(id: $deleteManagerId) {
      success
    }
  }
`;

export const CREATE_MANAGER_FROM_INVITATION = gql`
  mutation CreateManagerFromInvitation($infos: InputRegister!) {
    createManager(infos: $infos) {
      id
      firstName
      lastName
    }
  }
`;
