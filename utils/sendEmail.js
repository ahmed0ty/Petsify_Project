const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = async ({ email, name, otp }) => {
  try {

    const msg = {
      to: email,
      from: process.env.EMAIL_USER,
      templateId: process.env.SENDGRID_TEMPLATE_ID,

      dynamicTemplateData: {
        name: name,
        otp: otp
      }
    };

    await sgMail.send(msg);

    console.log("Email sent to:", email);

  } catch (error) {
    console.error("Email error:", error.response?.body || error.message);
  }
};