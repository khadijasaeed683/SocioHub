import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="logo">
        <Link to="/" className="logo-link">EventNest</Link>
      </div>
      <div className="navbar-right">
        <Link className="nav-link" to="/events">Events</Link>
        <Link className="nav-link" to="/login">Login</Link>
        <Link className="nav-button" to="/register">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
