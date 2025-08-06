import React, { useState } from 'react';
import './ProfileSettings.css';
import AuthNavbar from '../components/AuthNavbar';
import Sidebar from '../components/Sidebar';
import { userLoggedIn } from '../features/authSlice';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

const ProfileSettings = ({ onSignOut, societies = [] }) => {
  const user = useSelector((state) => state.auth.user);
  const [name, setName] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.pfp || '');
  const [password, setPassword] = useState('');
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('username', name);
    formData.append('email', email);
    formData.append('bio', bio);
    if (avatar instanceof File) {
      formData.append('avatar', avatar);
    }

    setLoading(true);

    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        body: formData,
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Profile updated!');        // Update avatar preview with new one if returned
        if (data.user?.pfp) {
          setAvatar(data.user.pfp);
        }
        if (data.user?.username) setName(data.user.username);
        if (data.user?.email) setEmail(data.user.email);
        if (data.user?.bio) setBio(data.user.bio);
        dispatch(userLoggedIn(data.user));

      } else {
        toast.error('Failed to update profile: ' + data.error);
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Something went wrong while updating profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () =>{
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
      try {
        const res = await fetch('/api/user', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ password })
        });

        const data = await res.json();

        if (res.ok) {
          toast.success('Account deleted successfully!');
          onSignOut(); 
        } else {
          toast.error(data?.error || 'Failed to delete account');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        toast.error('Something went wrong.');
      }
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
                <img
                  src={avatar instanceof File ? URL.createObjectURL(avatar) : avatar}
                  alt="Profile"
                />
              ) : (
                <div className="avatar-placeholder">No Image</div>
              )}
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
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

              <button className="save-btn" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
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
