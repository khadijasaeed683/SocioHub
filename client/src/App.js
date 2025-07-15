import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import RegisterSociety from './pages/RegisterSociety';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserDashboard from './pages/UserDashboard';
import ExploreEvents from './pages/ExploreEvents';
import JoinSociety from './pages/JoinSociety';
import SocietyDetails from './pages/SocietyDetails';
import ProfileSettings from './pages/ProfileSettings';



import ManageSociety from './pages/ManageSociety/ManageSociety';
import Overview from './pages/ManageSociety/Overview';
import Members from './pages/ManageSociety/Members';
import Events from './pages/ManageSociety/Events';
import Settings from './pages/ManageSociety/Settings';

import AdminLogin from './admin/AdminLogin';

import { SidebarProvider } from './context/SidebarContext';
import AdminDashboard from './admin/AdminDashboard';

const AppWrapper = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setLoggedInUser(userData);
    navigate('/dashboard');
  };

  const handleSignup = (userData) => {
    setLoggedInUser(userData);
    navigate('/dashboard');
  };
  const handleSignOut = () => {
    setLoggedInUser(null);
    navigate('/login');
  };

  return (
    <>
    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

    <Routes>
      {/* 🌐 Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/register" element={<SignupPage onSignup={handleSignup} />} />
      <Route path="/register-society" element={<RegisterSociety />} />
      <Route path="/events" element={<ExploreEvents />} />
      <Route path="/JoinSociety" element={<JoinSociety />} />
      <Route path="/society/:id" element={<SocietyDetails />} />
      <Route
        path="/profile-settings"
        element={
          loggedInUser ? (
            <ProfileSettings user={loggedInUser} onSignOut={handleSignOut} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />




      {/* 👤 Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          <UserDashboard
            user={loggedInUser}
            societies={[
              {
                _id: 'dummy123', // 👈 this is used in the route
                name: 'Tech Society',
                admins: [loggedInUser?._id] // make sure user is admin
              },
              {
                _id: 'dummy456',
                name: 'Art Circle',
                admins: []
              }
            ]}
            events={{ registered: [], upcoming: [] }}
          />
        }
      />


      {/* 🏛️ Society Management Nested Routes */}
      <Route path="/manage-society/:id" element={<ManageSociety />}>
        <Route path="overview" element={<Overview />} />
        <Route path="members" element={<Members />} />
        <Route path="events" element={<Events />} />
        <Route path="settings" element={<Settings />} />
      </Route>

    {/* Admin Panel Routes */}

    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin/Dashboard" element={<AdminDashboard/>}/>

    </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <SidebarProvider>
      <AppWrapper />
    </SidebarProvider>
  </Router>
);

export default App;
