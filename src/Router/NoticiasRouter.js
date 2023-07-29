import { createNativeStackNavigator } from '@react-navigation/native-stack';


import NewsListScreen from '../Screens/Noticias/NewsListScreen';
import NewsScreen from '../Screens/Noticias/NewsScreen';



const Stack = createNativeStackNavigator();

export default function NoticiasRouter({ navigation }) {

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="NewsList" component={NewsListScreen}/>
      <Stack.Screen name="News" component={NewsScreen}/>
    </Stack.Navigator>
  )
}