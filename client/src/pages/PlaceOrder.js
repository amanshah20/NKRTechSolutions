import React, { useState } from 'react';
import { submitOrder } from '../utils/api';
import { CheckCircle, AlertCircle } from 'lucide-react';

const PlaceOrder = () => {
  const [formData, setFormData] = useState({
    client_name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    timeline: '',
    requirements: ''
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

  const budgetRanges = [
    'Less than $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000 - $100,000',
    'More than $100,000',
    'To be discussed'
  ];

  const timelines = [
    '1-2 months',
    '3-4 months',
    '5-6 months',
    '6+ months',
    'Flexible'
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
      const response = await submitOrder(formData);
      
      if (response.data.success) {
        setStatus({
          type: 'success',
          message: 'Order placed successfully! We will contact you soon to discuss the details.'
        });
        setFormData({
          client_name: '',
          email: '',
          phone: '',
          company: '',
          service: '',
          budget: '',
          timeline: '',
          requirements: ''
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to place order. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="section" style={{ background: 'var(--gradient-dark)', color: 'white', paddingBottom: '60px' }}>
        <div className="container text-center">
          <h1 style={{ color: 'white', marginBottom: '24px' }}>Place an Order</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.85)', maxWidth: '700px', margin: '0 auto' }}>
            Ready to get started? Tell us about your project and we'll create a customized solution for you.
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
                  name="client_name"
                  className="form-input"
                  value={formData.client_name}
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
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  name="company"
                  className="form-input"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your Company (Optional)"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Service Required *</label>
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
                <label className="form-label">Budget Range *</label>
                <select
                  name="budget"
                  className="form-select"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select budget range</option>
                  {budgetRanges.map((budget, index) => (
                    <option key={index} value={budget}>{budget}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Project Timeline *</label>
                <select
                  name="timeline"
                  className="form-select"
                  value={formData.timeline}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select timeline</option>
                  {timelines.map((timeline, index) => (
                    <option key={index} value={timeline}>{timeline}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Project Requirements</label>
                <textarea
                  name="requirements"
                  className="form-textarea"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Describe your project requirements in detail..."
                  rows="6"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlaceOrder;
