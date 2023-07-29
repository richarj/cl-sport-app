import { gql, useLazyQuery } from '@apollo/client'

const useMe = () => {
  return useLazyQuery(
    gql`query($platForm: PlatFormEnum!) {
          me(platForm: $platForm) {
            firstName
            lastName
            roles
            userToken
            settingsSearch {
              communeId,
              regionsId,
              sportId
            }
            likesLocations
          }
        }`,
    {
      fetchPolicy: 'no-cache'
    }
  )
}
export default useMe