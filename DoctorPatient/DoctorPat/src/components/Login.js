import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient'
  });
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('danger');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user with matching credentials
    const user = users.find(u => 
      u.email === formData.email && 
      u.password === formData.password && 
      u.role === formData.role
    );

    if (user) {
      // Success - login user
      onLogin(user, user.role);
      setAlertVariant('success');
      setAlertMessage('Login successful! Redirecting...');
      setShowAlert(true);
      
      // Redirect after short delay
      setTimeout(() => {
        navigate(`/${user.role}`);
      }, 1000);
    } else {
      // Failed login
      setAlertVariant('danger');
      setAlertMessage('Invalid credentials. Please check your email, password, and role selection.');
      setShowAlert(true);
    }
  };



  return (
    <div className="main-content">
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-card card-modern">
            <div className="card-body">
              <div className="login-header">
                <div className="login-icon">🔐</div>
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Sign in to your account</p>
              </div>

              {showAlert && (
                <div className={`alert alert-${alertVariant}`} role="alert">
                  {alertMessage}
                  <button 
                    type="button" 
                    className="alert-close" 
                    onClick={() => setShowAlert(false)}
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`form-select-modern ${errors.role ? 'is-invalid' : ''}`}
                  >
                    <option value="patient">👤 Patient</option>
                    <option value="doctor">👨‍⚕️ Doctor</option>
                    <option value="admin">⚙️ Admin</option>
                  </select>
                  {errors.role && (
                    <div className="invalid-feedback">
                      {errors.role}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className={`form-control-modern ${errors.email ? 'is-invalid' : ''}`}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className={`form-control-modern ${errors.password ? 'is-invalid' : ''}`}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn-modern btn-login"
                  >
                    🔑 Sign In
                  </button>
                </div>

                <div className="demo-credentials">
                  <p className="demo-title">Demo Credentials:</p>
                  <div className="credential-item">
                    <strong>Admin:</strong> admin@doctorpat.com / admin123
                  </div>
                  <div className="credential-item">
                    <strong>Doctor:</strong> john.smith@doctor.com / password123
                  </div>
                  <div className="credential-item">
                    <strong>Patient:</strong> Use any email/password to create account
                  </div>
                </div>

                <div className="divider"></div>
                
                <div className="register-section">
                  <p className="register-text">Don't have an account?</p>
                  <Link to="/signup" className="btn-modern btn-register">
                    ✨ Create New Account
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          padding: 2rem 1rem;
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-wrapper {
          width: 100%;
          max-width: 450px;
        }

        .login-card {
          border-radius: 24px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .card-body {
          padding: 2rem;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .login-icon {
          font-size: 3rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }
        
        .login-title {
          color: #1e293b;
          font-weight: 700;
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }
        
        .login-subtitle {
          color: #64748b;
          font-size: 1rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          display: block;
        }
        
        .form-control-modern,
        .form-select-modern {
          width: 100%;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 16px;
          transition: all 0.3s ease;
          background: #ffffff;
          font-size: 1rem;
        }
        
        .form-control-modern:focus,
        .form-select-modern:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          outline: none;
        }
        
        .form-control-modern.is-invalid,
        .form-select-modern.is-invalid {
          border-color: #fa709a;
        }
        
        .invalid-feedback {
          color: #fa709a;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .form-actions {
          margin-bottom: 1.5rem;
        }

        .btn-login {
          width: 100%;
          padding: 1rem;
          font-size: 1.1rem;
        }

        .demo-credentials {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .demo-title {
          color: #64748b;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }

        .credential-item {
          color: #64748b;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .divider {
          height: 1px;
          background: #e2e8f0;
          margin: 1.5rem 0;
        }

        .register-section {
          text-align: center;
        }

        .register-text {
          color: #64748b;
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
        }

        .btn-register {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.75rem 1.5rem;
          font-size: 0.9rem;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          display: inline-block;
          transition: all 0.3s ease;
        }

        .btn-register:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
          color: white;
          text-decoration: none;
        }
        
        .alert {
          border: none;
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 1.5rem;
          position: relative;
        }
        
        .alert-success {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
        }
        
        .alert-danger {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
          color: white;
        }
        
        .alert-close {
          position: absolute;
          top: 8px;
          right: 12px;
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }

        @media (max-width: 576px) {
          .login-container {
            padding: 1rem;
          }

          .card-body {
            padding: 1.5rem;
          }

          .login-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login; 