import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import { FaCalendarAlt, FaUsers, FaStethoscope, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProviderDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading data
        setTimeout(() => {
            setAppointments([
                {
                    id: 1,
                    patientName: 'John Doe',
                    date: '2024-01-15 10:00:00',
                    status: 'CONFIRMED',
                    notes: 'Regular checkup'
                },
                {
                    id: 2,
                    patientName: 'Jane Smith',
                    date: '2024-01-16 14:30:00',
                    status: 'PENDING',
                    notes: 'Follow-up consultation'
                },
                {
                    id: 3,
                    patientName: 'Mike Johnson',
                    date: '2024-01-17 09:00:00',
                    status: 'COMPLETED',
                    notes: 'Wellness assessment'
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getStatusBadge = (status) => {
        const variants = {
            'CONFIRMED': 'success',
            'PENDING': 'warning',
            'COMPLETED': 'info',
            'CANCELLED': 'danger'
        };
        return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
    };

    if (loading) {
        return (
            <Container className="mt-5">
                <div className="text-center">
                    <div className="healthcare-spinner"></div>
                    <p>Loading provider dashboard...</p>
                </div>
            </Container>
        );
    }

    return (
        <div className="provider-dashboard">
            {/* Header */}
            <div className="healthcare-header bg-primary text-white py-4">
                <Container>
                    <Row className="align-items-center">
                        <Col>
                            <h1 className="mb-0">
                                <FaStethoscope className="me-2" />
                                Provider Dashboard
                            </h1>
                            <p className="mb-0">Welcome back, {user?.name}!</p>
                            <small>Role: {user?.role}</small>
                        </Col>
                        <Col xs="auto">
                            <Button variant="outline-light" onClick={handleLogout}>
                                <FaSignOutAlt className="me-2" />
                                Logout
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container className="mt-4">
                {/* Stats Cards */}
                <Row className="mb-4">
                    <Col md={4} className="mb-3">
                        <Card className="healthcare-stats-card h-100">
                            <Card.Body className="text-center">
                                <FaCalendarAlt className="healthcare-icon mb-3" />
                                <h3 className="text-success">{appointments.length}</h3>
                                <p className="mb-0">Total Appointments</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card className="healthcare-stats-card-blue h-100">
                            <Card.Body className="text-center">
                                <FaUsers className="healthcare-icon-blue mb-3" />
                                <h3 className="text-primary">
                                    {appointments.filter(a => a.status === 'CONFIRMED').length}
                                </h3>
                                <p className="mb-0">Confirmed Today</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card className="healthcare-stats-card-purple h-100">
                            <Card.Body className="text-center">
                                <FaStethoscope className="healthcare-icon-purple mb-3" />
                                <h3 className="text-purple">
                                    {appointments.filter(a => a.status === 'COMPLETED').length}
                                </h3>
                                <p className="mb-0">Completed Today</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Quick Actions */}
                <Row className="mb-4">
                    <Col>
                        <Card>
                            <Card.Header className="bg-primary text-white">
                                <h5 className="mb-0">Quick Actions</h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={3} className="mb-2">
                                        <Button variant="primary" className="w-100">
                                            View Schedule
                                        </Button>
                                    </Col>
                                    <Col md={3} className="mb-2">
                                        <Button variant="success" className="w-100">
                                            Add Notes
                                        </Button>
                                    </Col>
                                    <Col md={3} className="mb-2">
                                        <Button variant="info" className="w-100">
                                            Patient Records
                                        </Button>
                                    </Col>
                                    <Col md={3} className="mb-2">
                                        <Button variant="warning" className="w-100">
                                            Update Profile
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Appointments */}
                <Row>
                    <Col>
                        <Card>
                            <Card.Header className="bg-primary text-white">
                                <h5 className="mb-0">Today's Appointments</h5>
                            </Card.Header>
                            <Card.Body>
                                <Table responsive hover>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Patient</th>
                                            <th>Date & Time</th>
                                            <th>Status</th>
                                            <th>Notes</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map((appointment) => (
                                            <tr key={appointment.id}>
                                                <td>#{appointment.id}</td>
                                                <td>{appointment.patientName}</td>
                                                <td>{new Date(appointment.date).toLocaleString()}</td>
                                                <td>{getStatusBadge(appointment.status)}</td>
                                                <td>{appointment.notes}</td>
                                                <td>
                                                    <Button size="sm" variant="outline-primary" className="me-1">
                                                        View
                                                    </Button>
                                                    <Button size="sm" variant="outline-success">
                                                        Update
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Provider Info */}
                <Row className="mt-4">
                    <Col>
                        <Alert variant="info">
                            <h6>Provider Information</h6>
                            <p className="mb-1">Name: {user?.name}</p>
                            <p className="mb-1">Email: {user?.email}</p>
                            <p className="mb-1">Specialization: {user?.specialization || 'Not specified'}</p>
                            <p className="mb-0">Last Updated: {new Date().toLocaleString()}</p>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProviderDashboard;
