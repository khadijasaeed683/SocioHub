import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './RegisterSociety.css';
import { toast } from 'react-toastify';

const RegisterSociety = ({ user, societies }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [website, setWebsite] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [type, setType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', name);
    data.append('description', description);
    data.append('logo', logo);
    data.append('coverImage', coverImage || '');
    data.append('website', website);
    data.append('contactEmail', contactEmail);
    data.append('phone', phone);
    data.append('type', type);
    data.append('socialLinks.instagram', instagram);
    data.append('socialLinks.linkedin', linkedin);

    try {
      const res = await fetch(`http://localhost:5000/api/society/`, {
        method: 'POST',
        credentials: 'include',
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        toast.success('Society registration submitted successfully!');
        setName('');
        setDescription('');
        setLogo(null);
        setCoverImage(null);
        setWebsite('');
        setContactEmail('');
        setPhone('');
        setInstagram('');
        setLinkedin('');
        setType('');
      } else {
        toast.error(result.message || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-layout">
        {/* Sidebar */}
        <Sidebar user={user} societies={societies || []} />

        {/* Main Content */}
        <div className="register-content">
          <div className="register-society-container">
            <h1>🎓 Register Your Society</h1>
            <p className="subtext">Provide complete details and valid logos to get approved.</p>

            <form className="society-form" onSubmit={handleSubmit}>
              <label>Society Name</label>
              <input type="text" name="name" required value={name} onChange={(e) => setName(e.target.value)} />

              <label>Description</label>
              <textarea name="description" required value={description} onChange={(e) => setDescription(e.target.value)} />

              <label>Logo</label>
              <input type="file" name="logo" accept="image/*" required onChange={(e) => setLogo(e.target.files[0])} />

              <label>Cover Image</label>
              <input type="file" name="coverImage" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} />

              <label>Website</label>
              <input type="url" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} />

              <label>Contact Email</label>
              <input type="email" name="contactEmail" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />

              <label>Phone</label>
              <input type="tel" name="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />

              <label>Instagram</label>
              <input type="url" name="instagram" placeholder="https://instagram.com/yourpage" value={instagram} onChange={(e) => setInstagram(e.target.value)} />

              <label>LinkedIn</label>
              <input type="url" name="linkedin" placeholder="https://linkedin.com/in/yourpage" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />

              <label>Type</label>
              <select name="type" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">Select Type</option>
                <option value="academic">Academic</option>
                <option value="sports">Sports</option>
                <option value="art">Art</option>
                <option value="social">Social</option>
                <option value="literary">Literary</option>
                <option value="other">Other</option>
              </select>

              <button type="submit">Submit Registration</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterSociety;
