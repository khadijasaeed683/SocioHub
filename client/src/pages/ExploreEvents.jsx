import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard'; // Assuming EventCard is a separate component
import RSVPForm from './RSVPForm'; // Assuming RSVPForm is a separate component
import './ExploreEvents.css';
import './RSVPForm.css'; // Assuming RSVPForm styles are here


const ExploreEvents = () => {
  const [rsvpedEvents, setRsvpedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', reason: '' });

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
  
  const handleRSVPClick = (event) => {
    setSelectedEvent(event);
  };

  const handleFormSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`http://localhost:5000/api/explore-events/${selectedEvent._id}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      }),
    });
    console.log('Submitting RSVP with data:', formData);

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Registration failed');
    } else {
      alert('✅ ' + data.message);
      // Optionally close form or refresh events
      setSelectedEvent(null);
      setFormData({ name: '', email: '', phone: '' }); // Reset form data
    }
  } catch (error) {
    console.error(error);
    setError('Server error. Please try again later.');
  }
};


  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <Navbar />
      <div className="explore-events-page">
        <h2>Upcoming Events</h2>
        <div className="events-list">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              isRsvped={false} // Replace with your RSVP state logic
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
