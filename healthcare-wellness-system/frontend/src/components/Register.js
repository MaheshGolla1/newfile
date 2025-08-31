import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { FaHeartbeat } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        dob: '',
        gender: '',
        role: 'PATIENT', // Default role
        specialization: '' // For providers only
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const isProvider = formData.role === 'DOCTOR' || formData.role === 'WELLNESS_PROVIDER' || formData.role === 'ADMIN';

    return (
        <Container className="mt-5">
            <div className="text-center fade-in">
                <FaHeartbeat size={64} color="#28a745" />
                <h2 className="mt-3 text-success">Create Your Account</h2>
                <p className="text-muted">Join our healthcare wellness community</p>
            </div>

            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow">
                        <Card.Body className="p-4">
                            {error && <Alert variant="danger">{error}</Alert>}
                            
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Full Name *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="healthcare-input"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email *</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="healthcare-input"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Password *</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                minLength={6}
                                                className="healthcare-input"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Phone</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="healthcare-input"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Role *</Form.Label>
                                    <Form.Select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required
                                        className="healthcare-input"
                                    >
                                        <option value="PATIENT">Patient</option>
                                        <option value="DOCTOR">Doctor</option>
                                        <option value="WELLNESS_PROVIDER">Wellness Provider</option>
                                        <option value="ADMIN">Admin</option>
                                    </Form.Select>
                                </Form.Group>

                                {isProvider && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Specialization</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="specialization"
                                            value={formData.specialization}
                                            onChange={handleChange}
                                            placeholder="e.g., Cardiology, Nutrition, etc."
                                            className="healthcare-input"
                                        />
                                    </Form.Group>
                                )}

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Date of Birth</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleChange}
                                                className="healthcare-input"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Gender</Form.Label>
                                            <Form.Select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className="healthcare-input"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter your address"
                                        className="healthcare-input"
                                    />
                                </Form.Group>

                                <Button
                                    type="submit"
                                    variant="success"
                                    className="w-100 healthcare-btn-success"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="healthcare-spinner me-2"></span>
                                            Creating Account...
                                        </>
                                    ) : (
                                        'Create Account'
                                    )}
                                </Button>
                            </Form>

                            <div className="text-center mt-3">
                                <p className="mb-0">
                                    Already have an account?{' '}
                                    <Button
                                        variant="link"
                                        className="p-0 text-success"
                                        onClick={() => navigate('/login')}
                                    >
                                        Sign In
                                    </Button>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
