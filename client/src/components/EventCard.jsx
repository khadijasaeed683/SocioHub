import React from 'react';
import './EventCard.css';

const EventCard = ({ event, isRsvped, onRSVPClick }) => {
  return (
    <div className="event-card">
      {event.poster && (
        <div className="event-poster">
          <img src={event.poster} alt="Event Poster" />
        </div>
      )}

      <div className="event-content">
        <h2 className='event-title'>{event.title}</h2>

        <p className="event-date">
          📅 {new Date(event.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
          })} {event.time ? `at ${event.time}` : ''} 📍 {event.location}
        </p>

        <p className="event-desc">📜 {event.description}</p>
        <p className="event-society">🎓 Hosted by: {event.societyId.name}</p>

        {event.isPublic && <span className="open-tag">Open to All</span>}

        <button
          disabled={isRsvped}
          onClick={() => onRSVPClick(event)}
          className='rsvp-btn'
        >
          {isRsvped ? 'RSVP Pending' : 'RSVP'}
        </button>
      </div>
    </div>
  );
};

export default EventCard;