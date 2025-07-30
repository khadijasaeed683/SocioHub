import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignupPage.css';
import Navbar from '../components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signup } from '../api/authApi'; 

const SignupPage = ({ onSignup }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await signup(username, email, password); 
      onSignup(data.user);
      toast.success('Signup successful!');
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error(err.message);
      setUsername('');
      setEmail('');
      setPassword('');
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

            <p className="register-link" align="center">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="colored" />
    </>
  );
};

export default SignupPage;
