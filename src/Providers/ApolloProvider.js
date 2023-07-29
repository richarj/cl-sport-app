import React, { useEffect, useState } from 'react'
import { ApolloProvider as RawApolloProvider, ApolloClient, InMemoryCache} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import {createUploadLink} from 'apollo-upload-client'

import { auth } from '../Config/firebase'

const url_local = 'http://localhost:3000'
const url_production = 'https://api.chilehacedeporte.cl'
const httpLink = new createUploadLink({
  uri: `${url_production}/graphql`,

})

function ApolloProvider({ children }) {
  const [client, setClient] = useState(new ApolloClient({ cache: new InMemoryCache(), link: httpLink }))
  const [_, setFirebaseAuth] = useState(false)
  useEffect(() => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const asyncAuthLink = setContext(
            request =>
              new Promise((success, fail) => {
                // do some async lookup here
                user.getIdToken().then((token) => {
                  success({
                    headers: { authorization: `Bearer ${token}` }
                  })
                }).catch(fail)
              })
          )
          setClient(
            new ApolloClient({
              cache: new InMemoryCache(),
              link: asyncAuthLink.concat(httpLink)
            })
          )
          setFirebaseAuth(true)
        } else {
          setFirebaseAuth(false)
        }
      })
  }, [])
  return <RawApolloProvider client={client}>{children}</RawApolloProvider>
}

export default ApolloProvider

