import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Loader, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/myOrders.css';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved, completed, rejected

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get('http://localhost:5000/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="status-icon pending" />;
      case 'approved':
        return <CheckCircle className="status-icon approved" />;
      case 'in-progress':
        return <Loader className="status-icon in-progress" />;
      case 'completed':
        return <CheckCircle className="status-icon completed" />;
      case 'rejected':
        return <XCircle className="status-icon rejected" />;
      default:
        return <Clock className="status-icon" />;
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getProgressPercentage = (order) => {
    // Use actual progress from database if available, otherwise calculate based on status
    if (order.progress !== undefined && order.progress !== null) {
      return order.progress;
    }
    
    // Fallback to status-based calculation
    switch (order.status) {
      case 'pending':
        return 25;
      case 'approved':
        return 50;
      case 'in-progress':
        return 75;
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="my-orders-container">
        <div className="loading-state">
          <Loader className="spinner" size={48} />
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <div className="my-orders-content">
        <div className="orders-header">
          <div>
            <h1>My Orders</h1>
            <p>Track and manage your project orders</p>
          </div>
          <div className="orders-stats">
            <div className="stat-card">
              <h3>{orders.length}</h3>
              <p>Total Orders</p>
            </div>
            <div className="stat-card">
              <h3>{orders.filter(o => o.status === 'pending').length}</h3>
              <p>Pending</p>
            </div>
            <div className="stat-card">
              <h3>{orders.filter(o => o.status === 'in-progress').length}</h3>
              <p>In Progress</p>
            </div>
            <div className="stat-card">
              <h3>{orders.filter(o => o.status === 'completed').length}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>

        <div className="orders-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Orders
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button 
            className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setFilter('in-progress')}
          >
            In Progress
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <Package size={64} />
            <h2>No orders found</h2>
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">
                      Placed on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="order-status">
                    {getStatusIcon(order.status)}
                    <span className={`status-text ${order.status}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                <div className="order-details">
                  <div className="detail-item">
                    <strong>Service:</strong>
                    <span>{order.service}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Budget:</strong>
                    <span>{order.budget}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Timeline:</strong>
                    <span>{order.timeline}</span>
                  </div>
                </div>

                <div className="order-progress">
                  <div className="progress-header">
                    <span className="progress-label">Order Progress</span>
                    <span className="progress-text">
                      {getProgressPercentage(order)}% Complete
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${getProgressPercentage(order)}%` }}
                    ></div>
                  </div>
                </div>

                {order.admin_note && (
                  <div className="admin-note-card">
                    <div className="admin-note-header">
                      <strong>📢 Update from Admin</strong>
                    </div>
                    <p>{order.admin_note}</p>
                  </div>
                )}

                {order.description && (
                  <div className="order-description">
                    <strong>Description:</strong>
                    <p>{order.description}</p>
                  </div>
                )}

                <div className="order-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye size={18} />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>Order Information</h3>
                <p><strong>Order ID:</strong> #{selectedOrder.id}</p>
                <p><strong>Status:</strong> {getStatusText(selectedOrder.status)}</p>
                <p><strong>Progress:</strong> {getProgressPercentage(selectedOrder)}%</p>
                <p><strong>Service:</strong> {selectedOrder.service}</p>
                <p><strong>Budget:</strong> {selectedOrder.budget}</p>
                <p><strong>Timeline:</strong> {selectedOrder.timeline}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              
              {selectedOrder.admin_note && (
                <div className="detail-section admin-update-section">
                  <h3>📢 Latest Update from Admin</h3>
                  <div className="admin-update-box">
                    <p>{selectedOrder.admin_note}</p>
                  </div>
                </div>
              )}

              {selectedOrder.requirements && (
                <div className="detail-section">
                  <h3>Project Requirements</h3>
                  <p>{selectedOrder.requirements}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
