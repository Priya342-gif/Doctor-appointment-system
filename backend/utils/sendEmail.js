const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email skipped: EMAIL_USER or EMAIL_PASS not configured in environment variables.');
      return null;
    }

    const cleanPass = process.env.EMAIL_PASS.replace(/\s+/g, '');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
      auth: {
        user: process.env.EMAIL_USER.trim(),
        pass: cleanPass,
      },
    });

    const fromAddress = process.env.EMAIL_FROM
      ? process.env.EMAIL_FROM.trim()
      : process.env.EMAIL_USER.trim();

    const mailOptions = {
      from: `"DocBook" <${fromAddress}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to', to, '- Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error.message);
    return null;
  }
};

module.exports = sendEmail;
