import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/user/verify-token', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            localStorage.removeItem('userToken');
            // Show modal if token is invalid
            setShowAuthModal(true);
          }
        } catch (error) {
          localStorage.removeItem('userToken');
          // Show modal if token verification fails
          setShowAuthModal(true);
        }
      } else {
        // Show auth modal immediately if not logged in
        setShowAuthModal(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('userToken', token);
    setUser(userData);
    setShowAuthModal(false);
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };
  const closeAuthModal = () => setShowAuthModal(false);

  return (
    <AuthContext.Provider value={{ 
      user,
      setUser, 
      loading, 
      authMode,
      login, 
      logout, 
      showAuthModal,
      openAuthModal,
      closeAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};
