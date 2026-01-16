import React, { useState } from 'react';
import { submitDemoRequest } from '../utils/api';
import { CheckCircle, AlertCircle } from 'lucide-react';

const RequestDemo = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const services = [
    'ERP Software with AI',
    'AI Search Engine',
    'AI Image Enhancement',
    'AI Quality Check Engine',
    'Industrial Software',
    'Automation Services',
    'App Development',
    'Website Development',
    'Custom Solution'
  ];

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
      const response = await submitDemoRequest(formData);
      
      if (response.data.success) {
        setStatus({
          type: 'success',
          message: 'Demo request submitted successfully! We will contact you soon.'
        });
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          service: '',
          message: ''
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to submit request. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="section" style={{ background: 'var(--gradient-dark)', color: 'white', paddingBottom: '60px' }}>
        <div className="container text-center">
          <h1 style={{ color: 'white', marginBottom: '24px' }}>Request a Demo</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.85)', maxWidth: '700px', margin: '0 auto' }}>
            See our solutions in action. Schedule a personalized demo tailored to your business needs.
          </p>
        </div>
      </section>

      <section className="section" style={{ marginTop: '-40px' }}>
        <div className="container">
          <div className="card" style={{ maxWidth: '700px', margin: '0 auto', padding: '48px' }}>
            {status.message && (
              <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {status.type === 'success' ? <CheckCircle size={20} style={{ marginRight: '8px', display: 'inline' }} /> : <AlertCircle size={20} style={{ marginRight: '8px', display: 'inline' }} />}
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
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
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  name="company"
                  className="form-input"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="Your Company"
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
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Service Interested In *</label>
                <select
                  name="service"
                  className="form-select"
                  value={formData.service}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a service</option>
                  {services.map((service, index) => (
                    <option key={index} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Additional Message</label>
                <textarea
                  name="message"
                  className="form-textarea"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your requirements..."
                  rows="5"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Request Demo'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RequestDemo;
