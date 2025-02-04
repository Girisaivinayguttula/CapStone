const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendEmail } = require('../utils/emailService');

exports.createOrder = async (req, res, next) => {
  try {
    const { email, address, paymentMethod, cartProducts, totalAmount, shippingCost } = req.body;

    if (!email || !address || !cartProducts.length) {
      return res.status(400).send({ error: 'Validation Error', details: 'Email, address, and cart products are required' });
    }

    const newOrder = new Order({ email, address, paymentMethod, cartProducts, totalAmount, shippingCost });
    await newOrder.save();

    for (const product of cartProducts) {
      await Product.updateOne({ name: product.name }, { $inc: { quantity: -product.quantity } });
    }

    const cartHtml = cartProducts.map(product => `<li>${product.name} - $${product.price} x ${product.quantity}</li>`).join('');
    await sendEmail(email, 'Order Confirmation', `
      <p>Dear Customer,</p>
      <p>Your order has been placed successfully. Your order details are as follows:</p>
      <p><strong>Total Amount:</strong> $${totalAmount + shippingCost}</p>
      <p><strong>Shipping Address:</strong> ${address}</p>
      <p><strong>Order Details:</strong></p>
      <ul>${cartHtml}</ul>
    `);

    res.status(201).send({ message: 'Order placed successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getOrdersByEmail = async (req, res, next) => {
  try {
    const orders = await Order.find({ email: req.user.email });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};