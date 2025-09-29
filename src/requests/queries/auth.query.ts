import { gql } from "@apollo/client";

export const LOGIN = gql`
  query Login($infos: InputLogin!) {
    login(infos: $infos) {
      token
    }
  }
`;

export const CHECK_TOKEN = gql`
  query CheckToken {
    checkToken {
      email
      firstName
      id
      lastName
    }
  }
`;

export const LOGOUT = gql`
  query Logout {
    logout {
      message
      success
    }
  }
`;
