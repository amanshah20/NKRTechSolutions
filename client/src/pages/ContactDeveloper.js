import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User, Mail, Phone, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/contactDeveloper.css';

const ContactDeveloper = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    orderId: '',
    subject: '',
    message: '',
    priority: 'normal'
  });

  useEffect(() => {
    fetchOrders();
    fetchMessages();
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
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get('http://localhost:5000/api/user/developer-messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.post(
        'http://localhost:5000/api/user/contact-developer',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setSuccessMessage('Message sent successfully! The developer will respond soon.');
        setFormData({
          orderId: '',
          subject: '',
          message: '',
          priority: 'normal'
        });
        fetchMessages(); // Refresh messages
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-developer-container">
      <div className="contact-developer-content">
        <div className="contact-header">
          <MessageSquare size={32} />
          <div>
            <h1>Contact Developer</h1>
            <p>Get in touch with the development team about your project</p>
          </div>
        </div>

        <div className="contact-grid">
          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send a Message</h2>
            
            {successMessage && (
              <div className="success-message">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="developer-contact-form">
              <div className="form-group">
                <label htmlFor="orderId">
                  <Package size={18} />
                  Related Order (Optional)
                </label>
                <select
                  id="orderId"
                  name="orderId"
                  value={formData.orderId}
                  onChange={handleChange}
                >
                  <option value="">Select an order</option>
                  {orders.map((order) => (
                    <option key={order.id} value={order.id}>
                      Order #{order.id} - {order.serviceType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subject">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What do you want to discuss?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="8"
                  placeholder="Describe your question, concern, or feedback in detail..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={sending}
              >
                <Send size={18} />
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Info & Previous Messages */}
          <div className="contact-info-section">
            <div className="info-card">
              <h3>Contact Information</h3>
              <div className="info-item">
                <User size={18} />
                <div>
                  <strong>Your Name</strong>
                  <p>{user?.name}</p>
                </div>
              </div>
              <div className="info-item">
                <Mail size={18} />
                <div>
                  <strong>Your Email</strong>
                  <p>{user?.email}</p>
                </div>
              </div>
              {user?.phone && (
                <div className="info-item">
                  <Phone size={18} />
                  <div>
                    <strong>Your Phone</strong>
                    <p>{user.phone}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="messages-history">
              <h3>Message History</h3>
              {loading ? (
                <p className="loading-text">Loading messages...</p>
              ) : messages.length === 0 ? (
                <p className="empty-text">No messages yet</p>
              ) : (
                <div className="messages-list">
                  {messages.map((msg) => (
                    <div key={msg.id} className="message-item">
                      <div className="message-header">
                        <strong>{msg.subject}</strong>
                        <span className={`priority-badge ${msg.priority}`}>
                          {msg.priority}
                        </span>
                      </div>
                      <p className="message-text">{msg.message}</p>
                      <div className="message-footer">
                        <span className="message-date">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                        {msg.response && (
                          <span className="response-indicator">
                            ✓ Responded
                          </span>
                        )}
                      </div>
                      {msg.response && (
                        <div className="developer-response">
                          <strong>Developer Response:</strong>
                          <p>{msg.response}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="help-section">
          <h3>How Can We Help?</h3>
          <div className="help-cards">
            <div className="help-card">
              <h4>Project Updates</h4>
              <p>Ask about the progress of your ongoing projects</p>
            </div>
            <div className="help-card">
              <h4>Feature Requests</h4>
              <p>Suggest new features or modifications</p>
            </div>
            <div className="help-card">
              <h4>Technical Support</h4>
              <p>Get help with technical issues or bugs</p>
            </div>
            <div className="help-card">
              <h4>General Inquiries</h4>
              <p>Any other questions or feedback</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDeveloper;
