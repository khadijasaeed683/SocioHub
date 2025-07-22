import React, { useState } from 'react';
import './ProfileSettings.css';
import AuthNavbar from '../components/AuthNavbar';

const ProfileSettings = ({ user, onSignOut }) => {
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [password, setPassword] = useState('');

  const handleSave = () => {
    alert('Changes saved! (Backend not connected)');
    // You'd normally send PATCH request here
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account?');
    if (confirmDelete) {
      alert('Account deleted (mock)');
      // Send DELETE request to backend in real app
    }
  };

  

  return (
    <>
      <AuthNavbar user={user} onSignOut={onSignOut} />
      <div className="profile-settings-page">
        <h2>Profile Settings</h2>

        <div className="profile-section">
          <div className="avatar-preview">
            {avatar ? (
              <img src={avatar} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">No Image</div>
            )}
            <input type="file" onChange={handleAvatarChange} />
          </div>

          <div className="info-fields">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />

            <label>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell something about yourself..."
            ></textarea>

            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>

        <div className="certificates-section">
          <h3>Certificates & Badges</h3>

          <div className="badges-list">
            <div className="badge-card">🏅 Hackathon Winner</div>
            <div className="badge-card">🎓 Workshop Participant</div>
            <div className="badge-card">👨‍💻 Volunteer Certificate</div>
          </div>

          <div className="upload-badge">
            <label htmlFor="badge-upload" className="upload-label">
              + Upload New Badge
            </label>
            <input type="file" id="badge-upload" hidden onChange={() => alert('Badge uploaded!')} />
          </div>
        </div>

        <div className="danger-zone">
          <h3>Danger Zone</h3>
          <input
            type="password"
            placeholder="Confirm your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="delete-btn" onClick={handleDelete}>
            Delete Account
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;
