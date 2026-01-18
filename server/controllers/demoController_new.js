const DemoRequest = require('../models/DemoRequest');
const { sendEmail } = require('../utils/emailService');

exports.createDemoRequest = async (req, res) => {
  try {
    const { name, email, phone, company, service, message } = req.body;

    // Validation
    if (!name || !email || !phone || !company || !service) {
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

    // Create demo request
    const demoRequest = await DemoRequest.create({
      name,
      email,
      phone,
      company,
      service,
      message: message || ''
    });

    // Send confirmation emails
    sendEmail({
      to: email,
      subject: 'Demo Request Received - NKR Tech Solutions',
      html: `
        <h2>Thank you for requesting a demo!</h2>
        <p>Dear ${name},</p>
        <p>We have received your demo request for <strong>${service}</strong>.</p>
        <p>Our team will contact you shortly at ${phone}.</p>
        <br>
        <p>Best regards,<br>NKR Tech Solutions Team</p>
      `
    }).catch(err => console.error('Email error:', err));

    sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'New Demo Request Received',
      html: `
        <h2>New Demo Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    }).catch(err => console.error('Email error:', err));

    res.status(201).json({
      success: true,
      message: 'Demo request submitted successfully',
      id: demoRequest._id
    });

  } catch (error) {
    console.error('Demo request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit demo request' 
    });
  }
};
