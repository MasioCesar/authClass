import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Home from './src/screens/Home';
import { getStorage } from 'firebase/storage';
import Profile from './src/screens/Profile';
import ToDoList from './src/screens/ToDoList';

const Stack = createStackNavigator();

const firebaseConfig = {
  apiKey: "AIzaSyCsWRw19_34bagg9Lp_miFLsiV31wPRaeA",
  authDomain: "fb-auth-22f03.firebaseapp.com",
  projectId: "fb-auth-22f03",
  storageBucket: "fb-auth-22f03.appspot.com",
  messagingSenderId: "28956194977",
  appId: "1:28956194977:web:e2fc4dc89ad6737ca118e0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

export default function App() {
  const authUser = getAuth();

  const [user, setUser] = useState(authUser.currentUser);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User logged in...");
      setUser(user);
    } else {
      console.log("User not logged in...");
      setUser(null);
    }
  });

  if (user) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
          <Stack.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
          <Stack.Screen name="ToDoList" component={ToDoList} options={{ title: 'ToDoList' }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
          <Stack.Screen name="Register" component={Register} options={{ title: 'Register' }} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

}