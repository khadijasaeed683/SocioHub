import React, { useState } from 'react';
import './SignupPage.css';
import Navbar from '../components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignupPage = ({ onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();

    if (name && email && password) {
      const newUser = {
        name,
        email,
        _id: 'user_' + Date.now(),
        password // normally not sent to frontend
      };
      onSignup(newUser);
      toast.success('Signup successful! Redirecting to dashboard...');
    } else {
      setError('All fields are required');
      toast.error('Please fill in all fields');
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup-page">
        <div className="signup-container">
          <h2>Sign Up</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSignup}>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />

            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />

            <button type="submit">Create Account</button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="colored" />
    </>
  );
};

export default SignupPage;
