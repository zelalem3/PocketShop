import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../../navigation/MainNavigator';
import { fetchProductDetail } from '../../../services/firestore/firestoreService';

type Route = RouteProp<MainStackParamList, 'ProductDetail'>;

export default function ProductDetailScreen() {
  const { params } = useRoute<Route>();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(params.productId);

  useEffect(() => {
    const loadProduct = async () => {
        try {
        setLoading(true);
        setError(null);

        const data = await fetchProductDetail(params.productId);

        if (!data) {
            setError('Product not found');
        } else {
            setProduct(data);
        }
        } catch (err) {
        console.error(err);
        setError('Failed to load product');
        } finally {
        setLoading(false);
        }
    };

    loadProduct();
    }, [params.productId]);

    // ← Remove the console.log(product.name) that was here

    if (loading) {
    return (
        <View style={styles.center}>
        <ActivityIndicator size="large" color="#111827" />
        </View>
    );
    }

    if (error || !product) {
    return (
        <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'Product not found'}</Text>
        </View>
    );
    }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'Product not found'}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>{product.name || 'Product'}</Text>

          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{product.description}</Text>

          <Text style={styles.label}>Price</Text>
          <Text style={styles.price}>ETB {product.price?.toLocaleString()}</Text>

          <Text style={styles.label}>Stock</Text>
          <Text style={styles.value}>{product.stockQuantity}</Text>

          <Text style={styles.label}>Category</Text>
          <Text style={styles.value}>{product.category}</Text>

          <Text style={styles.label}>Created At</Text>
          <Text style={styles.value}>
            {product.createdAt?.toDate
              ? product.createdAt.toDate().toLocaleDateString()
              : '—'}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
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
    backgroundColor: '#F8FAFC',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#0F172A',
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  errorText: {
    fontSize: 16,
    color: '#64748B',
  },
});