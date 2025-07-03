import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './RegisterSociety.css';
import societyIllustration from '../assets/society-illustration.png';

const RegisterSociety = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: null,
    coverImage: null,
    website: '',
    contactEmail: '',
    phone: '',
    instagram: '',
    linkedin: '',
    type: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ Create FormData to send files and text fields
  const data = new FormData();
  data.append('name', formData.societyName);
  data.append('description', formData.description || ''); // add description input if not present
  data.append('logo', formData.file); // assuming 'file' is your logo
  data.append('coverImage', formData.coverImage || ''); // if coverImage input is added
  data.append('website', formData.website || '');
  data.append('contactEmail', formData.officialEmail);
  data.append('phone', formData.phone || '');
  data.append('type', formData.type || '');
  data.append('socialLinks.instagram', formData.instagram || '');
  data.append('socialLinks.linkedin', formData.linkedin || '');

  try {
    const res = await fetch(`http://localhost:5000/api/society/register`, {
      method: 'POST',
      headers: {
        // 'Content-Type': 'multipart/form-data' ❌ DO NOT SET when using FormData in fetch
        Authorization: `Bearer ${localStorage.getItem('token')}`, // if using JWT auth
      },
      body: data,
    });

    const result = await res.json();

    if (res.ok) {
      alert('Society registration submitted successfully!');
      console.log(result);
      // Optional: Redirect or reset form
    } else {
      alert(result.message || 'Registration failed.');
    }

  } catch (err) {
    console.error('Register society error:', err);
    alert('Server error during registration.');
  }
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
              Provide complete details and valid logos to get approved.
            </p>

            <form className="society-form" onSubmit={handleSubmit}>
              <label>Society Name</label>
              <input type="text" name="name" required onChange={handleChange} />

              <label>Description</label>
              <textarea name="description" required onChange={handleChange} />

              <label>Logo</label>
              <input type="file" name="logo" accept="image/*" required onChange={handleChange} />

              <label>Cover Image</label>
              <input type="file" name="coverImage" accept="image/*" onChange={handleChange} />

              <label>Website</label>
              <input type="url" name="website" onChange={handleChange} />

              <label>Contact Email</label>
              <input type="email" name="contactEmail" required onChange={handleChange} />

              <label>Phone</label>
              <input type="tel" name="phone" required onChange={handleChange} />

              <label>Instagram</label>
              <input type="url" name="instagram" placeholder="https://instagram.com/yourpage" onChange={handleChange} />

              <label>LinkedIn</label>
              <input type="url" name="linkedin" placeholder="https://linkedin.com/in/yourpage" onChange={handleChange} />

              <label>Type</label>
              <select name="type" onChange={handleChange}>
                <option value="">Select Type</option>
                <option value="academic">Academic</option>
                <option value="sports">Sports</option>
                <option value="art">Art</option>
                <option value="social">Social</option>
                <option value="literary">Literary</option>
                <option value="other">Other</option>
              </select>

              <button type="submit" >Submit Registration</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterSociety;
