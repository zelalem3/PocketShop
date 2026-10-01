import React, { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAuthStore } from '../../../store/authStore';
import { fetchProducts } from '../../../services/firestore/firestoreService';

export default function MainApp() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const loading = useAuthStore(state => state.loading);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProd = async () => {
      try {
        const all = await fetchProducts();
        setProducts(all);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProd();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.name}>
              {user?.displayName || user?.email}
            </Text>
          </View>

          <Pressable
            style={styles.logoutButton}
            onPress={logout}
            disabled={loading}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Discover products</Text>
          <Text style={styles.heroSubtitle}>
            Find something you'll love.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Featured Products</Text>

        <View style={styles.productList}>
          {products.map(product => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productImage}>
                <Text style={styles.imagePlaceholder}>Image</Text>
              </View>

              <Text style={styles.productName}>{product.name}</Text>

              <Text style={styles.productPrice}>
                ETB {product.price?.toLocaleString()}
              </Text>

              <Pressable style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View Product</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    maxWidth: 220,
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  hero: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#111827',
    marginBottom: 28,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#d1d5db',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  productList: {
    gap: 16,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
  },
  productImage: {
    height: 160,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  imagePlaceholder: {
    color: '#6b7280',
  },
  productName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },
  viewButton: {
    height: 44,
    borderRadius: 8,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});