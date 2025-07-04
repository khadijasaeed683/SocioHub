import React from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import './ManageSociety.css';

const ManageSociety = () => {
  const { id } = useParams(); // society ID from the route

  return (
    <div className="manage-society-layout">
      {/* Sidebar */}
      <aside className="manage-society-sidebar">
        <h2 className="sidebar-heading">Society Admin</h2>
        <nav className="sidebar-links">
          <NavLink
            to={`/manage-society/${id}/overview`}
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Overview
          </NavLink>
          <NavLink
            to={`/manage-society/${id}/teams`}
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Teams
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
          <NavLink
            to={`/manage-society/${id}/settings`}
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Settings
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="manage-society-main">
        <Outlet /> {/* Nested routes render here */}
      </main>
    </div>
  );
};

export default ManageSociety;
