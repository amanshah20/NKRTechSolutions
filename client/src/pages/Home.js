import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Users, Clock } from 'lucide-react';
import Testimonials from '../components/Testimonials';
import FeedbackForm from '../components/FeedbackForm';
import '../styles/hero.css';

const Home = () => {
  const [stats, setStats] = useState({
    projectsCompleted: 0,
    clientSatisfaction: 92,
    activeClients: 2,
    yearsOfExcellence: 1
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
            clientSatisfaction: data.stats.clientSatisfaction || 92,
            activeClients: data.stats.activeClients || 2,
            yearsOfExcellence: data.stats.yearsOfExcellence || 1
          });
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching stats:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Transform Your Business with AI-Powered Solutions</h1>
          <p className="hero-subtitle">
            Enterprise-grade software solutions that drive innovation, enhance efficiency, 
            and accelerate your digital transformation journey.
          </p>
          <div className="hero-cta">
            <Link to="/request-demo" className="btn btn-primary">
              Request a Demo <ArrowRight size={20} style={{ marginLeft: '8px', display: 'inline' }} />
            </Link>
            <Link to="/place-order" className="btn btn-outline">
              Place an Order
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">{loading ? '...' : `${stats.projectsCompleted || 0}+`}</span>
              <span className="hero-stat-label">Projects Delivered</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">{loading ? '...' : `${stats.clientSatisfaction || 0}%`}</span>
              <span className="hero-stat-label">Client Satisfaction</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">{loading ? '...' : `${stats.activeClients || 0}+`}</span>
              <span className="hero-stat-label">Active Clients</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">{loading ? '...' : `${stats.yearsOfExcellence || 1}+`}</span>
              <span className="hero-stat-label">Years Experience</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Why Businesses Choose Us</h2>
            <p>Delivering excellence through innovation and dedication</p>
          </div>

          <div className="grid grid-4">
            <div className="card">
              <div className="card-icon">
                <Zap size={32} />
              </div>
              <h3>Innovation First</h3>
              <p>Cutting-edge AI and machine learning technologies integrated into every solution we deliver.</p>
            </div>

            <div className="card">
              <div className="card-icon">
                <Shield size={32} />
              </div>
              <h3>Enterprise Security</h3>
              <p>Bank-level security protocols ensuring your data remains protected at all times.</p>
            </div>

            <div className="card">
              <div className="card-icon">
                <Users size={32} />
              </div>
              <h3>Expert Team</h3>
              <p>Highly skilled professionals with years of experience in enterprise software development.</p>
            </div>

            <div className="card">
              <div className="card-icon">
                <Clock size={32} />
              </div>
              <h3>Fast Delivery</h3>
              <p>Agile methodology ensuring quick turnaround times without compromising quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section" style={{ background: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-title">
            <h2>Our Core Services</h2>
            <p>Comprehensive solutions tailored to your business needs</p>
          </div>

          <div className="grid grid-3">
            <div className="card">
              <h3>ERP Software with AI</h3>
              <p>
                Intelligent enterprise resource planning systems that automate workflows 
                and provide real-time business insights.
              </p>
              <Link to="/services" className="btn btn-secondary mt-3">Learn More</Link>
            </div>

            <div className="card">
              <h3>AI Search Engine</h3>
              <p>
                Advanced search solutions powered by natural language processing 
                for superior data discovery and retrieval.
              </p>
              <Link to="/services" className="btn btn-secondary mt-3">Learn More</Link>
            </div>

            <div className="card">
              <h3>Industrial Automation</h3>
              <p>
                Smart automation solutions that optimize manufacturing processes 
                and reduce operational costs significantly.
              </p>
              <Link to="/services" className="btn btn-secondary mt-3">Learn More</Link>
            </div>
          </div>

          <div className="text-center mt-4">
            <Link to="/services" className="btn btn-primary">View All Services</Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Feedback Form Section */}
      <FeedbackForm />

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ 
            background: 'var(--gradient-primary)', 
            textAlign: 'center',
            padding: '60px 40px'
          }}>
            <h2 style={{ color: 'white', marginBottom: '20px' }}>
              Ready to Transform Your Business?
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.15rem', marginBottom: '32px' }}>
              Join hundreds of satisfied clients who have revolutionized their operations with our solutions.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/request-demo" className="btn btn-outline">Request Demo</Link>
              <Link to="/contact" className="btn" style={{ background: 'white', color: 'var(--primary)' }}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
