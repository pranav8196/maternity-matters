// File: server/utils/mailer.js

const nodemailer = require('nodemailer');

// Configure the transporter using credentials from your .env file
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * A generic function to send emails.
 * @param {object} mailOptions - Options object for nodemailer.
 * @param {string} mailOptions.to - The recipient's email address.
 * @param {string} mailOptions.subject - The subject line of the email.
 * @param {string} mailOptions.text - The plain text body of the email.
 * @param {string} mailOptions.html - The HTML body of the email.
 */
const sendEmail = async (mailOptions) => {
  try {
    // Set the 'from' address using the .env variable for all emails
    const optionsWithFrom = {
      from: `"Maternity Matters" <${process.env.EMAIL_USER}>`,
      ...mailOptions,
    };
    
    await transporter.sendMail(optionsWithFrom);
    console.log(`Email sent successfully to ${mailOptions.to}`);
  } catch (error) {
    console.error(`Error sending email to ${mailOptions.to}:`, error);
    // We throw the error so the calling function can decide how to handle it,
    // but we log it here for debugging purposes.
    throw new Error('Failed to send email.');
  }
};

module.exports = sendEmail;