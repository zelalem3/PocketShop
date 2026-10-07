import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MainApp from '../features/home/Screens/MainApp';
import ProductDetailScreen from '../features/products/Screens/productDetail';
import Checkout from '../features/orders/Screens/Checkout';
import PaymentSuccess from '../features/orders/Screens/PaymentSuccess';
import WishListScreen from '../features/wishlist/Screens/wishListScreen';
import ReviewScreen from '../features/reviews/Screens/ReviewScreen';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Home"
        component={MainApp}
      />

      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
      />

      <Stack.Screen
        name="Checkout"
        component={Checkout}
      />

      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccess}
      />

      <Stack.Screen
      name="WishList"
      component={WishListScreen}
      />
      <Stack.Screen name="ReviewScreen" component={ReviewScreen} />

    </Stack.Navigator>
  );
}