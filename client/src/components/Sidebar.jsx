import React, { useContext, useMemo, useState } from 'react';
import './Sidebar.css';
import {
  FaUsersCog,
  FaPlusCircle,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { SidebarContext } from '../context/SidebarContext';

const Sidebar = ({ user, societies }) => {
  const { isOpen } = useContext(SidebarContext);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleAdminDropdown = () => setAdminDropdownOpen(!adminDropdownOpen);

  // ✅ Efficient filtering
  const adminSocieties = useMemo(() => {
    if (!user?._id) return [];
    return societies.filter(s => s.createdBy === user._id);
  }, [societies, user?._id]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  console.log("Sidebar user._id:", user?._id);
  console.log("Received societies:", societies);
  console.log("Filtered adminSocieties:", adminSocieties);

  return (
    <div className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
      <div className="sidebar-links">

        <div className="sidebar-item" onClick={toggleAdminDropdown}>
          <FaUsersCog />
          {isOpen ? <span>Society Admin Portal</span> : <span className="tooltip">Societies</span>}
        </div>

        {isOpen && adminDropdownOpen && (
          <div className="admin-dropdown">
            {adminSocieties.length > 0 ? (
              adminSocieties.map(society => (
                <div
                  key={society._id}
                  className="dropdown-item"
                  onClick={() => navigate(`/manage-society/${society._id}/overview`)}
                >
                  {society.name}
                </div>
              ))
            ) : (
              <div className="dropdown-item disabled">Nothing to show</div>
            )}
          </div>
        )}

        <div className="sidebar-item" onClick={() => navigate('/register-society')}>
          <FaPlusCircle />
          {isOpen ? <span>Create Society</span> : <span className="tooltip">Create</span>}
        </div>

        <div className="sidebar-item" onClick={() => navigate('/profile-settings')}>
          <FaCog />
          {isOpen ? <span>Settings</span> : <span className="tooltip">Settings</span>}
        </div>

        <div className="sidebar-item" onClick={handleLogout}>
          <FaSignOutAlt />
          {isOpen ? <span>Logout</span> : <span className="tooltip">Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
