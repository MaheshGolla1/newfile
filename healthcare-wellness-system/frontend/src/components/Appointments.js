import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    serviceId: '',
    providerId: '',
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchServices();
    fetchProviders();
  }, []);

  const fetchAppointments = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockAppointments = [
        {
          id: 1,
          serviceName: 'Physical Therapy',
          providerName: 'Dr. Jane Smith',
          date: '2024-01-15',
          time: '10:00 AM',
          status: 'CONFIRMED',
          notes: 'Follow-up session for back pain'
        },
        {
          id: 2,
          serviceName: 'Massage Therapy',
          providerName: 'Dr. Mike Wilson',
          date: '2024-01-20',
          time: '2:00 PM',
          status: 'PENDING',
          notes: 'Relaxation massage'
        },
        {
          id: 3,
          serviceName: 'Nutrition Consultation',
          providerName: 'Dr. Sarah Johnson',
          date: '2024-01-18',
          time: '11:00 AM',
          status: 'COMPLETED',
          notes: 'Diet plan review'
        }
      ];
      setAppointments(mockAppointments);
    } catch (error) {
      toast.error('Failed to fetch appointments');
    }
  };

  const fetchServices = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockServices = [
        {
          id: 1,
          name: 'Physical Therapy',
          description: 'Comprehensive physical therapy sessions',
          duration: '60 minutes',
          price: 120,
          category: 'THERAPY'
        },
        {
          id: 2,
          name: 'Massage Therapy',
          description: 'Relaxing massage therapy',
          duration: '45 minutes',
          price: 80,
          category: 'MASSAGE'
        },
        {
          id: 3,
          name: 'Nutrition Consultation',
          description: 'Personalized nutrition planning',
          duration: '30 minutes',
          price: 60,
          category: 'NUTRITION'
        }
      ];
      setServices(mockServices);
    } catch (error) {
      toast.error('Failed to fetch services');
    }
  };

  const fetchProviders = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockProviders = [
        {
          id: 1,
          name: 'Dr. Jane Smith',
          specialization: 'Physical Therapy',
          rating: 4.8
        },
        {
          id: 2,
          name: 'Dr. Mike Wilson',
          specialization: 'Massage Therapy',
          rating: 4.6
        },
        {
          id: 3,
          name: 'Dr. Sarah Johnson',
          specialization: 'Nutrition',
          rating: 4.9
        }
      ];
      setProviders(mockProviders);
    } catch (error) {
      toast.error('Failed to fetch providers');
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedService = services.find(s => s.id === parseInt(bookingData.serviceId));
      const selectedProvider = providers.find(p => p.id === parseInt(bookingData.providerId));
      
      const newAppointment = {
        id: Date.now(),
        serviceName: selectedService.name,
        providerName: selectedProvider.name,
        date: bookingData.date,
        time: bookingData.time,
        status: 'PENDING',
        notes: bookingData.notes
      };
      
      setAppointments([...appointments, newAppointment]);
      setShowBookingModal(false);
      setBookingData({ serviceId: '', providerId: '', date: '', time: '', notes: '' });
      toast.success('Appointment booked successfully!');
    } catch (error) {
      toast.error('Failed to book appointment');
    }
  };

  const cancelAppointment = (appointmentId) => {
    setAppointments(appointments.map(appointment =>
      appointment.id === appointmentId ? { ...appointment, status: 'CANCELLED' } : appointment
    ));
    toast.success('Appointment cancelled successfully');
  };

  const rescheduleAppointment = (appointmentId) => {
    // For now, just show a toast - in a real app, this would open a reschedule modal
    toast.info('Reschedule functionality would open a modal here');
  };

  const getStatusBadge = (status) => {
    const variants = {
      'CONFIRMED': 'success',
      'PENDING': 'warning',
      'CANCELLED': 'danger',
      'COMPLETED': 'info'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getAvailableTimes = () => {
    return [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
      '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
    ];
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>My Appointments</h2>
          <p className="text-muted">Manage your healthcare appointments</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowBookingModal(true)}
        >
          Book New Appointment
        </Button>
      </div>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Appointment History</h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Provider</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(appointment => (
                    <tr key={appointment.id}>
                      <td>{appointment.serviceName}</td>
                      <td>{appointment.providerName}</td>
                      <td>{appointment.date}</td>
                      <td>{appointment.time}</td>
                      <td>{getStatusBadge(appointment.status)}</td>
                      <td>
                        <small className="text-muted">
                          {appointment.notes || 'No notes'}
                        </small>
                      </td>
                      <td>
                        {appointment.status === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline-warning"
                              onClick={() => rescheduleAppointment(appointment.id)}
                              className="me-1"
                            >
                              Reschedule
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => cancelAppointment(appointment.id)}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {appointment.status === 'CONFIRMED' && (
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => cancelAppointment(appointment.id)}
                          >
                            Cancel
                          </Button>
                        )}
                        {appointment.status === 'COMPLETED' && (
                          <Button
                            size="sm"
                            variant="outline-primary"
                          >
                            View Details
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Book New Appointment</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleBookingSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Service</Form.Label>
                  <Form.Select
                    value={bookingData.serviceId}
                    onChange={(e) => setBookingData({ ...bookingData, serviceId: e.target.value })}
                    required
                  >
                    <option value="">Choose a service...</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} - ${service.price} ({service.duration})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Provider</Form.Label>
                  <Form.Select
                    value={bookingData.providerId}
                    onChange={(e) => setBookingData({ ...bookingData, providerId: e.target.value })}
                    required
                  >
                    <option value="">Choose a provider...</option>
                    {providers.map(provider => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name} - {provider.specialization} (⭐ {provider.rating})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Preferred Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    min={getMinDate()}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Preferred Time</Form.Label>
                  <Form.Select
                    value={bookingData.time}
                    onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                    required
                  >
                    <option value="">Select time...</option>
                    {getAvailableTimes().map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Any specific concerns or preferences..."
                value={bookingData.notes}
                onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Book Appointment
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Appointments;
