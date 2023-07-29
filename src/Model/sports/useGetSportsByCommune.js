import { gql, useLazyQuery } from '@apollo/client'

const GET_COMMUNE = gql`
  query useGetSportsByCommune($communeId: ID!, $apiKeyId: ID!) {
    freeGetSportsByCommune(communeId: $communeId, apiKeyId: $apiKeyId)
  }
`
export default (onSuccess, onError) => {
	const [submit, loading] = useLazyQuery(
		GET_COMMUNE,
		{
			onCompleted: onSuccess,
			onError: onError,
		}
	)
	return {submit, loading}
}