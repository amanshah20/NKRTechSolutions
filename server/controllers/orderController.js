const db = require('../database/init');
const { sendEmail } = require('../utils/emailService');

exports.createOrder = (req, res) => {
  const { client_name, email, phone, company, service, budget, timeline, requirements } = req.body;

  // Validation
  if (!client_name || !email || !phone || !service || !budget || !timeline) {
    return res.status(400).json({ 
      success: false, 
      message: 'All required fields must be filled' 
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid email format' 
    });
  }

  // Insert into database
  db.run(`
    INSERT INTO orders (client_name, email, phone, company, service, budget, timeline, requirements)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [client_name, email, phone, company || '', service, budget, timeline, requirements || ''], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to place order' 
      });
    }

    // Send emails (don't wait)
    sendEmail({
      to: email,
      subject: 'Order Confirmation - NKR Tech Solutions',
      html: `
        <h2>Order Received Successfully!</h2>
        <p>Dear ${client_name},</p>
        <p>Thank you for placing an order with NKR Tech Solutions.</p>
        <p><strong>Order Details:</strong></p>
        <ul>
          <li>Service: ${service}</li>
          <li>Budget: ${budget}</li>
          <li>Timeline: ${timeline}</li>
        </ul>
        <p>Our team will review your requirements and contact you shortly.</p>
        <br>
        <p>Best regards,<br>NKR Tech Solutions Team</p>
      `
    }).catch(err => console.error('Email error:', err));

    sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'New Order Placed',
      html: `
        <h2>New Order Received</h2>
        <p><strong>Client:</strong> ${client_name}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Timeline:</strong> ${timeline}</p>
        <p><strong>Requirements:</strong> ${requirements}</p>
      `
    }).catch(err => console.error('Email error:', err));

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      id: this.lastID
    });
  });
};

// Get My Orders
exports.getMyOrders = (req, res) => {
  const userId = req.userId;

  // For now, return orders by email (assuming user has email)
  db.get('SELECT email FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    db.all(
      `SELECT id, service as serviceType, budget, timeline, requirements as description, 
       status, created_at as createdAt, admin_note as adminNote 
       FROM orders WHERE email = ? ORDER BY created_at DESC`,
      [user.email],
      (err, orders) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Database error' });
        }

        res.json({ success: true, orders: orders || [] });
      }
    );
  });
};
