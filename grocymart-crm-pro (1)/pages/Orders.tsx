
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Order, OrderStatus, OrderItem, Product } from '../types';

const Orders: React.FC = () => {
  const { orders, customers, products, createOrder, loading } = useAppContext();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'All'>('All');
  const [isPosOpen, setIsPosOpen] = useState(false);
  
  // New Order State
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [cart, setCart] = useState<OrderItem[]>([]);

  const filteredOrders = orders.filter(o => filterStatus === 'All' || o.status === filterStatus);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || cart.length === 0) return;

    const customer = customers.find(c => c.id === selectedCustomerId);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerId: selectedCustomerId,
      customerName: customer?.name || 'Walk-in Customer',
      items: cart,
      totalAmount,
      status: 'Delivered',
      orderDate: new Date().toISOString(),
      paymentMethod: 'Cash'
    };

    await createOrder(newOrder);
    setIsPosOpen(false);
    setCart([]);
    setSelectedCustomerId('');
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Shipped': return 'bg-indigo-100 text-indigo-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Order Management</h1>
          <p className="text-slate-500 text-sm">Review and process store transactions.</p>
        </div>
        <button 
          onClick={() => setIsPosOpen(true)}
          className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:bg-green-700 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          New POS Order
        </button>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as any)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              filterStatus === status 
              ? 'bg-slate-800 text-white' 
              : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400">No orders found.</td>
              </tr>
            ) : filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-slate-600">{order.id}</td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-800">{order.customerName}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-bold text-slate-800">${order.totalAmount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                    {order.paymentMethod}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-green-600 hover:text-green-700 font-bold text-sm">
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* POS MODAL */}
      {isPosOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] shadow-2xl flex overflow-hidden">
            {/* Catalog Side */}
            <div className="flex-1 p-6 border-r border-slate-100 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">New Sale</h2>
                <div className="relative">
                   <input type="text" placeholder="Scan or search..." className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm w-64" />
                   <svg className="w-4 h-4 absolute left-3 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4 pr-2">
                {products.filter(p => p.quantity > 0).map(product => (
                  <button 
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="flex flex-col text-left bg-slate-50 p-3 rounded-2xl hover:bg-green-50 hover:ring-2 hover:ring-green-200 transition-all group"
                  >
                    <img src={product.imageUrl} className="w-full h-24 object-cover rounded-xl mb-2" alt="" />
                    <p className="font-bold text-slate-800 text-sm line-clamp-1">{product.name}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-green-600 font-bold">${product.price.toFixed(2)}</span>
                      <span className="text-[10px] font-medium text-slate-400">{product.quantity} left</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cart Side */}
            <div className="w-96 bg-slate-50 p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800">Current Order</h3>
                <button onClick={() => setIsPosOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Customer</label>
                <select 
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="">Guest Customer</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">Cart is empty.</div>
                ) : cart.map(item => (
                  <div key={item.productId} className="bg-white p-3 rounded-xl shadow-sm flex justify-between items-center group">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.quantity} x ${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">${(item.price * item.quantity).toFixed(2)}</span>
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
                      >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="flex justify-between text-slate-500 text-sm">
                  <span>Subtotal</span>
                  <span>${cart.reduce((s, i) => s + (i.price * i.quantity), 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-800 font-black text-xl">
                  <span>Total</span>
                  <span>${cart.reduce((s, i) => s + (i.price * i.quantity), 0).toFixed(2)}</span>
                </div>
                <button 
                  disabled={cart.length === 0}
                  onClick={handleCreateOrder}
                  className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-100"
                >
                  Confirm & Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
