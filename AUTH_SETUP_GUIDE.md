# Authentication System - Setup Guide

## ✅ What Has Been Implemented

### Backend Features:
1. **User Authentication APIs**
   - Signup with email verification
   - Login with email/password
   - OTP verification system
   - Password reset functionality
   - Google Sign-In support (backend ready)
   - Token-based authentication (JWT)

2. **Email Service**
   - OTP email sending
   - Password reset emails
   - Professional HTML email templates

3. **Database**
   - Users table with OTP and reset token fields
   - Email duplicate prevention
   - Password hashing with bcrypt

### Frontend Features:
1. **Authentication Modal**
   - Beautiful signup/login forms
   - Auto-shows after 5 seconds
   - Tab switching between signup/login
   - Password visibility toggle
   - Form validation

2. **OTP Verification**
   - 6-digit OTP input
   - Auto-focus next input
   - Paste support
   - Resend OTP with countdown
   - Real-time validation

3. **User Profile**
   - Profile icon in navbar
   - User name display
   - Profile dropdown menu
   - Logout functionality

4. **Password Reset**
   - Forgot password flow
   - Email-based reset link
   - Professional UI

## 🔧 Required Configuration

### Email Setup (IMPORTANT!)

To enable OTP and password reset emails, you need to configure Gmail SMTP:

1. **Create App Password for Gmail:**
   - Go to your Google Account: https://myaccount.google.com/
   - Navigate to Security
   - Enable 2-Step Verification
   - Go to App Passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

2. **Update Email Configuration:**

Open `server/utils/otpService.js` and update lines 6-8:

```javascript
auth: {
  user: 'your-email@gmail.com',  // Replace with your Gmail
  pass: 'your-app-password'       // Replace with generated app password
}
```

**OR** (Recommended) create a `.env` file in the server folder:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
JWT_SECRET=your_secret_key_here
PORT=5000
```

## 🚀 How to Test

### 1. Restart the Server
```bash
cd server
npm start
```

### 2. Test the Flow:

**Signup Process:**
1. Open http://localhost:3000
2. Wait 5 seconds or click "Sign In" button
3. Click "Sign Up" tab
4. Enter name, email, and password
5. Click "Create Account"
6. Check your email for OTP
7. Enter the 6-digit OTP
8. You'll be logged in automatically

**Login Process:**
1. Click "Sign In"
2. Enter registered email and password
3. Click "Sign In"
4. You'll see your profile in the navbar

**Password Reset:**
1. Click "Sign In"
2. Click "Forgot Password?"
3. Enter your email
4. Check email for reset link
5. Click the link to reset password

## 📋 Features Summary

### ✅ Completed:
- [x] User signup with email validation
- [x] Email verification via OTP
- [x] Real email sending (configure Gmail)
- [x] Secure password hashing
- [x] Login system
- [x] User profile display
- [x] Password reset flow
- [x] Duplicate email prevention
- [x] JWT token authentication
- [x] Auto-logout on token expiry
- [x] Professional CSS styling
- [x] Mobile responsive design
- [x] Session management
- [x] Error handling

### 🔄 Pending (Optional):
- [ ] Google OAuth integration (backend ready, needs Google API setup)
- [ ] Profile picture upload
- [ ] Change password feature
- [ ] Email preferences

## 🎨 Design Features

- **Modern gradient UI**
- **Smooth animations**
- **Loading states**
- **Error messages**
- **Success notifications**
- **Responsive design**
- **Focus states on inputs**
- **Hover effects**
- **Professional email templates**

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- OTP expiry (10 minutes)
- Reset token expiry (1 hour)
- Duplicate email prevention
- Secure session management
- Protected API routes

## 📝 API Endpoints

- `POST /api/user/signup` - Register new user
- `POST /api/user/verify-otp` - Verify OTP
- `POST /api/user/resend-otp` - Resend OTP
- `POST /api/user/login` - User login
- `POST /api/user/forgot-password` - Request password reset
- `POST /api/user/reset-password` - Reset password
- `POST /api/user/google-signin` - Google Sign-In
- `GET /api/user/profile` - Get user profile (protected)
- `GET /api/user/verify-token` - Verify JWT token

## 🎯 User Experience Flow

1. **First Visit:** User browses site for 5 seconds → Auth modal appears
2. **Signup:** User registers → Receives OTP email → Verifies → Logged in
3. **Profile:** User sees their name in navbar → Can logout anytime
4. **Return Visit:** Auto-login if token valid
5. **Forgot Password:** Request reset → Check email → Reset password

## ⚠️ Important Notes

1. **Email Configuration is MANDATORY** for OTP and password reset to work
2. The auth modal auto-shows once per session after 5 seconds
3. Users can manually open auth modal by clicking "Sign In" in navbar
4. Profile dropdown closes automatically on logout
5. Tokens expire after 7 days (configurable in userAuthController.js)

## 🐛 Troubleshooting

**OTP Not Received:**
- Check email configuration in otpService.js
- Verify Gmail app password is correct
- Check spam folder
- Ensure 2-Step Verification is enabled on Gmail

**Login Not Working:**
- Verify email first (check for OTP)
- Ensure password is correct
- Check browser console for errors

**Profile Not Showing:**
- Clear browser localStorage
- Refresh the page
- Check if user is logged in

## 🎉 Success!

Your complete authentication system is now ready! Configure the email settings and test the flow.

---

**NKR Tech Solutions Authentication System**
Version 1.0 - January 2026
