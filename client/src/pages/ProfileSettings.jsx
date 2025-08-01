import React, { useState } from 'react';
import './ProfileSettings.css';
import AuthNavbar from '../components/AuthNavbar';
import Sidebar from '../components/Sidebar';

const ProfileSettings = ({ user, onSignOut, societies = [] }) => {
  const [name, setName] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [password, setPassword] = useState('');
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleSave = () => {
    alert('Changes saved! (Backend not connected)');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleDelete = () => {
    if (!showPasswordConfirm) {
      setShowPasswordConfirm(true);
      return;
    }

    if (!password.trim()) {
      alert('Please enter your password to confirm.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to permanently delete your account?');
    if (confirmDelete) {
      alert('Account deleted (mock)');
      // Backend delete logic goes here
    }
  };

  return (
    <div className="profile-settings-layout">
      <Sidebar user={user} societies={societies} />
      <div className="profile-settings-content">
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
              <label>Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
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

          <div className="danger-zone">
            <h3>Danger Zone</h3>
            {showPasswordConfirm && (
              <input
                type="password"
                placeholder="Enter your password to confirm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
            <button className="delete-btn" onClick={handleDelete}>
              {showPasswordConfirm ? 'Confirm Delete' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
