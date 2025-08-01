import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useLogout from '../hooks/useLogout'; // adjust path

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);

  // ✅ Handle scroll styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = useLogout();

  // ✅ Toggle profile dropdown
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // ✅ Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word[0].toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          <img 
            src="/assets/Logo.png" 
            alt="EventNest Logo" 
            className="navbar-logo" 
          />
        </Link>
      </div>


      <div className="navbar-right">
        <Link className="nav-link" to="/events">Events</Link>

        {user ? (
          <div className="user-info" onClick={toggleDropdown}>
            <div className="avatar">
              {user.avatar ? (
                <img src={user.avatar} alt="DP" />
              ) : (
                <span>{getInitials(user.username)}</span>
              )}
            </div>
            <span >{user.username}</span>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={() => navigate('/dashboard')}>👤 My Account</button>
                <button onClick={() => navigate('/settings')}>⚙️ Settings</button>
                <button onClick={logout}>🚪 Sign Out</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-button" to="/register">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
