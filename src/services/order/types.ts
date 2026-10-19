


export type Order = {
  id: number;
  userId: string;
  productId: number;
  quantity: number;
  Price: number;
  createdAt: string;
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