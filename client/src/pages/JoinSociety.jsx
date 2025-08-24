import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // ✅ Import Footer
import './JoinSociety.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const JoinSociety = () => {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', reason: '' });
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Search state
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/society/?status=active');
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Failed to fetch societies');
        } else {
          setSocieties(data.societies);
        }
      } catch (err) {
        setError('Server error. Try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSocieties();
  }, []);

  const handleApplyClick = (society) => {
    if (!user) {
      toast.info('Please login to join this society.');
      navigate('/login');
      return;
    }

    setFormData({
      name: user?.username || '',
      email: user?.email || '',
      reason: '',
    });

    setSelectedSociety(society);
    console.log('Selected society:', society);
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/society/${selectedSociety._id}/join`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Join society failed:', data);

        if (response.status === 401) {
          toast.error('Please login to join this society.');
          navigate('/login');
          return;
        }

        toast.error(data.message || data.error || 'Failed to join society');
      } else {
        toast.success('Join request sent successfully!');
      }
    } catch (err) {
      console.error('Error joining society:', err);
      toast.error('Server error. Please try again later.');
    }
    setSelectedSociety(null);
    setFormData({ name: '', email: '', reason: '' });
  };

  const handleViewDetails = (id) => {
    navigate(`/society/${id}`);
  };

  // ✅ Filter societies by search query (safe handling)
  const filteredSocieties = societies.filter(society =>
    (society.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="join-society-page">
        <h2>Join a Society</h2>

        {/* ✅ Search Bar */}
        <input
          type="text"
          placeholder="Search societies by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="eventsearch-bar"
        />

        <div className="society-list">
          {filteredSocieties.length > 0 ? (
            filteredSocieties.map((society) => (
              <div key={society._id} className="society-card">
                <img
                  src={society.logo || 'https://via.placeholder.com/80x80?text=No+Logo'}
                  alt={`${society.name} logo`}
                  className="society-logo"
                />
                <h3>{society.name}</h3>
                <p>{society.description}</p>
                {society.inductionsOpen && <span className="open-tag">Inductions Open</span>}
                <div className="card-buttons">
                  <button
                    disabled={!society.inductionsOpen}
                    onClick={() => handleApplyClick(society)}
                  >
                    {society.inductionsOpen ? 'Join' : 'Inductions Closed'}
                  </button>

                  <button onClick={() => handleViewDetails(society._id)}>
                    Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No societies found.</p>
          )}
        </div>

        {selectedSociety && (
          <div className="apply-form-modal">
            <div className="apply-form-container">
              <h3>Apply to {selectedSociety.name}</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Your Name"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Your Email"
                  required
                />
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleFormChange}
                  placeholder="Why do you want to join?"
                  required
                ></textarea>
                <div className="form-actions">
                  <button type="submit">Submit</button>
                  <button type="button" className="cancel-btn" onClick={() => setSelectedSociety(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Footer */}
      <Footer />
    </>
  );
};

export default JoinSociety;
