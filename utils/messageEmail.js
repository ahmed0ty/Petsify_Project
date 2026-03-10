exports.htmlMessage=(name,resetCode)=>{
   return `
  <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <div style="text-align: center; padding-bottom: 20px;">
      <h2 style="color: #4CAF50; margin-bottom: 10px;">🔐 Password Reset Request</h2>
      <p style="font-size: 16px;">Hello <strong>${name}</strong>,</p>
    </div>

    <p style="font-size: 15px; line-height: 1.6;">
      We received a request to reset the password for your <strong>E-shop</strong> account.
      Please use the verification code below to reset your password. This code is valid for <strong>10 minutes</strong>.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <span style="display: inline-block; background-color: #4CAF50; color: white; padding: 14px 30px; font-size: 24px; letter-spacing: 4px; border-radius: 8px; font-weight: bold;">
        ${resetCode}
      </span>
    </div>

    <p style="font-size: 15px; line-height: 1.6;">
      If you didn't request this, please ignore this email. Your account is still secure.
    </p>

    <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 14px; color: #888;">
      <p>Need help? Contact us at <a href="mailto:ttayeb769@gmail.com" style="color: #4CAF50;">ttayeb769@gmail.com</a></p>
      <p>Thanks for using <strong>E-shop</strong>!</p>
    </div>
  </div>
`;
}