import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Loader } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const { showAuthModal, closeAuthModal, login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  if (!showAuthModal) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/user/signup', formData);
      if (response.data.success) {
        login(response.data.user, response.data.token);
        closeAuthModal();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/user/login', {
        email: formData.email,
        password: formData.password
      });
      if (response.data.success) {
        login(response.data.user, response.data.token);
        closeAuthModal();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeIn 0.3s ease'
    },
    modal: {
      background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
      borderRadius: '24px',
      width: '90%',
      maxWidth: '450px',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      animation: 'slideUp 0.4s ease'
    },
    header: {
      background: 'linear-gradient(135deg, #0A66C2, #0858a8)',
      padding: '30px',
      borderRadius: '24px 24px 0 0',
      position: 'relative'
    },
    closeBtn: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    title: {
      color: 'white',
      fontSize: '28px',
      fontWeight: '700',
      margin: '0 0 8px 0'
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '14px',
      margin: 0
    },
    content: {
      padding: '35px 30px'
    },
    tabs: {
      display: 'flex',
      gap: '10px',
      marginBottom: '30px',
      background: '#f1f3f5',
      padding: '6px',
      borderRadius: '12px'
    },
    tab: (active) => ({
      flex: 1,
      padding: '12px',
      border: 'none',
      borderRadius: '10px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: active ? 'linear-gradient(135deg, #0A66C2, #0858a8)' : 'transparent',
      color: active ? 'white' : '#5a6c7d'
    }),
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#2c3e50'
    },
    inputWrapper: {
      position: 'relative'
    },
    input: {
      width: '100%',
      padding: '14px 45px 14px 45px',
      fontSize: '15px',
      border: '2px solid #e1e8ed',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      backgroundColor: '#f8f9fa',
      outline: 'none'
    },
    icon: {
      position: 'absolute',
      left: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#8899A6'
    },
    eyeIcon: {
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      color: '#8899A6'
    },
    button: {
      width: '100%',
      padding: '16px',
      fontSize: '16px',
      fontWeight: '600',
      background: 'linear-gradient(135deg, #0A66C2, #0858a8)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 24px rgba(10, 102, 194, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    },
    googleBtn: {
      width: '100%',
      padding: '14px',
      fontSize: '15px',
      fontWeight: '600',
      background: 'white',
      color: '#2c3e50',
      border: '2px solid #e1e8ed',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '15px'
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '25px 0',
      color: '#8899A6',
      fontSize: '14px'
    },
    line: {
      flex: 1,
      height: '1px',
      background: '#e1e8ed'
    },
    error: {
      background: '#fee',
      color: '#c33',
      padding: '12px',
      borderRadius: '10px',
      marginBottom: '20px',
      fontSize: '14px',
      border: '1px solid #fcc'
    },
    forgotLink: {
      textAlign: 'right',
      marginTop: '10px'
    },
    link: {
      color: '#0A66C2',
      fontSize: '14px',
      cursor: 'pointer',
      textDecoration: 'none',
      fontWeight: '500'
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      <div style={styles.overlay} onClick={closeAuthModal}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={styles.header}>
            <button 
              style={styles.closeBtn}
              onClick={closeAuthModal}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              <X size={20} color="white" />
            </button>
            <h2 style={styles.title}>Welcome!</h2>
            <p style={styles.subtitle}>
              {isLogin ? 'Sign in to continue' : 'Create your account'}
            </p>
          </div>

          <div style={styles.content}>
            <div style={styles.tabs}>
              <button 
                style={styles.tab(isLogin)} 
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
              >
                Login
              </button>
              <button 
                style={styles.tab(!isLogin)} 
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
              >
                Sign Up
              </button>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={isLogin ? handleLogin : handleSignup}>
              {!isLogin && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Name</label>
                  <div style={styles.inputWrapper}>
                    <User size={20} style={styles.icon} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      style={styles.input}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0A66C2';
                        e.target.style.backgroundColor = '#ffffff';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e1e8ed';
                        e.target.style.backgroundColor = '#f8f9fa';
                      }}
                    />
                  </div>
                </div>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <Mail size={20} style={styles.icon} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    style={styles.input}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0A66C2';
                      e.target.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e1e8ed';
                      e.target.style.backgroundColor = '#f8f9fa';
                    }}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <Lock size={20} style={styles.icon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    style={styles.input}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0A66C2';
                      e.target.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e1e8ed';
                      e.target.style.backgroundColor = '#f8f9fa';
                    }}
                  />
                  <div style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                style={styles.button}
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 32px rgba(10, 102, 194, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 24px rgba(10, 102, 194, 0.3)';
                }}
              >
                {loading && <Loader size={20} className="spin" />}
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default AuthModal;
