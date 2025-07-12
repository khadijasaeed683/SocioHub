import React, { useState, useEffect } from 'react';
import './Events.css';
import { useSociety } from '../../context/SocietyContext';
import {toast} from 'react-toastify'
const Events = () => {
  const { society } = useSociety();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editEventId, setEditEventId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    poster: null,
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmTargetId, setConfirmTargetId] = useState(null);
  const [confirmAction, setConfirmAction] = useState('');

  const [showRSVPList, setShowRSVPList] = useState(null);

  const openCreateForm = () => {
    setFormData({
      title: '',
      date: '',
      description: '',
      startTime: '',
      endTime: '',
      location: '',
      poster: null,
    });
    setEditEventId(null);
    setShowForm(true);
  };

  const openEditForm = (event) => {
    setFormData({
      title: event.title,
      date: event.date?.slice(0, 10),
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      poster: null,
    });
    setEditEventId(event._id);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'poster') {
      setFormData((prev) => ({ ...prev, poster: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventFormData = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        eventFormData.append(key, formData[key]);
      }
    }

    try {
      const res = await fetch(
        editEventId
          ? `http://localhost:5000/api/event/${editEventId}`
          : `http://localhost:5000/api/society/${society._id}/event`,
        {
          method: editEventId ? 'PUT' : 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: eventFormData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        setShowForm(false);
        setEditEventId(null);
        setFormData({
          title: '',
          date: '',
          description: '',
          startTime: '',
          endTime: '',
          location: '',
          poster: null,
        });

        setEvents((prev) =>
          editEventId ? prev.map((ev) => (ev._id === editEventId ? data : ev)) : [data, ...prev]
        );
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const handleConfirmation = (eventId, action) => {
    setConfirmTargetId(eventId);
    setConfirmAction(action);
    setShowConfirm(true);
  };

  const confirmActionHandler = async () => {
  if (confirmAction === 'toggle') {
    try {
      const eventToToggle = events.find(ev => ev._id === confirmTargetId);
      const res = await fetch(`http://localhost:5000/api/society/${society._id}/event/${confirmTargetId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rsvpOpen: !eventToToggle.rsvpOpen })
      });

      const data = await res.json();

      if (res.ok) {
        // Update local state to reflect backend change
        setEvents((prev) =>
          prev.map((ev) =>
            ev._id === confirmTargetId ? { ...ev, rsvpOpen: data.event.rsvpOpen } : ev
          )
        );
        toast.success(data.message);
      } else {
        console.error('Error toggling RSVP:', data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Server error toggling RSVP:', error);
      toast.error(error);
    }
  } else if (confirmAction === 'delete') {
    setEvents((prev) => prev.filter((ev) => ev._id !== confirmTargetId));
    // Add your delete API call here if you implement it server-side
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/society/${society._id}/event?upcoming=true`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setEvents(data);
        } else {
          console.error('Error fetching events:', data.message);
        }
      } catch (error) {
        console.error('Server error while fetching events:', error);
      }
    };

    fetchEvents();
  }, [society._id]);

  return (
    <div className="eventspage">
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
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
              <div className="time-input-group">
                <span className="input-label">Start Time</span>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="time-input-group">
                <span className="input-label">End Time</span>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="description"
                placeholder="Event Description"
                value={formData.description}
                onChange={handleInputChange}
                required
              ></textarea>
              <label>Upload Event Poster:</label>
              <input
                type="file"
                name="poster"
                accept="image/*"
                onChange={handleInputChange}
                required={!editEventId}
              />
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
            <h4>Are you sure you want to {confirmAction === 'toggle' ? 'change RSVP' : 'delete'} this event?</h4>
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
        {showRSVPList.participants.length > 0 ? (
          showRSVPList.participants.map((name, idx) => (
            <li key={idx}>{name}</li>
          ))
        ) : (
          <li>No RSVPs yet.</li>
        )}
      </ul>
      <div className="form-actions">
        <button className="cancel-btn" onClick={() => setShowRSVPList(null)}>Close</button>
      </div>
    </div>
  </div>
)}


      <div className="events-section">
        <h3>Upcoming Events</h3>
        {upcomingEvents.length === 0 ? <p>No upcoming events.</p> : (
          upcomingEvents.map((event) => (
            <div key={event._id} className="event-card">
              <img src={event.poster} alt={event.title} className="event-banner" />
              <div className="event-details">
                <h4>{event.title}</h4>
                <p>📅 {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p>{event.description}</p>
                <p>📍 Location: {event.location}</p>
                <p>🕒 {formatTime(event.startTime)} – {formatTime(event.endTime)}</p>
                <p>👥 Registrations: {event.participants?.length || 0}</p>
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


const formatTime = (timeString) => {
  const [hour, minute] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hour));
  date.setMinutes(parseInt(minute));
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};
