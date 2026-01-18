const express = require('express');
const router = express.Router();
const { submitFeedback, getApprovedFeedback } = require('../controllers/feedbackController_new');

// POST /api/feedback - Submit feedback
router.post('/', submitFeedback);

// GET /api/feedback - Get approved feedback
router.get('/', getApprovedFeedback);

module.exports = router;
