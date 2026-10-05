import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

import { getOrderById} from '../../../services/order/orderService';
import { Order} from '../../../services/order/types';
import { MainStackParamList } from '../../../navigation/MainNavigator';

type Route = RouteProp<MainStackParamList, 'OrderDetail'>;

export default function OrderDetailScreen() {
  const { params } = useRoute<Route>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(params.orderId)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [params.orderId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text>Order not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Order #{order.merchantReference}</Text>
      <Text style={styles.status}>{order.paymentStatus.toUpperCase()}</Text>

      <Text style={styles.section}>Items</Text>
      {order.items.map((item, i) => (
        <View key={i} style={styles.itemRow}>
          <Text>
            {item.name} × {item.quantity}
          </Text>
          <Text>ETB {(item.price * item.quantity).toLocaleString()}</Text>
        </View>
      ))}

      <Text style={styles.section}>Summary</Text>
      <Text>Subtotal: ETB {order.subtotal.toLocaleString()}</Text>
      <Text>Delivery: ETB {order.deliveryFee.toLocaleString()}</Text>
      <Text style={styles.total}>Total: ETB {order.total.toLocaleString()}</Text>

      <Text style={styles.section}>Delivery</Text>
      <Text>{order.fullName}</Text>
      <Text>{order.phone}</Text>
      <Text>{order.address}</Text>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  status: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    // Default (pending / other)
    backgroundColor: '#F1F5F9',
    color: '#64748B',
  },


  section: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 28,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
  },
});  
