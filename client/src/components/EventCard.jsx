import React from 'react';
import './EventCard.css'; // Create CSS if needed

const EventCard = ({ event, isRsvped, onRSVPClick }) => {
  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p className="event-date">
        📅 {new Date(event.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })} {event.time ? `at ${event.time}` : ''}
    </p>

      <p className="event-location">📍 {event.location}</p>
      <p className="event-desc">{event.description}</p>

      <p className="event-society">🎓 Hosted by: {event.societyId.name}</p>
      {event.openToAll && <span className="open-tag">Open to All</span>}

      <button
        disabled={isRsvped}
        onClick={() => onRSVPClick(event)}
      >
        {isRsvped ? 'RSVP Pending' : 'RSVP'}
      </button>
    </div>
  );
};

export default EventCard;
