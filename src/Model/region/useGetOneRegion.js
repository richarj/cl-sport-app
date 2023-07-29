import { gql, useLazyQuery } from '@apollo/client'

const GET_REGION = gql`
  query useGetOneRegion($regionId: ID!, $apiKeyId: ID!) {
    freeGetOneRegion(regionId: $regionId, apiKeyId: $apiKeyId) {
      	communes {
            id
            name
        }
    }
  }
`
export default (onSuccess, onError) => {
	const [submit, loading] = useLazyQuery(
		GET_REGION,
		{
			onCompleted: onSuccess,
			onError: onError,
		}
	)

	return {submit, loading}
}