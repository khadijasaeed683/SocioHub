import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SocietyDetails.css';
import { FaInstagram, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const SocietyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [society, setSociety] = useState(null);
  const user = useSelector(state => state.auth.user);
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
  const hasJoined = society?.members?.some((member) => member._id === user._id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/society/${id}/${hasJoined ? 'leave' : 'join'}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: user.username,
            email: user.email,
            reason: formData.reason, // optional on leave
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Action failed');
      } else {
        toast.success(hasJoined ? 'Left the society.' : 'Join request sent!');
        // Optional: refresh society data to reflect changes
        setSociety((prev) => ({
          ...prev,
          members: hasJoined
            ? prev.members.filter((m) => m._id !== user._id)
            : [...prev.members, { _id: user._id }],
        }));
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Server error. Please try again later.');
    }

    setShowApplyForm(false);
    setFormData({ name: '', email: '', reason: '' });
  };

  const handleJoinClick = () => {
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

    setShowApplyForm(true);
  };

  if (!society) {
    return <div>Loading...</div>;
  }
  console.log("FETCHED SOCIETY: ", society)

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
            <button
              className="join-society-btn"
              onClick={handleJoinClick}
              disabled={society.pendingRequests?.some((req) => req.userId === user?._id)}
            >
              {society.pendingRequests?.some((req) => req.userId === user?._id)
                ? 'Join request pending'
                : society.members?.some((m) => m._id === user?._id)
                  ? `Leave ${society.name}`
                  : `Join ${society.name}`}
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
                placeholder={`Why do you want to ${hasJoined ? 'leave' : 'join'}?`}
                required={!hasJoined}
              />
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
