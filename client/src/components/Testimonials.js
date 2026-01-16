import React, { useState } from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const [testimonials] = useState([
    {
      id: 1,
      name: 'Kiara Jewellery Pvt Ltd',
      company: 'Jewellery Manufacturing & Retail',
      rating: 5,
      message: 'NKR Tech Solutions delivered an outstanding ERP system for our company. Their AI-powered features have significantly improved our operational efficiency. Highly recommended!',
      date: '2025-12-15'
    },
    {
      id: 2,
      name: 'Chandra Jewellery',
      company: 'Jewellery & Ornaments',
      rating: 5,
      message: 'Working with NKR Tech Solutions was a great experience. They understood our requirements perfectly and delivered a custom solution that exceeded our expectations. Professional and reliable!',
      date: '2025-11-28'
    },
    {
      id: 3,
      name: 'Amit Patel',
      company: 'Manufacturing Solutions Inc',
      rating: 4,
      message: 'The industrial automation software developed by NKR Tech Solutions has streamlined our manufacturing processes. Great team, excellent support, and timely delivery!',
      date: '2025-10-20'
    }
  ]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={20}
        fill={index < rating ? '#FFC107' : 'none'}
        stroke={index < rating ? '#FFC107' : '#ddd'}
      />
    ));
  };

  return (
    <section className="section" style={{ background: 'var(--bg-main)' }}>
      <div className="container">
        <div className="section-title">
          <h2>What Our Clients Say</h2>
          <p>Trusted by leading businesses for innovative solutions</p>
        </div>

        <div className="grid grid-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="card" style={{ height: '100%' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {renderStars(testimonial.rating)}
              </div>
              <p style={{ 
                fontSize: '1rem', 
                lineHeight: '1.6', 
                marginBottom: '20px',
                color: 'var(--text-secondary)'
              }}>
                "{testimonial.message}"
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <h4 style={{ marginBottom: '4px', color: 'var(--primary)' }}>
                  {testimonial.name}
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
