import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {MyTabs} from '../components/bottomtab';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="MainTabs"
        component={MyTabs}
      />
    </Stack.Navigator>
  );
}