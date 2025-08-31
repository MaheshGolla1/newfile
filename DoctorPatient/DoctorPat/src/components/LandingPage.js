import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = ({ currentUser }) => {
  return (
    <div className="main-content">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Welcome to DoctorPatient
              </h1>
              <p className="hero-subtitle">
                Your trusted platform for managing doctor-patient appointments. 
                Book consultations, manage schedules, and stay connected with healthcare professionals.
              </p>
            </div>
            <div className="hero-visual">
              <div className="hero-icon">
                🏥
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">Why Choose DoctorPatient?</h2>
            <p className="features-subtitle">
              Streamlined appointment management for patients, doctors, and administrators
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card card-modern">
              <div className="feature-content">
                <div className="feature-icon">👨‍⚕️</div>
                <h3 className="feature-title">For Doctors</h3>
                <p className="feature-text">
                  Manage your schedule, set availability, and view patient appointments 
                  all in one place. Streamline your practice management.
                </p>
              </div>
            </div>

            <div className="feature-card card-modern">
              <div className="feature-content">
                <div className="feature-icon">👤</div>
                <h3 className="feature-title">For Patients</h3>
                <p className="feature-text">
                  Easily book appointments with your preferred doctors, 
                  view your medical history, and manage your wellness journey.
                </p>
              </div>
            </div>

            <div className="feature-card card-modern">
              <div className="feature-content">
                <div className="feature-icon">⚙️</div>
                <h3 className="feature-title">For Administrators</h3>
                <p className="feature-text">
                  Monitor system activity, manage user accounts, and 
                  oversee all appointments across the platform.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action - Only show when user is NOT logged in */}
          {!currentUser && (
            <div className="cta-section">
              <h3 className="cta-title">Ready to Get Started?</h3>
              <div className="cta-buttons">
                <Link 
                  to="/login" 
                  className="btn-modern btn-cta"
                >
                  🔑 Login Now
                </Link>
                <Link 
                  to="/signup" 
                  className="btn-modern btn-cta-secondary"
                >
                  ✨ Create Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
          padding: 5rem 0;
          color: white;
        }
        
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 1;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
        }

        .hero-text {
          text-align: left;
        }
        
        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }
        
        .hero-subtitle {
          font-size: 1.25rem;
          opacity: 0.95;
          font-weight: 400;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        
        .hero-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-hero-primary {
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .btn-hero-secondary {
          background: var(--secondary-gradient);
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
        }
        
        .hero-visual {
          text-align: center;
        }
        
        .hero-icon {
          font-size: 8rem;
          opacity: 0.8;
        }

        .features-section {
          padding: 5rem 0;
          background: #f8fafc;
        }

        .features-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        .features-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        
        .features-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }
        
        .features-subtitle {
          font-size: 1.125rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }
        
        .feature-card {
          transition: all 0.3s ease;
          height: 100%;
        }
        
        .feature-card:hover {
          transform: translateY(-8px);
        }

        .feature-content {
          padding: 2rem;
          text-align: center;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .feature-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }
        
        .feature-title {
          color: #1e293b;
          font-weight: 600;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .feature-text {
          color: #64748b;
          line-height: 1.6;
          flex-grow: 1;
        }

        .cta-section {
          text-align: center;
        }
        
        .cta-title {
          font-size: 2rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 2rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-cta {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .btn-cta-secondary {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .btn-cta-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(79, 172, 254, 0.3);
          color: white;
          text-decoration: none;
        }
        
        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2rem;
          }

          .hero-text {
            text-align: center;
          }
          
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-icon {
            font-size: 6rem;
          }
          
          .features-title {
            font-size: 2rem;
          }

          .hero-container,
          .features-container {
            padding: 0 1rem;
          }

          .hero-section,
          .features-section {
            padding: 3rem 0;
          }
        }
        
        @media (max-width: 576px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-icon {
            font-size: 5rem;
          }
          
          .features-title {
            font-size: 1.75rem;
          }

          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn-hero-primary,
          .btn-hero-secondary {
            width: 100%;
            max-width: 300px;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn-cta,
          .btn-cta-secondary {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage; 