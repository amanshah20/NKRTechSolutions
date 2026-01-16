import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getStats, 
  getDemoRequests, 
  updateDemoRequest, 
  deleteDemoRequest,
  getOrders,
  updateOrder,
  deleteOrder,
  getContacts,
  deleteContact,
  getFeedback,
  approveFeedback,
  deleteFeedback,
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
} from '../utils/api';
import { 
  LayoutDashboard, 
  ClipboardList, 
  ShoppingCart, 
  Mail, 
  MessageSquare,
  LogOut,
  Trash2,
  Star,
  Users,
  Bell,
  MessageCircle,
  CreditCard,
  Edit,
  X as CloseIcon
} from 'lucide-react';
import '../styles/dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [demoRequests, setDemoRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [developerMessages, setDeveloperMessages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderUpdateData, setOrderUpdateData] = useState({
    status: '',
    progress: 0,
    admin_note: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [statsRes, demosRes, ordersRes, contactsRes, feedbackRes, usersRes, notificationsRes, messagesRes, paymentsRes] = await Promise.all([
        getStats(),
        getDemoRequests(),
        getOrders(),
        getContacts(),
        getFeedback(),
        getAllUsers().catch(() => ({ data: { users: [] } })),
        getAllNotifications().catch(() => ({ data: { notifications: [] } })),
        getDeveloperMessages().catch(() => ({ data: { messages: [] } })),
        getAllPayments().catch(() => ({ data: { payments: [] } }))
      ]);

      setStats(statsRes.data.stats);
      setDemoRequests(demosRes.data.data);
      setOrders(ordersRes.data.data);
      setContacts(contactsRes.data.data);
      setFeedback(feedbackRes.data.feedback);
      setUsers(usersRes.data.users || []);
      setNotifications(notificationsRes.data.notifications || []);
      setDeveloperMessages(messagesRes.data.messages || []);
      setPayments(paymentsRes.data.payments || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/admin/login');
  };

  const handleStatusChange = async (id, status, type) => {
    try {
      if (type === 'demo') {
        await updateDemoRequest(id, status);
      } else if (type === 'order') {
        await updateOrder(id, status);
      } else if (type === 'payment') {
        await updatePaymentStatus(id, status);
      }
      fetchData();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleEditOrder = (order) => {
    console.log('Opening order for edit:', order);
    
    // Normalize status to ensure it's valid
    let normalizedStatus = order.status || 'pending';
    const validStatuses = ['pending', 'approved', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(normalizedStatus)) {
      console.warn('Invalid status detected:', normalizedStatus, 'defaulting to pending');
      normalizedStatus = 'pending';
    }
    
    setEditingOrder(order);
    setOrderUpdateData({
      status: normalizedStatus,
      progress: parseInt(order.progress) || 0,
      admin_note: order.admin_note || ''
    });
  };

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;
    
    try {
      console.log('Updating order:', editingOrder.id);
      console.log('Update data:', JSON.stringify(orderUpdateData, null, 2));
      const response = await updateOrder(editingOrder.id, orderUpdateData.status, orderUpdateData.progress, orderUpdateData.admin_note);
      console.log('Update response:', response);
      alert('Order updated successfully!');
      setEditingOrder(null);
      fetchData();
    } catch (error) {
      console.error('Update error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error message:', error.response?.data?.message);
      alert(`Failed to update order: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      if (type === 'demo') {
        await deleteDemoRequest(id);
      } else if (type === 'order') {
        await deleteOrder(id);
      } else if (type === 'contact') {
        await deleteContact(id);
      } else if (type === 'feedback') {
        await deleteFeedback(id);
      } else if (type === 'user') {
        await deleteUser(id);
      } else if (type === 'notification') {
        await deleteNotification(id);
      } else if (type === 'message') {
        await deleteMessage(id);
      }
      fetchData();
    } catch (error) {
      alert('Failed to delete item');
    }
  };

  const handleApproveFeedback = async (id) => {
    try {
      await approveFeedback(id);
      fetchData();
    } catch (error) {
      alert('Failed to approve feedback');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">NKR Tech Admin</div>
        
        <ul className="dashboard-nav">
          <li className="dashboard-nav-item">
            <div 
              className={`dashboard-nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard size={20} />
              <span>Overview</span>
            </div>
          </li>
          <li className="dashboard-nav-item">
            <div 
              className={`dashboard-nav-link ${activeTab === 'demos' ? 'active' : ''}`}
              onClick={() => setActiveTab('demos')}
            >
              <ClipboardList size={20} />
              <span>Demo Requests</span>
            </div>
          </li>
          <li className="dashboard-nav-item">
            <div 
              className={`dashboard-nav-link ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingCart size={20} />
              <span>Orders</span>
            </div>
          </li>
          <li className="dashboard-nav-item">
            <div 
              className={`dashboard-nav-link ${activeTab === 'contacts' ? 'active' : ''}`}
              onClick={() => setActiveTab('contacts')}
            >
              <Mail size={20} />
              <span>Contacts</span>
            </div>
          </li>
          <li className="dashboard-nav-item">
            <div 
              className={`dashboard-nav-link ${activeTab === 'feedback' ? 'active' : ''}`}
              onClick={() => setActiveTab('feedback')}
            >
              <MessageSquare size={20} />
              <span>Feedback</span>
            </div>
          </li>
          <li className="dashboard-nav-item">
            <div 
              className={`dashboard-nav-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={20} />
              <span>User Accounts</span>
            </div>
          </li>
          <li className="dashboard-nav-item">
            <div 
              className={`dashboard-nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell size={20} />
              <span>Notifications</span>
            </div>
          </li>
          <li className="dashboard-nav-item">
            <div 
              className={`dashboard-nav-link ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <MessageCircle size={20} />
              <span>Developer Messages</span>
            </div>
          </li>
          <li className="dashboard-nav-item">
            <div 
              className={`dashboard-nav-link ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              <CreditCard size={20} />
              <span>Payments</span>
            </div>
          </li>
        </ul>

        <div className="dashboard-logout">
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%' }}
            onClick={handleLogout}
          >
            <LogOut size={18} style={{ marginRight: '8px' }} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {activeTab === 'overview' && (
          <>
            <div className="dashboard-header">
              <h1>Dashboard Overview</h1>
              <p>Welcome back, {localStorage.getItem('adminEmail')}</p>
            </div>

            <div className="dashboard-stats">
              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon" style={{ background: 'var(--gradient-primary)' }}>
                  {stats?.totalOrders || 0}
                </div>
                <div className="dashboard-stat-info">
                  <h3>{stats?.totalOrders || 0}</h3>
                  <p>Total Orders</p>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' }}>
                  {stats?.totalDemoRequests || 0}
                </div>
                <div className="dashboard-stat-info">
                  <h3>{stats?.totalDemoRequests || 0}</h3>
                  <p>Demo Requests</p>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)' }}>
                  {stats?.totalContacts || 0}
                </div>
                <div className="dashboard-stat-info">
                  <h3>{stats?.totalContacts || 0}</h3>
                  <p>Contact Messages</p>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}>
                  {stats?.totalUsers || 0}
                </div>
                <div className="dashboard-stat-info">
                  <h3>{stats?.totalUsers || 0}</h3>
                  <p>Registered Users</p>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon" style={{ background: 'linear-gradient(135deg, #10B981 0%, #0FB9B1 100%)' }}>
                  {((stats?.pendingOrders || 0) + (stats?.pendingDemos || 0))}
                </div>
                <div className="dashboard-stat-info">
                  <h3>{((stats?.pendingOrders || 0) + (stats?.pendingDemos || 0))}</h3>
                  <p>Pending Items</p>
                </div>
              </div>
            </div>

            <div className="grid grid-2" style={{ gap: '24px' }}>
              <div className="dashboard-table">
                <div className="dashboard-table-header">
                  <h2>Recent Demo Requests</h2>
                </div>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Service</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demoRequests.slice(0, 5).map(demo => (
                        <tr key={demo.id}>
                          <td>{demo.name}</td>
                          <td>{demo.service}</td>
                          <td>
                            <span className={`status-badge status-${demo.status}`}>
                              {demo.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {demoRequests.length === 0 && (
                        <tr><td colSpan="3" style={{ textAlign: 'center' }}>No demo requests yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="dashboard-table">
                <div className="dashboard-table-header">
                  <h2>Recent Orders</h2>
                </div>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Service</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id}>
                          <td>{order.client_name}</td>
                          <td>{order.service}</td>
                          <td>
                            <span className={`status-badge status-${order.status}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr><td colSpan="3" style={{ textAlign: 'center' }}>No orders yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'demos' && (
          <>
            <div className="dashboard-header">
              <h1>Demo Requests</h1>
              <p>Manage all demo requests from clients</p>
            </div>

            <div className="dashboard-table">
              <div className="dashboard-table-header">
                <h2>All Demo Requests ({demoRequests.length})</h2>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Service</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoRequests.map(demo => (
                      <tr key={demo.id}>
                        <td>#{demo.id}</td>
                        <td>{demo.name}</td>
                        <td>{demo.company}</td>
                        <td>{demo.email}</td>
                        <td>{demo.phone}</td>
                        <td>{demo.service}</td>
                        <td>
                          <select 
                            className="form-select" 
                            value={demo.status}
                            onChange={(e) => handleStatusChange(demo.id, e.target.value, 'demo')}
                            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>{new Date(demo.created_at).toLocaleDateString()}</td>
                        <td>
                          <button 
                            className="btn btn-danger btn-icon"
                            onClick={() => handleDelete(demo.id, 'demo')}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {demoRequests.length === 0 && (
                      <tr><td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>No demo requests yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <>
            <div className="dashboard-header">
              <h1>Orders</h1>
              <p>Manage all client orders</p>
            </div>

            <div className="dashboard-table">
              <div className="dashboard-table-header">
                <h2>All Orders ({orders.length})</h2>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Client</th>
                      <th>Service</th>
                      <th>Budget</th>
                      <th>Status</th>
                      <th>Progress</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>
                          <div>
                            <strong>{order.client_name}</strong>
                            <div style={{ fontSize: '0.85rem', color: '#666' }}>{order.email}</div>
                          </div>
                        </td>
                        <td>{order.service}</td>
                        <td>{order.budget}</td>
                        <td>
                          <span className={`status-badge status-${order.status}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ width: '100px' }}>
                            <div style={{ fontSize: '0.75rem', marginBottom: '4px' }}>{order.progress || 0}%</div>
                            <div style={{ background: '#e0e0e0', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                              <div style={{ 
                                background: 'var(--primary)', 
                                height: '100%', 
                                width: `${order.progress || 0}%`,
                                transition: 'width 0.3s ease'
                              }}></div>
                            </div>
                          </div>
                        </td>
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              className="btn btn-primary btn-icon"
                              onClick={() => handleEditOrder(order)}
                              title="Edit Order"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="btn btn-danger btn-icon"
                              onClick={() => handleDelete(order.id, 'order')}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan="10" style={{ textAlign: 'center', padding: '40px' }}>No orders yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'contacts' && (
          <>
            <div className="dashboard-header">
              <h1>Contact Messages</h1>
              <p>View all messages from clients</p>
            </div>

            <div className="dashboard-table">
              <div className="dashboard-table-header">
                <h2>All Messages ({contacts.length})</h2>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map(contact => (
                      <tr key={contact.id}>
                        <td>#{contact.id}</td>
                        <td>{contact.name}</td>
                        <td>{contact.email}</td>
                        <td style={{ maxWidth: '400px' }}>{contact.message}</td>
                        <td>{new Date(contact.created_at).toLocaleDateString()}</td>
                        <td>
                          <button 
                            className="btn btn-danger btn-icon"
                            onClick={() => handleDelete(contact.id, 'contact')}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {contacts.length === 0 && (
                      <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No contact messages yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <>
            <h1 className="dashboard-title">Client Feedback</h1>
            <div className="dashboard-card">
              <div className="table-responsive">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Company</th>
                      <th>Rating</th>
                      <th>Message</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedback.map(item => (
                      <tr key={item.id}>
                        <td>#{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.company || 'N/A'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                size={16}
                                fill={i < item.rating ? '#FFC107' : 'none'}
                                stroke={i < item.rating ? '#FFC107' : '#ddd'}
                              />
                            ))}
                          </div>
                        </td>
                        <td style={{ maxWidth: '300px' }}>{item.message}</td>
                        <td>
                          <span className={`badge ${item.is_approved ? 'badge-success' : 'badge-warning'}`}>
                            {item.is_approved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td>{new Date(item.created_at).toLocaleDateString()}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {!item.is_approved && (
                              <button 
                                className="btn btn-success btn-icon"
                                onClick={() => handleApproveFeedback(item.id)}
                                title="Approve"
                              >
                                ✓
                              </button>
                            )}
                            <button 
                              className="btn btn-danger btn-icon"
                              onClick={() => handleDelete(item.id, 'feedback')}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {feedback.length === 0 && (
                      <tr><td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>No feedback yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <>
            <div className="dashboard-header">
              <h1>User Accounts</h1>
              <p>View and manage all registered users</p>
            </div>

            <div className="dashboard-table">
              <div className="dashboard-table-header">
                <h2>All Users ({users.length})</h2>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Company</th>
                      <th>City</th>
                      <th>Country</th>
                      <th>Registered</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone || 'N/A'}</td>
                        <td>{user.company || 'N/A'}</td>
                        <td>{user.city || 'N/A'}</td>
                        <td>{user.country || 'N/A'}</td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                        <td>
                          <button 
                            className="btn btn-danger btn-icon"
                            onClick={() => handleDelete(user.id, 'user')}
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>No users registered yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <>
            <div className="dashboard-header">
              <h1>User Notifications</h1>
              <p>View all notifications sent to users</p>
            </div>

            <div className="dashboard-table">
              <div className="dashboard-table-header">
                <h2>All Notifications ({notifications.length})</h2>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Type</th>
                      <th>Title</th>
                      <th>Message</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.map(notification => (
                      <tr key={notification.id}>
                        <td>#{notification.id}</td>
                        <td>{notification.user_name || `User #${notification.user_id}`}</td>
                        <td>
                          <span className={`status-badge status-${notification.type}`}>
                            {notification.type}
                          </span>
                        </td>
                        <td>{notification.title}</td>
                        <td style={{ maxWidth: '300px' }}>{notification.message}</td>
                        <td>
                          <span className={`badge ${notification.is_read ? 'badge-success' : 'badge-warning'}`}>
                            {notification.is_read ? 'Read' : 'Unread'}
                          </span>
                        </td>
                        <td>{new Date(notification.created_at).toLocaleDateString()}</td>
                        <td>
                          <button 
                            className="btn btn-danger btn-icon"
                            onClick={() => handleDelete(notification.id, 'notification')}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {notifications.length === 0 && (
                      <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>No notifications yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Developer Messages Tab */}
        {activeTab === 'messages' && (
          <>
            <div className="dashboard-header">
              <h1>Developer Messages</h1>
              <p>Messages from users regarding their projects</p>
            </div>

            <div className="dashboard-table">
              <div className="dashboard-table-header">
                <h2>All Messages ({developerMessages.length})</h2>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Order ID</th>
                      <th>Subject</th>
                      <th>Priority</th>
                      <th>Message</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {developerMessages.map(message => (
                      <tr key={message.id}>
                        <td>#{message.id}</td>
                        <td>{message.user_name || `User #${message.user_id}`}</td>
                        <td>{message.order_id ? `#${message.order_id}` : 'N/A'}</td>
                        <td>{message.subject}</td>
                        <td>
                          <span className={`priority-badge priority-${message.priority}`}>
                            {message.priority}
                          </span>
                        </td>
                        <td style={{ maxWidth: '300px' }}>{message.message}</td>
                        <td>
                          <span className={`badge ${message.status === 'resolved' ? 'badge-success' : 'badge-warning'}`}>
                            {message.status}
                          </span>
                        </td>
                        <td>{new Date(message.created_at).toLocaleDateString()}</td>
                        <td>
                          <button 
                            className="btn btn-danger btn-icon"
                            onClick={() => handleDelete(message.id, 'message')}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {developerMessages.length === 0 && (
                      <tr><td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>No messages yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <>
            <div className="dashboard-header">
              <h1>Payment History</h1>
              <p>View all user payments and transactions</p>
            </div>

            <div className="dashboard-table">
              <div className="dashboard-table-header">
                <h2>All Payments ({payments.length})</h2>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Order ID</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Transaction ID</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(payment => (
                      <tr key={payment.id}>
                        <td>#{payment.id}</td>
                        <td>{payment.user_name || `User #${payment.user_id}`}</td>
                        <td>{payment.order_id ? `#${payment.order_id}` : 'N/A'}</td>
                        <td style={{ fontWeight: 'bold', color: '#10B981' }}>₹{payment.amount}</td>
                        <td>{payment.method}</td>
                        <td style={{ fontFamily: 'monospace' }}>{payment.transaction_id}</td>
                        <td>
                          <select 
                            className="form-select" 
                            value={payment.status}
                            onChange={(e) => handleStatusChange(payment.id, e.target.value, 'payment')}
                            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </td>
                        <td>{new Date(payment.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {payments.length === 0 && (
                      <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>No payments yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Order Update Modal */}
      {editingOrder && (
        <div className="modal-overlay" onClick={() => setEditingOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Order #{editingOrder.id}</h2>
              <button className="modal-close" onClick={() => setEditingOrder(null)}>
                <CloseIcon size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="order-detail-row">
                <strong>Client:</strong> {editingOrder.client_name}
              </div>
              <div className="order-detail-row">
                <strong>Service:</strong> {editingOrder.service}
              </div>
              <div className="order-detail-row">
                <strong>Budget:</strong> {editingOrder.budget}
              </div>
              
              <div className="form-group" style={{ marginTop: '20px' }}>
                <label>Order Status</label>
                <select 
                  className="form-control"
                  value={orderUpdateData.status}
                  onChange={(e) => setOrderUpdateData({...orderUpdateData, status: e.target.value})}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label>Progress ({orderUpdateData.progress}%)</label>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  className="form-range"
                  value={orderUpdateData.progress}
                  onChange={(e) => setOrderUpdateData({...orderUpdateData, progress: parseInt(e.target.value)})}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666' }}>
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="form-group">
                <label>Admin Note / Progress Message</label>
                <textarea 
                  className="form-control"
                  rows="4"
                  placeholder="Enter progress update or message for the client..."
                  value={orderUpdateData.admin_note}
                  onChange={(e) => setOrderUpdateData({...orderUpdateData, admin_note: e.target.value})}
                />
                <small style={{ color: '#666' }}>This message will be visible to the client in their My Orders section</small>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setEditingOrder(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleUpdateOrder}>
                Update Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
