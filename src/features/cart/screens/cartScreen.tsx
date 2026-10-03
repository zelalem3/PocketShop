import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import type {MainStackParamList} from '../../../navigation/MainNavigator';
import { useAuthStore } from '../../../store/authStore';
import { fetchUserCart } from '../../../services/firestore/firestoreService';

export default function CartScreen() {

  const navigation =
  useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useAuthStore(state => state.user);

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  
  useFocusEffect(
    useCallback(() => {
      const loadCart = async () => {
        if (!user?.uid) return;

        try {
          setLoading(true);
          const cart = await fetchUserCart(user.uid);
          setCartItems(cart?.items || []);
        } catch (error) {
          console.error('Failed to load cart:', error);
        } finally {
          setLoading(false);
        }
      };

      loadCart();
    }, [user?.uid]),
  );

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cart</Text>
        <Text style={styles.subtitle}>
          {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Pressable
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Continue Shopping</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={item => item.productId}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.quantity}>Qty: {item.quantity}</Text>
                  <Text style={styles.price}>
                    ETB {(item.price * item.quantity).toLocaleString()}
                  </Text>
                </View>
              </View>
            )}
          />

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ETB {total.toLocaleString()}
              </Text>
            </View>

            <Pressable
  style={styles.checkoutButton}
  onPress={() =>
    navigation.navigate('Checkout', {
      items: cartItems,
    })
  }>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  list: {
    padding: 24,
    paddingTop: 8,
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  cardInfo: {
    gap: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  quantity: {
    fontSize: 14,
    color: '#6b7280',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  checkoutButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#111827',
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});