import { gql } from "@apollo/client";

export const CREATE_COMPANY = gql`
  mutation Mutation($data: CreateCompanyInput!) {
    createCompany(data: $data) {
      id
    }
  }
`;
