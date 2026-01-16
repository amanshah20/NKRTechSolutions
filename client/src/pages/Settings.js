import React, { useState } from 'react';
import { Lock, Moon, Sun, Eye, Shield, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import '../styles/settings.css';

const Settings = () => {
  const { user } = useAuth();
  const { theme, eyeProtection, toggleTheme, toggleEyeProtection } = useTheme();
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.put(
        'http://localhost:5000/api/user/change-password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to change password'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-content">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your account security and preferences</p>
        </div>

        {message.text && (
          <div className={`settings-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Password Section */}
        <div className="settings-section">
          <div className="section-header">
            <Lock size={24} />
            <div>
              <h2>Change Password</h2>
              <p>Update your password to keep your account secure</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="settings-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                placeholder="Enter your current password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                placeholder="Enter new password (min. 6 characters)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                placeholder="Confirm new password"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} />
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Theme Section */}
        <div className="settings-section">
          <div className="section-header">
            <Moon size={24} />
            <div>
              <h2>Appearance</h2>
              <p>Customize how the application looks</p>
            </div>
          </div>

          <div className="settings-options">
            <div className="setting-option">
              <div className="option-info">
                <div className="option-icon">
                  {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div>
                  <h3>Dark Mode</h3>
                  <p>Switch between light and dark theme</p>
                </div>
              </div>
              <button 
                className={`toggle-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={toggleTheme}
              >
                <span className="toggle-slider"></span>
              </button>
            </div>

            <div className="setting-option">
              <div className="option-info">
                <div className="option-icon">
                  <Eye size={20} />
                </div>
                <div>
                  <h3>Eye Protection Mode</h3>
                  <p>Reduce blue light and eye strain</p>
                </div>
              </div>
              <button 
                className={`toggle-btn ${eyeProtection ? 'active' : ''}`}
                onClick={toggleEyeProtection}
              >
                <span className="toggle-slider"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="settings-section">
          <div className="section-header">
            <Shield size={24} />
            <div>
              <h2>Security</h2>
              <p>Manage your account security settings</p>
            </div>
          </div>

          <div className="security-info">
            <div className="info-item">
              <h3>Account Status</h3>
              <p className="status-active">Active and Verified</p>
            </div>
            <div className="info-item">
              <h3>Email</h3>
              <p>{user?.email}</p>
            </div>
            <div className="info-item">
              <h3>Two-Factor Authentication</h3>
              <p className="status-pending">Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
