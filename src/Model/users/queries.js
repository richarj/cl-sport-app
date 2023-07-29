import {gql} from "@apollo/client";

export const SET_AVATAR = gql`
  mutation($file: Upload!) {
    setAvatar(file: $file) {
      avatar
      success
    }
  }
`;

export const SET_BASIC_DATA = gql`
  mutation($input: BasicDataInput!) {
    updateBasicData(input: $input) 
  }
`;