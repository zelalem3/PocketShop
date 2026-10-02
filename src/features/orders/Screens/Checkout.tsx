import React, {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import {useAuthStore} from '../../../store/authStore';
import {initializeChapaPayment} from '../../../services/payment/chapaService';

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type CheckoutRouteParams = {
  items: CartItem[];
};

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const user = useAuthStore(state => state.user);

  const {items = []} = (route.params || {}) as CheckoutRouteParams;

  const [fullName, setFullName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }, [items]);

  const deliveryFee: number = 0;

  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
  setError('');

  if (!fullName.trim()) {
    setError('Please enter your full name.');
    return;
  }

  if (!phone.trim()) {
    setError('Please enter your phone number.');
    return;
  }

  if (!address.trim()) {
    setError('Please enter your delivery address.');
    return;
  }

  if (items.length === 0) {
    setError('Your cart is empty.');
    return;
  }

  if (!user?.uid || !user.email) {
    setError('You must be signed in to continue.');
    return;
  }

  try {
    setLoading(true);

    // Must be ≤ 20 characters for Chapa
    // Example result: "PS1748293017" (12 chars)
    const merchantReference = `PS${Date.now().toString().slice(-10)}`;

    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || fullName.trim();
    const lastName = nameParts.slice(1).join(' ') || firstName;

    const checkoutUrl = await initializeChapaPayment({
      amount: total,
      merchantReference,
      customer: {
        first_name: firstName,
        last_name: lastName,
        email: user.email,
        phone_number: phone.trim(),
      },
      orderId: merchantReference, // optional, you can also store the real order id later
    });

    console.log('Chapa checkout URL:', checkoutUrl);
    console.log('Chapa merchant reference:', merchantReference);

    const supported = await Linking.canOpenURL(checkoutUrl);

    if (!supported) {
      throw new Error('Unable to open the Chapa checkout page.');
    }

    await Linking.openURL(checkoutUrl);

    // Do NOT create the Firestore order here.
    // Wait for payment verification / webhook first.
  } catch (error) {
    console.error('Failed to initialize Chapa payment:', error);

    setError(
      error instanceof Error
        ? error.message
        : 'Unable to start payment. Please try again.',
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">

        {/* Header */}

        <Text style={styles.title}>
          Checkout
        </Text>

        <Text style={styles.subtitle}>
          Enter your delivery information
        </Text>

        {/* Delivery Information */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Delivery Information
          </Text>

          <Text style={styles.label}>
            Full name
          </Text>

          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            placeholderTextColor="#9ca3af"
            style={styles.input}
            editable={!loading}
          />

          <Text style={styles.label}>
            Phone number
          </Text>

          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="+2519XXXXXXXX"
            placeholderTextColor="#9ca3af"
            keyboardType="phone-pad"
            style={styles.input}
            editable={!loading}
          />

          <Text style={styles.label}>
            Delivery address
          </Text>

          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your delivery address"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={[
              styles.input,
              styles.addressInput,
            ]}
            editable={!loading}
          />
        </View>

        {/* Payment Method */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Payment Method
          </Text>

          <View style={styles.paymentCard}>
            <View style={styles.radioOuter}>
              <View style={styles.radioInner} />
            </View>

            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>
                Chapa
              </Text>

              <Text style={styles.paymentSubtitle}>
                Secure online payment
              </Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Order Summary
          </Text>

          {items.map(item => (
            <View
              key={item.productId}
              style={styles.itemRow}>

              <View style={styles.itemInfo}>
                <Text
                  style={styles.itemName}
                  numberOfLines={2}>
                  {item.name}
                </Text>

                <Text style={styles.itemQuantity}>
                  Qty: {item.quantity}
                </Text>
              </View>

              <Text style={styles.itemPrice}>
                ETB{' '}
                {(item.price * item.quantity).toLocaleString()}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          {/* Subtotal */}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Subtotal
            </Text>

            <Text style={styles.summaryValue}>
              ETB {subtotal.toLocaleString()}
            </Text>
          </View>

          {/* Delivery */}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Delivery
            </Text>

            <Text style={styles.summaryValue}>
              {deliveryFee === 0
                ? 'Free'
                : `ETB ${deliveryFee.toLocaleString()}`}
            </Text>
          </View>

          {/* Total */}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Total
            </Text>

            <Text style={styles.totalValue}>
              ETB {total.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Error */}

        {error ? (
          <Text style={styles.error}>
            {error}
          </Text>
        ) : null}

        {/* Payment Button */}

        <Pressable
          style={[
            styles.placeOrderButton,
            loading && styles.disabledButton,
          ]}
          onPress={handlePlaceOrder}
          disabled={loading}>

          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.placeOrderText}>
              Pay with Chapa · ETB{' '}
              {total.toLocaleString()}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },

  content: {
    padding: 24,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 24,
  },

  section: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 7,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 9,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#111827',
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },

  addressInput: {
    height: 100,
    paddingTop: 12,
  },

  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#111827',
    borderRadius: 10,
    padding: 14,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#111827',
  },

  paymentInfo: {
    marginLeft: 12,
  },

  paymentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  paymentSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 3,
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  itemInfo: {
    flex: 1,
    paddingRight: 16,
  },

  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  itemQuantity: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 3,
  },

  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 6,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },

  summaryValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },

  totalLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  totalValue: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
  },

  error: {
    color: '#dc2626',
    fontSize: 14,
    marginBottom: 12,
  },

  placeOrderButton: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledButton: {
    opacity: 0.6,
  },

  placeOrderText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});