import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Calendar, CheckCircle, Clock, Plus, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/payments.css';

const Payments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    fetchPayments();
    fetchPaymentMethods();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get('http://localhost:5000/api/user/payments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setPayments(response.data.payments || []);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get('http://localhost:5000/api/user/payment-methods', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setPaymentMethods(response.data.methods);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const handleCardChange = (e) => {
    setNewCard({
      ...newCard,
      [e.target.name]: e.target.value
    });
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.post(
        'http://localhost:5000/api/user/payment-methods',
        newCard,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setPaymentMethods([...paymentMethods, response.data.method]);
        setNewCard({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' });
        setShowAddCard(false);
        alert('Payment method added successfully!');
      }
    } catch (error) {
      console.error('Error adding card:', error);
      alert('Failed to add payment method');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { icon: CheckCircle, color: 'success' },
      pending: { icon: Clock, color: 'warning' },
      failed: { icon: Clock, color: 'danger' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`status-badge ${config.color}`}>
        <Icon size={14} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const totalPaid = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className="payments-container">
        <div className="loading-state">
          <CreditCard className="spinner" size={48} />
          <p>Loading payment information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payments-container">
      <div className="payments-content">
        <div className="payments-header">
          <div>
            <h1>Payments</h1>
            <p>Manage your payment methods and view transaction history</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="payment-summary">
          <div className="summary-card">
            <DollarSign size={24} />
            <div>
              <h3>${totalPaid.toFixed(2)}</h3>
              <p>Total Paid</p>
            </div>
          </div>
          <div className="summary-card">
            <Clock size={24} />
            <div>
              <h3>${totalPending.toFixed(2)}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="summary-card">
            <CreditCard size={24} />
            <div>
              <h3>{paymentMethods.length}</h3>
              <p>Payment Methods</p>
            </div>
          </div>
        </div>

        <div className="payments-grid">
          {/* Payment Methods */}
          <div className="payment-methods-section">
            <div className="section-header">
              <h2>Payment Methods</h2>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setShowAddCard(!showAddCard)}
              >
                <Plus size={18} />
                Add New
              </button>
            </div>

            {showAddCard && (
              <form onSubmit={handleAddCard} className="add-card-form">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={newCard.cardNumber}
                    onChange={handleCardChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Card Holder Name</label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={newCard.cardHolder}
                    onChange={handleCardChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={newCard.expiryDate}
                      onChange={handleCardChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={newCard.cvv}
                      onChange={handleCardChange}
                      placeholder="123"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddCard(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Card
                  </button>
                </div>
              </form>
            )}

            <div className="payment-methods-list">
              {paymentMethods.length === 0 ? (
                <div className="empty-state-small">
                  <CreditCard size={48} />
                  <p>No payment methods added yet</p>
                </div>
              ) : (
                paymentMethods.map((method) => (
                  <div key={method.id} className="payment-method-card">
                    <CreditCard size={24} />
                    <div className="method-info">
                      <h4>•••• •••• •••• {method.last4}</h4>
                      <p>Expires {method.expiryDate}</p>
                    </div>
                    <span className="method-badge">
                      {method.isDefault ? 'Default' : ''}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="payment-options">
              <h3>Accepted Payment Methods</h3>
              <div className="accepted-methods">
                <div className="method-badge">💳 Credit Card</div>
                <div className="method-badge">🏦 Bank Transfer</div>
                <div className="method-badge">💰 PayPal</div>
                <div className="method-badge">📱 UPI</div>
              </div>
              <button 
                className="btn btn-primary btn-pay-now"
                onClick={() => setShowUpiModal(true)}
              >
                <DollarSign size={20} />
                Pay Now
              </button>
            </div>
          </div>

          {/* Payment History */}
          <div className="payment-history-section">
            <h2>Transaction History</h2>
            
            {payments.length === 0 ? (
              <div className="empty-state-small">
                <DollarSign size={48} />
                <p>No payment history yet</p>
              </div>
            ) : (
              <div className="payments-list">
                {payments.map((payment) => (
                  <div key={payment.id} className="payment-item">
                    <div className="payment-icon">
                      <DollarSign size={20} />
                    </div>
                    <div className="payment-details">
                      <div className="payment-top">
                        <h4>Order #{payment.orderId}</h4>
                        {getStatusBadge(payment.status)}
                      </div>
                      <p className="payment-method">{payment.method}</p>
                      <p className="payment-date">
                        <Calendar size={14} />
                        {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="payment-amount">
                      ${payment.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Payment Security Info */}
        <div className="security-notice">
          <CheckCircle size={20} />
          <div>
            <h3>Secure Payments</h3>
            <p>All transactions are encrypted and secure. We never store your complete card details.</p>
          </div>
        </div>
      </div>

      {/* UPI Payment Modal */}
      {showUpiModal && (
        <div className="modal-overlay" onClick={() => setShowUpiModal(false)}>
          <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Pay with UPI</h2>
              <button className="modal-close" onClick={() => setShowUpiModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="upi-payment-info">
                <p>Scan the QR code below to make payment via UPI</p>
                <div className="qr-code-placeholder">
                  <div className="qr-placeholder-box">
                    <img 
                      src="/images/upi-qr-code.png" 
                      alt="UPI QR Code"
                      className="upi-qr-code"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="qr-placeholder-text" style={{ display: 'none' }}>
                      <CreditCard size={48} />
                      <p>QR Code will be displayed here</p>
                      <small>Upload your UPI QR code as /public/images/upi-qr-code.png</small>
                    </div>
                  </div>
                </div>
                <div className="payment-instructions">
                  <h4>How to pay:</h4>
                  <ol>
                    <li>Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                    <li>Scan the QR code</li>
                    <li>Enter the amount and complete payment</li>
                    <li>Share the payment screenshot with us</li>
                  </ol>
                </div>
                <div className="upi-details">
                  <p><strong>UPI ID:</strong> nkrtech@upi</p>
                  <p><strong>Business Name:</strong> NKR Tech Solutions</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowUpiModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
