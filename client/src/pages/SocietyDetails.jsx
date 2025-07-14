import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SocietyDetails.css';
import { FaInstagram, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const SocietyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [society, setSociety] = useState(null);

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', reason: '' });

  useEffect(() => {
    const fetchSociety = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/society/${id}`);
        setSociety(res.data);
      } catch (err) {
        console.error('Error fetching society:', err);
      }
    };
    fetchSociety();
  }, [id]);

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/society/${id}/join`, {
        method: 'POST',
        credentials: 'include',
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
    setShowApplyForm(false);
    setFormData({ name: '', email: '', reason: '' });
  };

    const handleJoinClick = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.info('Please login to join this society.');
    navigate('/login');
    return;
  }

  const user = JSON.parse(localStorage.getItem('user'));
  setFormData({
    name: user?.username || '',
    email: user?.email || '',
    reason: '',
  });

  setShowApplyForm(true);
};

  if (!society) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="society-details-container">
        <div className="cover-section">
          {society.coverImage ? (
            <img src={society.coverImage} alt="Cover" className="cover-img" />
          ) : (
            <div className="cover-placeholder">
              <h1>{society.name}</h1>
            </div>
          )}

          <div className="society-info">
            <img src={society.logo} alt={society.name} className="logo-img" />
            <h1>{society.name}</h1>
            <p className="type">{society.type}</p>
            <button className="join-society-btn" onClick={handleJoinClick}>
              Join {society.name}
            </button>
          </div>
        </div>

        <div className="details-section">
          <h2>About</h2>
          <p>{society.description}</p>
        </div>

        <div className="society-footer">
          <h3>Connect with {society.name}</h3>
          <div className="footer-links">
            {society.socialLinks?.instagram && (
              <a href={society.socialLinks.instagram} target="_blank" rel="noreferrer">
                <FaInstagram /> Instagram
              </a>
            )}
            {society.socialLinks?.linkedin && (
              <a href={society.socialLinks.linkedin} target="_blank" rel="noreferrer">
                <FaLinkedin /> LinkedIn
              </a>
            )}
            <a href={`mailto:${society.contactEmail}`}>
              <FaEnvelope /> {society.contactEmail}
            </a>
            <a href={`tel:${society.phone}`}>
              <FaPhone /> {society.phone}
            </a>
          </div>
        </div>
      </div>

      {showApplyForm && (
        <div className="apply-form-modal">
          <div className="apply-form-container">
            <h3>Apply to {society.name}</h3>
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
                <button type="button" className="cancel-btn" onClick={() => setShowApplyForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SocietyDetails;
