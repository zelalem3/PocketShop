import React, {useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import {useAuthStore} from '../../../store/authStore';
import {auth} from '../../../config/firebase';

export default function LoginScreen() {
  const navigation = useNavigation<any>();

  const login = useAuthStore(state => state.login);
  const loading = useAuthStore(state => state.loading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      await login(email.trim(), password);

      const user = auth.currentUser;

      if (!user?.emailVerified) {
        navigation.navigate('EmailVerification');
      }
    } catch (err: any) {
      console.log(err);

      setError(err?.message || 'Unable to sign in.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome back</Text>

          <Text style={styles.subtitle}>
            Sign in to continue shopping.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <Text style={styles.label}>Password</Text>

            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            {error ? (
              <Text style={styles.error}>{error}</Text>
            ) : null}

            <Pressable
              style={[
                styles.button,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </Pressable>

            <Pressable
              style={styles.signUpButton}
              onPress={() => navigation.navigate('Register')}
              disabled={loading}>
              <Text style={styles.signUpText}>
                Don't have an account?{' '}
                <Text style={styles.signUpLink}>Sign up</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
  },

  form: {
    width: '100%',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
  },

  error: {
    color: '#dc2626',
    marginBottom: 16,
  },

  button: {
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  signUpButton: {
    marginTop: 20,
    alignItems: 'center',
  },

  signUpText: {
    fontSize: 14,
    color: '#666666',
  },

  signUpLink: {
    color: '#111827',
    fontWeight: '600',
  },
});

