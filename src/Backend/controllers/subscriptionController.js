const Subscription = require('../models/Subscription');
const transporter = require('../config/mailer');

exports.subscribe = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).send({ error: 'Email is required' });

    const exists = await Subscription.findOne({ email });
    if (exists) return res.status(400).send({ error: 'Already subscribed' });

    const sub = new Subscription({ email });
    await sub.save();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Subscription Confirmation',
        html: `<p>Thanks for subscribing!</p>`
    };

    transporter.sendMail(mailOptions, () => { });
    res.status(200).send({ message: 'Subscribed successfully' });
};

exports.getAll = async (req, res) => {
    const list = await Subscription.find().select('email -_id');
    res.json(list.map(s => s.email));
};
