const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);


// FILE: middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;