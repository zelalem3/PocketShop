import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation';
import {firebase} from '@react-native-firebase/app'; 

export default function App() {
  useEffect(() => {
    console.log('Firebase Initialized:', firebase.apps.length > 0);
  }, []);
  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}