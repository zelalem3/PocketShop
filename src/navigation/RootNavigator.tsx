import React, {useEffect} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import {useAuthStore} from '../store/authStore';
import VerifyEmailScreen from '../features/auth/screens/VerifyEmailScreen';

export default function RootNavigator() {
  const user = useAuthStore(state => state.user);
  const initialized = useAuthStore(state => state.initialized);
  const initialize = useAuthStore(state => state.initialize);

  useEffect(() => {
    const unsubscribe = initialize();

    return unsubscribe;
  }, [initialize]);

  if (!initialized) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <AuthNavigator />;
  }

  if (!user.emailVerified) {
    return <VerifyEmailScreen />;
  }

  return <MainNavigator />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});