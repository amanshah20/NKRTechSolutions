const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'nkr_tech_solutions_secret_key_2026';

// User Signup - Simple version
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      success: true, 
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Failed to create account' });
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      success: true, 
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

// Change Password (requires old password)
exports.changePassword = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
};

// Google Sign-In (requires mobile number to be added later)
exports.googleSignIn = async (req, res) => {
  const { name, email, mobile, googleId, profilePicture } = req.body;

  if (!email || !googleId || !mobile) {
    return res.status(400).json({ success: false, message: 'Email, mobile number, and Google ID are required' });
  }

  // Validate mobile number format (10 digits)
  if (!/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ success: false, message: 'Invalid mobile number. Please enter 10 digits.' });
  }

  // Check if user exists by email or googleId
  try {
    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (user) {
      // User exists, log them in
      user.lastLogin = new Date();
      await user.save();

      const token = jwt.sign({ userId: user._id, email: user.email, mobile: user.mobile }, JWT_SECRET, { expiresIn: '7d' });

      return res.json({ 
        success: true, 
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          profilePicture: user.profilePicture || profilePicture
        }
      });
    }

    // Check if mobile already exists
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({ success: false, message: 'Mobile number already registered' });
    }

    // Create new user (Google users are auto-verified)
    user = await User.create({
      name,
      email,
      mobile,
      googleId,
      isVerified: true,
      profilePicture,
      password: crypto.randomBytes(16).toString('hex') // Random password for Google users
    });

    const token = jwt.sign({ userId: user._id, email, mobile }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      success: true, 
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name,
        email,
        mobile,
        profilePicture
      }
    });
  } catch (error) {
    console.error('Google sign-in error:', error);
    return res.status(500).json({ success: false, message: 'Google sign-in failed' });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (!user) {
      // Don't reveal if email exists for security
      return res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token
    db.run(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
      [resetToken, resetTokenExpiry.toISOString(), email],
      async (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Failed to process request' });
        }

        // Send password reset email
        const emailSent = await sendPasswordResetEmail(email, resetToken, user.name);
        
        if (!emailSent) {
          return res.status(500).json({ success: false, message: 'Failed to send reset email' });
        }

        res.json({ success: true, message: 'Password reset link sent to your email' });
      }
    );
  });
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ success: false, message: 'Token and new password are required' });
  }

  db.get('SELECT * FROM users WHERE reset_token = ?', [token], async (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    // Check token expiry
    const now = new Date();
    const tokenExpiry = new Date(user.reset_token_expiry);

    if (now > tokenExpiry) {
      return res.status(400).json({ success: false, message: 'Reset token has expired' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    db.run(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [hashedPassword, user.id],
      (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Failed to reset password' });
        }

        res.json({ success: true, message: 'Password reset successfully' });
      }
    );
  });
};

// Get User Profile
exports.getProfile = (req, res) => {
  const userId = req.userId; // From auth middleware

  db.get('SELECT id, name, email, profile_picture, created_at FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  });
};

// Verify Token
exports.verifyToken = (req, res) => {
  // If we reach here, token is valid (checked by middleware)
  db.get('SELECT id, name, email, profile_picture FROM users WHERE id = ?', [req.userId], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profile_picture
      }
    });
  });
};

// Update Profile
exports.updateProfile = (req, res) => {
  const userId = req.userId;
  const { name, email, phone, address, city, state, zipCode, country, company, website } = req.body;

  db.run(
    'UPDATE users SET name = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, zipCode = ?, country = ?, company = ?, website = ? WHERE id = ?',
    [name, email, phone, address, city, state, zipCode, country, company, website, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Failed to update profile' });
      }

      db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Database error' });
        }

        res.json({ 
          success: true, 
          message: 'Profile updated successfully',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            city: user.city,
            state: user.state,
            zipCode: user.zipCode,
            country: user.country,
            company: user.company,
            website: user.website,
            profilePicture: user.profile_picture,
            createdAt: user.created_at
          }
        });
      });
    }
  );
};

// Get Notifications
exports.getNotifications = (req, res) => {
  // Return empty array for now - implement notifications table later
  res.json({ success: true, notifications: [] });
};

// Mark Notification as Read
exports.markNotificationRead = (req, res) => {
  res.json({ success: true });
};

// Mark All Notifications as Read
exports.markAllNotificationsRead = (req, res) => {
  res.json({ success: true });
};

// Delete Notification
exports.deleteNotification = (req, res) => {
  res.json({ success: true });
};

// Contact Developer
exports.contactDeveloper = (req, res) => {
  const userId = req.userId;
  const { orderId, subject, message, priority } = req.body;

  // Store in a messages table (implement later)
  res.json({ success: true, message: 'Message sent successfully' });
};

// Get Developer Messages
exports.getDeveloperMessages = (req, res) => {
  // Return empty array for now - implement messages table later
  res.json({ success: true, messages: [] });
};

// Get Payments
exports.getPayments = (req, res) => {
  // Return empty array for now - implement payments table later
  res.json({ success: true, payments: [] });
};

// Get Payment Methods
exports.getPaymentMethods = (req, res) => {
  // Return empty array for now - implement payment methods table later
  res.json({ success: true, methods: [] });
};

// Add Payment Method
exports.addPaymentMethod = (req, res) => {
  res.json({ success: true, message: 'Payment method added successfully' });
};
