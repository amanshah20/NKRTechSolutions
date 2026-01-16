const db = require('../database/init');

// Get dashboard statistics
exports.getStats = (req, res) => {
  let stats = {
    totalOrders: 0,
    totalDemoRequests: 0,
    totalContacts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    pendingDemos: 0
  };

  db.get('SELECT COUNT(*) as count FROM orders', (err, row) => {
    if (!err && row) stats.totalOrders = row.count;
    
    db.get('SELECT COUNT(*) as count FROM demo_requests', (err, row) => {
      if (!err && row) stats.totalDemoRequests = row.count;
      
      db.get('SELECT COUNT(*) as count FROM contacts', (err, row) => {
        if (!err && row) stats.totalContacts = row.count;
        
        db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
          if (!err && row) stats.totalUsers = row.count;
          
          db.get('SELECT COUNT(*) as count FROM orders WHERE status = ?', ['pending'], (err, row) => {
            if (!err && row) stats.pendingOrders = row.count;
            
            db.get('SELECT COUNT(*) as count FROM demo_requests WHERE status = ?', ['pending'], (err, row) => {
              if (!err && row) stats.pendingDemos = row.count;
              res.json({ success: true, stats });
            });
          });
        });
      });
    });
  });
};

// Get all demo requests
exports.getDemoRequests = (req, res) => {
  db.all('SELECT * FROM demo_requests ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('Get demo requests error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch demo requests' });
    }
    res.json({ success: true, data: rows || [] });
  });
};

// Update demo request status
exports.updateDemoRequest = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'contacted', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  db.run('UPDATE demo_requests SET status = ? WHERE id = ?', [status, id], (err) => {
    if (err) {
      console.error('Update demo request error:', err);
      return res.status(500).json({ success: false, message: 'Failed to update demo request' });
    }
    res.json({ success: true, message: 'Demo request updated successfully' });
  });
};

// Delete demo request
exports.deleteDemoRequest = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM demo_requests WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Delete demo request error:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete demo request' });
    }
    res.json({ success: true, message: 'Demo request deleted successfully' });
  });
};

// Get all orders
exports.getOrders = (req, res) => {
  db.all('SELECT * FROM orders ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('Get orders error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
    res.json({ success: true, data: rows || [] });
  });
};

// Update order status
exports.updateOrder = (req, res) => {
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

  // Build dynamic update query
  const updates = [];
  const values = [];

  if (status !== undefined && status !== null && status !== '') {
    updates.push('status = ?');
    values.push(status);
  }

  if (progress !== undefined && progress !== null) {
    updates.push('progress = ?');
    values.push(parseInt(progress));
  }

  if (admin_note !== undefined && admin_note !== null) {
    updates.push('admin_note = ?');
    values.push(admin_note);
  }

  if (updates.length === 0) {
    console.error('No fields to update');
    return res.status(400).json({ success: false, message: 'No fields to update. Please provide status, progress, or admin_note' });
  }

  values.push(id);
  const query = `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`;

  console.log('Executing query:', query, 'with values:', values);

  db.run(query, values, function(err) {
    if (err) {
      console.error('Update order error:', err);
      return res.status(500).json({ success: false, message: 'Failed to update order: ' + err.message });
    }
    if (this.changes === 0) {
      console.error('No order found with id:', id);
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    console.log('Order updated successfully, rows affected:', this.changes);
    res.json({ success: true, message: 'Order updated successfully' });
  });
};

// Delete order
exports.deleteOrder = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM orders WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Delete order error:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete order' });
    }
    res.json({ success: true, message: 'Order deleted successfully' });
  });
};

// Get all contacts
exports.getContacts = (req, res) => {
  db.all('SELECT * FROM contacts ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('Get contacts error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch contacts' });
    }
    res.json({ success: true, data: rows || [] });
  });
};

// Delete contact
exports.deleteContact = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM contacts WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Delete contact error:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete contact' });
    }
    res.json({ success: true, message: 'Contact deleted successfully' });
  });
};

// Get all users
exports.getAllUsers = (req, res) => {
  db.all('SELECT id, name, email, phone, company, address, city, state, zipCode, country, website, created_at FROM users ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('Get users error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
    res.json({ success: true, users: rows || [] });
  });
};

// Update user
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, phone, company, address, city, state, zipCode, country, website } = req.body;

  db.run(
    'UPDATE users SET name = ?, email = ?, phone = ?, company = ?, address = ?, city = ?, state = ?, zipCode = ?, country = ?, website = ? WHERE id = ?',
    [name, email, phone, company, address, city, state, zipCode, country, website, id],
    (err) => {
      if (err) {
        console.error('Update user error:', err);
        return res.status(500).json({ success: false, message: 'Failed to update user' });
      }
      res.json({ success: true, message: 'User updated successfully' });
    }
  );
};

// Delete user
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM users WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Delete user error:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  });
};

// Get all notifications (placeholder - requires notifications table)
exports.getAllNotifications = (req, res) => {
  // Placeholder: Return empty array until notifications table is created
  res.json({ success: true, notifications: [] });
};

// Send notification (placeholder)
exports.sendNotification = (req, res) => {
  res.json({ success: true, message: 'Notification sent successfully' });
};

// Delete notification (placeholder)
exports.deleteNotification = (req, res) => {
  res.json({ success: true, message: 'Notification deleted successfully' });
};

// Get developer messages (placeholder - requires developer_messages table)
exports.getDeveloperMessages = (req, res) => {
  // Placeholder: Return empty array until developer_messages table is created
  res.json({ success: true, messages: [] });
};

// Respond to message (placeholder)
exports.respondToMessage = (req, res) => {
  res.json({ success: true, message: 'Response sent successfully' });
};

// Delete message (placeholder)
exports.deleteMessage = (req, res) => {
  res.json({ success: true, message: 'Message deleted successfully' });
};

// Get all payments (placeholder - requires payments table)
exports.getAllPayments = (req, res) => {
  // Placeholder: Return empty array until payments table is created
  res.json({ success: true, payments: [] });
};

// Update payment status (placeholder)
exports.updatePaymentStatus = (req, res) => {
  res.json({ success: true, message: 'Payment status updated successfully' });
};
