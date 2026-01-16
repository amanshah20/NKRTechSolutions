import React from 'react';
import { Brain, Search, Image, CheckCircle, Factory, Smartphone, Globe, BarChart } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Brain size={40} />,
      title: 'ERP Software with AI',
      description: 'Intelligent enterprise resource planning systems that integrate AI and machine learning to automate workflows, predict trends, and provide actionable business insights in real-time.',
      features: [
        'AI-powered analytics and forecasting',
        'Automated workflow management',
        'Real-time business intelligence',
        'Cloud-native architecture',
        'Seamless third-party integrations'
      ]
    },
    {
      icon: <Search size={40} />,
      title: 'AI Search Engine',
      description: 'Advanced search solutions powered by natural language processing and machine learning algorithms for superior data discovery, relevance, and user experience.',
      features: [
        'Natural language understanding',
        'Semantic search capabilities',
        'Multi-language support',
        'Custom ranking algorithms',
        'Real-time indexing'
      ]
    },
    {
      icon: <Image size={40} />,
      title: 'AI Image Enhancement',
      description: 'State-of-the-art image processing technology that automatically enhances, restores, and optimizes images for various business applications.',
      features: [
        'Automatic quality enhancement',
        'Noise reduction and upscaling',
        'Object detection and recognition',
        'Batch processing capabilities',
        'API integration ready'
      ]
    },
    {
      icon: <CheckCircle size={40} />,
      title: 'AI Quality Check Engine',
      description: 'Automated quality assurance systems that use computer vision and machine learning to detect defects, ensure compliance, and maintain standards.',
      features: [
        'Automated defect detection',
        'Real-time quality monitoring',
        'Compliance verification',
        'Custom inspection rules',
        'Detailed reporting and analytics'
      ]
    },
    {
      icon: <Factory size={40} />,
      title: 'Industrial Software',
      description: 'Robust manufacturing and industrial management solutions designed to optimize production, track inventory, and streamline operations.',
      features: [
        'Production planning and scheduling',
        'Inventory management',
        'Equipment maintenance tracking',
        'Supply chain optimization',
        'IoT device integration'
      ]
    },
    {
      icon: <BarChart size={40} />,
      title: 'Automation Services',
      description: 'End-to-end process automation solutions that eliminate manual tasks, reduce errors, and significantly improve operational efficiency.',
      features: [
        'Robotic Process Automation (RPA)',
        'Workflow automation',
        'Data extraction and processing',
        'Integration with existing systems',
        'Custom automation solutions'
      ]
    },
    {
      icon: <Smartphone size={40} />,
      title: 'App Development',
      description: 'Native and cross-platform mobile applications designed with beautiful interfaces and powerful functionality for iOS and Android.',
      features: [
        'iOS and Android development',
        'Cross-platform solutions',
        'User-centric design',
        'Performance optimization',
        'App store deployment'
      ]
    },
    {
      icon: <Globe size={40} />,
      title: 'Website Development',
      description: 'Modern, responsive, and high-performance websites and web applications built with the latest technologies and best practices.',
      features: [
        'Responsive design',
        'Progressive web apps (PWA)',
        'E-commerce solutions',
        'CMS integration',
        'SEO optimization'
      ]
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="section" style={{ background: 'var(--gradient-dark)', color: 'white' }}>
        <div className="container text-center">
          <h1 style={{ color: 'white', marginBottom: '24px' }}>Our Services</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.85)', maxWidth: '800px', margin: '0 auto' }}>
            Comprehensive technology solutions designed to accelerate your digital transformation 
            and drive measurable business results.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="section">
        <div className="container">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="card mb-4" 
              style={{ padding: '48px' }}
            >
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                <div className="card-icon" style={{ flexShrink: 0 }}>
                  {service.icon}
                </div>
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <h2 className="mb-2">{service.title}</h2>
                  <p className="mb-3">{service.description}</p>
                  <h4 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Key Features:</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {service.features.map((feature, idx) => (
                      <li 
                        key={idx} 
                        style={{ 
                          marginBottom: '12px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px' 
                        }}
                      >
                        <CheckCircle size={20} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
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
              Need a Custom Solution?
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.15rem', marginBottom: '32px' }}>
              We specialize in creating tailored solutions that perfectly match your unique requirements.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/request-demo" className="btn btn-outline">Request Demo</a>
              <a href="/place-order" className="btn" style={{ background: 'white', color: 'var(--primary)' }}>
                Place Order
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
