import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useAuthStore } from '../../../store/authStore';
import { MainStackParamList } from '../../../navigation/MainNavigator';
import { fetchReviews } from '../../../services/firestore/firestoreService'; // adjust path

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type ReviewScreenRouteProp = RouteProp<MainStackParamList, 'ReviewScreen'>;

interface ReviewItem {
  userId: string;
  comment: string;
  rating: number;
  addedAt: any;
}

export default function ReviewScreen() {
  // ─── ALL HOOKS FIRST ───────────────────────────────────────────────
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ReviewScreenRouteProp>();
  const { productId } = route.params;

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Fetch Reviews ─────────────────────────────────────────────────
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchReviews(productId);
        setReviews(data.items || []);
      } catch (err) {
        console.error('Error loading reviews:', err);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadReviews();
    }
  }, [productId]);

  // ─── Helper ────────────────────────────────────────────────────────
  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // ─── Render ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#111827" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Reviews</Text>
      </View>

      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : reviews.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No reviews yet</Text>
          <Text style={styles.emptySubText}>Be the first to review this product</Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.stars}>{renderStars(item.rating)}</Text>
                <Text style={styles.ratingNumber}>{item.rating}/5</Text>
              </View>

              <Text style={styles.comment}>{item.comment}</Text>

              <Text style={styles.meta}>
                {item.addedAt?.toDate
                  ? item.addedAt.toDate().toLocaleDateString()
                  : 'Recently'}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
  },
  backText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  list: {
    padding: 16,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    fontSize: 16,
    color: '#F59E0B',
    marginRight: 8,
  },
  ratingNumber: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  comment: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 8,
  },
  meta: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  emptySubText: {
    fontSize: 14,
    color: '#6B7280',
  },
});