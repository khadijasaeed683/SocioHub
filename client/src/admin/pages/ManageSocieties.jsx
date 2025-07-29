// ViewSocieties button
import React, { useState, useEffect } from 'react'; // Added useEffect
import { FaSearch } from 'react-icons/fa';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import axiosAdmin from '../axiosAdmin';
import { toast } from 'react-toastify';

import './ManageSocieties.css';

const SocietyRequests = () => {
  const [societies, setSocieties] = useState([]);
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const res = await axiosAdmin.get('/society?status=approved');
        setSocieties(res.data.societies);
      } catch (err) {
        console.error("[ERROR] Fetching societies failed:", err);
        setError(err.response?.data?.message || 'Failed to fetch societies');
      } finally {
        setLoading(false);
      }
    };

    fetchSocieties();
  }, []);

  const filteredSocieties = societies?.filter((society) =>
    society.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this society? This action cannot be undone.')) {
      try {
        const res = await axiosAdmin.delete(`/society/${id}`);
        setSocieties(prev => prev.filter(s => s._id !== id));
        if (selectedSociety && selectedSociety._id === id) {
          setSelectedSociety(null);
        }
        toast.success(res.data.message);
      } catch (err) {
        console.error("[ERROR] Deleting society failed:", err);
        toast.error('Failed to delete society.');
      }
    }
  };


  const handleToggleActivation = async (id) => {
    if (window.confirm('Are you sure you want to toggle activation status for this society?')) {
      try {
        const res = await axiosAdmin.patch(`/society/${id}/toggle-activation`);
        setSocieties(prev =>
          prev.map(soc =>
            soc._id === id ? { ...soc, deactivated: res.data.deactivated } : soc
          )
        );
        if (selectedSociety && selectedSociety._id === id) {
          setSelectedSociety(prev => ({ ...prev, deactivated: res.data.deactivated }));
        }
        toast.success(res.data.message);
      } catch (err) {
        console.error("[ERROR] Toggling activation failed:", err);
        toast.error('Failed to toggle activation.');
      }
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

          {loading ? (
            <p>Loading societies...</p>
          ) : error ? (
            <p className="error-msg">{error}</p>
          ) : (
            <div className="society-cards-container">
              {filteredSocieties?.length === 0 ? (
                <p>No matching societies.</p>
              ) : (
                filteredSocieties?.map((society) => (
                  <div key={society._id} className="society-card">
                    <img src={society.logo} alt="Logo" className="society-logo" />
                    {society.deactivated && (<span className="deactivated-badge">Deactivated</span>)}
                    <div className="card-body">
                      <h3>
                        {society.name}
                      </h3>

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
                <p><strong>Created By:</strong> {selectedSociety.createdBy.username}</p>
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
                <button
                  className={selectedSociety.deactivated ? "activate-btn" : "deactivate-btn"}
                  onClick={() => handleToggleActivation(selectedSociety._id)}
                >
                  {selectedSociety.deactivated ? "Activate" : "Deactivate"}
                </button>
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
