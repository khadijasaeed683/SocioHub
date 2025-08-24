import { React, useEffect } from 'react';
import { NavLink, Outlet, useParams, useNavigate } from 'react-router-dom';
import './ManageSociety.css';
import { SocietyProvider, useSociety } from '../../context/SocietyContext';
import { FaHome } from 'react-icons/fa'; // ✅ Home icon

const ManageSocietyContent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { society, setSociety } = useSociety(); // ✅ using context

  useEffect(() => {
    const fetchSociety = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/society/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        const data = await res.json();

        if (!res.ok) {
          console.error('Error fetching society:', data.message || 'Failed');
        } else {
          setSociety(data); // ✅ set in context
        }
      } catch (err) {
        console.error('Server error fetching society:', err.message);
      }
    };

    fetchSociety();
  }, [id, setSociety]);

  if (!society) return <div>Loading society...</div>;

  return (
    <>
      {/* ✅ Top Navbar Only */}
      <div className="sadmin-navbar">
        <div className="admin-navbar-left">
          {/* ✅ Home button instead of back */}
          <button className="home-btn" onClick={() => navigate('/dashboard')}>
            <FaHome size={20} />
          </button>
        </div>

        <div className="admin-navbar-center">
          <h2>{society?.name} Management Portal</h2>
        </div>

        {/* ✅ Links moved to top navbar */}
        <div className="admin-navbar-right">
          <NavLink
            to={`/manage-society/${id}/overview`}
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Overview
          </NavLink>
          <NavLink
            to={`/manage-society/${id}/members`}
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Members
          </NavLink>
          <NavLink
            to={`/manage-society/${id}/events`}
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Events
          </NavLink>
        </div>
      </div>

      {/* ✅ No sidebar anymore */}
      <div className="manage-society-layout">
        <main className="manage-society-main">
          <Outlet />
        </main>
      </div>
    </>
  );
};

const ManageSociety = () => (
  <SocietyProvider>
    <ManageSocietyContent />
  </SocietyProvider>
);

export default ManageSociety;
