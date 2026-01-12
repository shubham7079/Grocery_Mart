
import { Product, Customer, Order, Category } from './types';

export const CATEGORIES: Category[] = [
  'Fresh Produce',
  'Dairy',
  'Packaged Goods',
  'Household Essentials',
  'Beverages',
  'Frozen Foods'
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'P001',
    name: 'Organic Avocados',
    category: 'Fresh Produce',
    description: 'Ripe organic avocados from local farms.',
    price: 1.50,
    quantity: 120,
    minStockThreshold: 30,
    supplier: 'Green Farms Co.',
    expiryDate: '2024-12-01',
    imageUrl: 'https://picsum.photos/seed/avocado/200/200'
  },
  {
    id: 'P002',
    name: 'Whole Milk 1L',
    category: 'Dairy',
    description: 'Fresh whole milk, pasteurized.',
    price: 2.20,
    quantity: 45,
    minStockThreshold: 50,
    supplier: 'Dairy Peaks',
    expiryDate: '2024-11-25',
    imageUrl: 'https://picsum.photos/seed/milk/200/200'
  },
  {
    id: 'P003',
    name: 'Quinoa 500g',
    category: 'Packaged Goods',
    description: 'Organic white quinoa.',
    price: 4.50,
    quantity: 80,
    minStockThreshold: 20,
    supplier: 'Global Grains',
    imageUrl: 'https://picsum.photos/seed/quinoa/200/200'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'C001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-0101',
    loyaltyPoints: 1250,
    totalSpent: 450.75,
    joinDate: '2023-05-12',
    preferences: ['Organic', 'Gluten-Free']
  },
  {
    id: 'C002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-0102',
    loyaltyPoints: 340,
    totalSpent: 120.40,
    joinDate: '2024-01-15',
    preferences: ['Beverages']
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    customerId: 'C001',
    customerName: 'John Doe',
    items: [{ productId: 'P001', name: 'Organic Avocados', quantity: 4, price: 1.50 }],
    totalAmount: 6.00,
    status: 'Delivered',
    orderDate: '2024-11-10T14:30:00Z',
    paymentMethod: 'Online'
  }
];
