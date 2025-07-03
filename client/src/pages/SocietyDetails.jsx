import React, { useEffect, useState } from 'react';
import { useParams ,useNavigate} from 'react-router-dom';
import axios from 'axios';
import './SocietyDetails.css';
import { FaInstagram, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';


const SocietyDetails = () => {
const navigate = useNavigate(); // ✅ useNavigate hook for navigation
  const { id } = useParams();
  const [society, setSociety] = useState(null);

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

  if (!society) {
    return <div>Loading...</div>;
  }

  const handleJoin = async () => {
     // ✅ useNavigate hook for navigation
  try {
    const response = await fetch(`http://localhost:5000/api/society/${id}/join`, {
      method: 'POST',
      credentials: 'include', // ✅ include cookies if using JWT httpOnly
      headers: {
        'Content-Type': 'application/json',
      },
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



};

  return (
    <>
    <Navbar/>
    <div className="society-details-container">
      <div className="cover-section">
        {society.coverImage ? (
            <img
            src={society.coverImage}
            alt="Cover"
            className="cover-img"
            />
        ) : (
            <div className="cover-placeholder">
            <h1>{society.name}</h1>
            </div>
        )}

        <div className="society-info">
          <img src={society.logo } alt={society.name} className="logo-img" />
          <h1>{society.name}</h1>
          <p className="type">{society.type}</p>
          <button className="join-society-btn" onClick={handleJoin}>
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
    </>
    
  );
};

export default SocietyDetails;
