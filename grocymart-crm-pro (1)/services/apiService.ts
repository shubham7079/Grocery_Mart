
import { Product, Customer, Order } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_ORDERS } from '../constants';

const API_BASE = 'http://localhost:5000/api';

// --- Local Storage Database Simulation (Fallback) ---
const STORAGE_KEYS = {
  PRODUCTS: 'grocymart_db_products',
  CUSTOMERS: 'grocymart_db_customers',
  ORDERS: 'grocymart_db_orders',
};

const getLocal = <T>(key: string, fallback: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

const setLocal = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const localDB = {
  getProducts: () => getLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS),
  getCustomers: () => getLocal(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS),
  getOrders: () => getLocal(STORAGE_KEYS.ORDERS, INITIAL_ORDERS),
  
  saveProduct: (product: Product) => {
    const items = localDB.getProducts();
    const index = items.findIndex(p => p.id === product.id);
    const updated = index >= 0 ? items.map(p => p.id === product.id ? product : p) : [...items, product];
    setLocal(STORAGE_KEYS.PRODUCTS, updated);
    return product;
  },

  deleteProduct: (id: string) => {
    const items = localDB.getProducts().filter(p => p.id !== id);
    setLocal(STORAGE_KEYS.PRODUCTS, items);
  },

  saveCustomer: (customer: Customer) => {
    const items = localDB.getCustomers();
    const index = items.findIndex(c => c.id === customer.id);
    const updated = index >= 0 ? items.map(c => c.id === customer.id ? customer : c) : [...items, customer];
    setLocal(STORAGE_KEYS.CUSTOMERS, updated);
    return customer;
  },

  createOrder: (order: Order) => {
    const orders = [order, ...localDB.getOrders()];
    setLocal(STORAGE_KEYS.ORDERS, orders);

    // Business Logic: Deduct Stock
    const products = localDB.getProducts().map(p => {
      const item = order.items.find(oi => oi.productId === p.id);
      return item ? { ...p, quantity: Math.max(0, p.quantity - item.quantity) } : p;
    });
    setLocal(STORAGE_KEYS.PRODUCTS, products);

    // Business Logic: Update Customer
    if (order.customerId) {
      const customers = localDB.getCustomers().map(c => {
        if (c.id === order.customerId) {
          return {
            ...c,
            totalSpent: c.totalSpent + order.totalAmount,
            loyaltyPoints: c.loyaltyPoints + Math.floor(order.totalAmount)
          };
        }
        return c;
      });
      setLocal(STORAGE_KEYS.CUSTOMERS, customers);
    }
    return order;
  }
};

// --- API Logic with Fallback ---

const fetchJson = async (endpoint: string, options?: RequestInit, fallbackFn?: () => any) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  } catch (error) {
    console.warn(`Backend unreachable at ${API_BASE}${endpoint}. Using local fallback.`, error);
    if (fallbackFn) return fallbackFn();
    throw error;
  }
};

export const apiService = {
  async getProducts(): Promise<Product[]> {
    return fetchJson('/products', {}, localDB.getProducts);
  },
  async saveProduct(product: Product): Promise<Product> {
    return fetchJson('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }, () => localDB.saveProduct(product));
  },
  async deleteProduct(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    } catch (e) {
      localDB.deleteProduct(id);
    }
  },
  async getCustomers(): Promise<Customer[]> {
    return fetchJson('/customers', {}, localDB.getCustomers);
  },
  async saveCustomer(customer: Customer): Promise<Customer> {
    return fetchJson('/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    }, () => localDB.saveCustomer(customer));
  },
  async getOrders(): Promise<Order[]> {
    return fetchJson('/orders', {}, localDB.getOrders);
  },
  async createOrder(order: Order): Promise<Order> {
    return fetchJson('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    }, () => localDB.createOrder(order));
  }
};
