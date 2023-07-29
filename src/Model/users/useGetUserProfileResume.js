import { gql, useLazyQuery } from '@apollo/client'

const GET_USER_RESUME = gql`
  query getResume {
    getResumeProfile {
    	avatar {
    	  image
        baseCdn
        folder
    	}
      firstName
      lastName
      chats {
        id
        avatar {
          baseCdn
          image
          folder
        }
      }
      statistics {
        meLikes
        centersLikes
        messages
      }
    }
  }
`

export const useGetUserProfileResume = () => {
  return useLazyQuery(
    GET_USER_RESUME,
    {
      fetchPolicy: 'network-only'
    }
  )
}

export default useGetUserProfileResume