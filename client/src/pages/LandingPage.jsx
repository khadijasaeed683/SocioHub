import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LandingPage.css';
import { toast } from 'react-toastify';

import societyImg from '../assets/society.png';
import joinImg from '../assets/join.png';
import eventsImg from '../assets/events.png';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard'; // ✅ Add this if not already imported

// Dummy Events
const dummyEvents = [
  {
    _id: 'e1',
    title: 'Tech Talk 2025',
    description: 'AI and the future of humanity.',
    poster: 'https://via.placeholder.com/150x100?text=Tech+Talk',
    date: '2025-07-20',
    time: '5:00 PM',
    location: 'Main Auditorium',
    societyId: { name: 'AI Society' },
    isPublic: true
  },
  
  {
    _id: 'e6',
    title: 'Tech eewew 2025',
    description: 'AI and the future of humanity.',
    poster: 'https://via.placeholder.com/150x100?text=Tech+Talk',
    date: '2025-07-20',
    time: '5:00 PM',
    location: 'Main Auditorium',
    societyId: { name: 'AI Society' },
    isPublic: true
  },
  {
    _id: 'e2',
    title: 'Music Fest',
    poster: 'https://via.placeholder.com/150x100?text=Music+Fest',
    date: '2025-08-01',
    location: 'Open Grounds',
    societyId: { name: 'Cultural Club' },
    isPublic: true
  },
  {
    _id: 'e3',
    title: 'Startup Night',
    description: 'Pitch your ideas!',
    date: '2025-09-10',
    location: 'Auditorium B',
    societyId: { name: 'Entrepreneurship Society' },
    isPublic: true
  }
];

// Carousel scroll function
const scrollEventCarousel = (scrollOffset) => {
  const carousel = document.getElementById('event-carousel');
  if (carousel) {
    carousel.scrollBy({ left: scrollOffset, behavior: 'smooth' });
  }
};



const LandingPage = () => {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/society');
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Failed to fetch societies');
        } else {
          setSocieties(data.societies);
        }
      } catch (err) {
        setError('Server error. Try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSocieties();
  }, []);

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

  // ⬅️➡️ Scroll buttons
  const scrollLeft = () => {
    const container = document.getElementById('societyCarousel');
    container.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const container = document.getElementById('societyCarousel');
    container.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="landing-container">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <h1>Manage Your Campus Events Professionally</h1>
        <p>Your all-in-one hub for university societies and events.</p>
        <Link to="/register" className="cta-btn">Get Started</Link>
      </section>

      {/* Feature: Why Register */}
      <section className="feature-section">
        <div className="feature-header">
          <div className="feature-heading-text">
            <h2>Why Register Your Society?</h2>
            <p className="feature-subtitle">
              Manage your community with powerful, easy-to-use tools designed for student societies.
            </p>
          </div>
          <Link
            to="/register-society"
            className="feature-btn"
            onClick={handleRegisterClick}
          >
            Register Now →
          </Link>
        </div>

        <div className="card-grid">
          <div className="feature-card">
            <img src="assets/events.png" alt="Manage Events" />
            <p>Manage Events</p>
          </div>
          <div className="feature-card">
            <img src="assets/members.avif" alt="Approve Members" />
            <p>Approve Members</p>
          </div>
          <div className="feature-card">
            <img src="assets/profile.png" alt="Custom Profile" />
            <p>Custom Profile</p>
          </div>
          <div className="feature-card">
            <img src="assets/role.png" alt="Assign Roles" />
            <p>Assign Roles</p>
          </div>
          <div className="feature-card">
            <img src="assets/activity.png" alt="Track Activity" />
            <p>Track Activity</p>
          </div>
        </div>
      </section>

      {/* 🔄 Society Carousel */}
      <section className="feature-section">
        <div className="feature-text">
          <h2>Join a Society</h2>
          <p>Find your favorite university society, send join requests, or join instantly with your edu email.</p>

          <div className="society-carousel-container">
            <button className="carousel-arrow left" onClick={scrollLeft}>&lt;</button>

            <div className="society-carousel" id="societyCarousel">
              {societies.map((society, index) => (
                <div key={society._id || index} className="society-card">
                  <img src={society.logo || '/assets/default-logo.png'} alt={society.name} />
                  <h3>{society.name}</h3>
                  <button className="details-btn" onClick={() => handleViewDetails(society._id)}>
                    View Details
                  </button>
                </div>
              ))}
            </div>

            <button className="carousel-arrow right" onClick={scrollRight}>&gt;</button>
          </div>

          <Link to="/JoinSociety" className="feature-btn center-btn">View More</Link>
        </div>
      </section>

      {/* Browse Public Events */}
      <section className="feature-section">
          <div className="feature-text">
            <h2>Browse Public Events</h2>
            <p>Explore campus-wide public events and RSVP without logging in. Stay involved, effortlessly.</p>
          </div>

          <div className="event-carousel-container">
            <button className="carousel-arrow left" onClick={() => scrollEventCarousel(-300)}>‹</button>

            <div className="event-carousel" id="event-carousel">
              {dummyEvents.map((event) => (
                <EventCard key={event._id} event={event} isRsvped={false} onRSVPClick={() => {}} />
              ))}
            </div>

            <button className="carousel-arrow right" onClick={() => scrollEventCarousel(300)}>›</button>
          </div>

          <div className="center-btn">
            <Link to="/events" className="feature-btn">Explore More Events</Link>
          </div>
        </section>




      <Footer />
    </div>
  );
};

export default LandingPage;
