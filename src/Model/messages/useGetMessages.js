import { gql, useLazyQuery } from '@apollo/client'

const GET_USERS_LIKES = gql`
  query useGetMessages(
  	$roomId: ID!,
  	$limit: Int,
  	$next: String,
  	$previous: String,
  	$sortField: String
  ) {
    getMessages(
    	roomId: $roomId,
        limit: $limit,
        next: $next,
        previous: $previous,
        sortField: $sortField
    ) {
    	hasNext
    	hasPrevious
    	next
    	previous
    	totalDocs
    	docs {
            attachments {
                baseCdn
                folder
                image
            }
            author {
                id
                firstName
                lastName
                avatar
            }
            content
            id
      }
    }
  }
`

export const useGetMessages = () => {
  return useLazyQuery(
    GET_USERS_LIKES,
    {
      fetchPolicy: 'network-only'
    }
  )
}

export default useGetMessages