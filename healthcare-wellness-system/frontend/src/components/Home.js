import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaHeartbeat, 
  FaUserMd, 
  FaCalendarCheck, 
  FaChartLine, 
  FaShieldAlt, 
  FaUsers,
  FaStethoscope,
  FaDumbbell,
  FaBrain,
  FaLeaf
} from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <FaCalendarCheck className="healthcare-icon" />,
      title: "Easy Appointment Booking",
      description: "Book appointments with healthcare providers quickly and easily through our intuitive interface."
    },
    {
      icon: <FaUserMd className="healthcare-icon" />,
      title: "Expert Healthcare Providers",
      description: "Connect with qualified doctors, specialists, and wellness professionals."
    },
    {
      icon: <FaChartLine className="healthcare-icon" />,
      title: "Health Tracking",
      description: "Monitor your health progress and track wellness program participation."
    },
    {
      icon: <FaShieldAlt className="healthcare-icon" />,
      title: "Secure & Private",
      description: "Your health information is protected with industry-standard security measures."
    }
  ];

  const services = [
    {
      icon: <FaStethoscope />,
      title: "Medical Consultations",
      description: "Professional medical consultations with experienced doctors"
    },
    {
      icon: <FaDumbbell />,
      title: "Fitness Programs",
      description: "Personalized fitness and wellness programs"
    },
    {
      icon: <FaBrain />,
      title: "Mental Health",
      description: "Mental health and wellness counseling services"
    },
    {
      icon: <FaLeaf />,
      title: "Nutrition Guidance",
      description: "Expert nutrition advice and meal planning"
    }
  ];

  return (
    <div className="min-vh-100">
      {/* Hero Section */}
      <div className="healthcare-welcome">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1>Welcome to Healthcare & Wellness Management</h1>
              <p className="mb-4">
                Your comprehensive platform for managing health appointments, wellness programs, 
                and connecting with healthcare providers. Take control of your health journey today.
              </p>
              {!isAuthenticated && (
                <div className="d-flex gap-3 justify-content-center">
                  <Button as={Link} to="/register" size="lg" className="healthcare-btn-success">
                    Get Started
                  </Button>
                  <Button as={Link} to="/login" size="lg" className="healthcare-btn-outline-primary">
                    Sign In
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <h2 className="mb-4">Why Choose Our Platform?</h2>
            <p className="text-muted">
              We provide a comprehensive healthcare management solution designed to make your health journey easier and more effective.
            </p>
          </Col>
        </Row>
        
        <Row>
          {features.map((feature, index) => (
            <Col key={index} lg={3} md={6} className="mb-4">
              <Card className="healthcare-service-card h-100">
                <Card.Body className="text-center">
                  {feature.icon}
                  <Card.Title className="mt-3">{feature.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {feature.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Services Section */}
      <div className="py-5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <h2 className="mb-4">Our Services</h2>
              <p className="text-muted">
                Comprehensive healthcare and wellness services tailored to your needs.
              </p>
            </Col>
          </Row>
          
          <Row>
            {services.map((service, index) => (
              <Col key={index} lg={3} md={6} className="mb-4">
                <Card className="healthcare-service-card h-100">
                  <Card.Body className="text-center">
                    <div className="healthcare-icon">
                      {service.icon}
                    </div>
                    <Card.Title className="mt-3">{service.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {service.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Stats Section */}
      <Container className="py-5">
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <h2 className="mb-4">Our Impact</h2>
            <p className="text-muted">
              Trusted by thousands of patients and healthcare providers.
            </p>
          </Col>
        </Row>
        
        <Row>
          <Col lg={3} md={6} className="mb-4">
            <div className="healthcare-stats-card">
              <FaUsers className="mb-3" style={{ fontSize: '3rem' }} />
              <h3>10,000+</h3>
              <p>Happy Patients</p>
            </div>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <div className="healthcare-stats-card">
              <FaUserMd className="mb-3" style={{ fontSize: '3rem' }} />
              <h3>500+</h3>
              <p>Healthcare Providers</p>
            </div>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <div className="healthcare-stats-card">
              <FaCalendarCheck className="mb-3" style={{ fontSize: '3rem' }} />
              <h3>50,000+</h3>
              <p>Appointments</p>
            </div>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <div className="healthcare-stats-card">
              <FaHeartbeat className="mb-3" style={{ fontSize: '3rem' }} />
              <h3>100+</h3>
              <p>Wellness Programs</p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* CTA Section */}
      <div className="py-5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2 className="mb-4">Ready to Start Your Health Journey?</h2>
              <p className="mb-4">
                Join thousands of patients who have already improved their health and wellness with our platform.
              </p>
              {!isAuthenticated && (
                <Button as={Link} to="/register" size="lg" className="healthcare-btn-primary">
                  Get Started Today
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;
