import React, { useState, useEffect } from 'react';
import { Zap, Shield, Users, Clock, Award, TrendingUp, Heart, Globe } from 'lucide-react';

const WhyChooseUs = () => {
  const [stats, setStats] = useState({
    projectsCompleted: 0,
    clientSatisfaction: 0,
    expertTeamMembers: 50
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real statistics from API
    fetch('http://localhost:5000/api/stats')
      .then(response => response.json())
      .then(data => {
        if (data.success && data.stats) {
          setStats({
            projectsCompleted: data.stats.projectsCompleted || 0,
            clientSatisfaction: data.stats.clientSatisfaction || 0,
            expertTeamMembers: data.stats.expertTeamMembers || 50
          });
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching stats:', error);
        setLoading(false);
      });
  }, []);

  const reasons = [
    {
      icon: <Zap size={48} />,
      title: 'Innovation First',
      description: 'We stay at the forefront of technology, constantly exploring and implementing the latest AI and machine learning advancements to give you a competitive edge.'
    },
    {
      icon: <Shield size={48} />,
      title: 'Enterprise Security',
      description: 'Bank-level security protocols, end-to-end encryption, and compliance with international standards ensure your data is always protected.'
    },
    {
      icon: <Users size={48} />,
      title: 'Expert Team',
      description: 'Our team consists of seasoned professionals with decades of combined experience in enterprise software development and AI implementation.'
    },
    {
      icon: <Clock size={48} />,
      title: 'Fast Delivery',
      description: 'Agile development methodology enables us to deliver high-quality solutions quickly without compromising on features or reliability.'
    },
    {
      icon: <Award size={48} />,
      title: 'Quality Assurance',
      description: 'Rigorous testing processes and quality control measures ensure every solution we deliver meets the highest standards of excellence.'
    },
    {
      icon: <TrendingUp size={48} />,
      title: 'Scalable Solutions',
      description: 'Our architectures are designed to grow with your business, handling increased loads and new features seamlessly as you expand.'
    },
    {
      icon: <Heart size={48} />,
      title: 'Client-Centric Approach',
      description: 'Your success is our priority. We work closely with you at every step, ensuring the solution perfectly aligns with your vision and goals.'
    },
    {
      icon: <Globe size={48} />,
      title: '24/7 Support',
      description: 'Round-the-clock technical support and maintenance ensure your systems run smoothly and any issues are resolved immediately.'
    }
  ];

  return (
    <div>
      {/* Hero Section with Glassmorphism */}
      <section 
        style={{ 
          background: 'var(--gradient-dark)',
          padding: '120px 0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'grid\' width=\'100\' height=\'100\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 100 0 L 0 0 0 100\' fill=\'none\' stroke=\'rgba(255,255,255,0.05)\' stroke-width=\'1\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23grid)\'/%3E%3C/svg%3E")',
            opacity: 0.5
          }}
        ></div>
        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: 'white', marginBottom: '24px' }}>Why Choose NKR Tech Solutions?</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.85)', maxWidth: '800px', margin: '0 auto' }}>
            Discover what makes us the preferred technology partner for businesses worldwide.
          </p>
        </div>
      </section>

      {/* Main Reasons Section with Glassmorphism Cards */}
      <section className="section" style={{ background: 'var(--gradient-dark)', paddingTop: '0' }}>
        <div className="container">
          <div className="grid grid-2" style={{ gap: '32px' }}>
            {reasons.map((reason, index) => (
              <div 
                key={index}
                className="card"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '40px',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ 
                  color: 'var(--secondary)', 
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start'
                }}>
                  {reason.icon}
                </div>
                <h3 style={{ color: 'white', marginBottom: '16px' }}>{reason.title}</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.7' }}>
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section" style={{ background: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-title">
            <h2>Proven Track Record</h2>
            <p>Our numbers tell the story of our commitment to excellence</p>
          </div>

          <div className="grid grid-4">
            <div className="card text-center">
              <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '12px' }}>
                {loading ? '...' : `${stats.projectsCompleted || 0}+`}
              </div>
              <h4>Projects Delivered</h4>
              <p>Successfully completed projects across various industries and technologies.</p>
            </div>
            <div className="card text-center">
              <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '12px' }}>
                {loading ? '...' : `${stats.clientSatisfaction || 0}%`}
              </div>
              <h4>Client Satisfaction</h4>
              <p>Consistently exceeding client expectations with quality and service.</p>
            </div>
            <div className="card text-center">
              <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '12px' }}>
                {loading ? '...' : `${stats.expertTeamMembers || 50}+`}
              </div>
              <h4>Expert Developers</h4>
              <p>Highly skilled team members dedicated to your project success.</p>
            </div>
            <div className="card text-center">
              <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '12px' }}>
                24/7
              </div>
              <h4>Support Available</h4>
              <p>Round-the-clock assistance ensuring your operations never stop.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Our Proven Process</h2>
            <p>A systematic approach to delivering exceptional results</p>
          </div>

          <div className="grid grid-4">
            <div className="card">
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: 'var(--gradient-primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '800',
                marginBottom: '20px'
              }}>
                1
              </div>
              <h3>Discovery</h3>
              <p>We deeply understand your business needs, challenges, and objectives through comprehensive analysis.</p>
            </div>
            <div className="card">
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: 'var(--gradient-primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '800',
                marginBottom: '20px'
              }}>
                2
              </div>
              <h3>Design</h3>
              <p>Our architects create scalable, secure solutions aligned with best practices and your requirements.</p>
            </div>
            <div className="card">
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: 'var(--gradient-primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '800',
                marginBottom: '20px'
              }}>
                3
              </div>
              <h3>Development</h3>
              <p>Using agile methods, we build robust solutions with continuous testing and quality assurance.</p>
            </div>
            <div className="card">
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: 'var(--gradient-primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '800',
                marginBottom: '20px'
              }}>
                4
              </div>
              <h3>Deployment</h3>
              <p>Seamless deployment with comprehensive training and ongoing support for your success.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ background: 'var(--bg-main)' }}>
        <div className="container">
          <div className="card" style={{ 
            background: 'var(--gradient-primary)', 
            textAlign: 'center',
            padding: '60px 40px'
          }}>
            <h2 style={{ color: 'white', marginBottom: '20px' }}>
              Ready to Experience the Difference?
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.15rem', marginBottom: '32px' }}>
              Join hundreds of satisfied clients who have transformed their businesses with our solutions.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/request-demo" className="btn btn-outline">Request Demo</a>
              <a href="/contact" className="btn" style={{ background: 'white', color: 'var(--primary)' }}>
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyChooseUs;
