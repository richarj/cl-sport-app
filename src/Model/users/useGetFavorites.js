import { gql, useLazyQuery } from '@apollo/client'

const GET_USERS_FAVORITES = gql`
  query useGetFavorites(
  	$page: Int!,
  	$limit: Int!
  ) {
    getFavorites(
			page: $page,
			limit: $limit,
    ) {
    	items {
        id
        image
      }
      meta {
        totalItems
        itemCount
        itemsPerPage
        totalPages
        currentPage
      }
    }
  }
`

export const useGetFavorites = () => {
  return useLazyQuery(
    GET_USERS_FAVORITES,
    {
      fetchPolicy: 'network-only'
    }
  )
}

export default useGetFavorites