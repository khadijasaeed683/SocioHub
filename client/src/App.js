import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useEffect , useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userLoggedIn } from './features/authSlice';
import axios from 'axios';
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
import SocietyRequests from './admin/pages/SocietyRequests';
import ManageSocieties from './admin/pages/ManageSocieties';
import ManageUsers from './admin/pages/ManageUsers';

import { SidebarProvider } from './context/SidebarContext';
import AdminDashboard from './admin/AdminDashboard';

const AppWrapper = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user/profile', {
          withCredentials: true,
        });
        dispatch(userLoggedIn(res.data));
      } catch (err) {
        console.error('Failed to auto-fetch user:', err);
      } finally {
        setLoading(false); // ✅ done loading
      }
    };

    fetchUser();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  const handleLogin = (userData) => {
    dispatch(userLoggedIn(userData));
    navigate('/dashboard');
  };

  const handleSignup = (userData) => {
    dispatch(userLoggedIn(userData));
    navigate('/dashboard');
  };
  const handleSignOut = () => {
   dispatch(userLoggedIn(null));
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
          <ProfileSettings user={currentUser} onSignOut={handleSignOut} />
        }
      />




      {/* 👤 Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          <UserDashboard
            user={currentUser}
            societies={[
              {
                _id: 'dummy123', // 👈 this is used in the route
                name: 'Tech Society',
                admins: [currentUser?._id] // make sure user is admin
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

    {/* Admin Panel Routes

    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin/Dashboard" element={<AdminDashboard/>}/> */}


    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/dashboard/requests" element={<SocietyRequests />} />
    <Route path="/admin/dashboard/societies" element={<ManageSocieties />} />
    <Route path="/admin/dashboard/users" element={<ManageUsers />} />

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
