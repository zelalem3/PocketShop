import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  addToWishList,
  fetchProducts,
  addToCart,
} from '../../../services/firestore/firestoreService';
import { useAuthStore } from '../../../store/authStore';
import { MainStackParamList } from '../../../navigation/MainNavigator';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function MainApp() {
  // ─── ALL HOOKS FIRST (stable order) ───────────────────────────────
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const loading = useAuthStore(state => state.loading);

  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [wishlistAddingId, setWishlistAddingId] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        setError(null);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products');
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // ─── Regular functions ────────────────────────────────────────────
  const handleAddToCart = async (product: any) => {
    if (!user?.uid) {
      Alert.alert('Error', 'You must be logged in to add items to cart');
      return;
    }

    try {
      setAddingId(product.id);
      await addToCart(user.uid, {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      });
      Alert.alert('Success', `${product.name} added to cart`);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to add item to cart');
    } finally {
      setAddingId(null);
    }
  };

  const handleAddToWishlist = async (product: any) => {
    if (!user?.uid) {
      Alert.alert('Error', 'You must be logged in to add items to wishlist');
      return;
    }

    try {
      setWishlistAddingId(product.id);
      await addToWishList(user.uid, product.id);
      Alert.alert('Success', `${product.name} added to wishlist`);
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      Alert.alert('Error', 'Failed to add item to wishlist');
    } finally {
      setWishlistAddingId(null);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back</Text>
            <Pressable onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.name}>
                {user?.displayName || user?.email}
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.logoutButton}
            onPress={logout}
            disabled={loading}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <Pressable
            style={styles.actionButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.actionButtonText}>My Cart</Text>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() => navigation.navigate('OrderList')}
          >
            <Text style={styles.actionButtonText}>My Orders</Text>
          </Pressable>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Discover products</Text>
          <Text style={styles.heroSubtitle}>Find something you'll love.</Text>
        </View>

        <Text style={styles.sectionTitle}>Featured Products</Text>

        {productsLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#111827" />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        ) : (
          <View style={styles.productList}>
            {products.map(product => (
              <Pressable
                key={product.id}
                style={styles.productCard}
                onPress={() =>
                  navigation.navigate('ProductDetail', {
                    productId: product.id,
                  })
                }
              >
                {product.imageUrl ? (
                  <Image
                    source={{ uri: product.imageUrl }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.productImage, styles.imagePlaceholder]}>
                    <Text style={styles.placeholderText}>No Image</Text>
                  </View>
                )}

                <Text style={styles.productName}>{product.name}</Text>

                <Text style={styles.productPrice}>
                  ETB {Number(product.price).toLocaleString()}
                </Text>

                {/* Action Buttons */}
                <View style={styles.buttonRow}>
                  <Pressable
                    style={[
                      styles.wishlistButton,
                      wishlistAddingId === product.id && styles.buttonDisabled,
                    ]}
                    onPress={e => {
                      e.stopPropagation?.();
                      handleAddToWishlist(product);
                    }}
                    disabled={wishlistAddingId === product.id}
                  >
                    <Text style={styles.wishlistButtonText}>
                      {wishlistAddingId === product.id ? 'Adding...' : '♡ Wishlist'}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.addButton,
                      addingId === product.id && styles.buttonDisabled,
                    ]}
                    onPress={e => {
                      e.stopPropagation?.();
                      handleAddToCart(product);
                    }}
                    disabled={addingId === product.id}
                  >
                    <Text style={styles.addButtonText}>
                      {addingId === product.id ? 'Adding...' : 'Add to Cart'}
                    </Text>
                  </Pressable>
                </View>

                {/* Reviews Button */}
                <Pressable
                  style={styles.reviewsButton}
                  onPress={e => {
                    e.stopPropagation?.();
                    navigation.navigate('ReviewScreen', {
                      productId: product.id,
                    });
                  }}
                >
                  <Text style={styles.reviewsButtonText}>★ View & Write Reviews</Text>
                </Pressable>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
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
    backgroundColor: '#E5E7EB',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  hero: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#111827',
    marginBottom: 28,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: '#D1D5DB',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  productList: {
    gap: 20,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 14,
    backgroundColor: '#E2E8F0',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  productName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  wishlistButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#111827',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewsButton: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewsButtonText: {
    color: '#B45309',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  center: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 15,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 15,
  },
});