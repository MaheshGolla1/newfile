import React, { useState, useEffect, useCallback } from 'react';
import Payment from './Payment';

const PatientDashboard = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('doctors');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [wellnessList, setWellnessList] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    notes: ''
  });

  const loadData = useCallback(() => {
    // Load doctors
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const doctorUsers = users.filter(user => user.role === 'doctor');
    setDoctors(doctorUsers);

    // Load appointments for current patient
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const patientAppointments = allAppointments.filter(apt => apt.patientId === currentUser.id);
    setAppointments(patientAppointments);

    // Load wellness list (sample data)
    const sampleWellness = [
      { id: 1, date: '2024-01-15', type: 'Blood Pressure Check', status: 'Completed', notes: 'Normal range' },
      { id: 2, date: '2024-01-20', type: 'Weight Check', status: 'Completed', notes: 'Maintained weight' },
      { id: 3, date: '2024-02-01', type: 'General Checkup', status: 'Scheduled', notes: 'Annual physical' }
    ];
    setWellnessList(sampleWellness);
  }, [currentUser.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = () => {
    if (!bookingData.date || !bookingData.time) {
      alert('Please select date and time');
      return;
    }

    const newAppointment = {
      id: Date.now().toString(),
      patientId: currentUser.id,
      doctorId: selectedDoctor.id,
      patientName: currentUser.name,
      doctorName: selectedDoctor.name,
      date: bookingData.date,
      time: bookingData.time,
      status: 'scheduled',
      notes: bookingData.notes,
      amount: 100, // Default appointment fee
      createdAt: new Date().toISOString()
    };

    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    allAppointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(allAppointments));

    setAppointments(prev => [...prev, newAppointment]);
    setShowBookingModal(false);
    setBookingData({ date: '', time: '', notes: '' });
    setSelectedDoctor(null);
  };

  const handlePaymentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = (payment) => {
    // Update appointment status to paid
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updatedAppointments = allAppointments.map(apt => 
      apt.id === selectedAppointment.id ? { ...apt, paymentStatus: 'paid' } : apt
    );
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    setAppointments(prev => 
      prev.map(apt => apt.id === selectedAppointment.id ? { ...apt, paymentStatus: 'paid' } : apt)
    );

    setShowPaymentModal(false);
    setSelectedAppointment(null);
    alert('Payment completed successfully!');
  };

  const getStatusBadge = (status) => {
    const variants = {
      'scheduled': 'primary',
      'completed': 'success',
      'cancelled': 'danger'
    };
    return <span className={`status-badge status-${variants[status] || 'secondary'}`}>{status}</span>;
  };

  const getWellnessStatusBadge = (status) => {
    const variants = {
      'Completed': 'success',
      'Scheduled': 'primary',
      'Pending': 'warning'
    };
    return <span className={`status-badge status-${variants[status] || 'secondary'}`}>{status}</span>;
  };

  return (
    <div className="main-content">
      <div className="dashboard-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Patient Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, {currentUser.name}!</p>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs-modern">
          <button 
            className={`nav-link ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            👨‍⚕️ Available Doctors
          </button>
          <button 
            className={`nav-link ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            📅 Appointment History
          </button>
          <button 
            className={`nav-link ${activeTab === 'wellness' ? 'active' : ''}`}
            onClick={() => setActiveTab('wellness')}
          >
            💊 Wellness List History
          </button>
        </nav>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Doctors Tab */}
          {activeTab === 'doctors' && (
            <div className="tab-content-modern">
              <h3 className="tab-title">Available Doctors</h3>
              <div className="doctors-grid">
                {doctors.map(doctor => (
                  <div key={doctor.id} className="doctor-card card-modern">
                    <div className="card-content">
                      <div className="doctor-avatar">
                        <img 
                          src={doctor.profileImage || 'https://via.placeholder.com/100'} 
                          alt={doctor.name}
                          className="avatar-image"
                        />
                      </div>
                      <h5 className="doctor-name">{doctor.name}</h5>
                      <p className="doctor-specialization">
                        <strong>Specialization:</strong> {doctor.specialization}
                      </p>
                      <p className="doctor-phone">
                        <strong>Phone:</strong> {doctor.phone}
                      </p>
                      <button 
                        className="btn-modern btn-book"
                        onClick={() => handleBookAppointment(doctor)}
                      >
                        📅 Book Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="tab-content-modern">
              <h3 className="tab-title">Your Appointments</h3>
              {appointments.length === 0 ? (
                <div className="empty-state">
                  <p>No appointments found.</p>
                </div>
              ) : (
                <div className="appointments-grid">
                  {appointments.map(appointment => (
                    <div key={appointment.id} className="appointment-card card-modern">
                      <div className="card-content">
                        <h6 className="appointment-doctor">Dr. {appointment.doctorName}</h6>
                        <p className="appointment-details">
                          <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}<br />
                          <strong>Time:</strong> {appointment.time}<br />
                          <strong>Status:</strong> {getStatusBadge(appointment.status)}
                        </p>
                        {appointment.notes && (
                          <p className="appointment-notes">
                            <strong>Notes:</strong> {appointment.notes}
                          </p>
                        )}
                        {appointment.amount && (
                          <p className="appointment-amount">
                            <strong>Fee:</strong> ${appointment.amount}
                          </p>
                        )}
                        <div className="appointment-actions">
                          {appointment.paymentStatus !== 'paid' && (
                            <button 
                              className="btn-modern btn-pay"
                              onClick={() => handlePaymentClick(appointment)}
                            >
                              💳 Pay Now
                            </button>
                          )}
                          {appointment.paymentStatus === 'paid' && (
                            <span className="payment-status">✅ Paid</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Wellness List Tab */}
          {activeTab === 'wellness' && (
            <div className="tab-content-modern">
              <h3 className="tab-title">Wellness List History</h3>
              <div className="wellness-grid">
                {wellnessList.map(item => (
                  <div key={item.id} className="wellness-card card-modern">
                    <div className="card-content">
                      <h6 className="wellness-type">{item.type}</h6>
                      <p className="wellness-details">
                        <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}<br />
                        <strong>Status:</strong> {getWellnessStatusBadge(item.status)}
                      </p>
                      {item.notes && (
                        <p className="wellness-notes">
                          <strong>Notes:</strong> {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedAppointment && (
          <Payment 
            appointment={selectedAppointment}
            onPaymentComplete={handlePaymentComplete}
            onClose={() => setShowPaymentModal(false)}
          />
        )}

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="modal-title">Book Appointment with Dr. {selectedDoctor?.name}</h5>
                <button 
                  type="button" 
                  className="modal-close" 
                  onClick={() => setShowBookingModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control-modern"
                      value={bookingData.date}
                      onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time</label>
                    <select
                      className="form-select-modern"
                      value={bookingData.time}
                      onChange={(e) => setBookingData(prev => ({ ...prev, time: e.target.value }))}
                    >
                      <option value="">Select time</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes (Optional)</label>
                    <textarea
                      className="form-control-modern"
                      rows={3}
                      value={bookingData.notes}
                      onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any specific concerns or notes..."
                    ></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-modern btn-cancel" 
                  onClick={() => setShowBookingModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-modern btn-confirm" 
                  onClick={handleBookingSubmit}
                >
                  📅 Book Appointment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .nav-tabs-modern {
          display: flex;
          border-bottom: none;
          gap: 8px;
          margin-bottom: 2rem;
        }
        
        .nav-tabs-modern .nav-link {
          border: none;
          color: #64748b;
          border-radius: 12px;
          padding: 12px 24px;
          font-weight: 500;
          transition: all 0.3s ease;
          background: transparent;
          cursor: pointer;
          font-size: 1rem;
        }
        
        .nav-tabs-modern .nav-link.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .nav-tabs-modern .nav-link:hover:not(.active) {
          background: #f8fafc;
          color: #1e293b;
        }
        
        .tab-content-modern {
          background: white;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          margin-top: 24px;
        }

        .tab-title {
          margin-bottom: 2rem;
          color: #1e293b;
          font-weight: 600;
          font-size: 1.5rem;
        }

        .doctors-grid,
        .appointments-grid,
        .wellness-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .doctor-card,
        .appointment-card,
        .wellness-card {
          transition: all 0.3s ease;
          height: 100%;
        }
        
        .doctor-card:hover,
        .appointment-card:hover,
        .wellness-card:hover {
          transform: translateY(-4px);
        }

        .card-content {
          padding: 1rem;
          text-align: center;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .doctor-avatar {
          margin-bottom: 1.5rem;
        }

        .avatar-image {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 3px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        
        .doctor-card:hover .avatar-image {
          border-color: #667eea;
        }
        
        .doctor-name {
          color: #1e293b;
          font-weight: 600;
          margin-bottom: 1rem;
          font-size: 1.25rem;
        }
        
        .doctor-specialization,
        .doctor-phone {
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          color: #64748b;
        }

        .btn-book {
          margin-top: 1rem;
          width: 100%;
        }
        
        .appointment-doctor,
        .wellness-type {
          color: #1e293b;
          font-weight: 600;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }
        
        .appointment-details,
        .wellness-details {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 10px;
          line-height: 1.6;
          border: 2px solid #e2e8f0;
        }
        
        .appointment-notes,
        .wellness-notes {
          font-size: 0.85rem;
          font-style: italic;
          color: #94a3b8;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #64748b;
        }

        .status-badge {
          display: inline-block;
          border-radius: 8px;
          font-weight: 500;
          padding: 6px 12px;
          font-size: 0.875rem;
          text-transform: capitalize;
        }

        .status-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .status-success {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
        }

        .status-danger {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
          color: white;
        }

        .status-warning {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
        }

        .status-secondary {
          background: #64748b;
          color: white;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          padding: 20px;
        }
        
        .modal-content {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .modal-header {
          border-bottom: 1px solid #e2e8f0;
          padding: 24px 24px 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .modal-title {
          margin: 0;
          color: #1e293b;
          font-weight: 600;
          font-size: 1.25rem;
        }
        
        .modal-body {
          padding: 24px;
        }
        
        .modal-footer {
          border-top: 1px solid #e2e8f0;
          padding: 16px 24px 24px 24px;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #64748b;
          padding: 0;
          line-height: 1;
        }
        
        .modal-close:hover {
          color: #1e293b;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          display: block;
        }
        
        .form-control-modern,
        .form-select-modern {
          width: 100%;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 16px;
          transition: all 0.3s ease;
          background: #ffffff;
          font-size: 1rem;
        }
        
        .form-control-modern:focus,
        .form-select-modern:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          outline: none;
        }

        .btn-cancel {
          background: var(--secondary-gradient);
        }

        .btn-confirm {
          background: var(--primary-gradient);
        }

        .appointment-amount {
          color: #059669;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .appointment-actions {
          margin-top: 1rem;
        }

        .btn-pay {
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-pay:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
        }

        .payment-status {
          color: #059669;
          font-weight: 600;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .nav-tabs-modern {
            flex-direction: column;
            gap: 0.5rem;
          }

          .nav-tabs-modern .nav-link {
            text-align: center;
          }

          .doctors-grid,
          .appointments-grid,
          .wellness-grid {
            grid-template-columns: 1fr;
          }

          .tab-content-modern {
            padding: 1.5rem;
          }

          .modal-content {
            margin: 1rem;
            max-height: calc(100vh - 2rem);
          }
        }
      `}</style>
    </div>
  );
};

export default PatientDashboard; 