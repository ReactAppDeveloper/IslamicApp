const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (to, subject, content, isHtml = false) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "mwaqas@waiiz.com",
        pass: "decxetvmkxhbcope",
      },
    });

    const mailOptions = {
      from: `"Wasil App" <"mwaqas@waiiz.com"}>`,
      to,
      subject,
      // Use HTML if isHtml=true, otherwise use plain text
      [isHtml ? "html" : "text"]: content,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent: ', info.response);
  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw new Error('Failed to send email');
  }
};

module.exports = sendEmail;
