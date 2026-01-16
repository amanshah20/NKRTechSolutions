import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Client APIs
export const submitDemoRequest = (data) => api.post('/demo', data);
export const submitOrder = (data) => api.post('/orders', data);
export const submitContact = (data) => api.post('/contact', data);

// Auth APIs
export const adminLogin = (credentials) => api.post('/auth/login', credentials);

// Admin APIs
export const getStats = () => api.get('/admin/stats');
export const getDemoRequests = () => api.get('/admin/demo');
export const updateDemoRequest = (id, status) => api.put(`/admin/demo/${id}`, { status });
export const deleteDemoRequest = (id) => api.delete(`/admin/demo/${id}`);
export const getOrders = () => api.get('/admin/orders');
export const updateOrder = (id, status, progress, adminNote) => api.put(`/admin/orders/${id}`, { status, progress, admin_note: adminNote });
export const deleteOrder = (id) => api.delete(`/admin/orders/${id}`);
export const getContacts = () => api.get('/admin/contacts');
export const deleteContact = (id) => api.delete(`/admin/contacts/${id}`);
export const getFeedback = () => api.get('/admin/feedback');
export const approveFeedback = (id) => api.put(`/admin/feedback/${id}/approve`);
export const deleteFeedback = (id) => api.delete(`/admin/feedback/${id}`);

// Admin - User Management
export const getAllUsers = () => api.get('/admin/users');
export const updateUser = (id, data) => api.put(`/admin/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

// Admin - Notifications
export const getAllNotifications = () => api.get('/admin/notifications');
export const sendNotification = (data) => api.post('/admin/notifications', data);
export const deleteNotification = (id) => api.delete(`/admin/notifications/${id}`);

// Admin - Developer Messages
export const getDeveloperMessages = () => api.get('/admin/developer-messages');
export const respondToMessage = (id, response) => api.put(`/admin/developer-messages/${id}`, { response });
export const deleteMessage = (id) => api.delete(`/admin/developer-messages/${id}`);

// Admin - Payments
export const getAllPayments = () => api.get('/admin/payments');
export const updatePaymentStatus = (id, status) => api.put(`/admin/payments/${id}`, { status });

export default api;
