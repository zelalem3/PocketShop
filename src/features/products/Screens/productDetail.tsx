import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../../navigation/MainNavigator';
import {
  fetchProductDetail,
  fetchReviews,
  addReview,
} from '../../../services/firestore/firestoreService';
import { useAuthStore } from '../../../store/authStore';

type Route = RouteProp<MainStackParamList, 'ProductDetail'>;

interface ReviewItem {
  userId: string;
  comment: string;
  rating: number;
  addedAt: any;
}

export default function ProductDetailScreen() {
  const { params } = useRoute<Route>();
  const user = useAuthStore(state => state.user);

  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ─── Load Product ────────────────────────────────────────────────
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

  // ─── Load Reviews ────────────────────────────────────────────────
  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      const data = await fetchReviews(params.productId);
      setReviews(data.items || []);
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (params.productId) {
      loadReviews();
    }
  }, [params.productId]);

  // ─── Submit Review ───────────────────────────────────────────────
  const handleSubmitReview = async () => {
    if (!user?.uid) {
      Alert.alert('Error', 'You must be logged in to write a review');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Error', 'Please write a comment');
      return;
    }

    try {
      setSubmitting(true);
      await addReview(user.uid, params.productId, comment, rating);
      Alert.alert('Success', 'Review added successfully');
      setComment('');
      setRating(5);
      await loadReviews(); // refresh list
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.message || 'Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Helper ──────────────────────────────────────────────────────
  const renderStars = (value: number, onPress?: (v: number) => void) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(star => (
          <Pressable key={star} onPress={() => onPress?.(star)} disabled={!onPress}>
            <Text style={[styles.star, star <= value && styles.starActive]}>
              ★
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };

  // ─── Loading / Error ─────────────────────────────────────────────
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

          <Text style={styles.title}>{product.name || 'Product'}</Text>

          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{product.description}</Text>

          <Text style={styles.label}>Price</Text>
          <Text style={styles.price}>
            ETB {product.price?.toLocaleString()}
          </Text>

          <Text style={styles.label}>Stock</Text>
          <Text style={styles.value}>{product.stockQuantity}</Text>

          <Text style={styles.label}>Category</Text>
          <Text style={styles.value}>{product.category}</Text>

          {/* ═══════════════ REVIEWS SECTION ═══════════════ */}
          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Customer Reviews</Text>

          {/* Write a Review */}
          <View style={styles.reviewForm}>
            <Text style={styles.formTitle}>Write a Review</Text>

            {renderStars(rating, setRating)}

            <TextInput
              style={styles.input}
              placeholder="Share your experience..."
              placeholderTextColor="#94A3B8"
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Pressable
              style={[styles.submitButton, submitting && styles.buttonDisabled]}
              onPress={handleSubmitReview}
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Text>
            </Pressable>
          </View>

          {/* List of Reviews */}
          {reviewsLoading ? (
            <ActivityIndicator size="small" color="#111827" style={{ marginTop: 20 }} />
          ) : reviews.length === 0 ? (
            <Text style={styles.noReviews}>No reviews yet. Be the first!</Text>
          ) : (
            reviews.map((item, index) => (
              <View key={index} style={styles.reviewCard}>
                {renderStars(item.rating)}
                <Text style={styles.reviewComment}>{item.comment}</Text>
                <Text style={styles.reviewDate}>
                  {item.addedAt?.toDate
                    ? item.addedAt.toDate().toLocaleDateString()
                    : 'Recently'}
                </Text>
              </View>
            ))
          )}
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

  // Reviews
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  reviewForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 14,
    gap: 6,
  },
  star: {
    fontSize: 28,
    color: '#CBD5E1',
  },
  starActive: {
    color: '#F59E0B',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#0F172A',
    minHeight: 100,
    marginBottom: 14,
    backgroundColor: '#F8FAFC',
  },
  submitButton: {
    backgroundColor: '#111827',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  noReviews: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 15,
    marginTop: 12,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reviewComment: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
});