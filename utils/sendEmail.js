const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
  try {
   const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

    const mailOpts = {
      from: `"Petsify App" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOpts);
    console.log("Email sent successfully:", options.email);
  } catch (error) {
    console.log("Failed to send email:", error);
  }
};