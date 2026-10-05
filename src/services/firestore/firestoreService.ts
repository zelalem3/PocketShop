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
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return products;
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
      return {
        id: productSnap.id,
        ...productSnap.data(),
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
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
      // Create new cart
      await setDoc(cartRef, {
        userId,
        items: [newItem],
        updatedAt: Timestamp.now(),
      });
    } else {
      const currentItems = cartSnap.data()?.items || [];
      const existingIndex = currentItems.findIndex(
        (item: any) => item.productId === product.id,
      );

      if (existingIndex > -1) {
        // Increase quantity
        currentItems[existingIndex].quantity += quantity;
        await updateDoc(cartRef, {
          items: currentItems,
          updatedAt: Timestamp.now(),
        });
      } else {
        // Add new item
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