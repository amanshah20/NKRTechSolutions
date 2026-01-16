const nodemailer = require('nodemailer');

// Twilio SMS Configuration
let twilioClient = null;
const SMS_CONFIGURED = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER);

if (SMS_CONFIGURED) {
  try {
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log('✅ Twilio SMS service configured');
  } catch (error) {
    console.warn('⚠️  Twilio module not found. Run: npm install twilio');
  }
} else {
  console.warn('⚠️  SMS gateway not configured. OTPs will be logged to console only.');
  console.warn('   Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env file');
}

// Create transporter for sending emails (optional - only for password reset)
// Note: For production, use real SMTP credentials
let transporter = null;
try {
  transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com', // Replace with your email
      pass: process.env.EMAIL_PASSWORD || 'your-app-password' // Replace with your app password
    }
  });
} catch (error) {
  console.warn('⚠️  Email transporter not configured. Email features will not work.');
}

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() + 900000).toString();
};

// Send OTP via SMS
const sendOTPSMS = async (mobile, otp, name) => {
  // Production: Send via Twilio
  if (twilioClient && SMS_CONFIGURED) {
    try {
      const message = await twilioClient.messages.create({
        body: `Hi ${name}! Your NKR Tech Solutions verification OTP is: ${otp}. Valid for 10 minutes. Do not share this code.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${mobile}` // Assuming Indian numbers, adjust country code as needed
      });
      
      console.log(`✅ SMS sent to ${mobile} (SID: ${message.sid})`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send SMS via Twilio:', error.message);
      // Fallback to console logging
      logOTPToConsole(mobile, otp, name);
      return false;
    }
  } else {
    // Development: Log to console
    logOTPToConsole(mobile, otp, name);
    return true;
  }
};

// Helper function to log OTP to console (development mode)
const logOTPToConsole = (mobile, otp, name) => {
  console.log(`\n📱 SMS OTP for ${mobile}:`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`   Hi ${name}!`);
  console.log(`   Your OTP: ${otp}`);
  console.log(`   Valid for 10 minutes`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
};

// Check if SMS is configured
const isSMSConfigured = () => SMS_CONFIGURED;

// Send OTP email (backup method)
const sendOTPEmail = async (email, otp, name) => {
  if (!transporter) {
    console.warn('⚠️  Email transporter not configured');
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || 'NKR Tech Solutions <noreply@nkrtech.com>',
    to: email,
    subject: 'Mobile Verification - NKR Tech Solutions',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #0A66C2, #0858a8); padding: 30px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
          .content { padding: 40px 30px; }
          .otp-box { background: linear-gradient(135deg, #f8f9fa, #e8ecf1); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
          .otp-code { font-size: 36px; font-weight: bold; color: #0A66C2; letter-spacing: 8px; margin: 15px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #0A66C2, #0858a8); color: #ffffff; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Email Verification</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Thank you for signing up with <strong>NKR Tech Solutions</strong>. To complete your registration, please verify your email address using the OTP below:
            </p>
            <div class="otp-box">
              <p style="margin: 0; font-size: 14px; color: #666;">Your Verification Code</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; font-size: 13px; color: #999;">This code will expire in 10 minutes</p>
            </div>
            <p style="font-size: 14px; color: #666;">
              If you didn't request this verification, please ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>© 2026 NKR Tech Solutions. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    return false;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, name) => {
  if (!transporter) {
    console.warn('⚠️  Email transporter not configured');
    return false;
  }

  const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER || 'NKR Tech Solutions <noreply@nkrtech.com>',
    to: email,
    subject: 'Password Reset Request - NKR Tech Solutions',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #0A66C2, #0858a8); padding: 30px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
          .content { padding: 40px 30px; }
          .button { display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #0A66C2, #0858a8); color: #ffffff; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Password Reset</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              We received a request to reset your password for your NKR Tech Solutions account.
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Click the button below to reset your password:
            </p>
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              <strong>Note:</strong> This link will expire in 1 hour.
            </p>
            <p style="font-size: 14px; color: #666;">
              If you didn't request a password reset, please ignore this email or contact support if you have concerns.
            </p>
          </div>
          <div class="footer">
            <p>© 2026 NKR Tech Solutions. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return false;
  }
};

module.exports = {
  generateOTP,
  sendOTPSMS,
  sendOTPEmail,
  sendPasswordResetEmail,
  isSMSConfigured
};
