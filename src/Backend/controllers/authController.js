const User = require('../models/User');
const jwt = require('jsonwebtoken');
const transporter = require('../config/mailer');

exports.signup = async (req, res) => {
    try {
        const { name, email, phone, password, gender } = req.body;
        let user = await User.findOne({ email });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        if (user) {
            if (user.isVerified) return res.status(400).send({ error: 'Email already registered and verified.' });
            user.otp = otp;
            await user.save();
        } else {
            user = new User({ name, email, phone, password, gender, otp });
            await user.save();
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP Verification',
            html: `<p>Your OTP code is <strong>${otp}</strong></p>`
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) return res.status(500).send({ error: 'Failed to send OTP email' });
            res.status(200).send({ message: 'OTP sent to your email.' });
        });

    } catch (error) {
        res.status(500).send({ error: 'Error saving user', details: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp) return res.status(400).send({ error: 'Invalid OTP' });

        user.isVerified = true;
        user.otp = undefined;
        await user.save();

        res.status(200).send({ message: 'OTP verified. Account activated.' });
    } catch (error) {
        res.status(500).send({ error: 'Server error', details: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.password !== password) return res.status(401).send({ error: 'Invalid email or password' });

        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send({ error: 'Server error', details: error.message });
    }
};
