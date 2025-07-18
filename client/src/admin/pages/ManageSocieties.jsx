import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import './SocietyRequests.css';

const dummySocieties = [
  {
    _id: '1',
    name: 'True Society',
    logo: '/assets/events.png',
    coverImage: '/events.png',
    website: 'https://techsociety.com',
    socialLinks: {
      instagram: 'https://instagram.com/techsociety',
      linkedin: 'https://linkedin.com/company/techsociety'
    },
    contactEmail: 'tech@societies.edu',
    phone: '0300-1234567',
    type: 'Technical',
    description: 'A platform for tech enthusiasts.',
    createdBy: { _id: 'u1', name: 'John Doe' },
    members: [],
    events: [],
    approved: false,
    inductionsOpen: true
  },
  {
    _id: '2',
    name: 'Done Club',
    logo: '/logos/arts.png',
    coverImage: '/covers/arts-cover.jpg',
    website: 'https://artsclub.edu',
    socialLinks: {
      instagram: '',
      linkedin: 'https://linkedin.com/company/artsclub'
    },
    contactEmail: 'arts@societies.edu',
    phone: '0312-7654321',
    type: 'Cultural',
    description: 'Where creativity thrives.',
    createdBy: { _id: 'u2', name: 'Fatima Khan' },
    members: [],
    events: [],
    approved: false,
    inductionsOpen: false
  }
];

const SocietyRequests = () => {
  const [societies, setSocieties] = useState(dummySocieties);
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSocieties = societies.filter((society) =>
    society.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeactivate = (id) => {
    if (window.confirm('Deactivate this society?')) {
      setSocieties((prev) => prev.filter((s) => s._id !== id));
      setSelectedSociety(null);
      alert('Society deactivated.');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this society? This action cannot be undone.')) {
      setSocieties((prev) => prev.filter((s) => s._id !== id));
      setSelectedSociety(null);
      alert('Society deleted.');
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      <div className="dashboard-body">
        <AdminSidebar />
        <main className="dashboard-main">
          <h2>Registered Societies</h2>

          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search societies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar"
            />
            <FaSearch className="search-icon" />
          </div>

          <div className="society-cards-container">
            {filteredSocieties.length === 0 ? (
              <p>No matching societies.</p>
            ) : (
              filteredSocieties.map((society) => (
                <div key={society._id} className="society-card">
                  <img src={society.logo} alt="Logo" className="society-logo" />
                  <div className="card-body">
                    <h3>{society.name}</h3>
                    <p className="society-type">{society.type}</p>
                    <button
                      className="view-details-btn"
                      onClick={() => setSelectedSociety(society)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedSociety && (
            <div className="society-details-popup">
              <div className="details-header">
                <h3>{selectedSociety.name}</h3>
                <button className="close-btn" onClick={() => setSelectedSociety(null)}>✖</button>
              </div>
              <img src={selectedSociety.coverImage} alt="Cover" className="cover-img" />
              <img src={selectedSociety.logo} alt="Logo" className="details-logo" />
              <p><strong>Type:</strong> {selectedSociety.type}</p>
              <p><strong>Description:</strong> {selectedSociety.description}</p>
              <p><strong>Website:</strong> <a href={selectedSociety.website} target="_blank" rel="noreferrer">{selectedSociety.website}</a></p>
              <p><strong>Email:</strong> {selectedSociety.contactEmail}</p>
              <p><strong>Phone:</strong> {selectedSociety.phone}</p>
              <p><strong>Inductions Open:</strong> {selectedSociety.inductionsOpen ? 'Yes' : 'No'}</p>
              <p><strong>Created By:</strong> {selectedSociety.createdBy.name}</p>
              <p><strong>Social Links:</strong>
                {selectedSociety.socialLinks.instagram && (
                  <a href={selectedSociety.socialLinks.instagram} target="_blank" rel="noreferrer"> Instagram </a>
                )}
                {selectedSociety.socialLinks.linkedin && (
                  <a href={selectedSociety.socialLinks.linkedin} target="_blank" rel="noreferrer"> | LinkedIn </a>
                )}
              </p>
              <div className="details-actions">
                <button className="deactivate-btn" onClick={() => handleDeactivate(selectedSociety._id)}>Deactivate</button>
                <button className="delete-btn" onClick={() => handleDelete(selectedSociety._id)}>Delete</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SocietyRequests;
