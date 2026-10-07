import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from '@react-native-firebase/firestore';
import { db } from '../../config/firebase';

// --- PRODUCTS ---
export const fetchProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));
  } catch (error) {
    console.error('Error fetching products: ', error);
    throw error;
  }
};

export const fetchProductDetail = async (productId: string) => {
  try {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      return { id: productSnap.id, ...productSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// --- CART ---
export const fetchUserCart = async (userId: string) => {
  try {
    const cartRef = doc(db, 'carts', userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      return cartSnap.data();
    }
    return { userId, items: [], updatedAt: Timestamp.now() };
  } catch (error) {
    console.error('Error fetching cart: ', error);
    throw error;
  }
};

export const addToCart = async (
  userId: string,
  product: { id: string; name: string; price: number; imageUrl?: string },
  quantity: number = 1,
) => {
  try {
    const cartRef = doc(db, 'carts', userId);
    const cartSnap = await getDoc(cartRef);

    const newItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || '',
      quantity,
    };

    if (!cartSnap.exists()) {
      await setDoc(cartRef, {
        userId,
        items: [newItem],
        updatedAt: Timestamp.now(),
      });
    } else {
      const currentItems = [...(cartSnap.data()?.items || [])];
      const existingIndex = currentItems.findIndex(
        (item: any) => item.productId === product.id,
      );

      if (existingIndex > -1) {
        currentItems[existingIndex] = {
          ...currentItems[existingIndex],
          quantity: currentItems[existingIndex].quantity + quantity,
        };
        await updateDoc(cartRef, {
          items: currentItems,
          updatedAt: Timestamp.now(),
        });
      } else {
        await updateDoc(cartRef, {
          items: arrayUnion(newItem),
          updatedAt: Timestamp.now(),
        });
      }
    }
  } catch (error) {
    console.error('Error adding to cart: ', error);
    throw error;
  }
};

// --- USER PROFILE ---
export const fetchUserProfile = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// --- WISHLIST ---
export const fetchWishList = async (userId: string) => {
  try {
    if (!userId) return null;

    const wishRef = doc(db, 'Wishlist', userId);
    const wishSnap = await getDoc(wishRef);

    if (wishSnap.exists()) {
      return { id: wishSnap.id, ...wishSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching wishlist: ', error);
    throw error;
  }
};

export const fetchWishListIds = async (userId: string): Promise<string[]> => {
  try {
    const wishlist = await fetchWishList(userId);
    if (!wishlist?.items) return [];
    return wishlist.items.map((item: any) => item.productId);
  } catch (error) {
    console.error('Error fetching wishlist IDs: ', error);
    throw error;
  }
};

export const addToWishList = async (userId: string, productId: string) => {
  try {
    const wishRef = doc(db, 'Wishlist', userId);
    const wishSnap = await getDoc(wishRef);

    const newItem = {
      productId,
      addedAt: Timestamp.now(),
    };

    if (!wishSnap.exists()) {
      await setDoc(wishRef, {
        userId,
        items: [newItem],
        updatedAt: Timestamp.now(),
      });
    } else {
      const data = wishSnap.data();
      const alreadyExists = data?.items?.some(
        (item: any) => item.productId === productId,
      );

      if (alreadyExists) {
        console.log('Already on Wish List');
        return;
      }

      await updateDoc(wishRef, {
        items: arrayUnion(newItem),
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error adding to wishlist: ', error);
    throw error;
  }
};

/** Safe with @react-native-firebase – no web SDK needed */
export const fetchWishListProducts = async (productIds: string[]) => {
  try {
    if (!productIds || productIds.length === 0) return [];

    const snaps = await Promise.all(
      productIds.map(id => getDoc(doc(db, 'products', id))),
    );

    return snaps
      .filter(snap => snap.exists())
      .map(snap => ({
        id: snap.id,
        ...snap.data(),
      }));
  } catch (error) {
    console.error('Error loading wishlist products: ', error);
    throw error;
  }
};




// --- REVIEWS ----
export const fetchReviews = async (productId: string) => {
  try {
    const reviewRef = doc(db, 'Review', productId);
    const reviewSnap = await getDoc(reviewRef);

    if (reviewSnap.exists()) {
      const data = reviewSnap.data();
      return {
        id: reviewSnap.id,
        items: data.items || [],
        ...data,
      };
    }

    return { id: productId, items: [] }; // return empty array if no reviews yet
  } catch (error) {
    console.error('Error loading product reviews: ', error);
    throw error;
  }
};

export const addReview = async (
  userId: string,
  productId: string,
  comment: string,
  rating: number
) => {
  try {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const reviewRef = doc(db, 'Review', productId);
    const reviewSnap = await getDoc(reviewRef);

    const newItem = {
      userId,
      comment: comment.trim(),
      rating,
      addedAt: Timestamp.now(),
    };

    if (!reviewSnap.exists()) {
      await setDoc(reviewRef, {
        productId,
        items: [newItem],
        updatedAt: Timestamp.now(),
      });
    } else {
      const data = reviewSnap.data();
      const alreadyExists = data?.items?.some(
        (item: any) => item.userId === userId
      );

      if (alreadyExists) {
        console.log('You have already reviewed this product');
        return;
      }

      await updateDoc(reviewRef, {
        items: arrayUnion(newItem),
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error adding review: ', error);
    throw error;
  }
};