import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // ✅ add this
import './LandingPage.css';
import { toast } from 'react-toastify';

import societyImg from '../assets/society.png';
import joinImg from '../assets/join.png';
import eventsImg from '../assets/events.png';

const LandingPage = () => {
    const [societies, setSocieties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
  useEffect(() => {
      const fetchSocieties = async () => {
        try {
          const res = await fetch('http://localhost:5000/api/society');
          const data = await res.json();
  
          if (!res.ok) {
            setError(data.message || 'Failed to fetch societies');
          } else {
            setSocieties(data);
          }
        } catch (err) {
          setError('Server error. Try again later.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchSocieties();
    }, []);
    const navigate = useNavigate();
    const handleViewDetails = (id) => {
    navigate(`/society/${id}`);
  };

  const handleRegisterClick = (e) => {
    e.preventDefault(); 

    const isLoggedIn = localStorage.getItem('token');

    if (isLoggedIn) {
      navigate('/register-society');
    } else {
      toast.warning('Please login first to register your society.');
      navigate('/login');
    }
  };

  return (
    <div className="landing-container">
      {/* Navbar stays fixed at the top */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <h1>Manage Your Campus Events Professionally</h1>
        <p>Your all-in-one hub for university societies and events.</p>
        <Link to="/register" className="cta-btn">Get Started</Link>
      </section>

      {/* Feature Sections */}
      <section className="feature-section">
        <div className="feature-text">
          <h2>Register a Society</h2>
          <p>Submit official proof and get admin access to manage your events and members with ease.</p>
          <Link to="/register-society" className="feature-btn" onClick={handleRegisterClick}>Register Now</Link>
        </div>
        <img src={societyImg} alt="Register Society" className="feature-img" />
      </section>

      <section className="feature-section">
        {/* <img src={joinImg} alt="Join Society" className="feature-img" /> */}
        <div className="feature-text">
          <h2>Join a Society</h2>
          <p>Find your favorite university society, send join requests, or join instantly with your edu email.</p>
          <div className="society-gallery">
            {societies.map(society => (
              <div key={society.id} className="society-card">
                <img src={society.logo} alt={society.name} />
                <h3>{society.name}</h3>
                <button className="details-btn" onClick={() => handleViewDetails(society._id)}>View Details</button>
              </div>
            ))}
          </div>
          <Link to="/JoinSociety" className="feature-btn">Join Now</Link>
        </div>
      </section>

      <section className="feature-section">
        <div className="feature-text">
          <h2>Browse Public Events</h2>
          <p>Explore campus-wide public events and RSVP without logging in. Stay involved, effortlessly.</p>
          <Link to="/events" className="feature-btn">Explore Events</Link>
        </div>
        <img src={eventsImg} alt="Browse Events" className="feature-img" />
      </section>
    </div>
  );
};

export default LandingPage;
