import React, { useState, useEffect, useCallback } from 'react';

const DoctorDashboard = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [patientCount, setPatientCount] = useState(0);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [availabilityData, setAvailabilityData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    maxPatients: 5
  });

  const loadData = useCallback(() => {
    // Load appointments for current doctor
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const doctorAppointments = allAppointments.filter(apt => apt.doctorId === currentUser.id);
    setAppointments(doctorAppointments);

    // Calculate unique patients for this doctor
    const uniquePatients = new Set(doctorAppointments.map(apt => apt.patientId));
    setPatientCount(uniquePatients.size);

    // Load doctor availability
    const allAvailability = JSON.parse(localStorage.getItem('doctorAvailability') || '[]');
    const doctorAvailability = allAvailability.filter(avail => avail.doctorId === currentUser.id);
    setAvailability(doctorAvailability);
  }, [currentUser.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAvailabilitySubmit = () => {
    if (!availabilityData.date || !availabilityData.startTime || !availabilityData.endTime) {
      alert('Please fill in all fields');
      return;
    }

    const newAvailability = {
      id: Date.now().toString(),
      doctorId: currentUser.id,
      doctorName: currentUser.name,
      date: availabilityData.date,
      startTime: availabilityData.startTime,
      endTime: availabilityData.endTime,
      maxPatients: availabilityData.maxPatients,
      currentPatients: 0
    };

    const allAvailability = JSON.parse(localStorage.getItem('doctorAvailability') || '[]');
    allAvailability.push(newAvailability);
    localStorage.setItem('doctorAvailability', JSON.stringify(allAvailability));

    setAvailability(prev => [...prev, newAvailability]);
    setShowAvailabilityModal(false);
    setAvailabilityData({ date: '', startTime: '', endTime: '', maxPatients: 5 });
  };

  const updateAppointmentStatus = (appointmentId, newStatus) => {
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updatedAppointments = allAppointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    );
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    setAppointments(prev => 
      prev.map(apt => apt.id === appointmentId ? { ...apt, status: newStatus } : apt)
    );
  };

  const getStatusBadge = (status) => {
    const variants = {
      'scheduled': 'primary',
      'completed': 'success',
      'cancelled': 'danger'
    };
    return <span className={`status-badge status-${variants[status] || 'secondary'}`}>{status}</span>;
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  return (
    <div className="main-content">
      <div className="dashboard-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Doctor Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, Dr. {currentUser.name}!</p>
          <p className="specialization">Specialization: {currentUser.specialization}</p>
          
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-number">{patientCount}</div>
                <div className="stat-label">Total Patients</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <div className="stat-number">{appointments.length}</div>
                <div className="stat-label">Total Appointments</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-number">{appointments.filter(apt => apt.status === 'completed').length}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <div className="stat-number">{appointments.filter(apt => apt.status === 'scheduled').length}</div>
                <div className="stat-label">Pending</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs-modern">
          <button 
            className={`nav-link ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            📅 Appointments
          </button>
          <button 
            className={`nav-link ${activeTab === 'availability' ? 'active' : ''}`}
            onClick={() => setActiveTab('availability')}
          >
            ⏰ Set Availability
          </button>
        </nav>

        {/* Tab Content */}
        <div className="tab-content">
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
                        <h6 className="appointment-patient">Patient: {appointment.patientName}</h6>
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
                        <div className="appointment-actions">
                          {appointment.status === 'scheduled' && (
                            <>
                              <button 
                                className="btn-modern btn-success"
                                onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                              >
                                ✅ Complete
                              </button>
                              <button 
                                className="btn-modern btn-danger"
                                onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                              >
                                ❌ Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Availability Tab */}
          {activeTab === 'availability' && (
            <div className="tab-content-modern">
              <div className="availability-header">
                <h3 className="tab-title">Set Your Availability</h3>
                <button 
                  className="btn-modern btn-add-availability"
                  onClick={() => setShowAvailabilityModal(true)}
                >
                  ➕ Add New Availability
                </button>
              </div>
              
              <div className="availability-grid">
                {availability.map(slot => (
                  <div key={slot.id} className="availability-card card-modern">
                    <div className="card-content">
                      <h6 className="availability-date">{new Date(slot.date).toLocaleDateString()}</h6>
                      <p className="availability-time">
                        <strong>Time:</strong> {slot.startTime} - {slot.endTime}
                      </p>
                      <p className="availability-patients">
                        <strong>Patients:</strong> {slot.currentPatients}/{slot.maxPatients}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Availability Modal */}
        {showAvailabilityModal && (
          <div className="modal-overlay" onClick={() => setShowAvailabilityModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="modal-title">Set Availability</h5>
                <button 
                  type="button" 
                  className="modal-close" 
                  onClick={() => setShowAvailabilityModal(false)}
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
                      value={availabilityData.date}
                      onChange={(e) => setAvailabilityData(prev => ({ ...prev, date: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Start Time</label>
                    <select
                      className="form-select-modern"
                      value={availabilityData.startTime}
                      onChange={(e) => setAvailabilityData(prev => ({ ...prev, startTime: e.target.value }))}
                    >
                      <option value="">Select start time</option>
                      {getTimeSlots().map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Time</label>
                    <select
                      className="form-select-modern"
                      value={availabilityData.endTime}
                      onChange={(e) => setAvailabilityData(prev => ({ ...prev, endTime: e.target.value }))}
                    >
                      <option value="">Select end time</option>
                      {getTimeSlots().map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Max Patients</label>
                    <input
                      type="number"
                      className="form-control-modern"
                      value={availabilityData.maxPatients}
                      onChange={(e) => setAvailabilityData(prev => ({ ...prev, maxPatients: parseInt(e.target.value) }))}
                      min="1"
                      max="20"
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-modern btn-cancel" 
                  onClick={() => setShowAvailabilityModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-modern btn-confirm" 
                  onClick={handleAvailabilitySubmit}
                >
                  ✅ Set Availability
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .specialization {
          margin: 0;
          opacity: 0.9;
          font-size: 1.1rem;
        }

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

        .availability-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .btn-add-availability {
          background: var(--success-gradient);
          padding: 0.75rem 1.5rem;
          font-size: 0.9rem;
        }

        .appointments-grid,
        .availability-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .appointment-card,
        .availability-card {
          transition: all 0.3s ease;
          height: 100%;
        }
        
        .appointment-card:hover,
        .availability-card:hover {
          transform: translateY(-4px);
        }

        .card-content {
          padding: 1rem;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .appointment-patient,
        .availability-date {
          color: #1e293b;
          font-weight: 600;
          margin-bottom: 1rem;
          font-size: 1.1rem;
          margin-top: 0px;
        }
        
        .appointment-details,
        .availability-time,
        .availability-patients {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }
        
        .appointment-notes {
          font-size: 0.85rem;
          font-style: italic;
          color: #94a3b8;
          margin-bottom: 1rem;
        }

        .appointment-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .btn-success {
          background: var(--success-gradient);
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .btn-danger {
          background: var(--danger-gradient);
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .stat-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 1.5rem;
          color: white;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-icon {
          font-size: 2rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          opacity: 0.9;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .nav-tabs-modern {
            flex-direction: column;
            gap: 0.5rem;
          }

          .nav-tabs-modern .nav-link {
            text-align: center;
          }

          .availability-header {
            flex-direction: column;
            align-items: stretch;
          }

          .btn-add-availability {
            width: 100%;
          }

          .appointments-grid,
          .availability-grid {
            grid-template-columns: 1fr;
          }

          .tab-content-modern {
            padding: 1.5rem;
          }

          .modal-content {
            margin: 1rem;
            max-height: calc(100vh - 2rem);
          }

          .appointment-actions {
            flex-direction: column;
          }

          .btn-success,
          .btn-danger {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default DoctorDashboard; 