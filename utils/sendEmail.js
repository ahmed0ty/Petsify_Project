require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = (options) => {

  const msg = {
    to: options.email,
    from: {
      email: process.env.EMAIL_USER,
      name: "Petsify"
    },
    subject: options.subject,
    html: options.html,
  };

  sgMail.send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch(err => {
      console.error("Email error:", err.response?.body || err);
    });
};