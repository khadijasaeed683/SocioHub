import React, { useState } from 'react';
import './Sidebar.css';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaHome, 
  FaCalendarAlt, 
  FaChalkboardTeacher, 
  FaUserFriends,
  FaTasks 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ user, societies }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const adminSocieties = societies?.filter(s => s.admins.includes(user._id)) || [];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-toggle" onClick={handleToggle}>
        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </div>

      <div className="sidebar-links">
        <div className="sidebar-item" onClick={() => navigate('/dashboard')}>
          <FaHome />
          {!isCollapsed && <span>Home</span>}
          {isCollapsed && <span className="tooltip">Home</span>}
        </div>

        <div className="sidebar-item" onClick={() => navigate('/calendar')}>
          <FaCalendarAlt />
          {!isCollapsed && <span>Calendar</span>}
          {isCollapsed && <span className="tooltip">Calendar</span>}
        </div>

        <div className="sidebar-item active" onClick={() => navigate('/teaching')}>
          <FaChalkboardTeacher />
          {!isCollapsed && <span>Teaching</span>}
          {isCollapsed && <span className="tooltip">Teaching</span>}
        </div>

        <div className="sidebar-item" onClick={() => navigate('/enrolled')}>
          <FaUserFriends />
          {!isCollapsed && <span>Enrolled</span>}
          {isCollapsed && <span className="tooltip">Enrolled</span>}
        </div>

        <div className="sidebar-item" onClick={() => navigate('/todo')}>
          <FaTasks />
          {!isCollapsed && <span>To do</span>}
          {isCollapsed && <span className="tooltip">To do</span>}
        </div>
      </div>

      <div className="sidebar-courses">
        <div className="course-section">A</div>
        <div className="course-item" onClick={() => navigate('/course/ai-lab')}>
          {!isCollapsed ? 'AI lab Section-C 2023' : 'AI'}
        </div>
        <div className="course-item" onClick={() => navigate('/course/adbms')}>
          {!isCollapsed ? 'ADBMS Theory 23-(B) B' : 'ADB'}
        </div>

        <div className="course-section">C</div>
        <div className="course-item" onClick={() => navigate('/course/coal')}>
          {!isCollapsed ? 'COAL Theory B' : 'COA'}
        </div>
        <div className="course-item" onClick={() => navigate('/course/section-b')}>
          {!isCollapsed ? 'Section B' : 'SB'}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;