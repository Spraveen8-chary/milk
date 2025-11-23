
export type Role = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: Role;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Milk' | 'Curd' | 'Ghee' | 'Paneer' | 'Other';
  price: number;
  image: string;
  unit: string;
  description: string;
}

export interface Subscription {
  userId: string;
  productId: string;
  quantity: number;
}

export interface DeliveryDay {
  date: string; // ISO YYYY-MM-DD
  status: 'pending' | 'delivered' | 'skipped';
  items: { productId: string; quantity: number }[];
}

export interface Bill {
  id: string;
  userId: string;
  month: string; // YYYY-MM
  amount: number;
  status: 'paid' | 'pending';
  dueDate: string;
}

export interface Notification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'alert' | 'success';
}
