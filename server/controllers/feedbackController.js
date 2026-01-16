const db = require('../database/init');
const { sendEmail } = require('../utils/emailService');

// Submit feedback
exports.submitFeedback = (req, res) => {
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

  const query = 'INSERT INTO feedback (name, email, company, rating, message) VALUES (?, ?, ?, ?, ?)';
  
  db.run(query, [name, email, company || null, rating, message], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to submit feedback' 
      });
    }

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
      feedbackId: this.lastID
    });
  });
};

// Get approved feedback (for public display)
exports.getApprovedFeedback = (req, res) => {
  const query = 'SELECT id, name, company, rating, message, created_at FROM feedback WHERE is_approved = 1 ORDER BY created_at DESC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch feedback' 
      });
    }

    res.json({ 
      success: true, 
      feedback: rows 
    });
  });
};

// Get all feedback (admin only)
exports.getAllFeedback = (req, res) => {
  const query = 'SELECT * FROM feedback ORDER BY created_at DESC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch feedback' 
      });
    }

    res.json({ 
      success: true, 
      feedback: rows 
    });
  });
};

// Approve feedback
exports.approveFeedback = (req, res) => {
  const { id } = req.params;

  db.run('UPDATE feedback SET is_approved = 1 WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to approve feedback' 
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Feedback not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Feedback approved successfully' 
    });
  });
};

// Delete feedback
exports.deleteFeedback = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM feedback WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to delete feedback' 
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Feedback not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Feedback deleted successfully' 
    });
  });
};
