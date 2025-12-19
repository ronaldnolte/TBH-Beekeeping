import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from './src/screens/LoginScreen';
import ApiarySelectionScreen from './src/screens/ApiarySelectionScreen';
import ApiaryDashboardScreen from './src/screens/ApiaryDashboardScreen';
import HiveDetailsScreen from './src/screens/HiveDetailsScreen';

export type RootStackParamList = {
  Login: undefined;
  ApiarySelection: undefined;
  ApiaryDashboard: { apiaryId: string };
  HiveDetails: { hiveId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#E67E22',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ApiarySelection"
          component={ApiarySelectionScreen}
          options={{ title: 'Select Apiary', headerLeft: () => null }}
        />
        <Stack.Screen
          name="ApiaryDashboard"
          component={ApiaryDashboardScreen}
          options={{ title: 'Apiary Dashboard' }}
        />
        <Stack.Screen
          name="HiveDetails"
          component={HiveDetailsScreen}
          options={{ title: 'Hive Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
