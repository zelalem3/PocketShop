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
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { addToWishList } from '../../../services/firestore/firestoreService';
import { useAuthStore } from '../../../store/authStore';
import {
  fetchProducts,
  addToCart,
} from '../../../services/firestore/firestoreService';
import { MainStackParamList } from '../../../navigation/MainNavigator';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function MainApp() {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const loading = useAuthStore(state => state.loading);

  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);


 const wishList = async (productId: string) =>
  {
    try{
      const result =  addToWishList(user?.uid, productId)
      return "Product added to wishlist successfully"

    }
    catch(error)
    {
      console.error("Error adding to wishlist: ", error)
      throw error
    }
  }








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

  
  return (     
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
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
          <Text style={styles.heroSubtitle}>
            Find something you'll love.
          </Text>
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
      navigation.navigate('ProductDetail', { productId: product.id })
    }
  >
      {/* Product Image */}
  {product.imageUrl ? (
    <Image
      source={{ uri: product.imageUrl }}
      style={styles.detailImage}
      resizeMode="cover"
    />
  ) : (
    <View style={[styles.detailImage, styles.imagePlaceholder]}>
      <Text style={styles.placeholderText}>No Image</Text>
    </View>
  )}

    <Text style={styles.productName}>{product.name}</Text>

    <Text style={styles.productPrice}>
      ETB {Number(product.price).toLocaleString()}
    </Text>
    <Pressable 
    onPress={() => wishList(product.id)}>
      <Text>Add to WishList</Text>
    </Pressable>

    {/* Keep the Add to Cart button separate so it doesn't trigger navigation */}
    <Pressable
      style={[
        styles.addButton,
        addingId === product.id && styles.buttonDisabled,
      ]}
      onPress={(e) => { e.stopPropagation?.(); }}
      disabled={addingId === product.id}
    >
      <Text style={styles.addButtonText}>
        {addingId === product.id ? 'Adding...' : 'Add to Cart'}
      </Text>
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
    backgroundColor: '#f9fafb',
  },
  container: {
    padding: 24,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
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
  addButton: {
    height: 44,
    borderRadius: 8,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  center: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 15,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 15,
  },
  detailImage: {
  width: '100%',
  height: 280,
  borderRadius: 16,
  marginBottom: 20,
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
});