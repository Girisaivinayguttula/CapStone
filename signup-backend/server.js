const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_jwt_secret'; // Replace with a secure key

// Middleware
app.use(cors({
  origin: 'http://localhost:4200', // Adjust this if your Angular app is on a different port or domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://Veenaee:Vinay%401505@pro.9gpov.mongodb.net/myDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000 // Increase timeout to 30 seconds
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Could not connect to MongoDB Atlas:', err));

// User Model
const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  isAdmin: { type: Boolean, default: false } // Add isAdmin field
}));

// Product Model
const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  inStock: Boolean,
  category: String,
  imageUrl: String,
  quantity: { type: Number, required: true } // Ensure this line is included
}));

// Order Model
const OrderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  address: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  cartProducts: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      imageUrl: { type: String }
    }
  ],
  totalAmount: { type: Number, required: true },
  shippingCost: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// Correct Transporter Configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Correct Gmail SMTP server
  port: 465, // Secure port for SSL/TLS
  secure: true, // Use SSL
  auth: {
    user: 'cabastoreoffical@gmail.com', // Your Gmail address
    pass: 'achttpcpvxdxdhyx'  // Correct App Password without spaces
  }
});

// Subscription Model
const Subscription = mongoose.model('Subscription', new mongoose.Schema({
  email: { type: String, required: true, unique: true }
}));


// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Signup Route
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, phone, password, gender } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: 'Email already registered' });
    }

    const user = new User({ name, email, phone, password, gender });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(400).send({ error: 'Error saving user', details: error.message });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (user) {
      // Compare the provided password with the stored password
      if (password === user.password) { // Direct comparison
        // Generate a JWT token
        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).send({ token });
      } else {
        res.status(401).send({ error: 'Invalid password' });
      }
    } else {
      res.status(401).send({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send({ error: 'Server error', details: error.message });
  }
});

// Get orders for a logged-in user
app.get('/api/orders/email', authenticateToken, async (req, res) => {
  const userEmail = req.user.email; // Extract email from the token
  try {
    const orders = await Order.find({ email: userEmail });
    res.json(orders);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Get User Details
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // Exclude password
    if (!user) return res.status(404).send({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).send({ error: 'Server error', details: error.message });
  }
});

// CRUD Endpoints for Products

// Get all products
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Create a new product
app.post('/api/products', async (req, res) => {
  const newProduct = new Product(req.body); // `req.body` should contain `quantity`
  await newProduct.save();
  res.json(newProduct);
});

// Update a product
app.put('/api/products/:id', async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedProduct);
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

// Save Order Route with Product Quantity Reduction and Email Notification
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { email, address, paymentMethod, cartProducts, totalAmount, shippingCost } = req.body;

    // Validation
    if (!email || !address || !cartProducts.length) {
      return res.status(400).send({ error: 'Validation Error', details: 'Email, address, and cart products are required' });
    }

    // Create a new order
    const newOrder = new Order({
      email,
      address,
      paymentMethod,
      cartProducts,
      totalAmount,
      shippingCost
    });

    // Save the order to the database
    await newOrder.save();

    // Reduce the quantity of each product in the database
    for (const product of cartProducts) {
      await Product.updateOne(
        { name: product.name }, // or use _id: product._id
        { $inc: { quantity: -product.quantity } }
      );
    }

    // Send an email after the order is placed
    const cartHtml = cartProducts.map(product => `<li>${product.name} - $${product.price} x ${product.quantity}</li>`).join('');
    const mailOptions = {
      from: 'cabastoreoffical@gmail.com',
      to: email,
      subject: 'Order Confirmation',
      text: `Your order has been placed successfully!\n\nTotal Amount: $${totalAmount + shippingCost}\n\nShipping Address: ${address}`,
      html: `
        <p>Dear Customer,</p>
        <p>Your order has been placed successfully. Your order details are as follows:</p>
        <p><strong>Total Amount:</strong> $${totalAmount + shippingCost}</p>
        <p><strong>Shipping Address:</strong> ${address}</p>
        <p><strong>Order Details:</strong></p>
        <ul>${cartHtml}</ul>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error while sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(201).send({ message: 'Order placed successfully' });

  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).send({ error: 'Failed to place order', details: error.message });
  }
});

// Add a new route to handle newsletter subscription
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ error: 'Email is required' });
  }

  try {
    // Check if the email is already subscribed
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res.status(400).send({ error: 'Email is already subscribed' });
    }

    // Save the email to the Subscription collection
    const subscription = new Subscription({ email });
    await subscription.save();

    // Send subscription confirmation email
    const mailOptions = {
      from: 'cabastoreoffical@gmail.com',
      to: email,
      subject: 'Subscription Confirmation',
      html: `
        <p>Thank you for subscribing to our newsletter!</p>
        <p>We're thrilled to have you on board.</p>
        <p>Expect to receive the latest updates, exclusive content, and special offers directly in your inbox.</p>
        <p>If you ever have any questions or feedback, feel free to reply to this email or contact us at <a href="mailto:cabastoreoffical@gmail.com">cabastoreoffical@gmail.com</a>.</p>
        <p>Stay tuned for more exciting news!</p>
        <p>Best regards,</p>
        <p><strong>Caba</strong></p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error while sending email:', error);
        return res.status(500).send({ error: 'Failed to send email' });
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).send({ message: 'Subscription successful and confirmation email sent' });
      }
    });
  } catch (error) {
    console.error('Error during subscription:', error);
    return res.status(500).send({ error: 'Server error', details: error.message });
  }
});

// Get all subscriptions
app.get('/api/subscriptions', async (req, res) => {
  try {
    const subscriptions = await Subscription.find().select('email -_id');
    res.json(subscriptions.map(sub => sub.email));
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).send({ error: 'Failed to fetch subscriptions' });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
