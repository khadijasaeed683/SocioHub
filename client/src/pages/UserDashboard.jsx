import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthNavbar from '../components/AuthNavbar';
import Sidebar from '../components/Sidebar';
import './UserDashboard.css';

const dummyUser = {
  _id: 'u123',
  name: 'John Doe',
  email: 'john@example.com',
};

const dummySocieties = [
  {
    _id: 's1',
    name: 'Tech Society',
    admins: ['u123'],
  },
  {
    _id: 's2',
    name: 'Art Society',
    admins: [],
  },
];

const dummyEvents = {
  registered: [
    { _id: 'e1', title: 'TechFest 2025', societyName: 'Tech Society' },
    { _id: 'e2', title: 'Art Gala', societyName: 'Art Society' },
  ],
  upcoming: [
    { _id: 'e3', title: 'Hackathon', date: '2025-08-01' },
    { _id: 'e4', title: 'Painting Workshop', date: '2025-08-10' },
  ],
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const events = dummyEvents;

  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminSocieties, setAdminSocieties] = useState(null)
  const [showUnregisterForm, setShowUnregisterForm] = useState(null);
  const [unregisterReason, setUnregisterReason] = useState('');
  const [password, setPassword] = useState('');

  const handleUnregister = (eventId) => {
    alert(`Unregistered from event ${eventId}. Reason: ${unregisterReason}`);
    setShowUnregisterForm(null);
    setUnregisterReason('');
    setPassword('');
  };
  useEffect(() => {
        const fetchSocieties = async () => {
          try {
            const res = await fetch('http://localhost:5000/api/society/user-societies', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
            const data = await res.json();
    
            if (!res.ok) {
              setError(data.message || 'Failed to fetch societies');
            } else {
              setSocieties([...data.registeredSocieties, ...data.joinedSocieties]);

            }
          } catch (err) {
            setError('Server error. Try again later.');
          } finally {
            setLoading(false);
          }
        };
    
        fetchSocieties();
      }, []);

  return (
    <>
      <AuthNavbar user={user} />
      <div className="dashboard-layout">
        <Sidebar user={user} adminSocieties={adminSocieties} />

        <div className="dashboard-page">
          <h1>Welcome, {user.username}</h1>

          <section className="joined-societies">
            <h2>Your Joined Societies</h2>
            <div className="society-list">
              {societies.map((society) => (
                <div key={society._id} className="society-card">
                  <h3>{society.name}</h3>
                  <p className="role-tag">
                    Role:{' '}
                    {society.createdBy === user._id ? 'Admin' : 'Member'}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="user-events">
            <h2>Your Registered Events</h2>
            <ul>
              {events.registered.map((event) => (
                <li key={event._id}>
                  {event.title} - {event.societyName}
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

          <section className="upcoming-events">
            <h2>Upcoming Events in Your Societies</h2>
            <ul>
              {events.upcoming.map((event) => (
                <li key={event._id}>
                  {event.title} - {event.date}
                </li>
              ))}
            </ul>
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
    </>
  );
};

export default UserDashboard;
