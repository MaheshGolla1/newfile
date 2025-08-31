import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Alert, Nav, Tab, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [personalData, setPersonalData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });
  const [medicalData, setMedicalData] = useState({
    bloodType: '',
    allergies: '',
    medications: '',
    conditions: '',
    height: '',
    weight: ''
  });
  const [accountData, setAccountData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      // Load user data - in a real app, this would come from an API
      setPersonalData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        address: user.address || '',
        emergencyContact: {
          name: user.emergencyContact?.name || '',
          phone: user.emergencyContact?.phone || '',
          relationship: user.emergencyContact?.relationship || ''
        }
      });
    }
  }, [user]);

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data
      const updatedUser = { ...user, ...personalData };
      updateUser(updatedUser);
      
      setIsEditing(false);
      toast.success('Personal information updated successfully!');
    } catch (error) {
      toast.error('Failed to update personal information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMedicalSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Medical information updated successfully!');
    } catch (error) {
      toast.error('Failed to update medical information');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (accountData.newPassword !== accountData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (accountData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAccountData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const variants = {
      'ADMIN': 'danger',
      'PROVIDER': 'primary',
      'PATIENT': 'info'
    };
    return <Badge bg={variants[role] || 'secondary'}>{role}</Badge>;
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h2>Profile Settings</h2>
        <p className="text-muted">Manage your account information and preferences</p>
      </div>

      <Row>
        <Col lg={3} md={4}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <div className="mb-3">
                <div 
                  className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto"
                  style={{ width: '100px', height: '100px' }}
                >
                  <span className="text-white h3 mb-0">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              <h5>{user?.name || 'User'}</h5>
              <p className="text-muted mb-2">{user?.email}</p>
              {getRoleBadge(user?.role)}
              
              <div className="mt-3">
                <small className="text-muted">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </small>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h6>Quick Stats</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Appointments</span>
                <Badge bg="primary">12</Badge>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Services Used</span>
                <Badge bg="success">5</Badge>
              </div>
              <div className="d-flex justify-content-between">
                <span>Health Score</span>
                <Badge bg="info">85%</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9} md={8}>
          <Card>
            <Card.Header>
              <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Nav.Item>
                  <Nav.Link eventKey="personal">Personal Information</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="medical">Medical Information</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="account">Account Settings</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              <Tab.Content>
                <Tab.Pane active={activeTab === 'personal'}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Personal Information</h5>
                    <Button
                      variant={isEditing ? "secondary" : "primary"}
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>

                  <Form onSubmit={handlePersonalSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={personalData.name}
                            onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
                            disabled={!isEditing}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={personalData.email}
                            onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                            disabled={!isEditing}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            value={personalData.phone}
                            onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date of Birth</Form.Label>
                          <Form.Control
                            type="date"
                            value={personalData.dateOfBirth}
                            onChange={(e) => setPersonalData({ ...personalData, dateOfBirth: e.target.value })}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Gender</Form.Label>
                          <Form.Select
                            value={personalData.gender}
                            onChange={(e) => setPersonalData({ ...personalData, gender: e.target.value })}
                            disabled={!isEditing}
                          >
                            <option value="">Select Gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                            <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={personalData.address}
                        onChange={(e) => setPersonalData({ ...personalData, address: e.target.value })}
                        disabled={!isEditing}
                      />
                    </Form.Group>

                    <h6 className="mt-4 mb-3">Emergency Contact</h6>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={personalData.emergencyContact.name}
                            onChange={(e) => setPersonalData({
                              ...personalData,
                              emergencyContact: { ...personalData.emergencyContact, name: e.target.value }
                            })}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            type="tel"
                            value={personalData.emergencyContact.phone}
                            onChange={(e) => setPersonalData({
                              ...personalData,
                              emergencyContact: { ...personalData.emergencyContact, phone: e.target.value }
                            })}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Relationship</Form.Label>
                          <Form.Control
                            type="text"
                            value={personalData.emergencyContact.relationship}
                            onChange={(e) => setPersonalData({
                              ...personalData,
                              emergencyContact: { ...personalData.emergencyContact, relationship: e.target.value }
                            })}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {isEditing && (
                      <div className="d-flex justify-content-end">
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    )}
                  </Form>
                </Tab.Pane>

                <Tab.Pane active={activeTab === 'medical'}>
                  <h5 className="mb-3">Medical Information</h5>
                  <Alert variant="info">
                    <i className="fas fa-info-circle me-2"></i>
                    This information helps healthcare providers provide better care. All data is kept confidential and secure.
                  </Alert>

                  <Form onSubmit={handleMedicalSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Blood Type</Form.Label>
                          <Form.Select
                            value={medicalData.bloodType}
                            onChange={(e) => setMedicalData({ ...medicalData, bloodType: e.target.value })}
                          >
                            <option value="">Select Blood Type</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Height (cm)</Form.Label>
                          <Form.Control
                            type="number"
                            value={medicalData.height}
                            onChange={(e) => setMedicalData({ ...medicalData, height: e.target.value })}
                            placeholder="e.g., 170"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Weight (kg)</Form.Label>
                          <Form.Control
                            type="number"
                            value={medicalData.weight}
                            onChange={(e) => setMedicalData({ ...medicalData, weight: e.target.value })}
                            placeholder="e.g., 70"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Allergies</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={medicalData.allergies}
                        onChange={(e) => setMedicalData({ ...medicalData, allergies: e.target.value })}
                        placeholder="List any allergies (e.g., peanuts, penicillin, latex)"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Current Medications</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={medicalData.medications}
                        onChange={(e) => setMedicalData({ ...medicalData, medications: e.target.value })}
                        placeholder="List current medications and dosages"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Medical Conditions</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={medicalData.conditions}
                        onChange={(e) => setMedicalData({ ...medicalData, conditions: e.target.value })}
                        placeholder="List any chronic conditions or medical history"
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Saving...' : 'Save Medical Information'}
                      </Button>
                    </div>
                  </Form>
                </Tab.Pane>

                <Tab.Pane active={activeTab === 'account'}>
                  <h5 className="mb-3">Account Settings</h5>
                  
                  <Form onSubmit={handlePasswordChange}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Current Password</Form.Label>
                          <Form.Control
                            type="password"
                            value={accountData.currentPassword}
                            onChange={(e) => setAccountData({ ...accountData, currentPassword: e.target.value })}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>New Password</Form.Label>
                          <Form.Control
                            type="password"
                            value={accountData.newPassword}
                            onChange={(e) => setAccountData({ ...accountData, newPassword: e.target.value })}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Confirm New Password</Form.Label>
                          <Form.Control
                            type="password"
                            value={accountData.confirmPassword}
                            onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Changing...' : 'Change Password'}
                      </Button>
                    </div>
                  </Form>

                  <hr className="my-4" />

                  <h6>Account Actions</h6>
                  <div className="d-flex gap-2">
                    <Button variant="outline-warning" size="sm">
                      <i className="fas fa-download me-2"></i>
                      Export Data
                    </Button>
                    <Button variant="outline-danger" size="sm">
                      <i className="fas fa-trash me-2"></i>
                      Delete Account
                    </Button>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
