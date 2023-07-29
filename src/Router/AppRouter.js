import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NoticiasRouter from "./NoticiasRouter";
import EventosRouter from "./EventosRouter";
import VideosRouter from "./VideosRouter";
import ProfileScreen from "../Screens/Profile/ProfileScreen";
import HomeScreen from "../Screens/Home/HomeScreen";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Text, View} from "react-native";
import EditProfile from "../Screens/Profile/EditProfile";
import Center from "../Components/Center";
import Comments from '../Components/Comments';
import MapScreen from "../Screens/Home/MapScreen";

import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MapScene from '../Components/MapView';


  const home = ({ color, size }) => <Entypo name="home" size={size} color={color}/>
  const profile = ({ color, size }) => <FontAwesome name="user" size={24} color={color} />
  const mapRouter = ({ color, size }) => <Feather name="search" size={size} color={color}/>
  const menu = ({ color, size }) => <Ionicons name="book-outline" size={size} color={color}/>
  const news = ({ color, size }) => <Ionicons name="newspaper-outline" size={size} color={color} />
  const event = ({ color, size }) => <MaterialIcons name="handball" size={size} color={color} />
  const videos = ({ color, size }) => <Entypo name="folder-video" size={size} color={color}/>
  const OptionsScreen = () => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
        <Text>OPtions</Text>
      </View>
    )
  }

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function EmptyScreen() {
  return <View />;
}

function HomeTabs() {
  const screenOptions = {
    headerShown: false,
    tabBarShowLabel: false,
    tabBarActiveTintColor: '#2288DC',
    tabBarInactiveTintColor: 'gainsboro',
    tabBarStyle: {
      borderTopWidth: 0,
      elevation: 0
    },
  }
  return (
    <Tab.Navigator screenOptions={ screenOptions } initialRouteName="HomeRouter">
      {/* <Tab.Screen name="MenuRouter" component={MenuRouter} options={{tabBarIcon: home }}/> */}
      {/* <Tab.Screen name="MapRouter" component={MapRouter} options={{tabBarIcon: mapRouter }}/> */}

      <Tab.Screen name="NoticiasRouter" component={NoticiasRouter} options={{tabBarIcon: news }}/>
      <Tab.Screen name="EventosRouter" component={EventosRouter} options={{tabBarIcon: event }}/>
      <Tab.Screen name="HomeRouter" component={HomeScreen} options={{tabBarIcon: home }}/>
      <Tab.Screen name="VideosRouter" component={VideosRouter} options={{tabBarIcon: videos }}/>
      <Tab.Screen name="ProfileRouter" component={ProfileScreen} options={{tabBarIcon: profile}}/>
    </Tab.Navigator>

  );
}

const AppRouter = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeTabs" component={HomeTabs} options={{headerShown: false}} />
      <Stack.Screen name="EditProfile" component={EditProfile} options={{headerTitle: 'Editar Perfil', headerBackTitle: 'Atr', headerBackTitleVisible: true }} />
      <Stack.Screen name="ViewMap" component={MapScene} options={{headerTitle: 'Ver Ubicación', headerBackTitle: 'Atr'}} />
      <Stack.Screen name="Center" component={Center} options={{headerShown: false}} />
      <Stack.Screen name="Comments" component={Comments} options={{headerShown: false}} />
      <Stack.Screen name="Map" component={MapScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  )
}

export default AppRouter
