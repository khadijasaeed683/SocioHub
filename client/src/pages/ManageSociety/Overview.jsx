import React, { useState } from 'react';
import './Overview.css';
import { useSociety } from '../../context/SocietyContext';

const Overview = () => {
  const { society, setSociety } = useSociety();
  const [about, setAbout] = useState(society?.description || '');
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [socials, setSocials] = useState({
    website: society?.website || '',
    instagram: society?.socialLinks?.instagram || '',
    linkedin: society?.socialLinks?.linkedin || '',
    email: society?.contactEmail || '',
    phone: society?.phone || '',
  });

  const handleUpdateField = async (field, value) => {
    setLoading(true);
    try {
      const formData = new FormData();

      if ((field === 'logo' || field === 'coverImage') && value instanceof File) {
        formData.append(field, value);
      } else {
        formData.append(field, value);
      }

      const res = await fetch(`http://localhost:5000/api/society/${society._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Failed to update society');
      } else {
        setSociety(data.society);

        if (field === 'description') setAbout(data.society.description);
        else if (field === 'logo' || field === 'coverImage') ; // auto re-render
        else setSocials(prev => ({ ...prev, [field]: value }));

        setEditField('');
        setEditValue('');
        setIsEditing(false);
      }

    } catch (error) {
      console.error('Error updating society:', error);
      alert('Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overview-container">
      <h2 className="section-heading">Society Overview</h2>

      {/* ✅ Cover Image Section */}
      <div className="cover-image-section">
        <img src={society.coverImage} alt="Society Cover" className="society-cover" />
        {editField === 'coverImage' ? (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditValue(e.target.files[0])}
            />
            <button
              className="save-btn inline"
              onClick={() => handleUpdateField('coverImage', editValue)}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              className="cancel-btn inline"
              onClick={() => { setEditField(''); setIsEditing(false); }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            className="edit-btn"
            onClick={() => {
              setEditField('coverImage');
              setEditValue('');
              setIsEditing(true);
            }}
          >
            Change Cover Image
          </button>
        )}
      </div>

      {/* ✅ Logo Section */}
      <div className="logo-section">
        <img src={society.logo} alt="Society Logo" className="society-logo" />
        {editField === 'logo' ? (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditValue(e.target.files[0])}
            />
            <button
              className="save-btn inline"
              onClick={() => handleUpdateField('logo', editValue)}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              className="cancel-btn inline"
              onClick={() => { setEditField(''); setIsEditing(false); }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            className="edit-btn"
            onClick={() => {
              setEditField('logo');
              setEditValue('');
              setIsEditing(true);
            }}
          >
            Change Logo
          </button>
        )}
      </div>

      {/* ✅ About Section */}
      <div className="about-section">
        <div className="about-header">
          <h3>About Society</h3>
          {editField !== 'description' && !isEditing && (
            <button className="edit-btn" onClick={() => {
              setEditField('description');
              setEditValue(about);
              setIsEditing(true);
            }}>
              Edit
            </button>
          )}
        </div>

        {isEditing && editField === 'description' ? (
          <div className="edit-about">
            <textarea
              rows="5"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
            <div className="about-actions">
              <button
                className="save-btn"
                onClick={() => handleUpdateField(editField, editValue)}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                className="cancel-btn"
                onClick={() => { setIsEditing(false); setEditField(''); }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="about-text">{about}</p>
        )}
      </div>

      {/* ✅ Social Links Section */}
      <div className="socials-section">
        <h3>Social Media & Contacts</h3>
        <ul>
          {Object.entries(socials).map(([platform, url]) => (
            <li key={platform}>
              <strong>{platform.charAt(0).toUpperCase() + platform.slice(1)}:</strong>{' '}
              {editField === platform ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                  <button
                    className="save-btn inline"
                    onClick={() => handleUpdateField(platform, editValue)}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    className="cancel-btn inline"
                    onClick={() => { setEditField(''); setIsEditing(false); }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <a href={url} target="_blank" rel="noreferrer">{url || 'Not set'}</a>
                  <button
                    className="edit-btn inline"
                    onClick={() => {
                      setEditField(platform);
                      setEditValue(url);
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Overview;
