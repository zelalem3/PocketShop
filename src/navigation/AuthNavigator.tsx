import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={() => null}
      />
      <Stack.Screen
        name="Register"
        component={() => null}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={() => null}
      />
    </Stack.Navigator>
  );
}