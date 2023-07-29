import { useCallback, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
export default (onSuccess, onError) => {
  const [mutation, { data, error, loading }] = useMutation(
    gql`mutation ($locationId: ID!, $like: Boolean!) {
        addRemoveLike(locationId: $locationId, like: $like)
    }`
  )
  const [validationErrors, setValidationErrors] = useState({})
  const submit = useCallback((obj) => {
    mutation({ variables: obj }).then((result) => {
      onSuccess(result)
    }).catch((e) => {
      setValidationErrors({ general: 'misc.apiError' })
      onError(e)
    })
  }, [mutation, onSuccess, onError])
  return { loading, data: data ? data.addRemoveLike : null, error, submit }
}
