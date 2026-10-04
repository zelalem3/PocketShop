

export type Order = {
  id: string;
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
  paymentMethod: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any;
};
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