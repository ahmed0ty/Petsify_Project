const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOpts = {
    from: "petsify App <brahimbendada024@gmail.com>",
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOpts);
};
