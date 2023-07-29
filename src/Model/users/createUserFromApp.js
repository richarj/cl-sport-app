//import { gql, useMutation } from '@apollo/client';
//const CREATE_USER = gql`
//  mutation ($userInput: CreateUserFromAppInput!) {
//    createUserFromApp( userInput: $userInput)
//  }
//`
//export default (onSuccess, onError) => {
//	const [submit, { data, loading, error }]= useMutation(
//		CREATE_USER,
//		{
//			onCompleted: onSuccess,
//			onError: onError
//		}
//	)
//	return {submit, loading, error, data}
//}

import { useCallback, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
export default (onSuccess, onError) => {
	const [mutation, { data, error, loading }] = useMutation(
		gql`mutation createUser($userInput: CreateUserFromAppInput!) {
    			createUserFromApp( userInput: $userInput)
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
	return { loading, data: data ?? null, error, validationErrors, submit }
}