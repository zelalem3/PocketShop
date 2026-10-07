import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Home,
  ShoppingCart,
  User,
  ClipboardList,
} from 'lucide-react-native';

import HomeStack from './HomeStack';
import ProfileScreen from '../features/Profile/Screen/ProfileScreen';
import OrderListScreen from '../features/orders/Screens/OrderListScreen';
import CartScreen from '../features/cart/screens/cartScreen';
import WishListScreen from '../features/wishlist/Screens/wishListScreen';

const Tab = createBottomTabNavigator();

export function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,

        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#64748B',

        tabBarIcon: ({color, size}) => {
          if (route.name === 'Home') {
            return <Home size={size} color={color} />;
          }

          if (route.name === 'Orders') {
            return <ClipboardList size={size} color={color} />;
          }

          if (route.name === 'Cart') {
            return <ShoppingCart size={size} color={color} />;
          }

          if (route.name === 'Profile') {
            return <User size={size} color={color} />;
          }
          

          return null;
        },
      })}>
      
      <Tab.Screen
        name="Home"
        component={HomeStack}
      />

      <Tab.Screen
        name="Orders"
        component={OrderListScreen}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />

    </Tab.Navigator>
  );
}