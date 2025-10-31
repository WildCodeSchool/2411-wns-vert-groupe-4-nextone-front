import { gql } from "@apollo/client";

export const GET_INVITATION_BY_TOKEN = gql`
  query InvitationByToken($token: String!) {
    invitationByToken(token: $token) {
      id
      company {
        name
      }
      email
      role
      tokenExpiration
      createdAt
      updatedAt
    }
  }
`;
