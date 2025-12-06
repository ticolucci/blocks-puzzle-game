import React from 'react';
import {Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import {registerServiceWorker} from './utils/registerServiceWorker';

const Stack = createNativeStackNavigator();

export default function App() {
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      registerServiceWorker();
    }
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Blocks Puzzle Game'}}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{title: 'Game'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
