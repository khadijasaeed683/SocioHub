import React, { useState, useEffect } from 'react';
import './Events.css';
import { useSociety } from '../../context/SocietyContext';
import {toast} from 'react-toastify';
import EventForm from '../../components/EventForm';


const Events = () => {
  const { society } = useSociety();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    banner: '',
    startTime:'',
    endTime:''
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
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // if auth needed
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
    <div className="events-management-container">
      <div className="events-header">
        <h2>Events Management</h2>
        <button className="create-event-btn" onClick={openCreateForm}>
          + Create New Event
        </button>
      </div>

      {showForm && (
  <EventForm
    formData={formData}
    setFormData={setFormData}
    handleSubmit={handleSubmit}
    isEditing={!!editEventId}
    cancelForm={() => setShowForm(false)}
  />
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
                <p>📅 {new Date(event.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</p>
                <p>{event.description}</p>
                <p>👥 Registrations: {event.participants.length}</p>
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
