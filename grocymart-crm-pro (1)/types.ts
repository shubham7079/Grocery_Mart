
export type Category = 'Fresh Produce' | 'Dairy' | 'Packaged Goods' | 'Household Essentials' | 'Beverages' | 'Frozen Foods';

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  quantity: number;
  minStockThreshold: number;
  supplier: string;
  expiryDate?: string;
  imageUrl: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  totalSpent: number;
  joinDate: string;
  preferences: string[];
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  paymentMethod: 'Cash' | 'Card' | 'Online';
}

export interface User {
  id: string;
  name: string;
  role: 'Admin' | 'Manager' | 'Employee';
  email: string;
}

export interface DashboardStats {
  dailySales: number;
  totalOrders: number;
  activeCustomers: number;
  lowStockItems: number;
}
