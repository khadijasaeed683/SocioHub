import React, { useState } from 'react';
import AdminNavbar from './components/AdminNavbar';
import AdminSidebar from './components/AdminSidebar';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="admin-dashboard">
      <AdminNavbar toggleSidebar={toggleSidebar} />
      <div className={`dashboard-body ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <AdminSidebar isOpen={isSidebarOpen} />
        <div className="dashboard-main">
          <h2>Welcome to Admin Dashboard</h2>
          <p>Select a section from the sidebar to begin managing the platform.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
