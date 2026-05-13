// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// exports.sendEmail = async (options) => {
//   try {
//     const msg = {
//       to: options.email,        
//       from: process.env.EMAIL_USER,
//       subject: options.subject,
//       html: options.html,
//     };

//     await sgMail.send(msg);
//     console.log("✅ Email sent successfully to:", options.email);
//   } catch (error) {
//     console.error("❌ Failed to send email:", error.response?.body || error);
//   }
// };

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

exports.sendEmail = async (options) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: options.email,        // ← أي إيميل حتى temp mail ✅
      subject: options.subject,
      html: options.html,
    });
    console.log("✅ Email sent to:", options.email);
  } catch (error) {
    console.error("❌ Failed:", error);
  }
};