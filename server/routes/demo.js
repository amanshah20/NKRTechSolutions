const express = require('express');
const router = express.Router();
const { createDemoRequest } = require('../controllers/demoController');

router.post('/', createDemoRequest);

module.exports = router;
