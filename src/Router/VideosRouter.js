import { createNativeStackNavigator } from '@react-navigation/native-stack';


import VideosScreen from '../Screens/Videos/VideosScreen';



const Stack = createNativeStackNavigator();

export default function VideosRouter({ navigation }) {

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Videos" component={VideosScreen}/>
    </Stack.Navigator>
  )
}