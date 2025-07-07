import { React, useEffect } from 'react';
import { NavLink, Outlet, useParams, useNavigate } from 'react-router-dom';
import './ManageSociety.css';
import { SocietyProvider, useSociety } from '../../context/SocietyContext';

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
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
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
      <div className="admin-navbar">
        <div className="admin-navbar-left">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
        </div>
        <div className="admin-navbar-center">
          <h2>{society?.name} Management Portal</h2>
        </div>
        <div className="admin-navbar-right" />
      </div>

      <div className="manage-society-layout">
        <aside className="manage-society-sidebar">
          <h3 className="sidebar-heading">Admin Panel</h3>
          <nav className="sidebar-links">
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
          </nav>
        </aside>

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
