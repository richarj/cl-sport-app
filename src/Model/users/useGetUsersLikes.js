import { gql, useLazyQuery } from '@apollo/client'

const GET_USERS_LIKES = gql`
  query useGetUsersLikes(
  	$locationIds: [ID!]!,
  	$limit: Int,
  	$next: String,
  	$previous: String,
  	$sortField: String
  ) {
    getUsersPaginated(
    	locationIds: $locationIds,
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
        id
        firstName
        lastName
        avatar {
          image
          baseCdn
          folder
        }
        comments
        likesLocations
      }
    }
  }
`

export const useGetUsersLikes = () => {
  return useLazyQuery(
    GET_USERS_LIKES,
    {
      fetchPolicy: 'network-only'
    }
  )
}

export default useGetUsersLikes