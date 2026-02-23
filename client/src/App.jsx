import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AssessmentFlow from './components/AssessmentFlow';
import History from './components/History';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL || 'https://comfy-o2ia.onrender.com';

  // Keep-alive heartbeat
  useEffect(() => {
    const pingBackend = () => {
      axios.get(API_URL + '/ping')
        .then(() => console.log('Backend pinged to keep alive'))
        .catch(err => console.error('Ping failed', err));
    };

    // Ping immediately on load
    pingBackend();

    // Ping every 5 minutes (300,000 ms)
    const interval = setInterval(pingBackend, 300000);

    return () => clearInterval(interval);
  }, [API_URL]);

  const startFlow = () => {
    navigate('/assessment');
  };

  const hideHeaderRoutes = ['/assessment', '/history'];
  const showHeader = !hideHeaderRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="App">
      {showHeader && <Header />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home onStart={startFlow} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assessment" element={<AssessmentFlow />} />
          <Route path="/history" element={<History onBack={() => navigate('/dashboard')} />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
