import { useNavigate } from 'react-router-dom';
import './UserSocietyCard.css';

const SocietyCard = ({ society, user }) => {
  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`/society/${id}`);
  };

  const handleRequestActivation = (societyId) => {
    // Example: Send activation request to backend
    console.log(`Requesting activation for society: ${societyId}`);
    // You can implement the actual API call here if needed
    alert('Activation request sent!');
  };


  return (
    <div className="card">
      <div className="top-section">
        <h1 className="society-name">{society.name}</h1>
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
            <span className="regular-text">
              {society.createdBy === user._id ? 'Admin' : 'Member'}
            </span>
          </div>
        </div>
        {society.deactivated && (
          <button className="details-btn" onClick={() => handleRequestActivation(society._id)}>
            Request Activation
          </button>
        )}
        <button className="details-btn" onClick={() => handleViewDetails(society._id)}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default SocietyCard;
