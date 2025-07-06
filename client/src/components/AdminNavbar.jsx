import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word[0].toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <header className="admin-navbar">
      <div className="admin-navbar-left">
        <h2>🛠 Manage Society</h2>
        <span className="society-id">ID: {id}</span>
      </div>

      <div className="admin-navbar-right">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Dashboard
        </button>

        <div className="admin-user">
          <div className="avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt="User Avatar" />
            ) : (
              <span>{getInitials(user?.name)}</span>
            )}
          </div>
          <span className="username">{user?.name}</span>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
