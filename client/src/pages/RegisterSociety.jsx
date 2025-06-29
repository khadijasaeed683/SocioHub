import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './RegisterSociety.css';
import societyIllustration from '../assets/society-illustration.png'; // ✅ Use your illustration here

const RegisterSociety = () => {
  const [formData, setFormData] = useState({
    societyName: '',
    officialEmail: '',
    adminEmail: '',
    password: '',
    confirmPassword: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Society registration submitted!');
    // TODO: Send formData to backend
  };

  return (
    <>
      <Navbar />
      <div className="register-page">
        <div className="register-wrapper">
          <div className="register-illustration">
            <img src={societyIllustration} alt="Register Society" />
          </div>

          <div className="register-society-container">
            <h1>🎓 Register Your Society</h1>
            <p className="subtext">
              Provide valid proof and admin credentials to get approved.
            </p>

            <form className="society-form" onSubmit={handleSubmit}>
              <label>Society Name</label>
              <input type="text" name="societyName" required onChange={handleChange} />

              <label>Official Society Email</label>
              <input type="email" name="officialEmail" required onChange={handleChange} />

              <label>Proof of Validity</label>
              <input type="file" name="file" accept=".pdf,.jpg,.png" required onChange={handleChange} />

              <label>Admin Email</label>
              <input type="email" name="adminEmail" required onChange={handleChange} />

              <label>Password</label>
              <input type="password" name="password" required onChange={handleChange} />

              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" required onChange={handleChange} />

              <button type="submit">Submit Registration</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterSociety;
