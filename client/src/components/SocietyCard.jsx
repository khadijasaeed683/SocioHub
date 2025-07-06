import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './SocietyCard.css';
import { FaInstagram, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';

const SocietyCard = ({ society, user }) => {
    const navigate = useNavigate();
    const handleViewDetails = (id) => {
        navigate(`/society/${id}`);
      };
  return (
<div className="card">
  <div className="top-section">
    <h1 className='society-name'>{society.name}</h1>
  </div>
  <div className="bottom-section">
    <div className="row row1">
      <div className="item">
        <span className="big-text">{society.members.length}</span>
        <span className="regular-text">Members</span>
      </div>
      <div className="item">
        <span className="big-text">{society.events.length}</span>
        <span className="regular-text">Events</span>
      </div>
      <div className="item">
        <span className="big-text">Role</span>
        <span className="regular-text">{society.createdBy === user._id ? 'Admin': 'Member'}</span>
      </div>
    </div>
    <button className="details-btn" onClick={() => handleViewDetails(society._id)}>View Details</button>
  </div>
</div>

    );  
}

export default SocietyCard;