import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import AdminDashboard from './components/AdminDashboard';
import './index.css';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('currentUser');
    const storedRole = localStorage.getItem('userRole');
    
    if (storedUser && storedRole) {
      setCurrentUser(JSON.parse(storedUser));
      setUserRole(storedRole);
    }
  }, []);

  const handleLogin = (user, role) => {
    setCurrentUser(user);
    setUserRole(role);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
  };

  // Initialize sample data if not exists
  useEffect(() => {
    if (!localStorage.getItem('users')) {
      const sampleUsers = [
        {
          id: '1',
          name: 'Dr. John Smith',
          email: 'john.smith@doctor.com',
          password: 'password123',
          role: 'doctor',
          phone: '+1-555-0101',
          specialization: 'Cardiology',
          profileImage: 'https://via.placeholder.com/150'
        },
        {
          id: '2',
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@doctor.com',
          password: 'password123',
          role: 'doctor',
          phone: '+1-555-0102',
          specialization: 'Pediatrics',
          profileImage: 'https://via.placeholder.com/150'
        },
        {
          id: '3',
          name: 'Admin User',
          email: 'admin@doctorpat.com',
          password: 'admin123',
          role: 'admin',
          phone: '+1-555-0000'
        },
        {
          id: '4',
          name: 'John Doe',
          email: 'john.doe@patient.com',
          password: 'password123',
          role: 'patient',
          phone: '+1-555-0103',
          address: '123 Main St, City, State 12345',
          dob: '1990-05-15',
          gender: 'male',
          profileImage: 'https://via.placeholder.com/150'
        },
        {
          id: '5',
          name: 'Jane Smith',
          email: 'jane.smith@patient.com',
          password: 'password123',
          role: 'patient',
          phone: '+1-555-0104',
          address: '456 Oak Ave, City, State 12345',
          dob: '1985-08-22',
          gender: 'female',
          profileImage: 'https://via.placeholder.com/150'
        }
      ];
      localStorage.setItem('users', JSON.stringify(sampleUsers));
    }

    if (!localStorage.getItem('appointments')) {
      localStorage.setItem('appointments', JSON.stringify([]));
    }

    if (!localStorage.getItem('doctorAvailability')) {
      localStorage.setItem('doctorAvailability', JSON.stringify([]));
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar 
          currentUser={currentUser} 
          userRole={userRole} 
          onLogout={handleLogout} 
        />
        <Routes>
          <Route path="/" element={<LandingPage currentUser={currentUser} />} />
          <Route 
            path="/login" 
            element={
              currentUser ? 
                <Navigate to={`/${userRole}`} replace /> : 
                <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/signup" 
            element={
              currentUser ? 
                <Navigate to={`/${userRole}`} replace /> : 
                <Signup onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/patient" 
            element={
              currentUser && userRole === 'patient' ? 
                <PatientDashboard currentUser={currentUser} /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/doctor" 
            element={
              currentUser && userRole === 'doctor' ? 
                <DoctorDashboard currentUser={currentUser} /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/admin" 
            element={
              currentUser && userRole === 'admin' ? 
                <AdminDashboard currentUser={currentUser} /> : 
                <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 