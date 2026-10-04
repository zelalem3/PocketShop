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
    section: {

    },
    total: {

    },
    title :{

    },
    status : {

    },
    itemRow: {

    },
    center : {

    },
    container: {

    },
    
})