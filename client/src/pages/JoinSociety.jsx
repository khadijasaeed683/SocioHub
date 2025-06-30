import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './JoinSociety.css';

const dummySocieties = [
  {
    _id: 's1',
    name: 'Tech Society',
    description: 'Technology & coding events throughout the year.',
    inductionsOpen: true,
  },
  {
    _id: 's2',
    name: 'Art Society',
    description: 'Visual arts, creativity and painting competitions.',
    inductionsOpen: false,
  },
  {
    _id: 's3',
    name: 'Literary Society',
    description: 'Debates, poetry slams and literary talks.',
    inductionsOpen: true,
  },
];

const JoinSociety = () => {
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', reason: '' });

  const handleApplyClick = (society) => {
    setSelectedSociety(society);
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Request to join ${selectedSociety.name} submitted.`);
    setSelectedSociety(null);
    setFormData({ name: '', email: '', reason: '' });
  };

  return (
    <>
      <Navbar />
      <div className="join-society-page">
        <h2>Join a Society</h2>
        <div className="society-list">
          {dummySocieties.map((society) => (
            <div key={society._id} className="society-card">
              <h3>{society.name}</h3>
              <p>{society.description}</p>
              {society.inductionsOpen && <span className="open-tag">Inductions Open</span>}
              <button
                disabled={!society.inductionsOpen}
                onClick={() => handleApplyClick(society)}
              >
                {society.inductionsOpen ? 'Apply to Join' : 'Inductions Closed'}
              </button>
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
