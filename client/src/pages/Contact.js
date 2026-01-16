import React, { useState } from 'react';
import { submitContact } from '../utils/api';
import { CheckCircle, AlertCircle, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await submitContact(formData);
      
      if (response.data.success) {
        setStatus({
          type: 'success',
          message: 'Message sent successfully! We will get back to you soon.'
        });
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to send message. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="section" style={{ background: 'var(--gradient-dark)', color: 'white', paddingBottom: '60px' }}>
        <div className="container text-center">
          <h1 style={{ color: 'white', marginBottom: '24px' }}>Contact Us</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.85)', maxWidth: '700px', margin: '0 auto' }}>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <section className="section" style={{ marginTop: '-40px' }}>
        <div className="container">
          <div className="grid grid-2" style={{ gap: '48px', alignItems: 'start' }}>
            {/* Contact Information */}
            <div>
              <h2 className="mb-3">Get in Touch</h2>
              <p className="mb-4">
                We're here to help and answer any question you might have. 
                We look forward to hearing from you.
              </p>

              <div className="card mb-3">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px',
                    background: 'var(--gradient-primary)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '4px' }}>Email</h4>
                    <p style={{ margin: 0 }}>amankumarkanu87@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="card mb-3">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px',
                    background: 'var(--gradient-primary)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '4px' }}>Phone</h4>
                    <p style={{ margin: 0 }}>8968702275</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px',
                    background: 'var(--gradient-primary)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '4px' }}>Address</h4>
                    <p style={{ margin: 0 }}>Uma Nagar Deoria, Uttar Pradesh</p>
                  </div>
                </div>
              </div>

              <div className="card mt-3">
                <h3 style={{ marginBottom: '16px' }}>Follow Us</h3>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      width: '48px',
                      height: '48px',
                      background: 'var(--gradient-primary)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Facebook size={24} />
                  </a>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      width: '48px',
                      height: '48px',
                      background: 'var(--gradient-primary)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Twitter size={24} />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      width: '48px',
                      height: '48px',
                      background: 'var(--gradient-primary)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Instagram size={24} />
                  </a>
                </div>
              </div>

              <div className="card mt-3" style={{ background: 'var(--gradient-primary)', color: 'white' }}>
                <h3 style={{ color: 'white', marginBottom: '12px' }}>Business Hours</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card" style={{ padding: '48px' }}>
              <h2 className="mb-3">Send us a Message</h2>

              {status.message && (
                <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                  {status.type === 'success' ? <CheckCircle size={20} style={{ marginRight: '8px', display: 'inline' }} /> : <AlertCircle size={20} style={{ marginRight: '8px', display: 'inline' }} />}
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@company.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    name="message"
                    className="form-textarea"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="How can we help you?"
                    rows="6"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
