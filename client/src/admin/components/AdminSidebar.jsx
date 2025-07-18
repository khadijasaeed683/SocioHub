import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaClipboardList, FaUsers, FaBuilding, FaChartBar } from 'react-icons/fa';
import './AdminSidebar.css';

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <nav>
        <NavLink to="/admin/dashboard/requests" className="admin-link">
          <FaClipboardList /> <span>Pending Requests</span>
        </NavLink>
        <NavLink to="/admin/dashboard/societies" className="admin-link">
          <FaBuilding /> <span>View Societies</span>
        </NavLink>
        <NavLink to="/admin/dashboard/users" className="admin-link">
          <FaUsers /> <span>Manage Users</span>
        </NavLink>
        <NavLink to="/admin/dashboard/reports" className="admin-link">
          <FaChartBar /> <span>Reports</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
