
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Customer, Order, User } from '../types';
import { apiService } from '../services/apiService';

interface AppContextType {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  currentUser: User | null;
  loading: boolean;
  serverOffline: boolean;
  refreshData: () => Promise<void>;
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  createOrder: (order: Order) => Promise<void>;
  saveCustomer: (customer: Customer) => Promise<void>;
  login: (email: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverOffline, setServerOffline] = useState(false);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      // Test connectivity briefly
      await fetch('http://localhost:5000/api/products', { method: 'HEAD', signal: AbortSignal.timeout(1000) })
        .then(() => setServerOffline(false))
        .catch(() => setServerOffline(true));

      const [p, c, o] = await Promise.all([
        apiService.getProducts(),
        apiService.getCustomers(),
        apiService.getOrders()
      ]);
      setProducts(p);
      setCustomers(c);
      setOrders(o);
    } catch (err) {
      console.error("Data refresh error:", err);
      setServerOffline(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('grocymart_user');
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
    refreshData();
  }, [refreshData]);

  const login = (email: string) => {
    const user: User = { id: 'U001', name: 'Admin User', email, role: 'Admin' };
    setCurrentUser(user);
    localStorage.setItem('grocymart_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('grocymart_user');
  };

  const saveProduct = async (product: Product) => {
    await apiService.saveProduct(product);
    await refreshData();
  };

  const deleteProduct = async (id: string) => {
    await apiService.deleteProduct(id);
    await refreshData();
  };

  const createOrder = async (order: Order) => {
    await apiService.createOrder(order);
    await refreshData();
  };

  const saveCustomer = async (customer: Customer) => {
    await apiService.saveCustomer(customer);
    await refreshData();
  };

  return (
    <AppContext.Provider value={{
      products, customers, orders, currentUser, loading, serverOffline,
      refreshData, saveProduct, deleteProduct, createOrder, saveCustomer,
      login, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
