import { gql, useLazyQuery } from '@apollo/client'

const GET_COMMUNE = gql`
  query useGetLocationById($locationId: ID!) {
    getOneLocation(locationId: $locationId) {
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
    }
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