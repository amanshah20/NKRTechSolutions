const Feedback = require('../models/Feedback');
const { sendEmail } = require('../utils/emailService');

// Submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, company, rating, message } = req.body;

    if (!name || !email || !rating || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, rating, and message are required' 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      });
    }

    const feedback = await Feedback.create({
      name,
      email,
      company: company || null,
      rating,
      message
    });

    // Send confirmation email
    sendEmail({
      to: email,
      subject: 'Feedback Received - NKR Tech Solutions',
      html: `
        <h2>Thank you for your feedback!</h2>
        <p>Dear ${name},</p>
        <p>We have received your feedback and appreciate you taking the time to share your thoughts.</p>
        <p><strong>Your Rating:</strong> ${rating}/5 stars</p>
        <p><strong>Your Message:</strong></p>
        <p>${message}</p>
        <br>
        <p>Best regards,<br>NKR Tech Solutions Team</p>
      `
    }).catch(err => console.error('Email error:', err));

    // Notify admin
    sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'New Feedback Received',
      html: `
        <h2>New Feedback Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Rating:</strong> ${rating}/5 stars</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    }).catch(err => console.error('Email error:', err));

    res.json({ 
      success: true, 
      message: 'Feedback submitted successfully',
      feedbackId: feedback._id
    });

  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit feedback' 
    });
  }
};

// Get approved feedback (for public display)
exports.getApprovedFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ isApproved: true })
      .select('name company rating message createdAt')
      .sort({ createdAt: -1 });

    res.json({ success: true, feedback });

  } catch (error) {
    console.error('Get approved feedback error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch feedback' 
    });
  }
};

// Get all feedback (admin only)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, feedback });

  } catch (error) {
    console.error('Get all feedback error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch feedback' 
    });
  }
};

// Approve feedback (admin only)
exports.approveFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    await Feedback.findByIdAndUpdate(id, { isApproved: true });

    res.json({ 
      success: true, 
      message: 'Feedback approved successfully' 
    });

  } catch (error) {
    console.error('Approve feedback error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to approve feedback' 
    });
  }
};

// Delete feedback (admin only)
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    await Feedback.findByIdAndDelete(id);

    res.json({ 
      success: true, 
      message: 'Feedback deleted successfully' 
    });

  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete feedback' 
    });
  }
};
