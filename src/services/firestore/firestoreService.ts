import { collection, getDocs } from '@react-native-firebase/firestore';
import { db } from '../../config/firebase';

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