import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import RegisterSociety from './pages/RegisterSociety';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserDashboard from './pages/UserDashboard';
import ExploreEvents from './pages/ExploreEvents';

const AppWrapper = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Login success handler
  const handleLogin = (userData) => {
    setLoggedInUser(userData);
    navigate('/dashboard');
  };

  // ✅ Signup success handler
  const handleSignup = (userData) => {
    setLoggedInUser(userData);
    navigate('/dashboard');
  };

  return (
    <Routes>
      {/* 🌐 Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/register" element={<SignupPage onSignup={handleSignup} />} />
      <Route path="/register-society" element={<RegisterSociety />} />
      <Route path="/events" element={<ExploreEvents />} />


      {/* 👤 Protected Route (sample only — no guard yet) */}
      <Route
        path="/dashboard"
        element={
          <UserDashboard
            user={loggedInUser}
            societies={[]} // Replace with actual data later
            events={{ registered: [], upcoming: [] }} // Replace with real events
          />
        }
      />
    </Routes>
  );
};

// 🧠 App with Router
const App = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;
