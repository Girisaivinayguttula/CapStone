const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/orders', authenticateToken, controller.placeOrder);
router.get('/orders/email', authenticateToken, controller.getOrdersByEmail);

module.exports = router;
