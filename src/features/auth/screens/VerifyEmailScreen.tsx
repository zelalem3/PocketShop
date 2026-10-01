import React, {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  resendVerificationEmail,
  reloadCurrentUser,
} from '../../../services/auth/authService';
import {useNavigation} from '@react-navigation/native';


export default function VerifyEmailScreen() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation<any>();

  const handleResend = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await resendVerificationEmail();
      setMessage('Verification email sent. Check your inbox.');
      navigation.navigate("Home");
    } catch (error: any) {
      setError(
        error.message || 'Unable to send verification email.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const user = await reloadCurrentUser();

      if (user?.emailVerified) {
        setMessage('Email verified successfully.');

      } else {
        setError(
          'Your email is not verified yet. Please check your inbox.',
        );
      }
    } catch (error: any) {
      setError(
        error.message || 'Unable to check verification status.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Verify your email</Text>

        <Text style={styles.subtitle}>
          We sent a verification link to your email address.
        </Text>

        {message ? (
          <Text style={styles.message}>{message}</Text>
        ) : null}

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}

        <Pressable
          style={[styles.button, loading && styles.disabled]}
          onPress={handleCheckVerification}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>
              I've verified my email
            </Text>
          )}
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={handleResend}
          disabled={loading}>
          <Text style={styles.secondaryButtonText}>
            Resend verification email
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 24,
  },

  message: {
    color: '#16a34a',
    marginBottom: 16,
  },

  error: {
    color: '#dc2626',
    marginBottom: 16,
  },

  button: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  disabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  secondaryButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

