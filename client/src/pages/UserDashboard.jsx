import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthNavbar from '../components/AuthNavbar'; // updated navbar for logged-in users
import Sidebar from '../components/Sidebar'; // sidebar with society management
import './UserDashboard.css';

const UserDashboard = ({ user, societies, events }) => {
  const navigate = useNavigate();

  const adminSocieties = societies.filter((society) =>
    society.admins.includes(user._id)
  );
  

  return (
    <>
      <AuthNavbar user={user} />
      <div className="dashboard-layout">
        <Sidebar user={user} adminSocieties={adminSocieties} />

        <div className="dashboard-page">
          <h1>Welcome, {user.name}</h1>

          <section className="joined-societies">
            <h2>Your Societies</h2>
            <div className="society-list">
              {societies.map((society) => (
                <div key={society._id} className="society-card">
                  <h3>{society.name}</h3>
                  <p className="role-tag">
                    Role:{' '}
                    {society.admins.includes(user._id) ? 'Admin' : 'Member'}
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
    </>
  );
};

export default UserDashboard;
