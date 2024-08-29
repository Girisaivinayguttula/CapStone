const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Gmail SMTP server
  port: 465, // Secure port for SSL/TLS
  secure: true, // Use SSL
  auth: {
    user: 'cabastoreoffical@gmail.com', // Your Gmail address
    pass: 'achttpcpvxdxdhyx'  // Correct App Password without spaces
  }
});

const mailOptions = {
  from: 'cabastoreoffical@gmail.com', // Must match the user in the auth field
  to: 'chaturyanaidu@gmail.com', // Recipient's email
  subject: 'Order submission',
  text: 'Your order has been Placed.'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error while sending email:', error);
  } else {
    console.log('Email sent successfully:', info.response);
  }
});
