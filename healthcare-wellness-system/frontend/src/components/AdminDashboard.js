import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import { FaUsers, FaCalendarAlt, FaCreditCard, FaChartLine, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalProviders: 0,
        totalAppointments: 0,
        totalPayments: 0
    });
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading data
        setTimeout(() => {
            setStats({
                totalPatients: 25,
                totalProviders: 8,
                totalAppointments: 45,
                totalPayments: 32
            });
            setRecentAppointments([
                {
                    id: 1,
                    patientName: 'John Doe',
                    providerName: 'Dr. Sarah Wilson',
                    date: '2024-01-15 10:00:00',
                    status: 'CONFIRMED'
                },
                {
                    id: 2,
                    patientName: 'Jane Smith',
                    providerName: 'Dr. Robert Brown',
                    date: '2024-01-16 14:30:00',
                    status: 'PENDING'
                },
                {
                    id: 3,
                    patientName: 'Mike Johnson',
                    providerName: 'Wellness Coach Lisa',
                    date: '2024-01-17 09:00:00',
                    status: 'COMPLETED'
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
                    <p>Loading admin dashboard...</p>
                </div>
            </Container>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <div className="healthcare-header bg-success text-white py-4">
                <Container>
                    <Row className="align-items-center">
                        <Col>
                            <h1 className="mb-0">
                                <FaChartLine className="me-2" />
                                Admin Dashboard
                            </h1>
                            <p className="mb-0">Welcome back, {user?.name}!</p>
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
                    <Col md={3} className="mb-3">
                        <Card className="healthcare-stats-card h-100">
                            <Card.Body className="text-center">
                                <FaUsers className="healthcare-icon mb-3" />
                                <h3 className="text-success">{stats.totalPatients}</h3>
                                <p className="mb-0">Total Patients</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="mb-3">
                        <Card className="healthcare-stats-card-blue h-100">
                            <Card.Body className="text-center">
                                <FaUsers className="healthcare-icon-blue mb-3" />
                                <h3 className="text-primary">{stats.totalProviders}</h3>
                                <p className="mb-0">Total Providers</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="mb-3">
                        <Card className="healthcare-stats-card-purple h-100">
                            <Card.Body className="text-center">
                                <FaCalendarAlt className="healthcare-icon-purple mb-3" />
                                <h3 className="text-purple">{stats.totalAppointments}</h3>
                                <p className="mb-0">Total Appointments</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="mb-3">
                        <Card className="healthcare-stats-card-orange h-100">
                            <Card.Body className="text-center">
                                <FaCreditCard className="healthcare-icon-orange mb-3" />
                                <h3 className="text-warning">{stats.totalPayments}</h3>
                                <p className="mb-0">Total Payments</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Quick Actions */}
                <Row className="mb-4">
                    <Col>
                        <Card>
                            <Card.Header className="bg-success text-white">
                                <h5 className="mb-0">Quick Actions</h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={3} className="mb-2">
                                        <Button variant="success" className="w-100">
                                            Add New Patient
                                        </Button>
                                    </Col>
                                    <Col md={3} className="mb-2">
                                        <Button variant="primary" className="w-100">
                                            Add New Provider
                                        </Button>
                                    </Col>
                                    <Col md={3} className="mb-2">
                                        <Button variant="info" className="w-100">
                                            View Reports
                                        </Button>
                                    </Col>
                                    <Col md={3} className="mb-2">
                                        <Button variant="warning" className="w-100">
                                            System Settings
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Recent Appointments */}
                <Row>
                    <Col>
                        <Card>
                            <Card.Header className="bg-success text-white">
                                <h5 className="mb-0">Recent Appointments</h5>
                            </Card.Header>
                            <Card.Body>
                                <Table responsive hover>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Patient</th>
                                            <th>Provider</th>
                                            <th>Date & Time</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentAppointments.map((appointment) => (
                                            <tr key={appointment.id}>
                                                <td>#{appointment.id}</td>
                                                <td>{appointment.patientName}</td>
                                                <td>{appointment.providerName}</td>
                                                <td>{new Date(appointment.date).toLocaleString()}</td>
                                                <td>{getStatusBadge(appointment.status)}</td>
                                                <td>
                                                    <Button size="sm" variant="outline-primary" className="me-1">
                                                        View
                                                    </Button>
                                                    <Button size="sm" variant="outline-success">
                                                        Edit
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

                {/* System Info */}
                <Row className="mt-4">
                    <Col>
                        <Alert variant="info">
                            <h6>System Information</h6>
                            <p className="mb-1">Database: MySQL 8.0</p>
                            <p className="mb-1">Backend: Spring Boot 3.2.0</p>
                            <p className="mb-1">Frontend: React 18.2.0</p>
                            <p className="mb-0">Last Updated: {new Date().toLocaleString()}</p>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AdminDashboard;
