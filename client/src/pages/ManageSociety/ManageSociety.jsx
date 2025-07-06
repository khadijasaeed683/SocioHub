import React from 'react';
import { NavLink, Outlet, useParams, useNavigate } from 'react-router-dom';
import './ManageSociety.css';

const ManageSociety = () => {
  const { id } = useParams(); // society ID
  const navigate = useNavigate();

  // For now, using dummy name — ideally fetch actual name by `id`
  const societyName = id === 'dummy123' ? 'Tech Society' : 'My Society';

  return (
    <>
      {/* ✅ Minimal Navbar */}
      <div className="admin-navbar">
        <div className="admin-navbar-left">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
        </div>
        <div className="admin-navbar-center">
          <h2>{societyName} Management Portal</h2>
        </div>
        <div className="admin-navbar-right" />
      </div>

      {/* ✅ Sidebar + Main */}
      <div className="manage-society-layout">
        <aside className="manage-society-sidebar">
          <h3 className="sidebar-heading">Admin Panel</h3>
          <nav className="sidebar-links">
            <NavLink
              to={`/manage-society/${id}/overview`}
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              Overview
            </NavLink>
            <NavLink
              to={`/manage-society/${id}/members`}
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              Members
            </NavLink>
            <NavLink
              to={`/manage-society/${id}/events`}
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              Events
            </NavLink>
            {/* <NavLink
              to={`/manage-society/${id}/settings`}
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              Settings
            </NavLink> */}
          </nav>
        </aside>

        <main className="manage-society-main">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default ManageSociety;
