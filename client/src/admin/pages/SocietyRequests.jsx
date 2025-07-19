import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import axiosAdmin from '../axiosAdmin'; 
import './SocietyRequests.css';
import {toast} from 'react-toastify';

const SocietyRequests = () => {
  const [societies, setSocieties] = useState([]);
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const res = await axiosAdmin.get('/society/registration-requests');
        setSocieties(res.data.pendingSocieties);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch societies');
      } finally {
        setLoading(false);
      }
    };

    fetchSocieties();
  }, []);

  const filteredSocieties = societies.filter((society) =>
    society.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = async (id) => {
    if (window.confirm('Approve this society?')) {
      try {
        const response = await axiosAdmin.post(`society/${id}/approve`);
        setSocieties((prev) => prev.filter((s) => s._id !== id));
        setSelectedSociety(null);
        toast.success(response?.data?.message);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || 'Approval failed');
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Reject this society?')) {
      try {
        const response = await axiosAdmin.post(`/society/${id}/reject`);
        setSocieties((prev) => prev.filter((s) => s._id !== id));
        setSelectedSociety(null);
        toast.success(response?.data?.message);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || 'Rejection failed');
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      <div className="dashboard-body">
        <AdminSidebar />
        <main className="dashboard-main">
          <h2>Society Registration Requests</h2>

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

          {loading ? (
            <p>Loading societies...</p>
          ) : error ? (
            <p className="error-msg">{error}</p>
          ) : (
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
          )}

          {selectedSociety && (
  <div className="society-details-popup">
    <div className="details-header">
      <h3>{selectedSociety.name}</h3>
      <button className="close-btn" onClick={() => setSelectedSociety(null)}>✖</button>
    </div>

            {selectedSociety.coverImage && (
              <img src={selectedSociety.coverImage} alt="Cover" className="cover-img" />
            )}

            {selectedSociety.logo && (
              <img src={selectedSociety.logo} alt="Logo" className="details-logo" />
            )}
            {selectedSociety._id && (
              <p><strong>_id:</strong> {selectedSociety._id}</p>
            )}
            {selectedSociety.type && (
              <p><strong>Type:</strong> {selectedSociety.type}</p>
            )}

            {selectedSociety.description && (
              <p><strong>Description:</strong> {selectedSociety.description}</p>
            )}

            {selectedSociety.website && (
              <p><strong>Website:</strong> <a href={selectedSociety.website} target="_blank" rel="noreferrer">{selectedSociety.website}</a></p>
            )}

            {selectedSociety.contactEmail && (
              <p><strong>Email:</strong> {selectedSociety.contactEmail}</p>
            )}

            {selectedSociety.phone && (
              <p><strong>Phone:</strong> {selectedSociety.phone}</p>
            )}

            {selectedSociety.inductionsOpen !== undefined && (
              <p><strong>Inductions Open:</strong> {selectedSociety.inductionsOpen ? 'Yes' : 'No'}</p>
            )}

            {selectedSociety.createdBy && selectedSociety.createdBy.username && (
              <p><strong>Requested By:</strong> {selectedSociety.createdBy.username}</p>
            )}
            {selectedSociety.createdAt && (
              <p><strong>Requested At:</strong> {new Date(selectedSociety.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
          })}</p>
            )}

            {(selectedSociety.socialLinks?.instagram || selectedSociety.socialLinks?.linkedin) && (
              <p><strong>Social Links:</strong>
                {selectedSociety.socialLinks.instagram && (
                  <a href={selectedSociety.socialLinks.instagram} target="_blank" rel="noreferrer"> Instagram </a>
                )}
                {selectedSociety.socialLinks.linkedin && (
                  <a href={selectedSociety.socialLinks.linkedin} target="_blank" rel="noreferrer"> | LinkedIn </a>
                )}
              </p>
            )}

            <div className="details-actions">
              <button className="approve-btn" onClick={() => handleApprove(selectedSociety._id)}>Approve</button>
              <button className="reject-btn" onClick={() => handleReject(selectedSociety._id)}>Reject</button>
            </div>
          </div>
        )}

        </main>
      </div>
    </div>
  );
};

export default SocietyRequests;
