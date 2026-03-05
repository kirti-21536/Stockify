import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Signup from './components/Signup';
import Sidebar from './components/Sidebar';
import StaffDashboard from './components/StaffDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

import api from './api';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');

    if (token) {
      setUser(username);
      setRole(storedRole);

      // Verify token is still valid
      api.get('/auth/me').catch(() => {
        handleLogout();
      });
    }
    setLoading(false);
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, role } = response.data;

      setUser(username);
      setRole(role);
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUser(null);
    setRole(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <div className="bg-pattern"></div>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={
            user ? (
              <div className="d-flex" style={{ minHeight: '100vh' }}>
                <Sidebar role={role} onLogout={handleLogout} username={user} />
                <div className="flex-grow-1 main-content" style={{ transition: 'margin-left 0.3s ease' }}>
                  {role === 'ADMIN' ? <AdminDashboard onLogout={handleLogout} /> : <StaffDashboard onLogout={handleLogout} />}
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
