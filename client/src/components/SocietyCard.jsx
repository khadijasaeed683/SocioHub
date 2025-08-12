import "./SocietyCard.css";
import { FaUsers } from "react-icons/fa"; // ✅ members icon

const SocietyCard = ({ logo, name, membersCount, category = "Music", onClick }) => {
  return (
    <div className="Gsociety-card" onClick={onClick}>
      <img
        src={logo || "/assets/default-logo.png"}
        alt={name}
        className="Gsociety-logo"
      />

      {/* Name & Members Row */}
      <div className="Gsociety-header">
        <h3 className="Gsociety-name">{name}</h3>
        <div className="Gsociety-members-count">
          <FaUsers className="members-icon" />
          <span>{membersCount}</span>
        </div>
      </div>

      {/* Category instead of "members" */}
      <p className="Gsociety-category">{category}</p>
    </div>
  );
};

export default SocietyCard;
