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
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    total: {
        fontSize: 16
    },
    items: {
        color: '#fff'
    },
    date:{

    },
    list: {

    },
    safe: {

    },
    paid :{

    },
    row: {

    },
    failed: {

    },
    ref: {

    },
    card : {

    },
    status : {

    },
    center: {

    },
    empty: {

    }

})
