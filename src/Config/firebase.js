import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// add firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBqZ01G3vKmPcF3roe0wskU2_xF3T8nOl4",
  authDomain: "chilehacedeporte.firebaseapp.com",
  projectId: "chilehacedeporte",
  storageBucket: "chilehacedeporte.appspot.com",
  messagingSenderId: "518199596127",
  appId: "1:518199596127:web:7d37f2bb98e1de349837ea",
};

// initialize firebase
const app = initializeApp(firebaseConfig);

// initialize auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth, app };
