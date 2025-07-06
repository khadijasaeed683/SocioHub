import React, { useState } from 'react';
import './Events.css';

const initialEvents = [
  {
    _id: 'e1',
    title: 'Tech Symposium 2025',
    date: '2025-07-25',
    description: 'Annual symposium featuring tech talks and panels.',
    banner: 'https://via.placeholder.com/600x200?text=Tech+Symposium',
    registrations: 58,
    rsvpOpen: true,
    registeredUsers: ['Alice', 'Bob', 'Charlie'],
  },
  {
    _id: 'e2',
    title: 'Hackathon Night',
    date: '2025-06-20',
    description: '12-hour overnight hackathon.',
    banner: 'https://via.placeholder.com/600x200?text=Hackathon+Night',
    registrations: 91,
    rsvpOpen: false,
    registeredUsers: ['Dana', 'Eve'],
  },
];

const Events = () => {
  const [events, setEvents] = useState(initialEvents);
  const [showForm, setShowForm] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    banner: '',
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmTargetId, setConfirmTargetId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(''); // 'toggle' or 'delete'

  const [showRSVPList, setShowRSVPList] = useState(null);

  const openCreateForm = () => {
    setFormData({ title: '', date: '', description: '', banner: '' });
    setEditEventId(null);
    setShowForm(true);
  };

  const openEditForm = (event) => {
    setFormData({ ...event });
    setEditEventId(event._id);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editEventId) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev._id === editEventId ? { ...formData, _id: editEventId, registrations: ev.registrations, rsvpOpen: ev.rsvpOpen, registeredUsers: ev.registeredUsers } : ev
        )
      );
    } else {
      const newId = `e${Date.now()}`;
      setEvents((prev) => [
        { _id: newId, ...formData, registrations: 0, rsvpOpen: true, registeredUsers: [] },
        ...prev,
      ]);
    }
    setShowForm(false);
    setEditEventId(null);
    setFormData({ title: '', date: '', description: '', banner: '' });
  };

  const handleConfirmation = (eventId, action) => {
    setConfirmTargetId(eventId);
    setConfirmAction(action);
    setShowConfirm(true);
  };

  const confirmActionHandler = () => {
    if (confirmAction === 'toggle') {
      setEvents((prev) =>
        prev.map((ev) =>
          ev._id === confirmTargetId ? { ...ev, rsvpOpen: !ev.rsvpOpen } : ev
        )
      );
    } else if (confirmAction === 'delete') {
      setEvents((prev) => prev.filter((ev) => ev._id !== confirmTargetId));
    }
    setShowConfirm(false);
    setConfirmTargetId(null);
    setConfirmAction('');
  };

  const cancelActionHandler = () => {
    setShowConfirm(false);
    setConfirmTargetId(null);
    setConfirmAction('');
  };

  const today = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.date) >= today);
  const pastEvents = events.filter((e) => new Date(e.date) < today);

  return (
    <div className="events-management-container">
      <div className="events-header">
        <h2>Events Management</h2>
        <button className="create-event-btn" onClick={openCreateForm}>
          + Create New Event
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-form">
            <h3>{editEventId ? 'Edit Event' : 'Create Event'}</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="title" placeholder="Event Title" value={formData.title} onChange={handleInputChange} required />
              <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
              <input type="text" name="banner" placeholder="Banner Image URL" value={formData.banner} onChange={handleInputChange} required />
              <textarea name="description" placeholder="Event Description" value={formData.description} onChange={handleInputChange} required></textarea>
              <div className="form-actions">
                <button type="submit">{editEventId ? 'Update' : 'Create'}</button>
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-form">
            <h4>Are you sure you want to {confirmAction === 'toggle' ? 'toggle RSVP' : 'delete'} this event?</h4>
            <div className="form-actions">
              <button onClick={confirmActionHandler}>Yes</button>
              <button className="cancel-btn" onClick={cancelActionHandler}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showRSVPList && (
        <div className="modal-overlay">
          <div className="modal-form">
            <h4>RSVP List</h4>
            <ul>
              {showRSVPList.registeredUsers.map((name, idx) => (
                <li key={idx}>{name}</li>
              ))}
            </ul>
            <div className="form-actions">
              <button className="cancel-btn" onClick={() => setShowRSVPList(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="events-section">
        {/* <h3>Upcoming Events</h3> */}
        {upcomingEvents.length === 0 ? <p>No upcoming events.</p> : (
          upcomingEvents.map((event) => (
            <div key={event._id} className="event-card">
              <img src={event.banner} alt={event.title} className="event-banner" />
              <div className="event-details">
                <h4>{event.title}</h4>
                <p>📅 {event.date}</p>
                <p>{event.description}</p>
                <p>👥 Registrations: {event.registrations}</p>
                <p>🔓 RSVP: {event.rsvpOpen ? 'Open' : 'Closed'}</p>
                <div className="event-actions">
                  <button onClick={() => openEditForm(event)}>✏️ Edit</button>
                  <button onClick={() => handleConfirmation(event._id, 'toggle')}>
                    {event.rsvpOpen ? '🔒 Close RSVP' : '🔓 Open RSVP'}
                  </button>
                  <button onClick={() => setShowRSVPList(event)}>📋 View RSVPs</button>
                  <button onClick={() => handleConfirmation(event._id, 'delete')}>🗑️ Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="events-section">
        {/* <h3>Past Events</h3> */}
        {pastEvents.length === 0 ? <p>No past events.</p> : (
          pastEvents.map((event) => (
            <div key={event._id} className="event-card">
              <img src={event.banner} alt={event.title} className="event-banner" />
              <div className="event-details">
                <h4>{event.title}</h4>
                <p>📅 {event.date}</p>
                <p>{event.description}</p>
                <p>👥 Registrations: {event.registrations}</p>
                <p>🔓 RSVP: {event.rsvpOpen ? 'Open' : 'Closed'}</p>
                <div className="event-actions">
                  <button onClick={() => openEditForm(event)}>✏️ Edit</button>
                  <button onClick={() => handleConfirmation(event._id, 'toggle')}>
                    {event.rsvpOpen ? '🔒 Close RSVP' : '🔓 Open RSVP'}
                  </button>
                  <button onClick={() => setShowRSVPList(event)}>📋 View RSVPs</button>
                  <button onClick={() => handleConfirmation(event._id, 'delete')}>🗑️ Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
