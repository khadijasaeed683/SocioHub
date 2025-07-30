//This is the navabr of user dashboard named authnavbar because authorized users access it
import React, { useContext, useState } from 'react';
import './AuthNavbar.css';
import { SidebarContext } from '../context/SidebarContext';
import { Link } from 'react-router-dom';
import useLogout from '../hooks/useLogout';

const AuthNavbar = ({ user, onSignOut }) => {
  const { toggleSidebar } = useContext(SidebarContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const logout = useLogout();

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
            {user?.avatar ? (
              <img src={user.avatar} alt="DP" />
            ) : (
              <span>{getInitials(user?.username)}</span>
            )}
          </div>
          <span className="username">{user?.username}</span>
        </div>

        {dropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/profile-settings">
              <button>👤 My Profile</button>
            </Link>
            <button>⚙️ Settings</button>
            <button onClick={logout}>🚪 Sign Out</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthNavbar;
