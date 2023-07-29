import { gql, useLazyQuery } from '@apollo/client'

const GET_COMMUNE = gql`
  query {
  	getAllSports {
        id
        name
		isParalympic
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
