import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  fetchWishListIds,
  fetchWishListProducts,
} from "../../../services/firestore/firestoreService";
import { useAuthStore } from "../../../store/authStore";

export default function WishListScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishListProducts, setWishListProducts] = useState<any[]>([]);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    let isMounted = true;

    const loadWishlist = async () => {
      // No user yet → stop loading, show empty state
      if (!user?.id) {
        if (isMounted) {
          setWishListProducts([]);
          setLoading(false);
          setError(null);
        }
        return;
      }

      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        // 1. Get product IDs
        const productIds = await fetchWishListIds(user.id);
        console.log("Wishlist IDs:", productIds);

        // 2. Get full product docs
        const products = await fetchWishListProducts(productIds);
        console.log("Wishlist products:", products);

        if (isMounted) {
          setWishListProducts(products);
        }
      } catch (err: any) {
        console.error("Error fetching wishlist:", err);
        if (isMounted) {
          setError(err?.message || "Failed to load wishlist");
          setWishListProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadWishlist();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // ----- LOADING -----
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#111827" />
        <Text style={styles.hint}>Loading wishlist…</Text>
      </View>
    );
  }

  // ----- ERROR -----
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // ----- EMPTY -----
  if (wishListProducts.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
        <Text style={styles.hint}>
          {user?.id ? "Add products to see them here" : "Please sign in"}
        </Text>
      </View>
    );
  }

  // ----- LIST -----
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.list}>
          {wishListProducts.map((product) => (
            <View key={product.id} style={styles.card}>
              <Text style={styles.title}>
                {product.name ?? "Unnamed product"}
              </Text>
              {product.price != null && (
                <Text style={styles.price}>${product.price}</Text>
              )}
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 8,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  price: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#dc2626",
  },
  errorText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  hint: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});