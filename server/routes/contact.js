const express = require('express');
const router = express.Router();
const { createContact } = require('../controllers/contactController_new');

router.post('/', createContact);

module.exports = router;
