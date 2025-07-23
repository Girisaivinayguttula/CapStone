const User = require('../models/User');

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).send({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).send({ error: 'Server error', details: error.message });
    }
};
