const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
  try {

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOpts = {
      from: `"Petsify" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOpts);

    console.log("Email sent successfully");

  } catch (error) {
    console.log("Email error:", error);
  }
};