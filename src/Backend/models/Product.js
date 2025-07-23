const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    inStock: Boolean,
    category: String,
    imageUrl: String,
    quantity: { type: Number, required: true }
});

module.exports = mongoose.model('Product', productSchema);