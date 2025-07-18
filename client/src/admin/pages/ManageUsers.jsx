import React, { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import './ManageUsers.css'; // Create this CSS for styling

const dummyUsers = [
  {
    _id: 'u1',
    username: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'guest',
    pfp: '/pfps/user1.png',
    societies: ['s1', 's2'],
    registeredEvents: ['e1']
  },
  {
    _id: 'u2',
    username: 'Bob Smith',
    email: 'bob@example.com',
    role: 'society-admin',
    pfp: '/pfps/user2.png',
    societies: ['s3'],
    registeredEvents: ['e2', 'e3']
  },
  {
    _id: 'u3',
    username: 'Charlie Ahmed',
    email: 'charlie@example.com',
    role: 'super-admin',
    pfp: '/pfps/user3.png',
    societies: [],
    registeredEvents: []
  }
];

const ManageUsers = () => {
  const [users, setUsers] = useState(dummyUsers);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          </div>

          <div className="user-list">
            {filteredUsers.length === 0 ? (
              <p>No matching users found.</p>
            ) : (
              filteredUsers.map(user => (
                <div key={user._id} className="user-card">
                  <img src={user.pfp} alt="Profile" className="user-pfp" />
                  <div className="user-info">
                    <h3>{user.username}</h3>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <p><strong>Societies:</strong> {user.societies.length}</p>
                    <p><strong>Events Registered:</strong> {user.registeredEvents.length}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageUsers;
