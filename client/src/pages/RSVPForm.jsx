import './RSVPForm.css';

const RSVPForm = ({ event, formData, setFormData, onSubmit, onCancel }) => {
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="rsvp-form-modal">
      <div className="rsvp-form-container">
        <h3>RSVP for {event.title}</h3>
        <form onSubmit={onSubmit}>
          <label>Your Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
          />

          <label>Your Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />

          <label>Your Phone</label>
          <input
            type="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter your phone"
          />

          <label>Why do you want to attend? (optional)</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="e.g., I'm interested in this topic"
          />

          <div className="form-actions">
            <button type="submit">Submit RSVP</button>
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RSVPForm;
