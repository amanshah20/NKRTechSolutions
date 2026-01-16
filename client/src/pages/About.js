import React, { useState, useEffect } from 'react';
import { Target, Award, Users, Zap, Shield, TrendingUp } from 'lucide-react';

const About = () => {
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
      <section className="section" style={{ background: 'var(--gradient-dark)', color: 'white' }}>
        <div className="container text-center">
          <h1 style={{ color: 'white', marginBottom: '24px' }}>About NKR Tech Solutions</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.85)', maxWidth: '800px', margin: '0 auto' }}>
            Pioneering the future of enterprise software with AI-driven innovation 
            and unwavering commitment to excellence.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            <div>
              <h2 className="mb-3">Our Mission</h2>
              <p className="mb-3">
                At NKR Tech Solutions, we are dedicated to empowering businesses through 
                cutting-edge technology solutions that drive growth, efficiency, and innovation.
              </p>
              <p>
                We believe that every business deserves access to world-class software 
                that not only meets their current needs but anticipates future challenges 
                and opportunities in an ever-evolving digital landscape.
              </p>
            </div>
            <div>
              <h2 className="mb-3">Our Vision</h2>
              <p className="mb-3">
                To become the global leader in AI-powered enterprise software solutions, 
                setting new standards for innovation, quality, and customer satisfaction.
              </p>
              <p>
                We envision a future where businesses of all sizes can leverage advanced 
                technology to unlock their full potential and achieve unprecedented success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section" style={{ background: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-title">
            <h2>Our Core Values</h2>
            <p>The principles that guide everything we do</p>
          </div>

          <div className="grid grid-3">
            <div className="card">
              <div className="card-icon">
                <Zap size={32} />
              </div>
              <h3>Innovation First</h3>
              <p>
                We constantly push boundaries, exploring new technologies and methodologies 
                to deliver solutions that give our clients a competitive edge.
              </p>
            </div>

            <div className="card">
              <div className="card-icon">
                <Award size={32} />
              </div>
              <h3>Quality Focus</h3>
              <p>
                Every line of code, every feature, every interaction is crafted with 
                meticulous attention to detail and commitment to excellence.
              </p>
            </div>

            <div className="card">
              <div className="card-icon">
                <Users size={32} />
              </div>
              <h3>Expert Team</h3>
              <p>
                Our team comprises industry veterans and talented professionals 
                passionate about creating software that makes a real difference.
              </p>
            </div>

            <div className="card">
              <div className="card-icon">
                <Shield size={32} />
              </div>
              <h3>Security & Trust</h3>
              <p>
                We implement the highest security standards to ensure your data 
                and operations are protected at every level.
              </p>
            </div>

            <div className="card">
              <div className="card-icon">
                <TrendingUp size={32} />
              </div>
              <h3>Fast Delivery</h3>
              <p>
                Using agile methodologies, we ensure rapid deployment without 
                compromising on quality or functionality.
              </p>
            </div>

            <div className="card">
              <div className="card-icon">
                <Target size={32} />
              </div>
              <h3>Client Success</h3>
              <p>
                Your success is our success. We go above and beyond to ensure 
                every client achieves their business objectives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Our Track Record</h2>
            <p>Numbers that speak for themselves</p>
          </div>

          <div className="grid grid-4">
            <div className="text-center">
              <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>
                {loading ? '...' : `${stats.projectsCompleted || 0}+`}
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Projects Completed</p>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>
                {loading ? '...' : `${stats.clientSatisfaction || 0}%`}
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Client Satisfaction</p>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>
                {loading ? '...' : `${stats.activeClients || 2}`}
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Active Clients</p>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>
                {loading ? '...' : `${stats.yearsOfExcellence || 1}+`}
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Years of Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="section" style={{ background: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-title">
            <h2>Our Approach</h2>
            <p>How we deliver exceptional results</p>
          </div>

          <div className="grid grid-2">
            <div className="card">
              <h3>Discovery & Planning</h3>
              <p>
                We begin by deeply understanding your business needs, challenges, 
                and objectives to create a tailored solution strategy.
              </p>
            </div>
            <div className="card">
              <h3>Design & Architecture</h3>
              <p>
                Our experts design scalable, secure architectures that align with 
                industry best practices and your specific requirements.
              </p>
            </div>
            <div className="card">
              <h3>Development & Testing</h3>
              <p>
                Using agile methodologies, we build robust solutions with continuous 
                testing to ensure quality at every stage.
              </p>
            </div>
            <div className="card">
              <h3>Deployment & Support</h3>
              <p>
                Seamless deployment followed by comprehensive training and 24/7 
                support to ensure your success.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
