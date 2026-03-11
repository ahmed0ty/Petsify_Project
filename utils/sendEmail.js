const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // STARTTLS على port 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // App Password
      },
    });

    const mailOpts = {
      from: `"Petsify App" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOpts);
    console.log("Email sent successfully to:", options.email);
  } catch (error) {
    console.log("Failed to send email:", error);
  }
};