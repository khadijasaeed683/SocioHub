import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthNavbar from '../components/AuthNavbar';
import Sidebar from '../components/Sidebar';
import './UserDashboard.css';
import SocietyCard from '../components/UserSocietyCard';
import EventCard from '../components/EventCard';
import RSVPForm from './RSVPForm';
import useRSVP from '../hooks/useRSVP';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const [societies, setSocieties] = useState([]);
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [error, setError] = useState('');
  const [showUnregisterForm, setShowUnregisterForm] = useState(null);
  const [unregisterReason, setUnregisterReason] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  const handleUnregister = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      // const data = await response.json();
      if (!response.ok) {
        toast.error('Unregistration failed');
      } else {
        toast.success('Unregistered successfully');
        setEvents(events.filter(event => event._id !== eventId));
        fetchDashboardData();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to unregister');
    } finally {
      setShowUnregisterForm(null);
      setUnregisterReason('');
      setPassword('');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const res1 = await fetch(`http://localhost:5000/api/user/events`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data1 = await res1.json();
      if (res1.ok) setEvents(data1);

      const res2 = await fetch(`http://localhost:5000/api/user/societies`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data2 = await res2.json();
      console.log(data2)
      if (res2.ok) {
        const societiesFetched = [...data2.registeredSocieties, ...data2.joinedSocieties];
        setSocieties(societiesFetched);

        const upcomingEventsMap = {};
        const pastEventsMap = {};

        await Promise.all(
          societiesFetched.map(async (society) => {
            try {
              const eventsRes = await fetch(`http://localhost:5000/api/society/${society._id}/event?include=all`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
              });
              const eventsData = await eventsRes.json();
              if (eventsRes.ok) {
                upcomingEventsMap[society._id] = eventsData.upcoming;
                pastEventsMap[society._id] = eventsData.past;
              }
            } catch {
              upcomingEventsMap[society._id] = [];
              pastEventsMap[society._id] = [];
            }
          })
        );

        setUpcomingEvents(upcomingEventsMap);
        setPastEvents(pastEventsMap);
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?._id) return;
    fetchDashboardData();
  }, [user?._id]);

  const {
    selectedEvent,
    setSelectedEvent,
    formData,
    setFormData,
    handleRSVPClick,
    handleFormSubmit,
    handleInputChange,
  } = useRSVP(fetchDashboardData);

  const adminSocieties = societies.filter(s => s.createdBy === user._id);
  const allUpcomingEvents = Object.values(upcomingEvents).flat();
  const allPastEvents = Object.values(pastEvents).flat();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <AuthNavbar user={user} onSignOut={handleSignOut} />
      <div className="dashboard-layout">
        <Sidebar user={user} societies={adminSocieties} />

        <div className="dashboard-page">
          <h1>Welcome, {user.username}</h1>

          {societies.some(s => s.deactivated === false && s.approved === true) && (
            <section className="joined-societies">
              <h2>Active Societies</h2>
              <div className="society-list">
                {societies
                  .filter(s => s.deactivated === false && s.approved === true)
                  .map(s => (
                    <SocietyCard key={s._id} society={s} user={user} />
                  ))}
              </div>
            </section>
          )}

          {societies.some(s => s.deactivated === true) && (
            <section className="joined-societies">
              <h2>Deactivated Societies</h2>
              <div className="society-list">
                {societies
                  .filter(s => s.deactivated === true)
                  .map(s => (
                    <SocietyCard key={s._id} society={s} user={user} />
                  ))}
              </div>
            </section>
          )}

          {societies.some(s => s.approved === false) && (
            <section className="joined-societies">
              <h2>Pending Societies</h2>
              <div className="society-list">
                {societies
                  .filter(s => s.approved === false)
                  .map(s => (
                    <SocietyCard key={s._id} society={s} user={user} />
                  ))}
              </div>
            </section>
          )}

          {events.length > 0 && (
            <section className="user-events">
              <h2>Registered Events</h2>
              <ul>
                {events.map(event => (
                  <li key={event._id}>
                    {event.title} - {event.societyId.name}
                    <button
                      className="unregister-btn"
                      onClick={() => setShowUnregisterForm(event._id)}
                    >
                      Unregister
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {allUpcomingEvents.length > 0 && (
            <section className="upcoming-events">
              <h2>Upcoming Events in Your Societies</h2>
              <div className="event-cards-container">
                {allUpcomingEvents.map(event => (
                  <EventCard
                    key={event._id}
                    event={event}
                    isRsvped={event.participants.some(r => r.email === user.email)}
                    onRSVPClick={handleRSVPClick}
                  />
                ))}
              </div>
            </section>
          )}

          {allPastEvents.length > 0 && (
            <section className="past-events">
              <h2>Past Events in Your Societies</h2>
              <div className="event-cards-container">
                {allPastEvents.map(event => (
                  <EventCard
                    key={event._id}
                    event={event}
                    isRsvped={event.participants.some(r => r.email === user.email)}
                    onRSVPClick={handleRSVPClick}
                  />
                ))}
              </div>
            </section>
          )}

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
