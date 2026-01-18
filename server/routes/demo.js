const express = require('express');
const router = express.Router();
const { createDemoRequest } = require('../controllers/demoController_new');

router.post('/', createDemoRequest);

module.exports = router;
