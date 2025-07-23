const Order = require('../models/Order');
const Product = require('../models/Product');
const transporter = require('../config/mailer');

exports.placeOrder = async (req, res) => {
    try {
        const { email, address, paymentMethod, cartProducts, totalAmount, shippingCost } = req.body;
        if (!email || !address || !cartProducts.length)
            return res.status(400).send({ error: 'Validation Error' });

        const order = new Order({ email, address, paymentMethod, cartProducts, totalAmount, shippingCost });
        await order.save();

        for (const item of cartProducts) {
            await Product.updateOne({ name: item.name }, { $inc: { quantity: -item.quantity } });
        }

        const cartHtml = cartProducts.map(p => `<li>${p.name} - $${p.price} x ${p.quantity}</li>`).join('');
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Order Confirmation',
            html: `<p>Your order has been placed!</p><ul>${cartHtml}</ul><p>Total: $${totalAmount + shippingCost}</p>`
        };

        transporter.sendMail(mailOptions, () => { });
        res.status(201).send({ message: 'Order placed successfully' });

    } catch (error) {
        res.status(500).send({ error: 'Order failed', details: error.message });
    }
};

exports.getOrdersByEmail = async (req, res) => {
    try {
        const orders = await Order.find({ email: req.user.email });
        res.json(orders);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch orders' });
    }
};
