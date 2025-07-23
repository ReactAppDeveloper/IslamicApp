const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // smtp.gmail.com
      port: "587", // 587
      secure: false, // TLS
      auth: {
        user: "mwaqas@waiiz.com",
        pass: "decxetvmkxhbcope",
      },
    });

    const mailOptions = {
      from: `"Wasil App" <"mwaqas@waiiz.com">`,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent: ', info.response);
  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw new Error('Failed to send email');
  }
};

module.exports = sendEmail;
