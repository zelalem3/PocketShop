import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
} from '@react-native-firebase/firestore';


import {db} from '../../config/firebase';

import { Order,CreateOrderParams } from './types';



export const createOrder = async (params: CreateOrderParams) => {
  const payload = {
    userId: params.userId,
    email: params.email,
    fullName: params.fullName,
    phone: params.phone,
    address: params.address,
    items: params.items,
    subtotal: params.subtotal,
    deliveryFee: params.deliveryFee,
    total: params.total,
    merchantReference: params.merchantReference,
    paymentStatus: params.paymentStatus,
    paymentMethod: 'chapa',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'orders'), payload);

  return {
    id: docRef.id,
    ...payload,
  };
};




/** Fetch all orders for a user, newest first */
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Order, 'id'>),
  }));
};

/** Fetch a single order by ID */
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  const snap = await getDoc(doc(db, 'orders', orderId));
  if (!snap.exists) return null;

  return {
    id: snap.id,
    ...(snap.data() as Omit<Order, 'id'>),
  };
};