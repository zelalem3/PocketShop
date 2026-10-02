import {
  addDoc,
  collection,
  serverTimestamp,
} from '@react-native-firebase/firestore';

import {db} from '../../config/firebase';

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type CreateOrderParams = {
  userId: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  merchantReference: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
};

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