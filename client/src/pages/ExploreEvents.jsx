import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './ExploreEvents.css';
import './RSVPForm.css'; // Assuming RSVPForm styles are here

const dummyEvents = [
  {
    _id: '1',
    title: 'TechFest 2025',
    description: 'A 3-day tech exhibition with competitions and talks.',
    date: '2025-07-15',
    societyName: 'UET Tech Society',
    openToAll: true,
  },
  {
    _id: '2',
    title: 'Art Gala',
    description: 'A display of student artwork with live performances.',
    date: '2025-07-20',
    societyName: 'UET Art Society',
    openToAll: false,
  },
  {
    _id: '3',
    title: 'Literary Slam',
    description: 'Poetry and storytelling night.',
    date: '2025-07-25',
    societyName: 'Literary Society',
    openToAll: true,
  },
];

const ExploreEvents = () => {
  const [rsvpedEvents, setRsvpedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', reason: '' });

  const handleRSVPClick = (event) => {
    setSelectedEvent(event);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setRsvpedEvents((prev) => [...prev, selectedEvent._id]);
    alert('RSVP submitted and is pending society approval.');

    setSelectedEvent(null);
    setFormData({ name: '', email: '', reason: '' });
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
          {dummyEvents.map((event) => (
            <div key={event._id} className="event-card">
              <h3>{event.title}</h3>
              <p className="event-date">📅 {event.date}</p>
              <p className="event-desc">{event.description}</p>
              <p className="event-society">🎓 Hosted by: {event.societyName}</p>
              {event.openToAll && <span className="open-tag">Open to All</span>}

              <button
                disabled={rsvpedEvents.includes(event._id)}
                onClick={() => handleRSVPClick(event)}
              >
                {rsvpedEvents.includes(event._id) ? 'RSVP Pending' : 'RSVP'}
              </button>
            </div>
          ))}
        </div>

        {/* RSVP Form Modal */}
        {selectedEvent && (
          <div className="rsvp-form-modal">
            <div className="rsvp-form-container">
              <h3>RSVP for {selectedEvent.title}</h3>
              <form onSubmit={handleFormSubmit}>
                <label>Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />

                <label>Your Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />

                <label>Reason for Attending (optional)</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                ></textarea>

                <div className="form-actions">
                  <button type="submit">Submit RSVP</button>
                  <button type="button" onClick={() => setSelectedEvent(null)} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ExploreEvents;
