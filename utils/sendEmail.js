const sgMail = require("@sendgrid/mail");

// ضبط API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = async (options) => {
  try {
    const msg = {
      to: options.email,                  // الإيميل اللي هيستقبل
      from: process.env.EMAIL_USER,       // لازم يكون Verified في SendGrid
      subject: options.subject,
      html: options.html,
    };

    // إرسال الإيميل
    await sgMail.send(msg);

    console.log("✅ Email sent successfully to:", options.email);

  } catch (error) {
    console.error(
      "❌ Failed to send email:",
      error?.response?.body || error.message
    );
  }
};