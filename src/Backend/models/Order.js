const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    email: { type: String, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    cartProducts: [
        {
            name: String,
            price: Number,
            quantity: Number,
            imageUrl: String
        }
    ],
    totalAmount: Number,
    shippingCost: Number,
    orderDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
