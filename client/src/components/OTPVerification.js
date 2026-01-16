import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, Loader, Phone } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OTPVerification = ({ mobile, onClose }) => {
  const { login } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [smsConfigured, setSmsConfigured] = useState(true);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Check SMS configuration status
    const checkSMSConfig = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/sms-config');
        setSmsConfigured(response.data.smsConfigured);
      } catch (error) {
        console.error('Failed to check SMS config:', error);
      }
    };
    checkSMSConfig();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
    inputRefs.current[Math.min(pastedData.length, 5)].focus();
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/user/verify-otp', {
        mobile,
        otp: otpCode
      });

      if (response.data.success) {
        setSuccess(true);
        login(response.data.user, response.data.token);
        setTimeout(onClose, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setResending(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/user/resend-otp', { mobile });
      if (response.data.success) {
        setCountdown(60);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0].focus();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
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
      maxWidth: '480px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      animation: 'slideUp 0.4s ease'
    },
    header: {
      background: 'linear-gradient(135deg, #0A66C2, #0858a8)',
      padding: '35px 30px',
      borderRadius: '24px 24px 0 0',
      textAlign: 'center'
    },
    icon: {
      width: '80px',
      height: '80px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px'
    },
    title: {
      color: 'white',
      fontSize: '28px',
      fontWeight: '700',
      margin: '0 0 10px 0'
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '15px',
      margin: 0
    },
    content: {
      padding: '40px 30px'
    },
    instruction: {
      textAlign: 'center',
      fontSize: '15px',
      color: '#5a6c7d',
      marginBottom: '30px',
      lineHeight: '1.6'
    },
    email: {
      fontWeight: '600',
      color: '#0A66C2'
    },
    otpContainer: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      marginBottom: '30px'
    },
    otpInput: {
      width: '50px',
      height: '60px',
      fontSize: '24px',
      fontWeight: '700',
      textAlign: 'center',
      border: '2px solid #e1e8ed',
      borderRadius: '12px',
      backgroundColor: '#f8f9fa',
      outline: 'none',
      transition: 'all 0.3s ease',
      color: '#0A66C2'
    },
    error: {
      background: '#fee',
      color: '#c33',
      padding: '12px',
      borderRadius: '10px',
      marginBottom: '20px',
      fontSize: '14px',
      border: '1px solid #fcc',
      textAlign: 'center'
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
      justifyContent: 'center',
      gap: '10px',
      fontWeight: '600'
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
      gap: '10px',
      marginBottom: '15px'
    },
    resendContainer: {
      textAlign: 'center',
      fontSize: '14px',
      color: '#5a6c7d'
    },
    resendLink: {
      color: '#0A66C2',
      cursor: 'pointer',
      fontWeight: '600',
      textDecoration: 'none'
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
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={styles.header}>
            <div style={styles.icon}>
              <Phone size={40} color="white" />
            </div>
            <h2 style={styles.title}>Verify Your Mobile</h2>
            <p style={styles.subtitle}>Enter the 6-digit code we sent</p>
          </div>

          <div style={styles.content}>
            <p style={styles.instruction}>
              We've sent a verification code to<br />
              <span style={styles.email}>+91 {mobile}</span>
            </p>

            {!smsConfigured && (
              <div style={{
                background: 'linear-gradient(135deg, #fff3cd, #ffe69c)',
                border: '2px solid #ffc107',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '20px',
                textAlign: 'center',
                fontSize: '14px',
                color: '#856404'
              }}>
                <strong>📱 Development Mode:</strong><br />
                Check the <strong>server console/terminal</strong> window for your OTP code.<br />
                (SMS gateway not configured - OTP is logged to console)
              </div>
            )}

            {success && (
              <div style={styles.success}>
                <CheckCircle size={20} />
                Mobile verified successfully!
              </div>
            )}

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : null}
                  style={styles.otpInput}
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
                  disabled={success}
                />
              ))}
            </div>

            <button
              style={styles.button}
              onClick={handleVerify}
              disabled={loading || success}
              onMouseEnter={(e) => {
                if (!loading && !success) {
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
              {loading ? 'Verifying...' : 'Verify Mobile'}
            </button>

            <div style={styles.resendContainer}>
              {countdown > 0 ? (
                <span>Resend code in {countdown}s</span>
              ) : (
                <span>
                  Didn't receive code?{' '}
                  <a
                    style={styles.resendLink}
                    onClick={handleResend}
                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                  >
                    {resending ? 'Sending...' : 'Resend'}
                  </a>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTPVerification;
