/** @format */

const nodemailer = require("nodemailer");

/**
 * Utility to send emails via Gmail SMTP.
 * * @param {Object} options - Email configuration options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.text - HTML content of the email (mapped to 'html' field)
 */
const sendEmail = async (options) => {
  // Create Reusable Transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  // Define Email Options
  const message = {
    from: `"Gym Tracker" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.text, // Note: We map 'text' input to 'html' output for styling
  };

  // Send Email
  await transporter.sendMail(message);
};

module.exports = sendEmail;
