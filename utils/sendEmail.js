const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // smtp-relay.brevo.com
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false, // STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        ciphers: "SSLv3", // ضروري أحيانًا للـ STARTTLS
        rejectUnauthorized: false,
      },
    });

    const mailOpts = {
      from: `"Petsify App" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOpts);
    console.log("✅ Email sent successfully:", options.email);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};