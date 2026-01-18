const Order = require('../models/Order');
const DemoRequest = require('../models/DemoRequest');
const Contact = require('../models/Contact');
const User = require('../models/User');

// Get dashboard statistics
exports.getStats = async (req, res) => {
  try {
    const [totalOrders, totalDemoRequests, totalContacts, totalUsers, pendingOrders, pendingDemos] = await Promise.all([
      Order.countDocuments(),
      DemoRequest.countDocuments(),
      Contact.countDocuments(),
      User.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      DemoRequest.countDocuments({ status: 'pending' })
    ]);

    const stats = {
      totalOrders,
      totalDemoRequests,
      totalContacts,
      totalUsers,
      pendingOrders,
      pendingDemos
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
};

// Get all demo requests
exports.getDemoRequests = async (req, res) => {
  try {
    const demoRequests = await DemoRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, data: demoRequests });
  } catch (error) {
    console.error('Get demo requests error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch demo requests' });
  }
};

// Update demo request status
exports.updateDemoRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'contacted', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    await DemoRequest.findByIdAndUpdate(id, { status });
    res.json({ success: true, message: 'Demo request updated successfully' });
  } catch (error) {
    console.error('Update demo request error:', error);
    res.status(500).json({ success: false, message: 'Failed to update demo request' });
  }
};

// Delete demo request
exports.deleteDemoRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await DemoRequest.findByIdAndDelete(id);
    res.json({ success: true, message: 'Demo request deleted successfully' });
  } catch (error) {
    console.error('Delete demo request error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete demo request' });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

// Update order status
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progress, admin_note } = req.body;

    console.log('Update order request:', { id, status, progress, admin_note, body: req.body });

    // Validate status if provided
    const validStatuses = ['pending', 'approved', 'in-progress', 'completed', 'cancelled'];
    if (status !== undefined && status !== null && status !== '') {
      if (!validStatuses.includes(status)) {
        console.error('Invalid status received:', status, 'Valid statuses:', validStatuses);
        return res.status(400).json({ 
          success: false, 
          message: `Invalid status: "${status}". Valid statuses are: ${validStatuses.join(', ')}` 
        });
      }
    }

    // Build update object
    const updateData = {};

    if (status !== undefined && status !== null && status !== '') {
      updateData.status = status;
    }

    if (progress !== undefined && progress !== null) {
      updateData.progress = parseInt(progress);
    }

    if (admin_note !== undefined && admin_note !== null) {
      updateData.adminNote = admin_note;
    }

    if (Object.keys(updateData).length === 0) {
      console.error('No fields to update');
      return res.status(400).json({ success: false, message: 'No fields to update. Please provide status, progress, or admin_note' });
    }

    console.log('Updating order with:', updateData);

    const result = await Order.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!result) {
      console.error('No order found with id:', id);
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    console.log('Order updated successfully');
    res.json({ success: true, message: 'Order updated successfully' });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order: ' + error.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete order' });
  }
};

// Get all contacts
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch contacts' });
  }
};

// Delete contact
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete contact' });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email phone company address city state zipCode country website createdAt')
      .sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

// Placeholder functions for features not yet implemented in MongoDB
exports.getAllNotifications = async (req, res) => {
  res.json({ success: true, data: [] });
};

exports.sendNotification = async (req, res) => {
  res.json({ success: true, message: 'Notification feature coming soon' });
};

exports.deleteNotification = async (req, res) => {
  res.json({ success: true, message: 'Notification deleted' });
};

exports.getDeveloperMessages = async (req, res) => {
  res.json({ success: true, data: [] });
};

exports.respondToMessage = async (req, res) => {
  res.json({ success: true, message: 'Response sent' });
};

exports.deleteMessage = async (req, res) => {
  res.json({ success: true, message: 'Message deleted' });
};

exports.getAllPayments = async (req, res) => {
  res.json({ success: true, data: [] });
};

exports.updatePaymentStatus = async (req, res) => {
  res.json({ success: true, message: 'Payment status updated' });
};
