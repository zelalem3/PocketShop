import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {confirmPayment} from '../../../services/payment/chapaService';
import { createOrder } from '../../../services/order/orderService';
import {useAuthStore} from '../../../store/authStore';
import type {MainStackParamList} from '../../../navigation/MainNavigator';

type RouteParams = MainStackParamList['PaymentSuccess'];

export default function PaymentSuccessScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute();
  const user = useAuthStore(state => state.user);

  const {
    merchantReference,
    items,
    subtotal,
    deliveryFee,
    total,
    fullName,
    phone,
    address,
  } = (route.params || {}) as RouteParams;

  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>(
    'idle',
  );
  const [message, setMessage] = useState(
    'Complete payment in the browser, then tap “I’ve paid”.',
  );

  const runVerify = useCallback(async () => {
    try {
      setStatus('verifying');
      setMessage('Checking payment with Chapa...');

      if (!merchantReference || !user?.uid || !user.email) {
        setStatus('failed');
        setMessage('Missing payment or user information.');
        return;
      }

      const isPaid = await confirmPayment(merchantReference, 3, 4000);

      if (!isPaid) {
        setStatus('failed');
        setMessage(
          'Payment not confirmed yet. Finish paying on Chapa, then tap “I’ve paid” again.',
        );
        return;
      }

      await createOrder({
        userId: user.uid,
        email: user.email,
        fullName,
        phone,
        address,
        items,
        subtotal,
        deliveryFee,
        total,
        merchantReference,
        paymentStatus: 'paid',
      });

      setStatus('success');
      setMessage('Payment successful! Your order has been placed.');
    } catch (error) {
      console.error('Payment success flow error:', error);
      setStatus('failed');
      setMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong while confirming payment.',
      );
    }
  }, [
    merchantReference,
    user,
    fullName,
    phone,
    address,
    items,
    subtotal,
    deliveryFee,
    total,
  ]);

  // Optional soft auto-check after 20s (user may still be paying)
  useEffect(() => {
    const t = setTimeout(() => {
      if (status === 'idle') {
        runVerify();
      }
    }, 20000);
    return () => clearTimeout(t);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {status === 'verifying' && (
          <>
            <ActivityIndicator size="large" color="#111827" />
            <Text style={styles.title}>Confirming payment</Text>
            <Text style={styles.subtitle}>{message}</Text>
          </>
        )}

        {(status === 'idle' || status === 'failed') && (
          <>
            <Text style={styles.emoji}>
              {status === 'failed' ? '⚠️' : '💳'}
            </Text>
            <Text style={styles.title}>
              {status === 'failed' ? 'Not confirmed yet' : 'Complete payment'}
            </Text>
            <Text style={styles.subtitle}>{message}</Text>
            <Text style={styles.ref}>Ref: {merchantReference}</Text>

            <Pressable style={styles.button} onPress={runVerify}>
              <Text style={styles.buttonText}>I've paid – verify</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.goBack()}>
              <Text style={[styles.buttonText, styles.secondaryText]}>
                Go back
              </Text>
            </Pressable>
          </>
        )}

        {status === 'success' && (
          <>
            <Text style={styles.emoji}>✅</Text>
            <Text style={styles.title}>Payment successful</Text>
            <Text style={styles.subtitle}>{message}</Text>
            <Text style={styles.ref}>Ref: {merchantReference}</Text>

            <Pressable
              style={styles.button}
              onPress={() => navigation.navigate('Home')}>
              <Text style={styles.buttonText}>Back to Home</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  ref: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 12,
  },
  button: {
    marginTop: 20,
    minWidth: 220,
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryText: {
    color: '#111827',
  },
});