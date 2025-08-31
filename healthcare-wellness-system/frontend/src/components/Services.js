import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, Form, InputGroup, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const Services = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, selectedCategory, searchTerm]);

  const fetchServices = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockServices = [
        {
          id: 1,
          name: 'Physical Therapy',
          description: 'Comprehensive physical therapy sessions designed to improve mobility, reduce pain, and enhance overall physical function. Our licensed therapists create personalized treatment plans for each patient.',
          duration: '60 minutes',
          price: 120,
          category: 'THERAPY',
          image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          features: ['Pain Management', 'Mobility Improvement', 'Post-Surgery Recovery', 'Sports Injury Treatment'],
          provider: 'Dr. Jane Smith',
          rating: 4.8,
          reviews: 124
        },
        {
          id: 2,
          name: 'Massage Therapy',
          description: 'Relaxing and therapeutic massage sessions to relieve stress, reduce muscle tension, and promote overall wellness. Various techniques available including Swedish, deep tissue, and hot stone massage.',
          duration: '45 minutes',
          price: 80,
          category: 'MASSAGE',
          image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          features: ['Stress Relief', 'Muscle Relaxation', 'Improved Circulation', 'Better Sleep'],
          provider: 'Dr. Mike Wilson',
          rating: 4.6,
          reviews: 89
        },
        {
          id: 3,
          name: 'Nutrition Consultation',
          description: 'Personalized nutrition planning and dietary guidance to help you achieve your health goals. Our certified nutritionists provide evidence-based recommendations for optimal health and wellness.',
          duration: '30 minutes',
          price: 60,
          category: 'NUTRITION',
          image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80',
          features: ['Personalized Meal Plans', 'Weight Management', 'Dietary Restrictions', 'Health Optimization'],
          provider: 'Dr. Sarah Johnson',
          rating: 4.9,
          reviews: 156
        },
        {
          id: 4,
          name: 'Mental Health Counseling',
          description: 'Professional mental health support and counseling services. Our licensed therapists provide a safe, confidential environment for addressing various mental health concerns and personal growth.',
          duration: '50 minutes',
          price: 100,
          category: 'MENTAL_HEALTH',
          image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          features: ['Anxiety & Depression', 'Stress Management', 'Relationship Issues', 'Personal Growth'],
          provider: 'Dr. Emily Chen',
          rating: 4.7,
          reviews: 203
        },
        {
          id: 5,
          name: 'Fitness Training',
          description: 'Personalized fitness training programs designed to improve strength, endurance, and overall physical fitness. Our certified trainers create customized workout plans for all fitness levels.',
          duration: '45 minutes',
          price: 75,
          category: 'FITNESS',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          features: ['Strength Training', 'Cardiovascular Fitness', 'Flexibility', 'Weight Loss'],
          provider: 'Alex Rodriguez',
          rating: 4.5,
          reviews: 67
        },
        {
          id: 6,
          name: 'Acupuncture',
          description: 'Traditional Chinese medicine technique using fine needles to stimulate specific points on the body. Effective for pain relief, stress reduction, and promoting natural healing processes.',
          duration: '60 minutes',
          price: 90,
          category: 'ALTERNATIVE',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2020&q=80',
          features: ['Pain Relief', 'Stress Reduction', 'Energy Balance', 'Natural Healing'],
          provider: 'Dr. Wei Zhang',
          rating: 4.4,
          reviews: 78
        }
      ];
      setServices(mockServices);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(mockServices.map(service => service.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      toast.error('Failed to fetch services');
    }
  };

  const filterServices = () => {
    let filtered = services;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.provider.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  const bookService = (service) => {
    // This would typically navigate to the appointments page with the service pre-selected
    toast.success(`Redirecting to book ${service.name}...`);
    setShowServiceModal(false);
  };

  const getCategoryBadge = (category) => {
    const variants = {
      'THERAPY': 'primary',
      'MASSAGE': 'success',
      'NUTRITION': 'warning',
      'MENTAL_HEALTH': 'info',
      'FITNESS': 'danger',
      'ALTERNATIVE': 'secondary'
    };
    return <Badge bg={variants[category] || 'secondary'}>{category.replace('_', ' ')}</Badge>;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-warning">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-warning">☆</span>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-muted">☆</span>);
    }

    return stars;
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h2>Healthcare Services</h2>
        <p className="text-muted">Explore our comprehensive range of wellness and healthcare services</p>
      </div>

      {/* Search and Filter Section */}
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <Form.Control
              placeholder="Search services, providers, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary">
              <i className="fas fa-search"></i>
            </Button>
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.replace('_', ' ')}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Services Grid */}
      <Row>
        {filteredServices.map(service => (
          <Col key={service.id} lg={4} md={6} className="mb-4">
            <Card className="h-100 service-card" style={{ cursor: 'pointer' }} onClick={() => handleServiceClick(service)}>
              <div style={{ height: '200px', overflow: 'hidden' }}>
                <Card.Img
                  variant="top"
                  src={service.image}
                  style={{ height: '100%', objectFit: 'cover' }}
                />
              </div>
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title mb-0">{service.name}</h5>
                  {getCategoryBadge(service.category)}
                </div>
                <p className="card-text text-muted small mb-2">
                  {service.description.substring(0, 100)}...
                </p>
                <div className="mb-2">
                  <small className="text-muted">
                    <i className="fas fa-clock me-1"></i>
                    {service.duration}
                  </small>
                </div>
                <div className="mb-2">
                  <div className="d-flex align-items-center">
                    {renderStars(service.rating)}
                    <span className="ms-1 small text-muted">
                      {service.rating} ({service.reviews} reviews)
                    </span>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h5 text-primary mb-0">${service.price}</span>
                    <Button variant="outline-primary" size="sm">
                      Learn More
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredServices.length === 0 && (
        <div className="text-center py-5">
          <h4 className="text-muted">No services found</h4>
          <p className="text-muted">Try adjusting your search criteria or browse all categories</p>
        </div>
      )}

      {/* Service Detail Modal */}
      <Modal show={showServiceModal} onHide={() => setShowServiceModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedService?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedService && (
            <div>
              <div className="mb-3">
                <img
                  src={selectedService.image}
                  alt={selectedService.name}
                  className="img-fluid rounded"
                  style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                />
              </div>
              
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5>{selectedService.name}</h5>
                  <p className="text-muted mb-1">by {selectedService.provider}</p>
                  <div className="d-flex align-items-center mb-2">
                    {renderStars(selectedService.rating)}
                    <span className="ms-2">
                      {selectedService.rating} ({selectedService.reviews} reviews)
                    </span>
                  </div>
                </div>
                <div className="text-end">
                  {getCategoryBadge(selectedService.category)}
                  <div className="h4 text-primary mt-2">${selectedService.price}</div>
                  <small className="text-muted">{selectedService.duration}</small>
                </div>
              </div>

              <div className="mb-3">
                <h6>Description</h6>
                <p>{selectedService.description}</p>
              </div>

              <div className="mb-3">
                <h6>Key Features</h6>
                <div className="row">
                  {selectedService.features.map((feature, index) => (
                    <div key={index} className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <i className="fas fa-check text-success me-2"></i>
                        <span>{feature}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowServiceModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => bookService(selectedService)}>
            Book Appointment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Services;
