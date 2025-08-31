import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavigationBar = ({ currentUser, userRole, onLogout }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setShowMobileMenu(false);
  };

  const handleNavClick = () => {
    setShowMobileMenu(false);
  };

  return (
    <>
      <nav className="navbar-modern">
        <div className="container">
          {/* Logo on the left */}
          <Link to="/" className="navbar-brand">
            <span className="logo-icon">🏥</span>
            <span className="logo-text">DoctorPatient</span>
          </Link>

          {/* Mobile toggle button */}
          <button 
            className="mobile-toggle"
            type="button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle navigation"
          >
            <span className={`hamburger ${showMobileMenu ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          {/* Navigation items */}
          <div className={`nav-menu ${showMobileMenu ? 'show' : ''}`}>
            <ul className="nav-list">
              {/* Home button - always visible */}
              <li className="nav-item">
                <Link 
                  to="/" 
                  className="nav-link"
                  onClick={handleNavClick}
                >
                  Home
                </Link>
              </li>

              {/* Conditional navigation based on user status */}
              {currentUser ? (
                <>
                  {/* User-specific dashboard link */}
                  <li className="nav-item">
                    <Link 
                      to={`/${userRole}`} 
                      className="nav-link"
                      onClick={handleNavClick}
                    >
                      Dashboard
                    </Link>
                  </li>
                  
                  {/* Logout button */}
                  <li className="nav-item">
                    <button 
                      className="btn-modern btn-logout"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                /* Login button for non-authenticated users */
                <li className="nav-item">
                  <Link 
                    to="/login" 
                    className="btn-modern btn-login"
                    onClick={handleNavClick}
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .navbar-modern {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1rem 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.75rem;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-icon {
          margin-right: 0.75rem;
          font-size: 2rem;
        }

        .logo-text {
          font-size: 1.75rem;
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          width: 24px;
          height: 20px;
          position: relative;
        }

        .hamburger span {
          width: 100%;
          height: 3px;
          background: var(--primary-color);
          border-radius: 2px;
          transition: all 0.3s ease;
          position: absolute;
        }

        .hamburger span:nth-child(1) {
          top: 0;
        }

        .hamburger span:nth-child(2) {
          top: 8px;
        }

        .hamburger span:nth-child(3) {
          top: 16px;
        }

        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg);
          top: 8px;
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg);
          top: 8px;
        }

        .nav-menu {
          display: flex;
          align-items: center;
        }

        .nav-list {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          padding: 0.5rem 1rem;
          border-radius: 8px;
        }

        .nav-link:hover {
          color: var(--text-primary);
          background: var(--surface-elevated);
        }

        .btn-login, .btn-logout {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .btn-logout {
          background: var(--danger-gradient);
        }

        .btn-logout:hover {
          background: linear-gradient(135deg, #e91e63 0%, #f50057 100%);
        }

        @media (max-width: 768px) {
          .mobile-toggle {
            display: block;
          }

          .nav-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--border-color);
            box-shadow: var(--shadow-lg);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
          }

          .nav-menu.show {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }

          .nav-list {
            flex-direction: column;
            padding: 1rem;
            gap: 1rem;
            align-items: stretch;
          }

          .nav-link, .btn-login, .btn-logout {
            display: block;
            text-align: center;
            padding: 0.75rem 1rem;
            border-radius: 8px;
          }

          .btn-login, .btn-logout {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default NavigationBar; 