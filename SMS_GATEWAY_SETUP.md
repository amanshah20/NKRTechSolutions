# 📱 SMS Gateway Setup Guide - Production Ready

## Overview
This guide will help you set up **Twilio SMS Gateway** to send real OTPs to mobile phones in production.

---

## 🚀 Step-by-Step Setup

### Step 1: Create Twilio Account

1. **Go to Twilio Website**:
   - Visit: https://www.twilio.com/try-twilio
   
2. **Sign Up**:
   - Click "Sign up and start building"
   - Enter your details:
     - Email address
     - Password
     - First and Last name
   
3. **Verify Your Email**:
   - Check your email inbox
   - Click the verification link from Twilio

4. **Verify Your Phone Number**:
   - Twilio will ask you to verify your phone number
   - Enter your mobile number (the one you want to test with)
   - Enter the verification code sent to your phone

5. **Complete Onboarding**:
   - Answer questions about your use case (select "SMS/MMS")
   - Choose "With code" option
   - Select "Node.js" as your language

### Step 2: Get Twilio Credentials

1. **Dashboard**:
   - After login, you'll see the Twilio Console Dashboard
   - Find the **Account Info** section

2. **Copy These 3 Values**:
   ```
   Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxx
   Auth Token: [Click "Show" to reveal]
   ```

3. **Get a Phone Number**:
   - Click "Get a Trial Number" button
   - Twilio will assign you a free trial phone number
   - Note: Format will be like: +1234567890
   - Click "Choose this number"

### Step 3: Install Twilio SDK

Open terminal in your **server** directory and run:

```bash
cd "g:\Semester-7\client project\nkr-tech-solution\server"
npm install twilio
```

### Step 4: Configure Environment Variables

1. **Create/Edit `.env` file** in server directory:
   ```
   g:\Semester-7\client project\nkr-tech-solution\server\.env
   ```

2. **Add these lines** (replace with your actual values):
   ```env
   # Twilio SMS Configuration
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   
   # JWT Secret
   JWT_SECRET=nkr_tech_solutions_secret_key_2026
   
   # Email Configuration (optional - for password reset)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

3. **Important Notes**:
   - Replace `ACxxxxx...` with your actual Account SID
   - Replace `your_auth_token_here` with your Auth Token
   - Replace `+1234567890` with your Twilio phone number
   - Keep the `+` sign in the phone number

### Step 5: Update server.js to Load Environment Variables

1. **Install dotenv** (if not already installed):
   ```bash
   npm install dotenv
   ```

2. **Edit server.js** - Add this at the very top:
   ```javascript
   require('dotenv').config();
   ```

### Step 6: Restart Server

1. **Stop the current server** (Ctrl+C in the server terminal)

2. **Start server again**:
   ```bash
   node server.js
   ```

3. **Check Console Output**:
   - You should see: `✅ Twilio SMS service configured`
   - If you see warning about SMS not configured, check your .env file

### Step 7: Test SMS Sending

1. **Go to your website**: http://localhost:3000

2. **Click "Sign In"** → **"Sign Up"** tab

3. **Fill the form**:
   - Name: Test User
   - Email: test@example.com
   - Mobile: Your 10-digit verified number (without +91)
   - Password: Test@123

4. **Click "Sign Up"**

5. **Check Your Phone**: 
   - You should receive an SMS with the OTP code!
   - Message will be: "Hi Test User! Your NKR Tech Solutions verification OTP is: 123456. Valid for 10 minutes. Do not share this code."

---

## 💰 Twilio Pricing

### Free Trial:
- **$15.50 USD free credit** when you sign up
- Can send SMS to **verified numbers only** during trial
- Each SMS costs approximately **$0.0079 USD** (varies by country)
- You can send ~1,960 messages with free credit

### Adding More Numbers (Trial Mode):
1. Go to Twilio Console
2. Click "Phone Numbers" → "Manage" → "Verified Caller IDs"
3. Click "+" to add new number
4. Verify the number via SMS

### Upgrading to Paid Account:
1. Click "Upgrade" in Twilio Console
2. Add payment method
3. After upgrade:
   - Can send to **ANY** mobile number (not just verified)
   - Get better rates
   - Remove "Sent from your Twilio trial account" prefix

---

## 🌍 International SMS Support

### For Indian Numbers (Default):
Already configured: `+91${mobile}` in `otpService.js`

### For Other Countries:
Edit `server/utils/otpService.js`, line ~45:

```javascript
// Change this line:
to: `+91${mobile}` 

