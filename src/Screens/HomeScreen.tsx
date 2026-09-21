import React from 'react';
import { Alert } from 'react-native';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';

export default function HomeScreen({ navigation }: { navigation?: any }) {
  // Sample data for your shop's categories and featured items
  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Groceries'];
  const featuredProducts = [
    { id: '1', title: 'Wireless Headphones', price: '$59.99' },
    { id: '2', title: 'Smart Watch Series 5', price: '$129.99' },
    { id: '3', title: 'Minimalist Backpack', price: '$45.00' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome to</Text>
            <Text style={styles.brandTitle}>PocketShop 🛍️</Text>
          </View>
          <TouchableOpacity style={styles.cartButton}>
            <Text style={styles.cartText}>🛒 Cart (0)</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Bar */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((cat, index) => (
              <TouchableOpacity key={index} style={styles.categoryChip}>
                <Text style={styles.categoryText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          {featuredProducts.map((product) => (
            <TouchableOpacity 
              key={product.id} 
              style={styles.productCard}
              onPress={() => {
                // If you have navigation set up, you can navigate to product details:
                // navigation.navigate('ProductDetails', { id: product.id });
                new Alert(`Tapped on ${product.title}!`);
              }}
            >
              <View style={styles.productPlaceholderImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.title}</Text>
                <Text style={styles.productPrice}>{product.price}</Text>
              </View>
              <Text style={styles.viewArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: '#6c757d',
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#212529',
  },
  cartButton: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cartText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 12,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productPlaceholderImage: {
    width: 50,
    height: 50,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  productPrice: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: 'bold',
    marginTop: 4,
  },
  viewArrow: {
    fontSize: 24,
    color: '#adb5bd',
    marginLeft: 8,
  },
});