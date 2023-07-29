import {useContext, useEffect, useState} from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthenticatedUserContext } from '../Providers/AuthenticatedUserProvider'
import {SingnedUserContext} from '../Providers/SingnedUserProvider';
import SignInScreen from '../Screens/AuthScreens/SignInScreen'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Config/firebase'
import SignUpScreen from "../Screens/AuthScreens/SignUpScreen";
import ResetScreen from "../Screens/AuthScreens/ResetScreen";
import SignOutScreen from "../Screens/AuthScreens/SignOutScreen";
import AppRouter from "./AppRouter";



import LoadingIndicator from '../Components/LoadingIndicator';



const Stack = createNativeStackNavigator();
const AuthRouter = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  const { isSingned } = useContext(SingnedUserContext);
  const [userTemp, setUserTemp] = useState(null)

  useEffect(() => {
    const unsubscribeAuthStateChanged = onAuthStateChanged(
      auth,
      authenticatedUser => {
        authenticatedUser?.emailVerified ? setUserTemp(authenticatedUser) : setUserTemp(null);
        setIsLoading(false);
      }
    );
    return unsubscribeAuthStateChanged;
  }, [user]);

  useEffect(() => {
    if (!userTemp || !isSingned) return
    isSingned ? setUser(userTemp) : setUser(null);
  }, [isSingned])

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return(
    <NavigationContainer>
          {
            user
              ?
                <AppRouter />
              : 
                <Stack.Navigator screenOptions={{headerShown: false }}>
                  <Stack.Screen name="SignInScreen" component={SignInScreen}/>
                  <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
                  <Stack.Screen name="ResetScreen" component={ResetScreen} />
                  <Stack.Screen name="SignOutScreen" component={SignOutScreen} />
                </Stack.Navigator>

          }
    </NavigationContainer>        
  )
}

export default AuthRouter

