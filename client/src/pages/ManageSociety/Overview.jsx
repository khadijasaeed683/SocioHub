import React, { useState } from 'react';
import './Overview.css';

const Overview = () => {
  const [about, setAbout] = useState(
    'We are a society focused on empowering students with real-world tech skills through workshops, hackathons, and mentoring.'
  );
  const [isEditing, setIsEditing] = useState(false);
  const [newAbout, setNewAbout] = useState(about);
  const [logo, setLogo] = useState('/default-logo.png');
  const [socials, setSocials] = useState({
    facebook: 'https://facebook.com/society',
    instagram: 'https://instagram.com/society',
    linkedin: 'https://linkedin.com/company/society'
  });

  const handleLogoChange = () => {
    const newLogo = prompt('Enter new logo URL');
    if (newLogo) setLogo(newLogo);
  };

  const handleSocialChange = (platform) => {
    const newLink = prompt(`Enter new ${platform} URL`);
    if (newLink) setSocials((prev) => ({ ...prev, [platform]: newLink }));
  };

  const saveAbout = () => {
    setAbout(newAbout);
    setIsEditing(false);
  };

  return (
    <div className="overview-container">
      <h2 className="section-heading">Society Overview</h2>

      <div className="logo-section">
        <img src={logo} alt="Society Logo" className="society-logo" />
        <button className="edit-btn" onClick={handleLogoChange}>Change Logo</button>
      </div>

      <div className="about-section">
        <div className="about-header">
          <h3>About Society</h3>
          {!isEditing && (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
          )}
        </div>

        {isEditing ? (
          <div className="edit-about">
            <textarea
              rows="5"
              value={newAbout}
              onChange={(e) => setNewAbout(e.target.value)}
            />
            <div className="about-actions">
              <button className="save-btn" onClick={saveAbout}>Save</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <p className="about-text">{about}</p>
        )}
      </div>

      <div className="socials-section">
        <h3>Social Media</h3>
        <ul>
          {Object.entries(socials).map(([platform, url]) => (
            <li key={platform}>
              <strong>{platform.charAt(0).toUpperCase() + platform.slice(1)}:</strong>{' '}
              <a href={url} target="_blank" rel="noreferrer">{url}</a>
              <button className="edit-btn inline" onClick={() => handleSocialChange(platform)}>Edit</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Overview;
