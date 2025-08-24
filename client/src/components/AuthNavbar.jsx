import React, { useContext, useState, useEffect } from 'react';
import './AuthNavbar.css';
import { SidebarContext } from '../context/SidebarContext';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useLogout from '../hooks/useLogout';

const AuthNavbar = () => {
  const { toggleSidebar } = useContext(SidebarContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const { handleLogout, loading } = useLogout();
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();

  // Redirect when user is null (after logout)
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '';
    return name
      .split(' ')
      .map(word => word[0]?.toUpperCase() || '')
      .slice(0, 2)
      .join('');
  };

  return (
    <div className="auth-navbar">

      <div className="navbar-left">
        <button className="hamburger" onClick={toggleSidebar}>
          ☰
        </button>
        <Link to="/" >
          <img src="/assets/Logo3.png" alt="EventNest Logo" className="navbar-logo" />
        </Link>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <div className="user-info" onClick={toggleDropdown}>
              <div className="avatar">
                {user.pfp ? (
                  <img src={user.pfp} alt="DP" />
                ) : (
                  <span>{getInitials(user.username)}</span>
                )}
              </div>
              <span className="username">{user.username}</span>
            </div>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile-settings">
                  <button>👤 My Profile</button>
                </Link>
                <button>⚙️ Settings</button>
                <button onClick={handleLogout} disabled={loading}>
                  {loading ? 'Signing out...' : '🚪 Sign Out'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div>Loading user info...</div>
        )}
      </div>
    </div>
  );
};

export default AuthNavbar;
