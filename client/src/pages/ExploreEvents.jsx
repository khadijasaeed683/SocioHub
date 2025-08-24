import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import RSVPForm from './RSVPForm';
import './ExploreEvents.css';
import useRSVP from '../hooks/useRSVP';
import { useSelector } from 'react-redux';
import Footer from '../components/Footer'; // ✅ Import Footer

const ExploreEvents = () => {
  const currentUser = useSelector(state => state.auth.user);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ state for search

  const {
    selectedEvent,
    setSelectedEvent,
    formData,
    setFormData,
    handleRSVPClick,
    handleFormSubmit,
  } = useRSVP();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/explore-events');
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Failed to fetch events');
        } else {
          setEvents(data);
        }
      } catch (err) {
        setError('Server error. Try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // ✅ Filter events by search query
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="explore-events-page">
        <h2>Upcoming Events</h2>

        {/* ✅ Search Bar */}
        <input
          type="text"
          placeholder="Search events by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="eventsearch-bar"
        />

        <div className="events-list">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isRsvped={event.participants?.some(p => p.email === currentUser?.email)}
                onRSVPClick={handleRSVPClick}
              />
            ))
          ) : (
            <p>No events found.</p>
          )}
        </div>

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
      </div>

      {/* ✅ Footer */}
      <Footer />
    </>
  );
};

export default ExploreEvents;
