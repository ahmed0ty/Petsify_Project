require("dotenv").config();
const emailQueue = require("../utils/emailQueue");
const { sendEmail } = require("../utils/sendEmail");

emailQueue.process(async (job) => {

  const { email, subject, html } = job.data;

  await sendEmail({
    email,
    subject,
    html
  });

  console.log("Email sent to:", email);
});