// To your country code:
to: `+1${mobile}`   // USA/Canada
to: `+44${mobile}`  // UK
to: `+61${mobile}`  // Australia
// etc.
```

### For Multiple Countries:
```javascript
// Add country code in signup form and pass it
to: `${countryCode}${mobile}`
```

---

## 🔧 Troubleshooting

### Issue 1: "SMS gateway not configured"
**Solution**: 
- Check if `.env` file exists in server directory
- Verify all 3 variables are set correctly
- Make sure you ran `npm install twilio`
- Restart the server

### Issue 2: "Twilio module not found"
**Solution**:
```bash
cd "g:\Semester-7\client project\nkr-tech-solution\server"
npm install twilio
```

### Issue 3: SMS not received
**Possible causes**:
1. **Trial account** - Number not verified in Twilio console
2. **Wrong phone number format** - Should be 10 digits without spaces/dashes
3. **Invalid Twilio credentials** - Double-check Account SID and Auth Token
4. **Country code mismatch** - Check if +91 is correct for your number

**Check server console for error messages**

### Issue 4: "Authentication Error" from Twilio
**Solution**: 
- Your Auth Token is incorrect
- Copy it again from Twilio dashboard (click "Show")
- Make sure there are no extra spaces in .env file

### Issue 5: Number not verified (Trial)
**Solution**:
- In Twilio Console, go to: Phone Numbers → Manage → Verified Caller IDs
- Add and verify the mobile number you want to test with
- Or upgrade to paid account to send to any number

---

## 📊 Checking SMS Status

### View SMS Logs in Twilio:
1. Go to Twilio Console
2. Click "Messaging" → "Logs" → "Messages"
3. You'll see all sent messages with status:
   - ✅ Delivered
   - ⏳ Queued/Sending
   - ❌ Failed (with error reason)

### In Your Server Console:
- Successful: `✅ SMS sent to 9876543210 (SID: SM...)`
- Failed: `❌ Failed to send SMS via Twilio: [error message]`

---

## 🔐 Security Best Practices

1. **Never commit .env file**:
   - Already added to `.gitignore`
   - Never share your Auth Token publicly

2. **Rotate Auth Token periodically**:
   - In Twilio Console → Settings → API Keys
   - Create new Auth Token
   - Update in `.env` file

3. **Rate Limiting**:
   - Consider adding rate limits to prevent abuse
   - Limit OTP requests per mobile number per hour

4. **Use Environment-Specific Credentials**:
   - Different Twilio accounts for development/production
   - Never use production credentials in development

---

## 🌐 Alternative SMS Gateways

If you want to use a different provider, update `server/utils/otpService.js`:

### Option 1: AWS SNS (Amazon)
```bash
npm install aws-sdk
```
Configure AWS credentials and use SNS API

### Option 2: MSG91 (India-focused)
```bash
npm install msg91
```
Good for Indian numbers, cheaper rates

### Option 3: Nexmo/Vonage
```bash
npm install @vonage/server-sdk
```
Alternative to Twilio

---

## ✅ Verification Checklist

Before going live, make sure:

- [ ] Twilio account created and verified
- [ ] Trial phone number obtained
- [ ] `npm install twilio` completed
- [ ] `.env` file created with correct credentials
- [ ] `dotenv` installed and configured in server.js
- [ ] Server restarted after configuration
- [ ] Test SMS received on verified number
- [ ] Country code is correct (+91 for India)
- [ ] Error handling tested (wrong OTP, expired OTP)
- [ ] Twilio account upgraded (for production) or numbers verified (for trial)

---

## 📞 Support Contacts

**Twilio Support**:
- Help Center: https://support.twilio.com/
- Documentation: https://www.twilio.com/docs/sms
- Status Page: https://status.twilio.com/

**Your Implementation**:
- Server logs: Check PowerShell window running `node server.js`
- Client errors: Check browser console (F12)
- Database: `server/database/database.db`

---

## 🎯 Quick Start Summary

For the impatient:

```bash
# 1. Sign up at twilio.com
# 2. Get Account SID, Auth Token, Phone Number
# 3. Install Twilio
cd server
npm install twilio

# 4. Create .env file with credentials
# 5. Restart server
node server.js

# 6. Test signup - SMS will be sent!
```

---

## 📝 Current Status

**Development Mode** (Current):
- ✅ OTP logged to server console
- ✅ All functionality working
- ⚠️ SMS not sent to actual phones

**Production Mode** (After Setup):
- ✅ Real SMS sent to mobile phones
- ✅ No console logging (unless error)
- ✅ Yellow warning box removed from UI
- ✅ Works with any verified number (trial) or any number (paid)

---

**Need help?** Check the server console for detailed error messages. Most issues are due to incorrect credentials or unverified phone numbers in trial mode.
