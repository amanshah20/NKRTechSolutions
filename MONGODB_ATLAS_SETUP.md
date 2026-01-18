# MongoDB Atlas Setup Guide

Complete guide to set up MongoDB Atlas (Cloud Database) for your NKR Tech Solution project.

## 📋 Prerequisites
- Email address for account creation
- Internet connection
- Your project's .env file access

---

## 🚀 Step-by-Step Setup

### Step 1: Create MongoDB Atlas Account

1. **Visit MongoDB Atlas**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Click on **"Try Free"** or **"Start Free"** button

2. **Sign Up**
   - Enter your email address
   - Create a strong password
   - OR sign up with Google/GitHub account
   - Click **"Create your Atlas account"**

3. **Verify Email**
   - Check your email inbox
   - Click the verification link sent by MongoDB
   - Complete email verification

---

### Step 2: Create Your First Cluster

1. **Choose Deployment Type**
   - After login, you'll see "Create a deployment" page
   - Select **"M0 FREE"** tier (This is completely free forever!)
   
2. **Configure Cluster Settings**
   - **Cloud Provider**: Choose **AWS** (recommended)
   - **Region**: Select the region closest to you or your users
     - For India: `Mumbai (ap-south-1)` or `Singapore (ap-southeast-1)`
     - For USA: `N. Virginia (us-east-1)`
     - For Europe: `Ireland (eu-west-1)`
   - **Cluster Name**: Leave default or rename to `nkr-tech-cluster`

