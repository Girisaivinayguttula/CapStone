const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const subscriptionController = require('../controllers/subscriptionController');
const { authenticateToken } = require('../middleware/authenticateToken');

// Auth Routes
router.post('/signup', authController.signup);
router.post('/verify-otp', authController.verifyOtp);
router.post('/login', authController.login);
router.get('/user', authenticateToken, authController.getUser);

// Product Routes
router.get('/products', productController.getProducts);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// Order Routes
router.post('/orders', authenticateToken, orderController.createOrder);
router.get('/orders/email', authenticateToken, orderController.getOrdersByEmail);

// Subscription Routes
router.post('/subscribe', subscriptionController.subscribe);
router.get('/subscriptions', subscriptionController.getSubscriptions);

module.exports = router;