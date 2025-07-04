import React, { useContext, useState } from 'react';
import './Sidebar.css';
import {
  FaUsersCog,
  FaPlusCircle,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { SidebarContext } from '../context/SidebarContext'; // ✅ import context

const Sidebar = ({ user, societies }) => {
  const { isOpen } = useContext(SidebarContext); // ✅ global control
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleAdminDropdown = () => setAdminDropdownOpen(!adminDropdownOpen);

  const adminSocieties = societies?.filter(s => s.admins.includes(user._id)) || [];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
      <div className="sidebar-links">
        {/* Societies Administration Dropdown */}
        <div className="sidebar-item" onClick={toggleAdminDropdown}>
          <FaUsersCog />
          {isOpen ? <span>Societies Administration</span> : <span className="tooltip">Societies</span>}
        </div>

        {isOpen && adminDropdownOpen && (
          <div className="admin-dropdown">
            {adminSocieties.length > 0 ? (
              adminSocieties.map(society => (
                <div
                  key={society._id}
                  className="dropdown-item"
                  onClick={() => navigate(`/society/${society._id}`)}
                >
                  {society.name}
                </div>
              ))
            ) : (
              <div className="dropdown-item disabled">Nothing to show</div>
            )}
          </div>
        )}

        {/* Create Society */}
        <div className="sidebar-item" onClick={() => navigate('/register-society')}>
          <FaPlusCircle />
          {isOpen ? <span>Create Society</span> : <span className="tooltip">Create</span>}
        </div>

        {/* Settings */}
        <div className="sidebar-item" onClick={() => navigate('/settings')}>
          <FaCog />
          {isOpen ? <span>Settings</span> : <span className="tooltip">Settings</span>}
        </div>

        {/* Logout */}
        <div className="sidebar-item" onClick={handleLogout}>
          <FaSignOutAlt />
          {isOpen ? <span>Logout</span> : <span className="tooltip">Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
