
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grocymart_crm';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- SCHEMAS & MODELS ---

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: String,
  description: String,
  price: Number,
  quantity: Number,
  minStockThreshold: Number,
  supplier: String,
  expiryDate: String,
  imageUrl: String
});
const Product = mongoose.model('Product', ProductSchema);

const CustomerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  email: String,
  phone: String,
  loyaltyPoints: Number,
  totalSpent: Number,
  joinDate: String,
  preferences: [String]
});
const Customer = mongoose.model('Customer', CustomerSchema);

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerId: String,
  customerName: String,
  items: [{
    productId: String,
    name: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: { type: String, default: 'Pending' },
  orderDate: { type: Date, default: Date.now },
  paymentMethod: String
});
const Order = mongoose.model('Order', OrderSchema);

// --- API ROUTES ---

// Products
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  const { id } = req.body;
  const product = await Product.findOneAndUpdate({ id }, req.body, { upsert: true, new: true });
  res.json(product);
});

app.delete('/api/products/:id', async (req, res) => {
  await Product.findOneAndDelete({ id: req.params.id });
  res.status(204).send();
});

// Customers
app.get('/api/customers', async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

app.post('/api/customers', async (req, res) => {
  const { id } = req.body;
  const customer = await Customer.findOneAndUpdate({ id }, req.body, { upsert: true, new: true });
  res.json(customer);
});

// Orders
app.get('/api/orders', async (req, res) => {
  const orders = await Order.find().sort({ orderDate: -1 });
  res.json(orders);
});

app.post('/api/orders', async (req, res) => {
  const orderData = req.body;
  const order = new Order(orderData);
  await order.save();

  // Deduct Stock
  for (const item of orderData.items) {
    await Product.findOneAndUpdate(
      { id: item.productId },
      { $inc: { quantity: -item.quantity } }
    );
  }

  // Update Customer Stats
  if (orderData.customerId) {
    await Customer.findOneAndUpdate(
      { id: orderData.customerId },
      { 
        $inc: { 
          totalSpent: orderData.totalAmount,
          loyaltyPoints: Math.floor(orderData.totalAmount) 
        } 
      }
    );
  }

  res.status(201).json(order);
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
