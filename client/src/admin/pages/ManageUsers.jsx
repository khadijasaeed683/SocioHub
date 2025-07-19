import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import axiosAdmin from '../axiosAdmin';
import { toast } from 'react-toastify';

import './ManageUsers.css';

//also written in AuthNavbar
const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word[0].toUpperCase())
      .slice(0, 2)
      .join('');
  };

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosAdmin.get('/users'); // Adjust endpoint as needed
        setUsers(res.data.users);
      } catch (err) {
        console.error('[ERROR] Fetching users failed:', err);
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const res = await axiosAdmin.delete(`/users/${id}`); // Adjust endpoint as per backend
        setUsers(prev => prev.filter(u => u._id !== id));
        if (selectedUser && selectedUser._id === id) {
          setSelectedUser(null);
        }
        toast.success(res.data.message || 'User deleted successfully');
      } catch (err) {
        console.error('[ERROR] Deleting user failed:', err);
        toast.error(err.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  const handleToggleRole = async (id) => {
    if (window.confirm('Are you sure you want to toggle user role?')) {
      try {
        const res = await axiosAdmin.patch(`/users/${id}/toggle-role`); // Adjust endpoint as per backend
        setUsers(prev =>
          prev.map(user =>
            user._id === id ? { ...user, role: res.data.role } : user
          )
        );
        if (selectedUser && selectedUser._id === id) {
          setSelectedUser(prev => ({ ...prev, role: res.data.role }));
        }
        toast.success(res.data.message || 'User role updated');
      } catch (err) {
        console.error('[ERROR] Toggling role failed:', err);
        toast.error(err.response?.data?.message || 'Failed to toggle user role.');
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      <div className="dashboard-body">
        <AdminSidebar />
        <main className="dashboard-main">
          <h2>Manage Users</h2>

          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar"
            />
            <FaSearch className="search-icon" />
          </div>

          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p className="error-msg">{error}</p>
          ) : (
            <div className="user-cards-container">
              {filteredUsers.length === 0 ? (
                <p>No matching users found.</p>
              ) : (
                filteredUsers.map(user => (
                  <div key={user._id} className="user-card">
                   <div className="user-pfp">
  {user?.pfp ? (
    <img src={user.pfp} alt="Profile" />
  ) : (
    <span>{getInitials(user?.username)}</span>
  )}
</div>

                    <div className="card-body">
                      <h3>{user.username}</h3>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Role:</strong> {user.role}</p>
                      <p><strong>Societies:</strong> {user.societies?.length || 0}</p>
                      <p><strong>Events Registered:</strong> {user.registeredEvents?.length || 0}</p>
                      <button
                        className="view-details-btn"
                        onClick={() => setSelectedUser(user)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {selectedUser && (
            <div className="user-details-popup">
              <div className="details-header">
                <h3>{selectedUser.username}</h3>
                <button className="close-btn" onClick={() => setSelectedUser(null)}>✖</button>
              </div>
              <img src={selectedUser.pfp || '/default-pfp.png'} alt="Profile" className="details-pfp" />
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Societies:</strong> {selectedUser.societies?.join(', ') || 'None'}</p>
              <p><strong>Events Registered:</strong> {selectedUser.registeredEvents?.join(', ') || 'None'}</p>

              <div className="details-actions">
                <button
                  className="toggle-role-btn"
                  onClick={() => handleToggleRole(selectedUser._id)}
                >
                  Toggle Role
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(selectedUser._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageUsers;
