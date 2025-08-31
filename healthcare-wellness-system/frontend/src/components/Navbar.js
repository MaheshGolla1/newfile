import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaHeartbeat, FaHome, FaCalendarAlt, FaCog } from 'react-icons/fa';

const NavigationBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'PATIENT':
        return 'Patient';
      case 'PROVIDER':
        return 'Healthcare Provider';
      case 'ADMIN':
        return 'Administrator';
      default:
        return 'User';
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="healthcare-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <FaHeartbeat className="text-success me-2" style={{ color: '#28a745' }} />
          <span className="fw-bold text-success">Healthcare & Wellness</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="d-flex align-items-center">
              <FaHome className="me-1" />
              Home
            </Nav.Link>
            
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/dashboard" className="d-flex align-items-center">
                  <FaCog className="me-1" />
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/appointments" className="d-flex align-items-center">
                  <FaCalendarAlt className="me-1" />
                  Appointments
                </Nav.Link>
                <Nav.Link as={Link} to="/services" className="d-flex align-items-center">
                  <FaHeartbeat className="me-1" />
                  Services
                </Nav.Link>
              </>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-primary" id="dropdown-basic" className="d-flex align-items-center">
                  <FaUser className="me-1" />
                  {user?.name || 'User'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Header>
                    <div className="text-muted small">Signed in as</div>
                    <div className="fw-bold">{user?.email}</div>
                    <div className="text-primary small">{getRoleDisplayName(user?.role)}</div>
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/profile">
                    <FaCog className="me-2" />
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="d-flex gap-2">
                <Button as={Link} to="/login" variant="outline-success" className="healthcare-btn-outline-primary">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="success" className="healthcare-btn-success">
                  Register
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
