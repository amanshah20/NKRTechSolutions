import React, { useState, useEffect } from 'react';
import { Bell, Check, Package, MessageSquare, CreditCard, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/notifications.css';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get('http://localhost:5000/api/user/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Create sample notifications if API fails
      setNotifications([
        {
          id: 1,
          type: 'order',
          title: 'Order Approved',
          message: 'Your order #12345 has been approved by admin',
          read: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          type: 'order',
          title: 'Order In Progress',
          message: 'Work has started on your project #12344',
          read: false,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.put(
        `http://localhost:5000/api/user/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Optimistically update UI
      setNotifications(notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.put(
        'http://localhost:5000/api/user/notifications/read-all',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(
        `http://localhost:5000/api/user/notifications/${notificationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <Package size={20} />;
      case 'message':
        return <MessageSquare size={20} />;
      case 'payment':
        return <CreditCard size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="loading-state">
          <Bell className="spinner" size={48} />
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-content">
        <div className="notifications-header">
          <div>
            <h1>Notifications</h1>
            <p>Stay updated with your orders and messages</p>
          </div>
          {unreadCount > 0 && (
            <button className="btn btn-primary" onClick={markAllAsRead}>
              <Check size={18} />
              Mark All as Read ({unreadCount})
            </button>
          )}
        </div>

        <div className="notifications-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button 
            className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={64} />
            <h2>No notifications</h2>
            <p>You're all caught up!</p>
          </div>
        ) : (
          <div className="notifications-list">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-card ${notification.read ? 'read' : 'unread'}`}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="notification-content">
                  <h3>{notification.title}</h3>
                  <p>{notification.message}</p>
                  <span className="notification-time">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="notification-actions">
                  {!notification.read && (
                    <button
                      className="action-btn"
                      onClick={() => markAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  <button
                    className="action-btn delete"
                    onClick={() => deleteNotification(notification.id)}
                    title="Delete"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
