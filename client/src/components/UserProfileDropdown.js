import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  ShoppingBag, 
  Bell, 
  MessageSquare, 
  CreditCard, 
  LogOut,
  X 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/userProfile.css';

const UserProfileDropdown = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isOpen) return null;

  return (
    <div className={`profile-dropdown-overlay ${isOpen ? 'active' : ''}`}>
      <div className="profile-dropdown-panel" ref={dropdownRef}>
        <div className="profile-dropdown-header">
          <button className="close-dropdown" onClick={onClose}>
            <X size={24} />
          </button>
          <div className="profile-dropdown-user">
            <div className="profile-avatar-large">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} />
              ) : (
                <span>{getInitials(user?.name || 'User')}</span>
              )}
            </div>
            <h3>{user?.name || 'User'}</h3>
            <p>{user?.email || ''}</p>
          </div>
        </div>

        <div className="profile-dropdown-menu">
          <button 
            className="profile-menu-item"
            onClick={() => handleNavigation('/my-account')}
          >
            <User size={20} />
            <div className="menu-item-content">
              <span className="menu-item-title">My Account</span>
              <span className="menu-item-desc">View and edit your profile</span>
            </div>
          </button>

          <button 
            className="profile-menu-item"
            onClick={() => handleNavigation('/my-orders')}
          >
            <ShoppingBag size={20} />
            <div className="menu-item-content">
              <span className="menu-item-title">My Orders</span>
              <span className="menu-item-desc">Track your order progress</span>
            </div>
          </button>

          <button 
            className="profile-menu-item"
            onClick={() => handleNavigation('/notifications')}
          >
            <Bell size={20} />
            <div className="menu-item-content">
              <span className="menu-item-title">Notifications</span>
              <span className="menu-item-desc">Order updates and messages</span>
            </div>
          </button>

          <button 
            className="profile-menu-item"
            onClick={() => handleNavigation('/contact-developer')}
          >
            <MessageSquare size={20} />
            <div className="menu-item-content">
              <span className="menu-item-title">Contact Developer</span>
              <span className="menu-item-desc">Message about your project</span>
            </div>
          </button>

          <button 
            className="profile-menu-item"
            onClick={() => handleNavigation('/payments')}
          >
            <CreditCard size={20} />
            <div className="menu-item-content">
              <span className="menu-item-title">Payments</span>
              <span className="menu-item-desc">Manage payment methods</span>
            </div>
          </button>

          <button 
            className="profile-menu-item"
            onClick={() => handleNavigation('/settings')}
          >
            <Settings size={20} />
            <div className="menu-item-content">
              <span className="menu-item-title">Settings</span>
              <span className="menu-item-desc">Password, theme & preferences</span>
            </div>
          </button>

          <div className="profile-menu-divider"></div>

          <button 
            className="profile-menu-item logout"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <div className="menu-item-content">
              <span className="menu-item-title">Logout</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDropdown;
