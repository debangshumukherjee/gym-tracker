/** @format */

const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const message = {
    from: `"Gym Tracker" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.text,
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;
