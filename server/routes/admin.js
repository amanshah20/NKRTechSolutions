const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getStats,
  getDemoRequests,
  updateDemoRequest,
  deleteDemoRequest,
  getOrders,
  updateOrder,
  deleteOrder,
  getContacts,
  deleteContact,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllNotifications,
  sendNotification,
  deleteNotification,
  getDeveloperMessages,
  respondToMessage,
  deleteMessage,
  getAllPayments,
  updatePaymentStatus
} = require('../controllers/adminController_new');
const {
  getAllFeedback,
  approveFeedback,
  deleteFeedback
} = require('../controllers/feedbackController_new');

// All routes require authentication
router.use(authMiddleware);

// Dashboard stats
router.get('/stats', getStats);

// Demo requests management
router.get('/demo', getDemoRequests);
router.put('/demo/:id', updateDemoRequest);
router.delete('/demo/:id', deleteDemoRequest);

// Orders management
router.get('/orders', getOrders);
router.put('/orders/:id', updateOrder);
router.delete('/orders/:id', deleteOrder);

// Contacts management
router.get('/contacts', getContacts);
router.delete('/contacts/:id', deleteContact);

// Feedback management
router.get('/feedback', getAllFeedback);
router.put('/feedback/:id/approve', approveFeedback);
router.delete('/feedback/:id', deleteFeedback);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Notifications management
router.get('/notifications', getAllNotifications);
router.post('/notifications', sendNotification);
router.delete('/notifications/:id', deleteNotification);

// Developer messages management
router.get('/developer-messages', getDeveloperMessages);
router.put('/developer-messages/:id', respondToMessage);
router.delete('/developer-messages/:id', deleteMessage);

// Payments management
router.get('/payments', getAllPayments);
router.put('/payments/:id', updatePaymentStatus);

module.exports = router;
