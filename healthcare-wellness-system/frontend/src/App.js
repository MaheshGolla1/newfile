import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import PatientDashboard from './components/PatientDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProviderDashboard from './components/ProviderDashboard';
import PrivateRoute from './components/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <DashboardRouter />
                </PrivateRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Component to route to appropriate dashboard based on user role
function DashboardRouter() {
  const { user } = React.useContext(require('./contexts/AuthContext').AuthContext);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Route based on user role
  switch (user.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'DOCTOR':
    case 'WELLNESS_PROVIDER':
      return <ProviderDashboard />;
    case 'PATIENT':
    default:
      return <PatientDashboard />;
  }
}

export default App;
