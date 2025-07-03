import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import './AuthNavbar.css';

const AuthNavbar = ({ user, onSignOut, onSidebarToggle }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav className="auth-navbar">
      <div className="navbar-left">
        <div className="navbar-left-content">
          <FaBars className="sidebar-toggle" onClick={onSidebarToggle} />
          
        </div>
        <h2>SociHub</h2>
      </div>

      <div className="navbar-right">
        <div className="user-info" onClick={toggleDropdown}>
          <div className="avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt="DP" />
            ) : (
              <span>{user?.name?.charAt(0)}</span>
            )}
          </div>
          <span className="username">{user.name}</span>
        </div>

        {dropdownOpen && (
          <div className="dropdown-menu">
            <button>👤 My Profile</button>
            <button>⚙️ Settings</button>
            <button onClick={onSignOut}>🚪 Sign Out</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AuthNavbar;