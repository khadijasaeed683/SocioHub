import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaUsers } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import "./SocietyDetails.css";
import useRSVP from "../hooks/useRSVP";
import EventCard from "../components/EventCard";
import RSVPForm from "./RSVPForm"; // ✅ import RSVP form
import Footer from "../components/Footer"; // ✅ import footer

// Generate consistent color per user ID
const getAvatarColor = (id) => {
  const colors = [
    "linear-gradient(135deg, #667eea, #764ba2)",
    "linear-gradient(135deg, #ff758c, #ff7eb3)",
    "linear-gradient(135deg, #43cea2, #185a9d)",
    "linear-gradient(135deg, #f7971e, #ffd200)",
    "linear-gradient(135deg, #00c6ff, #0072ff)",
  ];
  const index = id.charCodeAt(0) % colors.length;
  return colors[index];
};

const SocietyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [society, setSociety] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [joinSocietyformData, setjoinSocietyformData] = useState({ name: "", email: "", reason: "" });

  // ✅ Use the RSVP hook (same as ExploreEvents)
  const {
    selectedEvent,
    setSelectedEvent,
    formData,
    setFormData,
    handleRSVPClick,
    handleFormSubmit,
  } = useRSVP();

  useEffect(() => {
    const fetchSociety = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/society/${id}`);
        setSociety(res.data);
      } catch (err) {
        console.error("Error fetching society:", err);
        toast.error("Could not load society details.");
      }
    };
    fetchSociety();
  }, [id]);

  if (!society) return <div className="loading">Loading...</div>;

  const hasJoined = society?.members?.some((m) => m._id === user?._id);

  const handleFormChange = (e) => {
    setjoinSocietyformData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/society/${id}/${hasJoined ? "leave" : "join"}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.username,
            email: user.email,
            reason: joinSocietyformData.reason,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) return toast.error(data.message || "Action failed");

      toast.success(hasJoined ? "Left society." : "Join request sent!");

      setSociety((prev) => ({
        ...prev,
        members: hasJoined
          ? prev.members.filter((m) => m._id !== user._id)
          : [...prev.members, { _id: user._id }],
      }));

      setShowApplyForm(false);
      setjoinSocietyformData({ name: "", email: "", reason: "" });
    } catch (err) {
      toast.error("Server error. Try later.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="society-page">
        {/* Cover */}
        <div className="cover">
          {society.coverImage && (
            <img src={society.coverImage} alt="cover" />
          )}
          <div className="society-header">
            <img src={society.logo} alt="logo" className="society-logo-details" />
            <div>
              <h1>{society.name}</h1>
              <p className="society-type">{society.type}</p>
              <button
                className="join-btn"
                onClick={() => {
                  if (!user) {
                    toast.info("Please login to join.");
                    return navigate("/login");
                  }
                  setjoinSocietyformData({
                    name: user.username,
                    email: user.email,
                    reason: "",
                  });
                  setShowApplyForm(true);
                }}
              >
                {society.pendingRequests?.some((r) => r.userId === user?._id)
                  ? "Join request pending"
                  : hasJoined
                    ? `Leave ${society.name}`
                    : `Join ${society.name}`}
              </button>
            </div>
          </div>
        </div>


        {/* About Section */}
        <section className="about-card">
          <h2>About</h2>
          <p>{society.description}</p>
        </section>

        {/* Members Section */}
        <section className="society-members-card">
          <h2>
            <FaUsers /> Members ({society.members?.length || 0})
          </h2>

          <div className="society-members-carousel">
            {society.members?.length ? (
              society.members.map((m) => (
                <div key={m._id} className="society-member-card">
                  {m.profilePic ? (
                    <img
                      src={m.profilePic}
                      alt={m.username}
                      className="society-member-avatar-img"
                    />
                  ) : (
                    <div
                      className="society-member-avatar-fallback"
                      style={{
                        background: getAvatarColor(m._id),
                      }}
                    >
                      {m.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <p className="society-member-name">{m.username}</p>
                </div>
              ))
            ) : (
              <p>No members yet.</p>
            )}
          </div>
        </section>

        {/* Events Section */}
        <section className="events-card">
          <h2>Upcoming Events</h2>
          {society.events?.length ? (
            <div className="events-list">
              {society.events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  isRsvped={event.participants?.some((p) => p.email === user?.email)}
                  onRSVPClick={handleRSVPClick}
                />
              ))}
            </div>
          ) : (
            <p>No events scheduled.</p>
          )}
        </section>

        {/* ✅ RSVP Form Modal */}
        {selectedEvent && (
          <RSVPForm
            event={selectedEvent}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleFormSubmit}
            onCancel={() => setSelectedEvent(null)}
          />
        )}

        {/* Footer */}
        <Footer />
      </div>

      {/* Apply Modal */}
      {showApplyForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{hasJoined ? `Leave ${society.name}` : `Apply to ${society.name}`}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={joinSocietyformData.name}
                onChange={handleFormChange}
                placeholder="Your Name"
                required
              />
              <input
                type="email"
                name="email"
                value={joinSocietyformData.email}
                onChange={handleFormChange}
                placeholder="Your Email"
                required
              />
              <textarea
                name="reason"
                value={joinSocietyformData.reason}
                onChange={handleFormChange}
                placeholder={`Why do you want to ${hasJoined ? "leave" : "join"}?`}
                required={!hasJoined}
              />
              <div className="form-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowApplyForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SocietyDetails;
