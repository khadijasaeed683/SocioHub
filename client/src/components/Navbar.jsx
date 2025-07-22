import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Check token and user data on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user')); // Assuming you store user data in localStorage
    if (token && userData) {
      setUser(userData);
    }
  }, []);

  // ✅ Handle scroll styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

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
        <Link to="/" className="logo-link">EventNest</Link>
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
                <button onClick={handleLogout}>🚪 Sign Out</button>
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
