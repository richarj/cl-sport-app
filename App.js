import React, { useState } from 'react'
import AuthRouter from './src/Router/AuthRouter'
import ActionsContext from './src/Contexts/ActionsContext'
import ApolloProvider from './src/Providers/ApolloProvider'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { RootSiblingParent } from 'react-native-root-siblings'


const App = () => {
  const [action, setAction] = useState({})
  const changeAction = async (action) => {
    // await AsyncStorage.setItem("profile", JSON.stringify(action))
    setAction(action)
  }
  return (
    <ActionsContext.Provider
      value={{ action, changeAction }}>
      <ApolloProvider>
        <SafeAreaProvider>
          <RootSiblingParent>
            <AuthRouter />
          </RootSiblingParent>
        </SafeAreaProvider>
      </ApolloProvider>
    </ActionsContext.Provider>
  );
}

export default App

