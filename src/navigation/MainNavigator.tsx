import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MainApp from '../features/home/Screens/MainApp';
import CartScreen from '../features/cart/screens/cartScreen';
import Checkout from '../features/orders/Screens/Checkout';

export type MainStackParamList = {
  Home: undefined;
  Cart: undefined;
  Checkout: {
    items: any[];
  };
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={MainApp}
        options={{title: 'PocketShop'}}
      />

      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{title: 'My Cart'}}
      />

      <Stack.Screen
        name="Checkout"
        component={Checkout}
        options={{title: 'Checkout'}}
      />
    </Stack.Navigator>
  );
}