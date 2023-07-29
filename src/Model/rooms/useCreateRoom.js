import { gql } from "@apollo/client";

export const CREATE_MUTATION = gql`mutation ($recipientId: ID!, $chatType: TypeRecipientEnum!) {
        createRoom(recipientId: $recipientId, chatType: $chatType) {
            id
            creator {
                id,
                firstName,
                lastName
            }
            recipient {
                id,
                firstName,
                lastName
            }
            lastMessageSentId
        }
    }`
