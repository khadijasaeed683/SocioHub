import React, { useContext, useState } from 'react';
import './AuthNavbar.css';
import { SidebarContext } from '../context/SidebarContext';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useLogout from '../hooks/useLogout';

const AuthNavbar = () => {
  const { toggleSidebar } = useContext(SidebarContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const { handleLogout, loading } = useLogout();
  const user = useSelector(state => state.auth.user);
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word[0].toUpperCase())
      .slice(0, 2)
      .join('');
  };

  if (!user) {
    return <div className="auth-navbar">Loading user info...</div>;
  }

  return (
    <div className="auth-navbar">

      <div className="navbar-left">
        <button className="hamburger" onClick={toggleSidebar}>
          ☰
        </button>
        <Link to="/" className="logo-link">EventNest</Link>
      </div>

      <div className="navbar-right">
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
      </div>
    </div>
  );
};

export default AuthNavbar;
