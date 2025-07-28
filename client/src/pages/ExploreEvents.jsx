import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard'; // Assuming EventCard is a separate component
import RSVPForm from './RSVPForm'; // Assuming RSVPForm is a separate component
import './ExploreEvents.css';
import useRSVP from '../hooks/useRSVP'; // custom hook for RSVP logic
import { useSelector } from 'react-redux';

const ExploreEvents = () => {
  // const [rsvpedEvents, setRsvpedEvents] = useState([]);
  const currentUser = useSelector(state => state.auth.user);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <>
      <Navbar />
      <div className="explore-events-page">
        <h2>Upcoming Events</h2>
        <div className="events-list">
          {
            console.log(events)}{
            events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isRsvped={event.participants?.some(p => p.email === currentUser?.email)}
                onRSVPClick={handleRSVPClick}
              />

            ))}
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
    </>
  );
};

export default ExploreEvents;
