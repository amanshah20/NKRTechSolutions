const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders } = require('../controllers/orderController');
const userAuth = require('../middleware/userAuth');

router.post('/', createOrder);
router.get('/my-orders', userAuth, getMyOrders);

module.exports = router;
