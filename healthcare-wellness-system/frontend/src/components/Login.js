import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSignInAlt, FaEnvelope, FaLock, FaHeartbeat } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('danger');

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setShowAlert(false);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setAlertMessage(error.response?.data?.message || 'Login failed. Please try again.');
      setAlertVariant('danger');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5} xl={4}>
          <div className="text-center mb-4 fade-in">
            <FaHeartbeat className="healthcare-icon" style={{ fontSize: '4rem', color: '#28a745' }} />
            <h2 className="mt-3 text-success">Welcome Back</h2>
            <p className="text-muted">Sign in to your Healthcare & Wellness account</p>
          </div>

          <Card className="healthcare-form">
            <Card.Body>
              {showAlert && (
                <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
                  {alertMessage}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaEnvelope className="me-2" />
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`healthcare-input ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaLock className="me-2" />
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`healthcare-input ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Button
                  type="submit"
                  variant="success"
                  className="w-100 healthcare-btn-success mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="healthcare-spinner me-2" style={{ display: 'inline-block', width: '16px', height: '16px' }}></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <FaSignInAlt className="me-2" />
                      Sign In
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary text-decoration-none">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <small className="text-muted">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