3. **Create Cluster**
   - Click **"Create Deployment"** or **"Create Cluster"**
   - Wait 3-5 minutes for cluster to be created (you'll see a progress indicator)

---

### Step 3: Set Up Database Access (Create User)

1. **Navigate to Database Access**
   - On the left sidebar, click **"Database Access"** (under SECURITY)
   - Click **"+ ADD NEW DATABASE USER"**

2. **Create Database User**
   - **Authentication Method**: Select **"Password"**
   - **Username**: Enter `nkr_admin` (or any username you prefer)
   - **Password**: 
     - Click **"Autogenerate Secure Password"** (recommended)
     - OR create your own strong password
     - **IMPORTANT**: Copy and save this password immediately!
   
3. **Set Database User Privileges**
   - Under "Database User Privileges"
   - Select **"Atlas admin"** (for full access)
   - OR select **"Read and write to any database"** (recommended for production)

4. **Add User**
   - Click **"Add User"**
   - User will be created in a few seconds

---

### Step 4: Configure Network Access (Whitelist IP)

1. **Navigate to Network Access**
   - On the left sidebar, click **"Network Access"** (under SECURITY)
   - Click **"+ ADD IP ADDRESS"**

2. **Add IP Address**
   
   **Option A: Allow Access from Anywhere (Development)**
   - Click **"ALLOW ACCESS FROM ANYWHERE"**
   - IP Address will be set to `0.0.0.0/0`
   - Click **"Confirm"**
   - ⚠️ **Note**: This is for development only. For production, use specific IPs.

   **Option B: Add Your Current IP (More Secure)**
   - Click **"ADD CURRENT IP ADDRESS"**
   - Your IP will be automatically detected
   - Give it a description like "My Home Network"
   - Click **"Confirm"**
   - 📝 **Note**: You'll need to add more IPs if you work from different locations

3. **Wait for Status**
   - Wait until status shows **"Active"** (usually takes 1-2 minutes)

---

### Step 5: Get Connection String

1. **Go to Database Deployments**
   - Click **"Database"** in the left sidebar
   - You'll see your cluster listed

2. **Connect to Cluster**
   - Click the **"Connect"** button on your cluster
   - A modal will appear with connection options

3. **Choose Connection Method**
   - Select **"Drivers"** (for application connection)
   - **Driver**: Select **"Node.js"**
   - **Version**: Select your version (latest is fine)

4. **Copy Connection String**
   - You'll see a connection string like:
     ```
     mongodb+srv://nkr_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Click **"Copy"** to copy the connection string
   - **IMPORTANT**: Save this string - you'll need it in the next step

---

### Step 6: Update Your Project Configuration

1. **Open Your .env File**
   - Navigate to: `g:\Semester-7\client project\nkr-tech-solution\server\.env`
   - Open it in VS Code or any text editor

2. **Update MongoDB Connection String**
   ```env
   # Replace the MONGODB_URI line with your Atlas connection string
   MONGODB_URI=mongodb+srv://nkr_admin:<password>@cluster0.xxxxx.mongodb.net/nkr_tech?retryWrites=true&w=majority
   ```

3. **Replace `<password>`**
   - Replace `<password>` with the actual password you saved in Step 3
   - DO NOT include the angle brackets `< >`
   
   **Example**:
   ```env
   # Before (from Atlas)
   MONGODB_URI=mongodb+srv://nkr_admin:<password>@cluster0.xxxxx.mongodb.net/nkr_tech?retryWrites=true&w=majority
   
   # After (with your actual password)
   MONGODB_URI=mongodb+srv://nkr_admin:MySecurePass123@cluster0.xxxxx.mongodb.net/nkr_tech?retryWrites=true&w=majority
   ```

4. **Add Database Name**
   - In the connection string, after `.mongodb.net/` add `nkr_tech`
   - This ensures your database is named correctly

5. **Save the File**
   - Press `Ctrl + S` to save the `.env` file

---

### Step 7: Test the Connection

1. **Stop the Current Server**
   - If your server is running, stop it (Ctrl + C in the terminal)

2. **Start the Server**
   ```powershell
   cd "g:\Semester-7\client project\nkr-tech-solution\server"
   node server.js
   ```

3. **Check for Success Messages**
   - You should see:
     ```
     ✅ MongoDB connected successfully
     📊 Database: nkr_tech
     🚀 Server running on http://localhost:5000
     ```

4. **If Connection Fails**
   - Double-check your password in the connection string
   - Make sure you replaced `<password>` with actual password
   - Verify Network Access is set to Active
   - Check that your IP is whitelisted

---

## 🎯 Your Complete .env Configuration

After setup, your `.env` file should look like this:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://nkr_admin:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/nkr_tech?retryWrites=true&w=majority

# Email Configuration (Update with real credentials)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@nkrtechsolution.com
ADMIN_EMAIL=admin@nkrtechsolution.com
```

---

## 📊 View Your Database

1. **Browse Collections**
   - In MongoDB Atlas, click **"Browse Collections"** on your cluster
   - You'll see your `nkr_tech` database
   - Collections will be created automatically when you first add data

2. **Collections You'll See**
   - `admins` - Admin users
   - `users` - Regular users
   - `orders` - Customer orders
   - `demorequests` - Demo requests
   - `contacts` - Contact form submissions
   - `feedbacks` - User feedback

---

## 🔒 Security Best Practices

### For Development
✅ Use "Allow Access from Anywhere" (0.0.0.0/0)
✅ Use strong passwords
✅ Keep .env file in .gitignore

### For Production
✅ Whitelist only specific IP addresses
✅ Use environment variables (not hardcoded)
✅ Enable MongoDB Atlas Alerts
✅ Upgrade to paid tier for better performance
✅ Enable backup and point-in-time recovery
✅ Use separate clusters for dev and production

---

## 🐛 Troubleshooting

### Error: "MongoServerError: bad auth"
**Solution**: Check your password in the connection string
- Password is case-sensitive
- Special characters might need URL encoding
- Use `encodeURIComponent()` for special chars in password

### Error: "Could not connect to any servers"
**Solution**: Check Network Access
- Verify IP is whitelisted
- Ensure status is "Active"
- Try adding 0.0.0.0/0 temporarily

### Error: "Authentication failed"
**Solution**: Verify database user
- Check username is correct
- Confirm password was copied correctly
- Ensure user has proper privileges

### Connection Timeout
**Solution**: Check internet and firewall
- Verify internet connection is stable
- Check if firewall is blocking port 27017
- Try different network if possible

---

## 📱 Useful MongoDB Atlas Features

### 1. **Metrics & Charts**
   - Monitor database performance
   - View connection statistics
   - Track query performance

### 2. **Backup & Restore**
   - Available in paid tiers
   - Point-in-time recovery
   - Automated snapshots

### 3. **Alerts**
   - Set up email alerts
   - Monitor disk usage
   - Track connection spikes

### 4. **Atlas Search**
   - Full-text search capabilities
   - Available in M10+ tiers

---

## 🆘 Need Help?

- **MongoDB Documentation**: https://docs.mongodb.com/
- **Atlas Support**: https://support.mongodb.com/
- **Community Forums**: https://www.mongodb.com/community/forums/

---

## ✅ Next Steps

After successful connection:

1. **Seed Initial Data** (Optional)
   ```powershell
   cd "g:\Semester-7\client project\nkr-tech-solution\server"
   node database/seed.js
   ```

2. **Create Admin User**
   - Use the registration endpoint
   - Or add directly in Atlas

3. **Test Your Application**
   - Server: http://localhost:5000
   - Client: http://localhost:3000
   - Try creating orders, demo requests, etc.

4. **Monitor Your Database**
   - Check Atlas dashboard regularly
   - Watch for any connection issues
   - Monitor storage usage (500MB free limit)

---

## 💡 Pro Tips

1. **Free Tier Limitations**
   - 512 MB storage
   - Shared RAM
   - No backups
   - Good for development and small projects

2. **Connection String Security**
   - Never commit `.env` file to Git
   - Use different credentials for dev/production
   - Rotate passwords periodically

3. **Performance**
   - Create indexes for frequently queried fields
   - Use projection to limit returned data
   - Monitor slow queries in Atlas

4. **Upgrade When Needed**
   - M10 tier starts at $0.08/hour
   - Provides backups and better performance
   - Suitable for production applications

---

**🎉 Congratulations! Your MongoDB Atlas is now set up and ready to use!**

For questions or issues, refer to the troubleshooting section or MongoDB documentation.
