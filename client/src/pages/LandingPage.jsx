import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar'; // ✅ add this
import './LandingPage.css';

import societyImg from '../assets/society.png';
import joinImg from '../assets/join.png';
import eventsImg from '../assets/events.png';

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Navbar stays fixed at the top */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <h1>Manage Your Campus Events Professionally</h1>
        <p>Your all-in-one hub for university societies and events.</p>
        <Link to="/register-society" className="cta-btn">Get Started</Link>
      </section>

      {/* Feature Sections */}
      <section className="feature-section">
        <div className="feature-text">
          <h2>Register a Society</h2>
          <p>Submit official proof and get admin access to manage your events and members with ease.</p>
          <Link to="/register-society" className="feature-btn">Register Now</Link>
        </div>
        <img src={societyImg} alt="Register Society" className="feature-img" />
      </section>

      <section className="feature-section">
        <img src={joinImg} alt="Join Society" className="feature-img" />
        <div className="feature-text">
          <h2>🙋 Join a Society</h2>
          <p>Find your favorite university society, send join requests, or join instantly with your edu email.</p>
          <Link to="/signup" className="feature-btn">Join Now</Link>
        </div>
      </section>

      <section className="feature-section">
        <div className="feature-text">
          <h2>👀 Browse Public Events</h2>
          <p>Explore campus-wide public events and RSVP without logging in. Stay involved, effortlessly.</p>
          <Link to="/events" className="feature-btn">Explore Events</Link>
        </div>
        <img src={eventsImg} alt="Browse Events" className="feature-img" />
      </section>
    </div>
  );
};

export default LandingPage;
