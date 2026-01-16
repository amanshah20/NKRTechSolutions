const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/userAuthController');
const userAuth = require('../middleware/userAuth');

// Public routes
router.post('/signup', userAuthController.signup);
router.post('/login', userAuthController.login);

// Protected routes
router.post('/change-password', userAuth, userAuthController.changePassword);
router.get('/profile', userAuth, userAuthController.getProfile);
router.put('/profile', userAuth, userAuthController.updateProfile);
router.get('/verify-token', userAuth, userAuthController.verifyToken);

// Notifications
router.get('/notifications', userAuth, userAuthController.getNotifications);
router.put('/notifications/:id/read', userAuth, userAuthController.markNotificationRead);
router.put('/notifications/read-all', userAuth, userAuthController.markAllNotificationsRead);
router.delete('/notifications/:id', userAuth, userAuthController.deleteNotification);

// Contact Developer
router.post('/contact-developer', userAuth, userAuthController.contactDeveloper);
router.get('/developer-messages', userAuth, userAuthController.getDeveloperMessages);

// Payments
router.get('/payments', userAuth, userAuthController.getPayments);
router.get('/payment-methods', userAuth, userAuthController.getPaymentMethods);
router.post('/payment-methods', userAuth, userAuthController.addPaymentMethod);

module.exports = router;
