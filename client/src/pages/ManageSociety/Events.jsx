import React, { useState, useEffect } from 'react';
import './Events.css';
import { useSociety } from '../../context/SocietyContext';
import { toast } from 'react-toastify'

const Events = () => {
  const { society } = useSociety();
  const [showForm, setShowForm] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

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

  const handleSubmit = async (e, customData = null, customId = null) => {
    if (e) e.preventDefault();

    const eventFormData = new FormData();
    const dataToSend = customData || formData;
    const idToEdit = customId || editEventId;
    for (const key in dataToSend) {
      if (dataToSend[key] !== undefined && dataToSend[key] !== null && dataToSend[key] !== '') {
        eventFormData.append(key, dataToSend[key]);
      }
    }
    try {
      const res = await fetch(
        idToEdit
          ? `http://localhost:5000/api/event/${idToEdit}`
          : `http://localhost:5000/api/society/${society._id}/event`,
        {
          method: idToEdit ? 'PATCH' : 'POST',
          body: eventFormData,
          credentials: 'include'
        }
      );

      const data = await res.json();
      console.log(data);
      if (res.ok) {
        toast.success(data.message);
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

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const eventDate = new Date(data.event.date);
        eventDate.setHours(0, 0, 0, 0);

        if (eventDate >= now) {
  setUpcomingEvents((prev) => {
    const exists = prev.some(ev => ev._id === data.event._id);
    return exists ? prev.map(ev => ev._id === data.event._id ? data.event : ev)
                  : [data.event, ...prev];
  });
} else {
  setPastEvents((prev) => {
    const exists = prev.some(ev => ev._id === data.event._id);
    return exists ? prev.map(ev => ev._id === data.event._id ? data.event : ev)
                  : [data.event, ...prev];
  });
}

      } else {
        toast.error(data.message);
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
    let targetEvent = upcomingEvents.find(ev => ev._id === confirmTargetId) ||
      pastEvents.find(ev => ev._id === confirmTargetId);
    if (confirmAction === 'toggle') {
      setEditEventId(confirmTargetId);
      // console.log("confirmTargetId: ", confirmTargetId);
      // console.log("editEventId: ", editEventId);
      // console.log("selected event to update: ", targetEvent)
      setTimeout(() => {
        handleSubmit(null, { rsvpOpen: !targetEvent.rsvpOpen }, confirmTargetId);
      }, 0);
    }
    else if (confirmAction === 'delete') {
      try {
        const res = await fetch(`http://localhost:5000/api/event/${confirmTargetId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok) {
          const now = new Date();
          now.setHours(0, 0, 0, 0);

          const eventDate = new Date(targetEvent.date);
          eventDate.setHours(0, 0, 0, 0);

          if (eventDate >= now) {
            setUpcomingEvents((prev) => prev.filter(ev => ev._id !== confirmTargetId));
          } else {
            setPastEvents((prev) => prev.filter(ev => ev._id !== confirmTargetId));
          }
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error(error);
      }
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

  // const today = new Date();
  // const upcomingEvents = events?.filter((e) => new Date(e.date) >= today);
  // const pastEvents = events?.filter((e) => new Date(e.date) < today);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/society/${society._id}/event?include=all`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        const data = await res.json();
        console.log(data)
        if (res.ok) {
          setUpcomingEvents(data.upcoming);
          setPastEvents(data.past);
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
                showRSVPList.participants.map((participant, idx) => (
                  <li key={idx}>
                    {participant.name} ({participant.email}) {/* adjust fields as needed */}
                  </li>
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
        {/* Upcoming Events */}
        <h3>Upcoming Events</h3>
        {Array.isArray(upcomingEvents) && upcomingEvents.length > 0 ? (
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
                  {event.participants && event.participants.length > 0 && (
                    <button onClick={() => setShowRSVPList(event)}>
                      📋 View RSVPs
                    </button>
                  )}

                  <button onClick={() => handleConfirmation(event._id, 'delete')}>🗑️ Delete</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No upcoming events.</p>
        )}

        {/* Past Events */}
        <h3>Past Events</h3>
        {Array.isArray(pastEvents) && pastEvents.length > 0 ? (
          pastEvents.map((event) => (
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
                  {event.participants && event.participants.length > 0 && (
                    <button onClick={() => setShowRSVPList(event)}>
                      📋 View RSVPs
                    </button>
                  )}
                  <button onClick={() => handleConfirmation(event._id, 'delete')}>🗑️ Delete</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No past events.</p>
        )}
      </div>
    </div>
  );
};

export default Events;


const formatTime = (timeString) => {
  if (!timeString || typeof timeString !== 'string') return ''; // or return 'Invalid time'

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

