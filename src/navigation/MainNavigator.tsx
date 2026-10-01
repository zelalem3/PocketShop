import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MainApp from '../features/home/Screens/MainApp';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={MainApp}
        options={{
          title: 'PocketShop',
        }}
      />
    </Stack.Navigator>
  );
}