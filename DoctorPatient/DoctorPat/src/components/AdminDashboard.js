import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load all appointments
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    setAppointments(allAppointments);

    // Load all users
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(allUsers);

    // Calculate system statistics
    const totalUsers = allUsers.length;
    const totalDoctors = allUsers.filter(user => user.role === 'doctor').length;
    const totalPatients = allUsers.filter(user => user.role === 'patient').length;
    const totalAppointments = allAppointments.length;
    const completedAppointments = allAppointments.filter(apt => apt.status === 'completed').length;
    const pendingAppointments = allAppointments.filter(apt => apt.status === 'scheduled').length;

    setSystemStats({
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      completedAppointments,
      pendingAppointments
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      'scheduled': 'primary',
      'completed': 'success',
      'cancelled': 'danger'
    };
    return <span className={`status-badge status-${variants[status] || 'secondary'}`}>{status}</span>;
  };

  const getRoleBadge = (role) => {
    const variants = {
      'admin': 'danger',
      'doctor': 'primary',
      'patient': 'success'
    };
    return <span className={`status-badge status-${variants[role] || 'secondary'}`}>{role}</span>;
  };

  const getCompletionRate = () => {
    if (systemStats.totalAppointments === 0) return 0;
    return Math.round((systemStats.completedAppointments / systemStats.totalAppointments) * 100);
  };

  const getPendingRate = () => {
    if (systemStats.totalAppointments === 0) return 0;
    return Math.round((systemStats.pendingAppointments / systemStats.totalAppointments) * 100);
  };

  return (
    <div className="main-content">
      <div className="dashboard-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">System Overview & Management</p>
          <p className="admin-welcome">Welcome, {currentUser.name}</p>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs-modern">
          <button 
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 System Overview
          </button>
          <button 
            className={`nav-link ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            📅 All Appointments
          </button>
          <button 
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 User Management
          </button>
        </nav>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content-modern">
              <h3 className="tab-title">System Overview</h3>
              
              {/* Statistics Cards */}
              <div className="stats-grid">
                <div className="stats-card">
                  <div className="stats-icon">👥</div>
                  <h4 className="stats-number">{systemStats.totalUsers}</h4>
                  <p className="stats-label">Total Users</p>
                </div>
                <div className="stats-card">
                  <div className="stats-icon">👨‍⚕️</div>
                  <h4 className="stats-number">{systemStats.totalDoctors}</h4>
                  <p className="stats-label">Doctors</p>
                </div>
                <div className="stats-card">
                  <div className="stats-icon">👤</div>
                  <h4 className="stats-number">{systemStats.totalPatients}</h4>
                  <p className="stats-label">Patients</p>
                </div>
                <div className="stats-card">
                  <div className="stats-icon">📅</div>
                  <h4 className="stats-number">{systemStats.totalAppointments}</h4>
                  <p className="stats-label">Total Appointments</p>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="progress-section">
                <h4 className="progress-title">Appointment Completion Rate</h4>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill progress-success" 
                      style={{ width: `${getCompletionRate()}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{getCompletionRate()}%</span>
                </div>
              </div>

              <div className="progress-section">
                <h4 className="progress-title">Pending Appointments</h4>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill progress-warning" 
                      style={{ width: `${getPendingRate()}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{getPendingRate()}%</span>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="recent-section">
                <h4 className="recent-title">Recent Appointments</h4>
                <div className="recent-grid">
                  {appointments.slice(0, 6).map(appointment => (
                    <div key={appointment.id} className="recent-card card-modern">
                      <div className="card-content">
                        <h6 className="recent-patient">{appointment.patientName}</h6>
                        <p className="recent-doctor">Dr. {appointment.doctorName}</p>
                        <p className="recent-date">{new Date(appointment.date).toLocaleDateString()}</p>
                        {getStatusBadge(appointment.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="tab-content-modern">
              <h3 className="tab-title">All Appointments</h3>
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
                        <p className="appointment-doctor">Doctor: Dr. {appointment.doctorName}</p>
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="tab-content-modern">
              <h3 className="tab-title">User Management</h3>
              
              {/* Doctors Section */}
              <div className="user-section">
                <h4 className="section-title">👨‍⚕️ Doctors ({users.filter(u => u.role === 'doctor').length})</h4>
                <div className="users-grid">
                  {users.filter(user => user.role === 'doctor').map(user => (
                    <div key={user.id} className="user-card card-modern doctor-card">
                      <div className="card-content">
                        <div className="user-header">
                          <h6 className="user-name">{user.name}</h6>
                          {getRoleBadge(user.role)}
                        </div>
                        <p className="user-email">{user.email}</p>
                        <p className="user-phone">
                          <strong>Phone:</strong> {user.phone}
                        </p>
                        {user.specialization && (
                          <p className="user-specialization">
                            <strong>Specialization:</strong> {user.specialization}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patients Section */}
              <div className="user-section">
                <h4 className="section-title">👤 Patients ({users.filter(u => u.role === 'patient').length})</h4>
                <div className="users-grid">
                  {users.filter(user => user.role === 'patient').map(user => (
                    <div key={user.id} className="user-card card-modern patient-card">
                      <div className="card-content">
                        <div className="user-header">
                          <h6 className="user-name">{user.name}</h6>
                          {getRoleBadge(user.role)}
                        </div>
                        <p className="user-email">{user.email}</p>
                        <p className="user-phone">
                          <strong>Phone:</strong> {user.phone}
                        </p>
                        {user.address && (
                          <p className="user-address">
                            <strong>Address:</strong> {user.address}
                          </p>
                        )}
                        {user.dob && (
                          <p className="user-dob">
                            <strong>Date of Birth:</strong> {new Date(user.dob).toLocaleDateString()}
                          </p>
                        )}
                        {user.gender && (
                          <p className="user-gender">
                            <strong>Gender:</strong> {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admins Section */}
              <div className="user-section">
                <h4 className="section-title">⚙️ Administrators ({users.filter(u => u.role === 'admin').length})</h4>
                <div className="users-grid">
                  {users.filter(user => user.role === 'admin').map(user => (
                    <div key={user.id} className="user-card card-modern admin-card">
                      <div className="card-content">
                        <div className="user-header">
                          <h6 className="user-name">{user.name}</h6>
                          {getRoleBadge(user.role)}
                        </div>
                        <p className="user-email">{user.email}</p>
                        <p className="user-phone">
                          <strong>Phone:</strong> {user.phone}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-welcome {
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stats-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
        }

        .stats-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .stats-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stats-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .stats-label {
          color: #64748b;
          font-weight: 500;
          margin: 0;
        }

        .progress-section {
          margin-bottom: 2rem;
        }

        .progress-title {
          color: #1e293b;
          font-weight: 600;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .progress-bar {
          flex: 1;
          height: 12px;
          background: #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 6px;
          transition: width 0.3s ease;
        }

        .progress-success {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .progress-warning {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .progress-text {
          color: #64748b;
          font-weight: 600;
          min-width: 3rem;
          text-align: right;
        }

        .recent-section {
          margin-top: 3rem;
        }

        .recent-title {
          color: #1e293b;
          font-weight: 600;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }

        .recent-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .recent-card {
          transition: all 0.3s ease;
        }

        .recent-card:hover {
          transform: translateY(-4px);
        }

        .card-content {
          padding: 1rem;
        }

        .recent-patient,
        .appointment-patient,
        .user-name {
          color: #1e293b;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
          margin-top: 0px;
        }

        .recent-doctor,
        .appointment-doctor,
        .user-email {
          color: #64748b;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .recent-date,
        .appointment-details,
        .user-section {
          margin-bottom: 3rem;
        }

        .section-title {
          color: #1e293b;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .user-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .user-name {
          margin: 0;
          color: #1e293b;
          font-weight: 600;
        }

        .doctor-card {
          border-left: 4px solid #667eea;
        }

        .patient-card {
          border-left: 4px solid #4facfe;
        }

        .admin-card {
          border-left: 4px solid #fa709a;
        }

        .user-role,
        .user-specialization,
        .user-phone,
        .user-address,
        .user-dob,
        .user-gender {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }

        .appointment-notes {
          font-size: 0.85rem;
          font-style: italic;
          color: #94a3b8;
          margin-bottom: 0.5rem;
        }

        .appointments-grid,
        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .appointment-card,
        .user-card {
          transition: all 0.3s ease;
          height: 100%;
        }

        .appointment-card:hover,
        .user-card:hover {
          transform: translateY(-4px);
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

        @media (max-width: 768px) {
          .nav-tabs-modern {
            flex-direction: column;
            gap: 0.5rem;
          }

          .nav-tabs-modern .nav-link {
            text-align: center;
          }

          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
          }

          .stats-card {
            padding: 1.5rem;
          }

          .stats-number {
            font-size: 2rem;
          }

          .recent-grid,
          .appointments-grid,
          .users-grid {
            grid-template-columns: 1fr;
          }

          .tab-content-modern {
            padding: 1.5rem;
          }

          .progress-container {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }

          .progress-text {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard; 