const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = async (options) => {
  try {
    const msg = {
      to: options.email,        
      from: process.env.EMAIL_USER,
      subject: options.subject,
      html: options.html,
    };

    await sgMail.send(msg);
    console.log("✅ Email sent successfully to:", options.email);
  } catch (error) {
    console.error("❌ Failed to send email:", error.response?.body || error);
  }
};