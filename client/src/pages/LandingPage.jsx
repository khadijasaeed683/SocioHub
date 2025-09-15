import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LandingPage.css';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import SocietyCard from '../components/SocietyCard'; // <-- new import
import { useSelector } from 'react-redux';
import useRSVP from '../hooks/useRSVP';
import RSVPForm from './RSVPForm';

const LandingPage = () => {
  const [societies, setSocieties] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [canScrollSocietyLeft, setCanScrollSocietyLeft] = useState(false);
  const [canScrollSocietyRight, setCanScrollSocietyRight] = useState(true);
  const [canScrollEventLeft, setCanScrollEventLeft] = useState(false);
  const [canScrollEventRight, setCanScrollEventRight] = useState(true);

  const currentUser = useSelector(state => state.auth.user);
  const isLoggedIn = useSelector(state => state.auth.isAuthenticated);
  const navigate = useNavigate();

  // Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/explore-events');
        const data = await res.json();
        if (!res.ok) setError(data.message || 'Failed to fetch events');
        else setEvents(data);
      } catch (err) {
        setError('Server error. Try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Fetch Societies
  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/society/?status=active');
        const data = await res.json();
        if (!res.ok) setError(data.message || 'Failed to fetch societies');
        else setSocieties(data.societies);
      } catch (err) {
        setError('Server error. Try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchSocieties();
  }, []);

  // Scroll state checkers
  useEffect(() => {
    const societyCarousel = document.getElementById('societyCarousel');
    const eventCarousel = document.getElementById('event-carousel');

    const checkSocietyScroll = () => {
      if (!societyCarousel) return;
      setCanScrollSocietyLeft(societyCarousel.scrollLeft > 0);
      setCanScrollSocietyRight(
        societyCarousel.scrollLeft + societyCarousel.clientWidth < societyCarousel.scrollWidth
      );
    };

    const checkEventScroll = () => {
      if (!eventCarousel) return;
      setCanScrollEventLeft(eventCarousel.scrollLeft > 0);
      setCanScrollEventRight(
        eventCarousel.scrollLeft + eventCarousel.clientWidth < eventCarousel.scrollWidth
      );
    };

    societyCarousel?.addEventListener('scroll', checkSocietyScroll);
    eventCarousel?.addEventListener('scroll', checkEventScroll);

    checkSocietyScroll();
    checkEventScroll();

    return () => {
      societyCarousel?.removeEventListener('scroll', checkSocietyScroll);
      eventCarousel?.removeEventListener('scroll', checkEventScroll);
    };
  }, [societies, events]);

  // Scroll functions
  const scrollSocietyCarousel = (direction) => {
    const container = document.getElementById('societyCarousel');
    const scrollAmount = 300;
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  const scrollEventCarousel = (direction) => {
    const container = document.getElementById('event-carousel');
    const scrollAmount = 300;
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  const handleViewDetails = (id) => navigate(`/society/${id}`);

  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (isLoggedIn) navigate('/register-society');
    else {
      toast.warning('Please login first to register your society.');
      navigate('/login');
    }
  };

  const {
    selectedEvent,
    setSelectedEvent,
    formData,
    setFormData,
    handleRSVPClick,
    handleFormSubmit,
  } = useRSVP();

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error: {error}</p>;

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
            <h2>Want to Register Your Society?</h2>
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
            <img src="assets/events-.png" alt="Manage Events" />
            <p>Manage Events</p>
          </div>
          <div className="feature-card">
            <img src="assets/user.png" alt="Approve Members" />
            <p>Approve Members</p>
          </div>
          <div className="feature-card">
            <img src="assets/profile-.png" alt="Custom Profile" />
            <p>Custom Profile</p>
          </div>
          <div className="feature-card">
            <img src="assets/role-.png" alt="Assign Roles" />
            <p>Assign Roles</p>
          </div>
          <div className="feature-card">
            <img src="assets/activity.png" alt="Track Activity" />
            <p>Track Activity</p>
          </div>
        </div>
      </section>

      {/* Society Carousel */}
      <section className="feature-section">
        <div className="feature-text">
          <h2>Join a Society</h2>
          <p>Find your favorite university society, send join requests, or join instantly with your edu email.</p>

          <div className="society-carousel-container">
            <button
              className={`carousel-arrow left ${!canScrollSocietyLeft ? 'disabled' : ''}`}
              onClick={() => scrollSocietyCarousel('left')}
              disabled={!canScrollSocietyLeft}
            >
              ‹
            </button>

            <div className="society-carousel no-scrollbar" id="societyCarousel">
              {societies.map((society, index) => (
                <SocietyCard
                  key={society._id || index}
                  logo={society.logo || '/assets/default-logo.png'}
                  name={society.name}
                  membersCount={society.members ? society.members.length : 0}
                  category={society.type}
                  onClick={() => handleViewDetails(society._id)}
                />
              ))}
            </div>

            <button
              className={`carousel-arrow right ${!canScrollSocietyRight ? 'disabled' : ''}`}
              onClick={() => scrollSocietyCarousel('right')}
              disabled={!canScrollSocietyRight}
            >
              ›
            </button>
          </div>

          <Link to="/JoinSociety" className="feature-btn center-btn">View More</Link>
        </div>
      </section>


      {/* Event Carousel */}
      <section className="feature-section events">
        <div className="feature-text">
          <h2>Browse Public Events</h2>
          <p>
            Explore campus-wide public events and RSVP without logging in. Stay involved, effortlessly.{" "}
            <Link to="/events" className="inline-link">
              Explore Events →
            </Link>
          </p>
        </div>


        <div className="event-carousel-container">
          <button
            className={`carousel-arrow left ${!canScrollEventLeft ? 'disabled' : ''}`}
            onClick={() => scrollEventCarousel('left')}
            disabled={!canScrollEventLeft}
          >
            ‹
          </button>

          <div className="event-carousel no-scrollbar" id="event-carousel">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isRsvped={event.participants?.some(p => p.email === currentUser?.email)}
                onRSVPClick={handleRSVPClick}
              />
            ))}
          </div>

          <button
            className={`carousel-arrow right ${!canScrollEventRight ? 'disabled' : ''}`}
            onClick={() => scrollEventCarousel('right')}
            disabled={!canScrollEventRight}
          >
            ›
          </button>
        </div>
      </section>

      {/* RSVP Form Modal */}
      {selectedEvent && (
        <RSVPForm
          event={selectedEvent}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleFormSubmit}
          onCancel={() => setSelectedEvent(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default LandingPage;
