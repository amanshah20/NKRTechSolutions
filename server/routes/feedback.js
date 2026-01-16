const express = require('express');
const router = express.Router();
const { submitFeedback, getApprovedFeedback } = require('../controllers/feedbackController');

// POST /api/feedback - Submit feedback
router.post('/', submitFeedback);

// GET /api/feedback - Get approved feedback
router.get('/', getApprovedFeedback);

module.exports = router;
