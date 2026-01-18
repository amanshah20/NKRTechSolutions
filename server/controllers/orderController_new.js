const Order = require('../models/Order');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

exports.createOrder = async (req, res) => {
  try {
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

    // Create order
    const order = await Order.create({
      clientName: client_name,
      email,
      phone,
      company: company || '',
      service,
      budget,
      timeline,
      requirements: requirements || ''
    });

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
      id: order._id
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to place order' 
    });
  }
};

// Get My Orders
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const orders = await Order.find({ email: user.email })
      .select('service budget timeline requirements status createdAt adminNote progress')
      .sort({ createdAt: -1 });

    // Transform to match frontend expectations
    const transformedOrders = orders.map(order => ({
      id: order._id,
      serviceType: order.service,
      budget: order.budget,
      timeline: order.timeline,
      description: order.requirements,
      status: order.status,
      createdAt: order.createdAt,
      adminNote: order.adminNote,
      progress: order.progress
    }));

    res.json({ success: true, orders: transformedOrders });

  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};
