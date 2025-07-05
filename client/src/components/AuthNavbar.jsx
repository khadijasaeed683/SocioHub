import React, { useContext, useState } from 'react';
import './AuthNavbar.css';
import { SidebarContext } from '../context/SidebarContext';

const AuthNavbar = ({ user, onSignOut }) => {
  const { toggleSidebar } = useContext(SidebarContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word[0].toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <div className="auth-navbar">
      <div className="navbar-left">
        <button className="hamburger" onClick={toggleSidebar}>
          ☰
        </button>
        <span className="app-name">SocioHub</span>
      </div>

      <div className="navbar-right">
        <div className="user-info" onClick={toggleDropdown}>
          <div className="avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt="DP" />
            ) : (
              <span>{getInitials(user?.name)}</span>
            )}
          </div>
          <span className="username">{user?.name}</span>
        </div>

        {dropdownOpen && (
          <div className="dropdown-menu">
            <button>👤 My Profile</button>
            <button>⚙️ Settings</button>
            <button onClick={onSignOut}>🚪 Sign Out</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthNavbar;
