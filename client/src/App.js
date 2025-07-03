import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './pages/LandingPage';
import RegisterSociety from './pages/RegisterSociety';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserDashboard from './pages/UserDashboard';
import ExploreEvents from './pages/ExploreEvents';
import JoinSociety from './pages/JoinSociety';
import SocietyDetails from './pages/SocietyDetails';

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
    navigate('/login');
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      {/* 🧭 Main Routes */}
    <Routes>
      {/* 🌐 Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/register" element={<SignupPage onSignup={handleSignup} />} />
      <Route path="/register-society" element={<RegisterSociety />} />
      <Route path="/events" element={<ExploreEvents />} />
      <Route path="/JoinSociety" element={<JoinSociety />} />
      <Route path="/society/:id" element={<SocietyDetails />} />



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
    </>
  );
};

// 🧠 App with Router
const App = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;
