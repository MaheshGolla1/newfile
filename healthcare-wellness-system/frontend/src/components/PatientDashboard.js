import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaCalendarAlt, FaUserMd, FaChartLine, FaBell } from 'react-icons/fa';

const PatientDashboard = () => {
  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">Patient Dashboard</h2>
        </Col>
      </Row>
      
      <Row>
        <Col lg={3} md={6} className="mb-4">
          <Card className="healthcare-stats-card bounce-in">
            <Card.Body className="text-center">
              <FaCalendarAlt className="mb-3" style={{ fontSize: '2rem' }} />
              <h3>5</h3>
              <p>Upcoming Appointments</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6} className="mb-4">
          <Card className="healthcare-stats-card-blue slide-in-left">
            <Card.Body className="text-center">
              <FaUserMd className="mb-3" style={{ fontSize: '2rem' }} />
              <h3>3</h3>
              <p>Active Providers</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6} className="mb-4">
          <Card className="healthcare-stats-card-purple slide-in-right">
            <Card.Body className="text-center">
              <FaChartLine className="mb-3" style={{ fontSize: '2rem' }} />
              <h3>75%</h3>
              <p>Wellness Progress</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6} className="mb-4">
          <Card className="healthcare-stats-card-orange fade-in">
            <Card.Body className="text-center">
              <FaBell className="mb-3" style={{ fontSize: '2rem' }} />
              <h3>2</h3>
              <p>Notifications</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col lg={8}>
          <Card className="healthcare-dashboard">
            <Card.Header>
              <h5>Recent Appointments</h5>
            </Card.Header>
            <Card.Body>
              <p>No recent appointments to display.</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="healthcare-dashboard">
            <Card.Header>
              <h5>Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <p>Quick action buttons will be added here.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PatientDashboard;
