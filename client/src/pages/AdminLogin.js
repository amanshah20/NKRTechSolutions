import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../utils/api';
import { Lock, AlertCircle } from 'lucide-react';
import '../styles/admin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await adminLogin(credentials);
      
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminEmail', response.data.admin.email);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <Lock size={48} style={{ color: 'var(--primary)', margin: '0 auto 16px' }} />
          <h1>Admin Portal</h1>
          <p>NKR Tech Solutions</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={20} style={{ marginRight: '8px', display: 'inline' }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={credentials.email}
              onChange={handleChange}
              required
              placeholder="admin@nkrtech.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '16px', background: '#F1F5F9', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-light)' }}>
          <strong>Default Credentials:</strong><br />
          Email: admin@nkrtech.com<br />
          Password: Admin@123
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
