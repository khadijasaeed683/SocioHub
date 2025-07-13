import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthNavbar from '../components/AuthNavbar';
import Sidebar from '../components/Sidebar';
import './UserDashboard.css';
import SocietyCard from '../components/SocietyCard';
import EventCard from '../components/EventCard';
import RSVPForm from './RSVPForm'; // adjust path if needed
import useRSVP from '../hooks/useRSVP'; // custom hook for RSVP logic


const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : { _id: 'u123', username: 'John Doe' };
    });

    useEffect(() => {
      // Example: if you ever want to update localStorage when user changes
      localStorage.setItem('user', JSON.stringify(user));
    }, [user]);  


  const [societies, setSocieties] = useState([]);
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [error, setError] = useState('');
  const [showUnregisterForm, setShowUnregisterForm] = useState(null);
  const [unregisterReason, setUnregisterReason] = useState('');
  const [password, setPassword] = useState('');
  

  const handleUnregister = (eventId) => {
    alert(`Unregistered from event ${eventId}. Reason: ${unregisterReason}`);
    setShowUnregisterForm(null);
    setUnregisterReason('');
    setPassword('');
  };
  const {
 selectedEvent,
    setSelectedEvent,
    formData,
    setFormData,
    handleRSVPClick,
    handleFormSubmit,
    handleInputChange,
} = useRSVP();

  useEffect(() => {
    if (!user?._id) return;

    const fetchSocietiesAndUpcomingEvents = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/${user._id}/societies`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
      const message = data.message || 'Failed to fetch events';
      setError(message);
      console.error('Error fetching events:', message);
    }

      const societiesFetched = [...data.registeredSocieties, ...data.joinedSocieties];
      setSocieties(societiesFetched);

      // Fetch upcoming events for each society
      const upcomingEventsMap = {};
      await Promise.all(
        societiesFetched.map(async (society) => {
          try {
            const eventsRes = await fetch(`http://localhost:5000/api/society/${society._id}/event?upcoming=true`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
            });
            const eventsData = await eventsRes.json();

            if (eventsRes.ok) {
              upcomingEventsMap[society._id] = eventsData;
            } else {
              upcomingEventsMap[society._id] = [];
            }
          } catch (err) {
            console.error(`Error fetching upcoming events for society ${society._id}:`, err);
            upcomingEventsMap[society._id] = [];
          }
        })
      );

      setUpcomingEvents(upcomingEventsMap);

    } catch (err) {
      setError('Server error. Try again later.');
    } 
  };

    const fetchEvents = async () => {
      try { 
        const res = await fetch(`http://localhost:5000/api/user/${user._id}/events`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Failed to fetch events');
          console.error('Error fetching events:', error);
        } else {
          setEvents(data);
        }
      } catch (err) {
        setError('Server error. Try again later.');
      }
    };

    fetchEvents();
    fetchSocietiesAndUpcomingEvents();

  }, [user._id, error]);
  // console.log("User Dashboard societies:", societies);
  // console.log("User Dashboard events:", events);
  // console.log("User Dashboard upcomingEvents:", upcomingEvents);
  // Use dummySocieties for Sidebar testing instead of fetched societies
  const adminSocieties = societies.filter(s => s.createdBy === user._id);
  const allUpcomingEvents = Object.values(upcomingEvents).flat();


  // ✅ Logout function
  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <AuthNavbar user={user} onSignOut={handleSignOut} />
      <div className="dashboard-layout">
        <Sidebar
          user={user}
          societies={adminSocieties}
        />

        <div className="dashboard-page">
          <h1>Welcome, {user.username}</h1>

          <section className="joined-societies">
            <h2>Your Joined Societies</h2>
            <div className="society-list">
              {societies.map((society) => (
                <SocietyCard key={society._id} society={society} user={user} />
              ))}
            </div>
          </section>

          <section className="user-events">
            <h2>Your Registered Events</h2>
            {events && events.length > 0 ? (
              <ul>
                {events.map((event) => (
                  <li key={event._id}>
                    {event.title} - {event.societyId.name}
                    <button
                      className="unregister-btn"
                      onClick={() => setShowUnregisterForm(event._id)}>
                      Unregister
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No registered events to show.</p>
            )}
          </section>


          <section className="upcoming-events">
  <h2>Upcoming Events in Your Societies</h2>

  {allUpcomingEvents.length > 0 ? (
    <div className="event-cards-container">
      {allUpcomingEvents.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          isRsvped={false}
          onRSVPClick={handleRSVPClick}
        />
      ))}
    </div>
  ) : (
    <p>No upcoming events to show.</p>
  )}
</section>



          <div className="explore-button">
            <button onClick={() => navigate('/JoinSociety')}>
              Explore More Societies
            </button>
          </div>
        </div>
      </div>

      {showUnregisterForm && (
        <div className="unregister-modal">
          <div className="unregister-container">
            <h3>Confirm Unregistration</h3>
            <p>Reason for leaving:</p>
            <textarea
              value={unregisterReason}
              onChange={(e) => setUnregisterReason(e.target.value)}
              placeholder="Enter your reason"
              required
            ></textarea>

            <p>Confirm your password:</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />

            <div className="form-actions">
              <button
                onClick={() => handleUnregister(showUnregisterForm)}
                disabled={!unregisterReason || !password}
              >
                Confirm Unregister
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowUnregisterForm(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedEvent && (
          <RSVPForm
            event={selectedEvent}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleFormSubmit}
            onCancel={() => setSelectedEvent(null)}
            onInputChange={handleInputChange}
          />
        )}
    </>
  );
};

export default UserDashboard;
