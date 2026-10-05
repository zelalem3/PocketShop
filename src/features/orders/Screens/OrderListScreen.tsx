// src/features/orders/Screens/OrderListScreen.tsx
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '../../../store/authStore';
import { getUserOrders } from '../../../services/order/orderService';
import { Order } from '../../../services/order/types';
import { MainStackParamList } from '../../../navigation/MainNavigator';

type Nav = NativeStackNavigationProp<MainStackParamList, 'OrderList'>;

export default function OrderListScreen() {
  const navigation = useNavigation<Nav>();
  const user = useAuthStore(s => s.user);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (!user?.uid) return;
    try {
      setError(null);
      const data = await getUserOrders(user.uid);
      setOrders(data);
    } catch (e) {
      console.error(e);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.uid]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadOrders();
    }, [loadOrders]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.empty}>No orders yet</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate('OrderDetail', { orderId: item.id })
            }
          >
            <View style={styles.row}>
              <Text style={styles.ref}>#{item.merchantReference}</Text>
              <Text
                style={[
                  styles.status,
                  item.paymentStatus === 'paid' && styles.paid,
                  item.paymentStatus === 'failed' && styles.failed,
                ]}
              >
                {item.paymentStatus.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.date}>
              {item.createdAt?.toDate
                ? item.createdAt.toDate().toLocaleDateString()
                : '—'}
            </Text>
            <Text style={styles.total}>
              ETB {item.total.toLocaleString()}
            </Text>
            <Text style={styles.items}>
              {item.items.length} item{item.items.length > 1 ? 's' : ''}
            </Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    // Soft shadow
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ref: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  status: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    color: '#64748B',
  },
  paid: {
    backgroundColor: '#DCFCE7',
    color: '#15803D',
  },
  failed: {
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
  },
  date: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 6,
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  items: {
    fontSize: 13,
    color: '#94A3B8',
  },
  empty: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
    textAlign: 'center',
  },
});