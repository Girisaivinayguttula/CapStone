const Subscription = require('../../models/Subscription');
const { sendEmail } = require('../utils/emailService');

exports.subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send({ error: 'Email is required' });

    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) return res.status(400).send({ error: 'Email is already subscribed' });

    const subscription = new Subscription({ email });
    await subscription.save();

    await sendEmail(email, 'Subscription Confirmation', `
      <p>Thank you for subscribing to our newsletter!</p>
      <p>We're thrilled to have you on board.</p>
      <p>Expect to receive the latest updates, exclusive content, and special offers directly in your inbox.</p>
      <p>If you ever have any questions or feedback, feel free to reply to this email or contact us at <a href="mailto:cabastoreoffical@gmail.com">cabastoreoffical@gmail.com</a>.</p>
      <p>Stay tuned for more exciting news!</p>
      <p>Best regards,</p>
      <p><strong>Caba</strong></p>
    `);

    res.status(200).send({ message: 'Subscription successful and confirmation email sent' });
  } catch (error) {
    next(error);
  }
};

exports.getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find().select('email -_id');
    res.json(subscriptions.map(sub => sub.email));
  } catch (error) {
    next(error);
  }
};