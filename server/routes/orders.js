const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders } = require('../controllers/orderController_new');
const userAuth = require('../middleware/userAuth');

router.post('/', createOrder);
router.get('/my-orders', userAuth, getMyOrders);

module.exports = router;
