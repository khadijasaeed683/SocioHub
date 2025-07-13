import React, { useState, useEffect } from 'react';
import { useSociety } from '../../context/SocietyContext';
import {toast} from 'react-toastify';
import './Members.css';


const Members = () => {
  const { society } = useSociety(); // get current society from context
  const [members, setMembers] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingRequests, setPendingRequests] = useState([]);
  // Fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/society/${society._id}/members`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setMembers(data.members);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        toast.error('Failed to fetch members');
      }
    };

    const fetchApplications = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/society/${society._id}/requests`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setPendingRequests(data.requests);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    }
  };

    fetchApplications();
    fetchMembers();
  }, [society._id]);

  const handleApprove = (id) => {
    alert(`Approved application: ${id}`);
    setSelectedApp(null);
  };

  const handleReject = (id) => {
    alert(`Rejected application: ${id}`);
    setSelectedApp(null);
  };

  const handleRemoveMember = (id) => {
    alert(`Removed member: ${id}`);
    setSelectedMember(null);
  };

  const handleChangeRole = (id, newRole) => {
    alert(`Changed role of ${id} to ${newRole}`);
    setSelectedMember(null);
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="members-page">
      <h2>Pending Applications ({pendingRequests.length})</h2>
      <div className="application-list">
        {pendingRequests.length === 0 ? (
          <p>No pending applications.</p>
        ) : (
          pendingRequests.map((app) => (
            <div
              key={app._id}
              className="application-card"
              onClick={() => setSelectedApp(app)}
            >
              <div className="avatar">{app.avatar ? <img src={app.avatar} alt="" /> : app.name[0]}</div>
              <span>{app.name}</span>
            </div>
          ))
        )}
      </div>

      {selectedApp && (
        <div className="app-details-modal">
          <div className="app-details">
            <h3>{selectedApp.name}</h3>
            <p><strong>Email:</strong> {selectedApp.email}</p>
            <p><strong>Why join:</strong> {selectedApp.reason}</p>
            <div className="actions">
              <button onClick={() => handleApprove(selectedApp._id)}>✅ Approve</button>
              <button className="reject-btn" onClick={() => handleReject(selectedApp._id)}>❌ Reject</button>
              <button onClick={() => setSelectedApp(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <h2>Current Members</h2>

      <input
        type="text"
        placeholder="Search members..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="members-list">
        {filteredMembers.map((member) => (
          <div
            key={member._id}
            className="member-card"
            onClick={() => setSelectedMember(member)}
          >
            <div className="avatar">{member.avatar ? <img src={member.avatar} alt="" /> : member.name[0]}</div>
            <div>
              <h4>{member.name}</h4>
              <p className="role">{member.role}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedMember && (
        <div className="app-details-modal">
          <div className="app-details">
            <h3>{selectedMember.name}</h3>
            <p><strong>Email:</strong> {selectedMember.email}</p>
            <p><strong>Role:</strong></p>
            <select
              value={selectedMember.role}
              onChange={(e) => handleChangeRole(selectedMember._id, e.target.value)}
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="actions">
              <button
                className="reject-btn"
                onClick={() => handleRemoveMember(selectedMember._id)}
              >
                Remove
              </button>
              <button onClick={() => setSelectedMember(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;