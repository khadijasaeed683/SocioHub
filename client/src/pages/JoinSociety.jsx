import React, { useState , useEffect} from 'react';
import Navbar from '../components/Navbar';
import './JoinSociety.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const JoinSociety = () => {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', reason: '' });
  
  
  useEffect(() => {
      const fetchSocieties = async () => {
        try {
          const res = await fetch('http://localhost:5000/api/society');
          const data = await res.json();
  
          if (!res.ok) {
            setError(data.message || 'Failed to fetch societies');
          } else {
            setSocieties(data);
          }
        } catch (err) {
          setError('Server error. Try again later.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchSocieties();
    }, []);

  const handleApplyClick = async (society) => {
    setSelectedSociety(society);
    console.log('Selected society:', society);

  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const response = await fetch(`http://localhost:5000/api/society/${selectedSociety._id}/join`, {
          method: 'POST',
          credentials: 'include', // ✅ include cookies if using JWT httpOnly
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            reason: formData.reason,
          }),
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
  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`/society/${id}`);
  };

  return (
    <>
      <Navbar />
      <div className="join-society-page">
        <h2>Join a Society</h2>
        <div className="society-list">
          {societies.map((society) => (
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
                  View Details
                </button>
              </div>

            </div>
          ))}
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
    </>
  );
};

export default JoinSociety;
