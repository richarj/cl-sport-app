import { gql, useLazyQuery } from '@apollo/client'

const GET_LOCATIONS = gql`
  query useGetLocations(
  	$regionIds: [ID!]!,
  	$communeIds: [ID!]!,
  	$sports: [String!]!,
    $isParalympic: Boolean,
  	$search: String,
  	$limit: Int,
  	$next: String,
  	$previous: String,
  	$sortField: String
  ) {
    allPaginateLocations(
    	regionIds: $regionIds,
    	communeIds: $communeIds,
    	sports: $sports,
    	search: $search,
			limit: $limit,
			next: $next,
			previous: $previous,
			sortField: $sortField,
      isParalympic: $isParalympic
    ) {
    	hasNext
    	hasPrevious
    	next
    	previous
    	totalDocs
    	docs {
        id
        administration
        email
        horario
        image
        isOwnImage
        location {
            address
            number
            communeId
            regionId
            latitude
            longitude
            communeName
        }
        name
        phone
        sport
        type
        web
        info
        likes
      }
    }
  }
`

export const useGetLocations = () => {
	return useLazyQuery(
		GET_LOCATIONS,
		{
			fetchPolicy: 'no-cache'
		}
	)
}

export default useGetLocations