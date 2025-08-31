import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    phone: '',
    address: '',
    dob: '',
    gender: '',
    specialization: '',
    profileImage: ''
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    // Role-specific validations
    if (formData.role === 'patient') {
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }
      if (!formData.dob) {
        newErrors.dob = 'Date of birth is required';
      }
      if (!formData.gender) {
        newErrors.gender = 'Gender is required';
      }
    }

    if (formData.role === 'doctor') {
      if (!formData.specialization.trim()) {
        newErrors.specialization = 'Specialization is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(u => u.email === formData.email);
    
    if (existingUser) {
      setAlertVariant('danger');
      setAlertMessage('An account with this email already exists.');
      setShowAlert(true);
      return;
    }

    // Create new user object based on role
    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone,
      profileImage: formData.profileImage || 'https://via.placeholder.com/150'
    };

    // Add role-specific fields
    if (formData.role === 'patient') {
      newUser.address = formData.address;
      newUser.dob = formData.dob;
      newUser.gender = formData.gender;
    }

    if (formData.role === 'doctor') {
      newUser.specialization = formData.specialization;
    }

    // Save user to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto-login the user
    onLogin(newUser, newUser.role);
    setAlertVariant('success');
    setAlertMessage('Account created successfully! Redirecting to dashboard...');
    setShowAlert(true);
    
    setTimeout(() => {
      navigate(`/${newUser.role}`);
    }, 1500);
  };

  return (
    <div className="main-content">
      <div className="signup-container">
        <div className="signup-wrapper">
          <div className="signup-card card-modern">
            <div className="card-body">
              <div className="signup-header">
                <div className="signup-icon">✨</div>
                <h2 className="signup-title">Create Account</h2>
                <p className="signup-subtitle">Join our healthcare community</p>
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
                  <label className="form-label">Role *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`form-select-modern ${errors.role ? 'is-invalid' : ''}`}
                  >
                    <option value="patient">👤 Patient</option>
                    <option value="doctor">👨‍⚕️ Doctor</option>
                  </select>
                  {errors.role && (
                    <div className="invalid-feedback">
                      {errors.role}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={`form-control-modern ${errors.name ? 'is-invalid' : ''}`}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">
                      {errors.name}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
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
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className={`form-control-modern ${errors.phone ? 'is-invalid' : ''}`}
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">
                      {errors.phone}
                    </div>
                  )}
                </div>

                {formData.role === 'patient' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Address *</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your address"
                        className={`form-control-modern ${errors.address ? 'is-invalid' : ''}`}
                        rows="3"
                      />
                      {errors.address && (
                        <div className="invalid-feedback">
                          {errors.address}
                        </div>
                      )}
                    </div>

                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label className="form-label">Date of Birth *</label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                          className={`form-control-modern ${errors.dob ? 'is-invalid' : ''}`}
                        />
                        {errors.dob && (
                          <div className="invalid-feedback">
                            {errors.dob}
                          </div>
                        )}
                      </div>

                      <div className="form-group col-md-6">
                        <label className="form-label">Gender *</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className={`form-select-modern ${errors.gender ? 'is-invalid' : ''}`}
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.gender && (
                          <div className="invalid-feedback">
                            {errors.gender}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {formData.role === 'doctor' && (
                  <div className="form-group">
                    <label className="form-label">Specialization *</label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className={`form-select-modern ${errors.specialization ? 'is-invalid' : ''}`}
                    >
                      <option value="">Select specialization</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Endocrinology">Endocrinology</option>
                      <option value="Gastroenterology">Gastroenterology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Oncology">Oncology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Psychiatry">Psychiatry</option>
                      <option value="Radiology">Radiology</option>
                      <option value="Surgery">Surgery</option>
                      <option value="Urology">Urology</option>
                    </select>
                    {errors.specialization && (
                      <div className="invalid-feedback">
                        {errors.specialization}
                      </div>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Password *</label>
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

                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className={`form-control-modern ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn-modern btn-signup"
                  >
                    ✨ Create Account
                  </button>
                </div>

                <div className="login-link">
                  <p>Already have an account? <a href="/login">Sign in here</a></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .signup-container {
          padding: 2rem 1rem;
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .signup-wrapper {
          width: 100%;
          max-width: 600px;
        }

        .signup-card {
          border-radius: 24px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .card-body {
          padding: 2rem;
        }

        .signup-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .signup-icon {
          font-size: 3rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }
        
        .signup-title {
          color: #1e293b;
          font-weight: 700;
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }
        
        .signup-subtitle {
          color: #64748b;
          font-size: 1rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .col-md-6 {
          flex: 1;
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

        .btn-signup {
          width: 100%;
          padding: 1rem;
          font-size: 1.1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-signup:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .login-link {
          text-align: center;
          margin-top: 1rem;
        }

        .login-link a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }

        .login-link a:hover {
          text-decoration: underline;
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
          .signup-container {
            padding: 1rem;
          }

          .card-body {
            padding: 1.5rem;
          }

          .signup-title {
            font-size: 1.5rem;
          }

          .form-row {
            flex-direction: column;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Signup;
