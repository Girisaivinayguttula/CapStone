const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    gender: String,
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    otp: String
});

module.exports = mongoose.model('User', userSchema);
