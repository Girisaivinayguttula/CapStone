const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { sendEmail } = require('../utils/emailService');

exports.signup = async (req, res, next) => {
  try {
    const { name, email, phone, password, gender } = req.body;
    let user = await User.findOne({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    if (user) {
      if (user.isVerified) {
        return res.status(400).send({ error: 'Email already registered and verified.' });
      }
      user.otp = otp;
    } else {
      user = new User({ name, email, phone, password, gender, otp });
    }
    await user.save();

    await sendEmail(email, 'OTP Verification', `Your OTP code is ${otp}`);
    res.status(200).send({ message: 'OTP sent to your email. Please enter it to verify your account.' });
  } catch (error) {
    next(error);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).send({ error: 'Invalid OTP' });
    }
    user.isVerified = true;
    user.otp = undefined;
    await user.save();
    res.status(200).send({ message: 'OTP verified. Account activated.' });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || password !== user.password) {
      return res.status(401).send({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).send({ token });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).send({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};