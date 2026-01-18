const Contact = require('../models/Contact');
const { sendEmail } = require('../utils/emailService');

exports.createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
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

    // Create contact
    const contact = await Contact.create({ name, email, message });

    // Send emails (don't wait)
    sendEmail({
      to: email,
      subject: 'Message Received - NKR Tech Solutions',
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your message:</strong></p>
        <p>${message}</p>
        <br>
        <p>Best regards,<br>NKR Tech Solutions Team</p>
      `
    }).catch(err => console.error('Email error:', err));

    sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'New Contact Message',
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    }).catch(err => console.error('Email error:', err));

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      id: contact._id
    });

  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message' 
    });
  }
};
