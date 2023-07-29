import { createNativeStackNavigator } from '@react-navigation/native-stack';


import EventosListScreen from '../Screens/Eventos/EventosListScreen';
import EventosScreen from '../Screens/Eventos/EventosScreen';



const Stack = createNativeStackNavigator();

export default function EventosRouter({ navigation }) {

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="EventosList" component={EventosListScreen}/>
      <Stack.Screen name="Eventos" component={EventosScreen}/>
    </Stack.Navigator>
  )
}