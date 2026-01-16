import React, { useState } from 'react';
import { ArrowLeft, Mail, Loader, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = ({ onBack, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/user/forgot-password', { email });
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => onClose(), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
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
      zIndex: 9999
    },
    modal: {
      background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
      borderRadius: '24px',
      width: '90%',
      maxWidth: '450px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    header: {
      background: 'linear-gradient(135deg, #0A66C2, #0858a8)',
      padding: '30px',
      borderRadius: '24px 24px 0 0',
      position: 'relative'
    },
    backBtn: {
      position: 'absolute',
      top: '30px',
      left: '30px',
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
      margin: '0 0 10px 0'
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '14px',
      margin: 0
    },
    content: {
      padding: '35px 30px'
    },
    instruction: {
      fontSize: '15px',
      color: '#5a6c7d',
      marginBottom: '25px',
      lineHeight: '1.6'
    },
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
      padding: '14px 45px',
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
    error: {
      background: '#fee',
      color: '#c33',
      padding: '12px',
      borderRadius: '10px',
      marginBottom: '20px',
      fontSize: '14px',
      border: '1px solid #fcc'
    },
    success: {
      background: '#d4edda',
      color: '#155724',
      padding: '16px',
      borderRadius: '12px',
      marginBottom: '20px',
      fontSize: '15px',
      border: '2px solid #c3e6cb',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontWeight: '600'
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <button
            style={styles.backBtn}
            onClick={onBack}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            <ArrowLeft size={20} color="white" />
          </button>
          <h2 style={styles.title}>Reset Password</h2>
          <p style={styles.subtitle}>We'll send you a reset link</p>
        </div>

        <div style={styles.content}>
          {success ? (
            <div style={styles.success}>
              <CheckCircle size={20} />
              Password reset link sent! Check your email.
            </div>
          ) : (
            <>
              <p style={styles.instruction}>
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {error && <div style={styles.error}>{error}</div>}

              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <div style={styles.inputWrapper}>
                    <Mail size={20} style={styles.icon} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      style={styles.input}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0A66C2';
                        e.target.style.backgroundColor = '#ffffff';
                        e.target.style.boxShadow = '0 0 0 4px rgba(10, 102, 194, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e1e8ed';
                        e.target.style.backgroundColor = '#f8f9fa';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
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
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
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
    </div>
  );
};

export default ForgotPassword;
