const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');

// GET /api/stats - Get website statistics
router.get('/', getStats);

module.exports = router;
