import { gql } from "@apollo/client";

export const CREATE_MESSAGE = gql`mutation ($roomId: ID!, $content: String!, $file: Upload) {
    createMessage(roomId: $roomId, content: $content, file: $file) {
            message {
                id
            }
        }
    }`
