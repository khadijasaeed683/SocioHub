import React from 'react';
import './AdminNavbar.css';

const AdminNavbar = () => {
  return (
    <nav className="admin-navbar">
      <div className="admin-logo">EventNest Admin</div>
      <div className="admin-navbar-right">
        <span className="admin-role">Super Admin</span>
        <button className="logout-btn" onClick={() => window.location.href = '/admin/login'}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
