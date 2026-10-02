import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MainApp from '../features/home/Screens/MainApp';
import CartScreen from '../features/cart/screens/cartScreen';
import CheckoutScreen from '../features/orders/Screens/Checkout';


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
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'Cart' }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          title: 'Checkout',
        }}
      />
    </Stack.Navigator>
    

  );
}