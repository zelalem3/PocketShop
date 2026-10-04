import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MainApp from '../features/home/Screens/MainApp';
import CartScreen from '../features/cart/screens/cartScreen';
import Checkout from '../features/orders/Screens/Checkout';
import PaymentSuccess from '../features/orders/Screens/PaymentSuccess';
import OrderDetailScreen from '../features/orders/Screens/OrderDetailScreen';
import OrderListScreen from '../features/orders/Screens/OrderListScreen';

export type MainStackParamList = {
  Home: undefined;
  Cart: undefined;

  Checkout: {
    items: Array<{
      productId: string;
      name: string;
      price: number;
      quantity: number;
    }>;
  };

  PaymentSuccess: {
    merchantReference: string;
    items: Array<{
      productId: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    subtotal: number;
    deliveryFee: number;
    total: number;
    fullName: string;
    phone: string;
    address: string;
  };

  OrderList: undefined;

  OrderDetail: {
    orderId: string;
  };
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={MainApp} />

      <Stack.Screen name="Cart" component={CartScreen} />

      <Stack.Screen name="Checkout" component={Checkout} />

      <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />

      <Stack.Screen name="OrderList" component={OrderListScreen} />

      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </Stack.Navigator>
  );
}