import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './ExploreEvents.css';

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

  const handleRSVP = (eventId) => {
    if (!rsvpedEvents.includes(eventId)) {
      setRsvpedEvents([...rsvpedEvents, eventId]);
    }
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
                onClick={() => handleRSVP(event._id)}
              >
                {rsvpedEvents.includes(event._id) ? 'RSVPed' : 'RSVP'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ExploreEvents;
