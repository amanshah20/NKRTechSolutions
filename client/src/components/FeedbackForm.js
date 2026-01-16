import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const FeedbackForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Service images slider
  const serviceImages = [
    '/images/slide1.png',
    '/images/slide2.png',
    '/images/slide3.png',
    '/images/slide4.png',
    '/images/slide5.png',
    '/images/slide6.png'
  ];
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    rating: 5,
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Auto-advance slider every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === serviceImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [serviceImages.length]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === serviceImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? serviceImages.length - 1 : prevIndex - 1
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          company: '',
          rating: 5,
          message: ''
        });
        setTimeout(() => {
          setSuccess(false);
          setShowForm(false);
        }, 5000);
      } else {
        setError(data.message || 'Failed to submit feedback');
      }
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={32}
        fill={index < formData.rating ? '#FFC107' : 'none'}
        stroke={index < formData.rating ? '#FFC107' : '#ddd'}
        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
        onClick={() => setFormData({ ...formData, rating: index + 1 })}
      />
    ));
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-title">
          <h2>Share Your Feedback</h2>
          <p>We'd love to hear about your experience with our services</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2.5fr 1fr', 
          gap: '40px',
          alignItems: 'center'
        }}>
          {/* Image Slider Section */}
          <div style={{ position: 'relative', height: '600px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            {serviceImages.map((image, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  opacity: index === currentImageIndex ? 1 : 0,
                  transition: 'opacity 1s ease-in-out',
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundColor: '#f8f9fa'
                }}
              />
            ))}
            
            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 10
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'}
            >
              <ChevronLeft size={24} color="#0A66C2" />
            </button>
            
            <button
              onClick={nextImage}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 10
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'}
            >
              <ChevronRight size={24} color="#0A66C2" />
            </button>

            {/* Dots Indicator */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
              zIndex: 10
            }}>
              {serviceImages.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  style={{
                    width: index === currentImageIndex ? '32px' : '12px',
                    height: '12px',
                    borderRadius: '6px',
                    background: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          <div>
          {!showForm ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
              <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>
                Your Opinion Matters!
              </h3>
              <p style={{ 
                fontSize: '1.1rem', 
                lineHeight: '1.8', 
                color: 'var(--text-secondary)',
                marginBottom: '30px',
                maxWidth: '600px',
                margin: '0 auto 30px'
              }}>
                Help us improve by sharing your experience with our services. Your valuable feedback 
                helps us deliver better solutions and may be featured on our website!
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
                style={{ 
                  padding: '14px 40px',
                  fontSize: '1.1rem'
                }}
              >
                Give Feedback Now
              </button>
            </div>
          ) : (
            <div className="card" style={{
              background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
              borderRadius: '20px',
              padding: '40px 35px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
              border: '1px solid rgba(10, 102, 194, 0.1)'
            }}>
              {success && (
                <div className="alert alert-success" style={{ 
                  marginBottom: '24px',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  background: 'linear-gradient(135deg, #d4edda, #c3e6cb)',
                  border: '2px solid #b1dfbb',
                  boxShadow: '0 4px 12px rgba(40, 167, 69, 0.15)'
                }}>
                  <CheckCircle size={20} style={{ marginRight: '10px', display: 'inline' }} />
                  Thank you for your feedback! We appreciate your time.
                </div>
              )}

              {error && (
                <div className="alert alert-error" style={{ 
                  marginBottom: '24px',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  background: 'linear-gradient(135deg, #f8d7da, #f5c6cb)',
                  border: '2px solid #f1b0b7',
                  boxShadow: '0 4px 12px rgba(220, 53, 69, 0.15)'
                }}>
                  <AlertCircle size={20} style={{ marginRight: '10px', display: 'inline' }} />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '22px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '1rem',
                    border: '2px solid #e1e8ed',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#f8f9fa',
                    outline: 'none'
                  }}
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

              <div className="form-group" style={{ marginBottom: '22px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>Your Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '1rem',
                    border: '2px solid #e1e8ed',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#f8f9fa',
                    outline: 'none'
                  }}
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

              <div className="form-group" style={{ marginBottom: '22px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>Company (Optional)</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your Company Name"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '1rem',
                    border: '2px solid #e1e8ed',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#f8f9fa',
                    outline: 'none'
                  }}
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

              <div className="form-group" style={{ marginBottom: '22px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>Your Rating *</label>
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  marginTop: '10px',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #fff8e1, #ffecb3)',
                  borderRadius: '12px',
                  justifyContent: 'center'
                }}>
                  {renderStars()}
                </div>
                <p style={{ 
                  fontSize: '0.95rem', 
                  color: '#FF9800', 
                  marginTop: '10px',
                  textAlign: 'center',
                  fontWeight: '600'
                }}>
                  {formData.rating} out of 5 stars
                </p>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>Your Feedback *</label>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us about your experience..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '1rem',
                    border: '2px solid #e1e8ed',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#f8f9fa',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '100px',
                    fontFamily: 'inherit',
                    lineHeight: '1.6'
                  }}
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
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  width: '100%', 
                  marginBottom: '12px',
                  padding: '14px 32px',
                  fontSize: '1.05rem',
                  fontWeight: '600',
                  background: loading ? '#ccc' : 'linear-gradient(135deg, #0A66C2, #0858a8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: loading ? 'none' : '0 6px 20px rgba(10, 102, 194, 0.3)',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(10, 102, 194, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 6px 20px rgba(10, 102, 194, 0.3)';
                  }
                }}
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
              
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                style={{ 
                  width: '100%',
                  padding: '12px 32px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  background: 'white',
                  color: '#5a6c7d',
                  border: '2px solid #e1e8ed',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f8f9fa';
                  e.target.style.borderColor = '#cbd5e0';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.borderColor = '#e1e8ed';
                }}
              >
                Cancel
              </button>
            </form>
          </div>
          )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackForm;
