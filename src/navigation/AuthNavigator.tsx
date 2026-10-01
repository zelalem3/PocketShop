import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../features/auth/screens/LoginScreen';
import SignupScreen from '../features/auth/screens/SignupScreen';
import VerifyEmailScreen from '../features/auth/screens/VerifyEmailScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Register"
        component={SignupScreen}
      />
      <Stack.Screen
      name="emailVerification"
      component={VerifyEmailScreen}
      />

      <Stack.Screen
        name="ForgotPassword"
        component={() => null}
      />
    </Stack.Navigator>
  );
}