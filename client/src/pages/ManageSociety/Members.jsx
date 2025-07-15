import React, { useState, useEffect } from 'react';
import { useSociety } from '../../context/SocietyContext';
import {toast} from 'react-toastify';
import './Members.css';


const Members = () => {
  const { society , setSociety} = useSociety(); // get current society from context
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

  
  const handleRequestAction = async (reqId, action) => {
    try {
      const res = await fetch(`http://localhost:5000/api/society/${society._id}/requests/${reqId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || `${action} failed`);
      } else {
        toast.success(`Request ${action}ed successfully`);
        // Update context and local state
        setSociety(data.society);
        setPendingRequests(data.society.pendingRequests);
        setMembers(prev => [...prev, data.newMember]);
      }
    } catch (err) {
      console.error(`Error on ${action}ing request:`, err);
      toast.error('Server error');
    }
    setSelectedApp(null);
  };

  const handleRemoveMember = async (memberId) => {
  if (!window.confirm('Are you sure you want to remove this member?')) return;

  try {
    const res = await fetch(`http://localhost:5000/api/society/${society._id}/members/${memberId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || 'Failed to remove member');
    } else {
      toast.success('Member removed successfully');
      // Update local members state by removing the member
      setMembers(prev => prev.filter(member => member._id !== memberId));
      // Optionally update society context if needed
      setSociety(data.society);
    }
  } catch (err) {
    console.error('Error removing member:', err);
    toast.error('Server error');
  }

  setSelectedMember(null);
};


  const handleChangeRole = (id, newRole) => {
    alert(`Changed role of ${id} to ${newRole}`);
    setSelectedMember(null);
  };

  const filteredMembers = members.filter((member) =>
  (member.username || '').toLowerCase().includes(searchTerm.toLowerCase())
);

useEffect(() => {
  console.log("Members updated: ", members);
}, [members]);


  return (
    <div className="members-page">
      <h2>Pending Applications ({pendingRequests.length})</h2>
      <div className="application-list">
        {pendingRequests.length === 0 ? (
          <p>No pending applications.</p>
        ) : (
          pendingRequests.map((app) => (
            <div
              key={app.userId._id}
              className="application-card"
              onClick={() => setSelectedApp(app)}
            >
              <div className="avatar">{app.userId.pfp ? <img src={app.userId.pfp} alt="" /> : app.userId.username[0]}</div>
              <span>{app.userId.username}</span>
            </div>
          ))
        )}
      </div>

      {selectedApp && (
        <div className="app-details-modal">
          <div className="app-details">
            <h3>{selectedApp.username}</h3>
            <p><strong>Email:</strong> {selectedApp.userId.email}</p>
            <p><strong>Why join:</strong> {selectedApp.reason}</p>
            <div className="actions">
              <button className="accept-btn" onClick={() => handleRequestAction(selectedApp._id, 'accept')}>Accept</button>
              <button className="reject-btn" onClick={() => handleRequestAction(selectedApp._id, 'reject')}>Reject</button>
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
          <div className="avatar">
            {member.pfp ? (
              <img src={member.pfp} alt="" />
            ) : (
              member.username ? member.username[0] : '?'
            )}
          </div>
            <div>
              <h4>{member.username}</h4>
              <p className="role">{member.role}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedMember && (
        <div className="app-details-modal">
          <div className="app-details">
            <h3>{selectedMember.username}</h3>
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